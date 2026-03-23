import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import {
  connectWallet as connectMetamask,
  disconnectWallet,
  getBalance,
  listenToAccountChanges,
  listenToChainChanges,
  parseMetamaskError,
} from '@/lib/hederaUtils';
import {
  requestWalletSignature,
  authenticateWithSignature,
} from '@/lib/auth/wallet-signature';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase/types';
import type { Session } from '@supabase/supabase-js';
import { IWalletProvider, createInjectedProvider, createWalletConnectProvider } from '@/lib/wallet/provider-utils';

interface WalletState {
  connected: boolean;
  account: string | null;  // EVM address
  accountId: string | null;  // Hedera account ID
  balance: number;
  network: string;
  loading: boolean;
  error: string | null;
  user: User | null;  // Authenticated user from database
  session: Session | null;  // Supabase session
  authLoading: boolean;  // Authentication loading state
  authError: string | null;  // Authentication error
  activeProvider: IWalletProvider | null;  // Unified provider interface
}

interface WalletContextType extends WalletState {
  connect: (type?: 'evm' | 'native') => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    account: null,
    accountId: null,
    balance: 0,
    network: 'testnet',
    loading: false,
    error: null,
    user: null,
    session: null,
    authLoading: false,
    authError: null,
    activeProvider: null,
  });

  useEffect(() => {
    // Eagerly initialize the WalletConnect Hedera Connector so any Hashpack extensions natively injected
    // into the browser are discovered and mapped BEFORE the user clicks "Connect"
    import('@/lib/hederaWalletConnect')
      .then(m => m.initHederaWalletConnect())
      .catch(e => console.warn('Silent early WC init failure:', e));
  }, []);

  // Connect wallet with signature-based authentication
  const connect = useCallback(async (type: 'evm' | 'native' = 'evm') => {
    setState(prev => ({ ...prev, loading: true, error: null, authLoading: true, authError: null }));

    try {
      let walletAddress: string | null = null; // This will be the EVM address for 'account' state
      let hederaId: string | null = null;
      let signature: string;
      let message: string;
      let networkValue: string;
      let activeProvider: IWalletProvider | null = null;

      if (type === 'native') {
        const { connectHederaNative, signMessageNative } = await import('@/lib/hederaWalletConnect');
        const nativeResult = await connectHederaNative();
        console.log('✅ Native Wallet connected:', nativeResult.accountId);

        walletAddress = nativeResult.evmAddress || null; // Prioritize EVM address for 'account'
        hederaId = nativeResult.accountId;
        networkValue = nativeResult.network;

        if (nativeResult.isEIP6963) {
          // Treat it exactly as standard EVM Metamask!
          if (!nativeResult.provider) throw new Error('No EIP-6963 provider returned');
          if (!walletAddress) throw new Error('EVM address not available for EIP-6963 provider');
          const ethersProvider = new BrowserProvider(nativeResult.provider);

          console.log('🖊️ Requesting EIP-6963 Native wallet signature...');
          const { signature: sig, message: msg } = await requestWalletSignature(
            walletAddress,
            ethersProvider
          );
          signature = sig;
          message = msg;
          console.log('✅ Signature obtained via EIP-6963 Provider');

          // Set active provider
          activeProvider = createInjectedProvider(nativeResult.provider, nativeResult.info?.name || 'Native Extension');
        } else {
          if (!hederaId) throw new Error('Hedera account ID not available for native WalletConnect');
          // For native WalletConnect, we sign with the Hedera ID, but the 'account' state will be null if no EVM address
          const { generateAuthMessage } = await import('@/lib/auth/wallet-signature');
          message = generateAuthMessage(hederaId); // Use Hedera ID for message generation if no EVM address

          console.log('🖊️ Requesting native WalletConnect signature...');
          const { dAppConnector } = await import('@/lib/hederaWalletConnect');
          signature = await signMessageNative(hederaId, message);
          console.log('✅ Native signature obtained via WalletConnect');

          // Set active provider via WalletConnect wrapper
          activeProvider = createWalletConnectProvider(dAppConnector);
        }
      } else {
        // 1. Connect Metamask wallet
        const walletResult = await connectMetamask();
        console.log('✅ Wallet connected:', walletResult.evmAddress);

        walletAddress = walletResult.evmAddress;
        hederaId = walletResult.accountId;
        networkValue = walletResult.network;

        // 2. Create ethers provider for signing
        if (!(window as any).ethereum) {
          throw new Error('No Ethereum provider found');
        }

        const ethersProvider = new BrowserProvider((window as any).ethereum);

        // 3. Request signature from user
        console.log('🖊️ Requesting wallet signature...');
        const { signature: sig, message: msg } = await requestWalletSignature(
          walletAddress,
          ethersProvider
        );
        signature = sig;
        message = msg;
        console.log('✅ Signature obtained');

        // Set active provider (Metamask)
        activeProvider = createInjectedProvider((window as any).ethereum, 'Metamask');
      }

      // Determine the identifier to use for authentication
      const authIdentifier = walletAddress || hederaId;
      if (!authIdentifier) {
        throw new Error('No wallet address or Hedera ID available for authentication.');
      }

      // 4. Authenticate with backend (verify signature, create/update user, get JWT)
      console.log('🔐 Authenticating with backend...');
      const authResult = await authenticateWithSignature(
        authIdentifier, // Use EVM address if available, otherwise Hedera ID
        signature,
        message,
        hederaId || undefined
      );
      console.log('✅ Backend authentication successful');

      // 5. Set Supabase session with JWT tokens
      console.log('🔐 Setting Supabase session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
      });

      if (sessionError) {
        throw new Error('Failed to establish authentication session');
      }

      // 6. Fetch balance
      let balance = 0;
      try {
        if (walletAddress) { // If EVM address is available, use it for balance
          balance = await getBalance(walletAddress);
        } else if (hederaId) { // Otherwise, use Hedera ID
          const mirrorNodeUrl = networkValue === 'mainnet'
            ? 'https://mainnet-public.mirrornode.hedera.com'
            : 'https://testnet.mirrornode.hedera.com';
          const response = await fetch(`${mirrorNodeUrl}/api/v1/balances?account.id=${hederaId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.balances && data.balances.length > 0) {
              balance = data.balances[0].balance / 1e8; // Tinybars to Hbar
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch balance', err);
      }

      // 7. Update state with all data
      setState({
        connected: true,
        account: walletAddress, // EVM address or null
        accountId: hederaId,
        balance,
        network: networkValue,
        loading: false,
        error: null,
        user: authResult.user,
        session: sessionData.session,
        authLoading: false,
        authError: null,
        activeProvider,
      });

      console.log('✅ Wallet connection complete');
    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error);

      const errorMessage = error.message || parseMetamaskError(error);

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        authLoading: false,
        authError: errorMessage,
      }));

      throw error;
    }
  }, []);

  // Disconnect wallet and clear session
  const disconnect = useCallback(async () => {
    console.log('🔌 Disconnecting wallet...');

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Disconnect wallets
    disconnectWallet();

    try {
      const { disconnectHederaNative } = await import('@/lib/hederaWalletConnect');
      await disconnectHederaNative();
    } catch (err) { }

    // Reset state
    setState({
      connected: false,
      account: null,
      accountId: null,
      balance: 0,
      network: 'testnet',
      loading: false,
      error: null,
      user: null,
      session: null,
      authLoading: false,
      authError: null,
    });

    console.log('✅ Wallet disconnected');
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!state.account && !state.accountId) return;

    try {
      if (state.account) { // Prioritize EVM address for balance
        const balance = await getBalance(state.account);
        setState(prev => ({ ...prev, balance }));
      } else if (state.accountId) { // Fallback to Hedera ID
        const mirrorNodeUrl = state.network === 'mainnet'
          ? 'https://mainnet-public.mirrornode.hedera.com'
          : 'https://testnet.mirrornode.hedera.com';
        const response = await fetch(`${mirrorNodeUrl}/api/v1/balances?account.id=${state.accountId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.balances && data.balances.length > 0) {
            const balance = data.balances[0].balance / 1e8; // Tinybars to Hbar
            setState(prev => ({ ...prev, balance }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [state.account, state.accountId, state.network]);

  // Refresh user data from database
  const refreshUser = useCallback(async () => {
    if (!state.session) return;

    setState(prev => ({ ...prev, authLoading: true, authError: null }));

    try {
      // Get user ID from session metadata
      const userId = state.session.user.user_metadata?.user_id;

      if (!userId) {
        throw new Error('User ID not found in session');
      }

      // Fetch fresh user data
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('Failed to fetch user data');
      }

      setState(prev => ({
        ...prev,
        user,
        authLoading: false,
        authError: null,
      }));
    } catch (error: any) {
      console.error('Failed to refresh user:', error);
      setState(prev => ({
        ...prev,
        authLoading: false,
        authError: error.message || 'Failed to refresh user data',
      }));
    }
  }, [state.session]);

  // Auto-restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      console.log('🔄 Checking for existing session...');

      try {
        // Check if Supabase session exists
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Session check failed:', error);
          return;
        }

        if (!session) {
          console.log('ℹ️ No existing session found');
          return;
        }

        console.log('✅ Found existing session, restoring wallet state...');

        // Extract wallet info from session metadata
        const walletAddress = session.user.user_metadata?.wallet_address; // This is the EVM address
        const hederaAccountId = session.user.user_metadata?.hedera_account_id;
        const userId = session.user.user_metadata?.user_id;

        if (!walletAddress && !hederaAccountId || !userId) { // Ensure at least one identifier and user ID
          console.warn('⚠️ Invalid session metadata, signing out');
          await supabase.auth.signOut();
          return;
        }

        // Check if wallet is still connected (only for EVM providers like Metamask)
        if (walletAddress && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          }) as string[];

          if (!accounts || accounts.length === 0 || accounts[0].toLowerCase() !== walletAddress.toLowerCase()) {
            console.warn('⚠️ Wallet not connected or account changed, signing out');
            await supabase.auth.signOut();
            return;
          }
        } else if (walletAddress && !window.ethereum) {
          console.warn('⚠️ No Ethereum provider found for previously connected EVM wallet. Cannot verify connection.');
          // We might choose to sign out here or proceed assuming the session is valid.
          // For now, let's proceed, but this could be a point of failure if the user expects an EVM wallet.
        }
        // Note: For native Hedera wallets, there's no universal way to check connection status without re-initiating.
        // We rely on the Supabase session being valid.

        // Fetch user data
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError || !user) {
          console.error('❌ Failed to fetch user:', userError);
          await supabase.auth.signOut();
          return;
        }

        // Fetch balance
        let balance = 0;
        try {
          if (walletAddress) {
            balance = await getBalance(walletAddress);
          } else if (hederaAccountId) {
            const mirrorNodeUrl = 'https://testnet.mirrornode.hedera.com'; // Default to testnet for restoration balance check
            const response = await fetch(`${mirrorNodeUrl}/api/v1/balances?account.id=${hederaAccountId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.balances && data.balances.length > 0) {
                balance = data.balances[0].balance / 1e8; // Tinybars to Hbar
              }
            }
          }
        } catch (err) {
          console.warn('Failed to fetch balance during session restore', err);
        }


        // Restore state
        setState({
          connected: true,
          account: walletAddress || null, // EVM address or null
          accountId: hederaAccountId || null,
          balance,
          network: 'testnet', // Assuming testnet for now, could be stored in session metadata
          loading: false,
          error: null,
          user,
          session,
          authLoading: false,
          authError: null,
          activeProvider: null, // Cannot restore activeProvider easily without re-connecting
        });

        console.log('✅ Session restored successfully');
      } catch (error) {
        console.error('❌ Session restoration failed:', error);
      }
    };

    restoreSession();
  }, []);

  // Listen to Supabase auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      console.log('🔐 Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        // Clear wallet state when signed out
        setState((prev: WalletState) => ({
          ...prev,
          connected: false,
          account: null,
          accountId: null,
          user: null,
          session: null,
        }));
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Update session when token is refreshed
        setState((prev: WalletState) => ({
          ...prev,
          session,
        }));
      } else if (event === 'SIGNED_IN' && session) {
        // Update session on sign in
        setState((prev: WalletState) => ({
          ...prev,
          session,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Listen to account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum || !state.connected) return;

    const cleanup = listenToAccountChanges(async (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('⚠️ Wallet disconnected');
        await disconnect();
      } else if (accounts[0].toLowerCase() !== state.account?.toLowerCase()) {
        console.log('⚠️ Account changed, reconnecting...');
        await disconnect();
        // User can manually reconnect with new account
      }
    });

    return cleanup;
  }, [state.connected, state.account, disconnect]);

  // Listen to chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum || !state.connected) return;

    const cleanup = listenToChainChanges(async (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const isHederaTestnet = chainId === 296;

      console.log(`🌐 Network changed to Chain ID ${chainId}`);

      if (!isHederaTestnet) {
        console.warn('⚠️ Switched away from Hedera Testnet. Some features may not work.');
        // Refresh balance (will fail gracefully on wrong network)
        refreshBalance();
      } else {
        console.log('✅ On Hedera Testnet');
        refreshBalance();
        refreshUser();
      }
    });

    return cleanup;
  }, [state.connected, refreshBalance, refreshUser]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, refreshBalance, refreshUser }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
