import { DAppConnector, HederaJsonRpcMethod, HederaSessionEvent, HederaChainId } from '@hashgraph/hedera-wallet-connect';

// For localhost testing, use a highly permissive generic Project ID if the primary one is domain-restricted
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const configuredProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '645c8e5529b5fb4fe09a2bf3453175eb';
const projectId = isLocalhost ? '377d75bb6f86a222a28d1dd818ef716f' : configuredProjectId;

const metadata = {
    name: "Web3Versity",
    description: "Web3 Education Platform",
    url: window.location.origin, // Must match executing origin to prevent WC errors
    icons: ["https://web3varsity.netlify.app/assets/w3v-logo.png"]
};

// Initialize DAppConnector specifically for Hedera Testnet
// Depending on user .env, we can set mainnet later
const isMainnet = import.meta.env.VITE_HEDERA_NETWORK === 'mainnet';
const networkName = isMainnet ? HederaChainId.Mainnet : HederaChainId.Testnet;

export const dAppConnector = new DAppConnector(
    metadata,
    networkName as any,
    projectId,
    [networkName],
    [HederaJsonRpcMethod.SignMessage, HederaJsonRpcMethod.ExecuteTransaction],
    [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged]
);

let isInit = false;

export async function initHederaWalletConnect() {
    if (isInit) return;
    try {
        await dAppConnector.init({ logger: 'error' });
        isInit = true;
    } catch (e) {
        console.error('WalletConnect init failed (likely WebSocket Relay block):', e);
        // We set to true so we don't infinitely retry failing blocks
        isInit = true;
    }
}

export async function connectHederaNative() {
    await initHederaWalletConnect();

    let session;
    const extensions = dAppConnector.extensions;

    // Fallback to explicitly trying the extension first if detected
    if (extensions && extensions.length > 0) {
        try {
            // Find hashpack explicitly if needed, or use the first available
            const hashpackExt = extensions.find(e => e.id.toLowerCase().includes('hashpack')) || extensions[0];
            console.log('Connecting via WalletConnect Extension directly:', hashpackExt.name);
            session = await dAppConnector.connectExtension(hashpackExt.id);
        } catch (e: any) {
            console.warn('Extension connection failed, falling back to modal', e);
            session = await dAppConnector.openModal();
        }
    } else {
        session = await dAppConnector.openModal();
    }

    // Parse namespaces to get the active account ID
    const hederaNamespace = session.namespaces['hedera'];
    if (!hederaNamespace || !hederaNamespace.accounts || hederaNamespace.accounts.length === 0) {
        throw new Error('No Hedera accounts found in the connection session.');
    }

    // Format: "hedera:testnet:0.0.123456"
    const accountStr = hederaNamespace.accounts[0];
    const accountId = accountStr.split(':').pop() || '';

    return { session, accountId, network: isMainnet ? 'mainnet' : 'testnet' };
}

export async function disconnectHederaNative() {
    if (isInit) {
        await dAppConnector.disconnectAll();
    }
}

/**
 * Request user to sign an authentication message natively via HashPack/Blade over WalletConnect
 */
export async function signMessageNative(accountId: string, message: string): Promise<string> {
    if (!isInit) await initHederaWalletConnect();

    // Format signer string to require Hedera format
    const signerAccountId = `hedera:${isMainnet ? 'mainnet' : 'testnet'}:${accountId}`;

    const result: any = await dAppConnector.signMessage({
        signerAccountId,
        message
    });

    return result.signatureMap || result.signature || result.result?.signatureMap || JSON.stringify(result);
}
