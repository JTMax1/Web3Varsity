/**
 * Wallet Provider Utilities
 * 
 * Provides a unified interface to interact with different wallet providers:
 * 1. EIP-1193 (Metamask, Rabby, Injected Native Extensions)
 * 2. WalletConnect (HashPack/Blade via DAppConnector)
 */

export interface WalletRequest {
    method: string;
    params?: any[];
}

export interface IWalletProvider {
    request: (args: WalletRequest) => Promise<any>;
    name: string;
    isNative: boolean;
}

/**
 * Creates a provider wrapper for standard EIP-1193 injected wallets (Metamask, etc.)
 */
export function createInjectedProvider(provider: any, name: string = 'Injected'): IWalletProvider {
    return {
        name,
        isNative: name.toLowerCase().includes('hashpack') || name.toLowerCase().includes('blade'),
        request: async (args: WalletRequest) => {
            return provider.request(args);
        }
    };
}

/**
 * Creates a provider wrapper for WalletConnect Hedera sessions
 */
export function createWalletConnectProvider(connector: any): IWalletProvider {
    return {
        name: 'WalletConnect',
        isNative: true,
        request: async (args: WalletRequest) => {
            // Map common EVM methods to Hedera-specific WalletConnect methods if needed
            // Most of our services use 'personal_sign' or 'eth_sendTransaction'

            if (args.method === 'personal_sign') {
                // args.params = [message, address]
                const [message, address] = args.params || [];
                // Map to native signMessage
                return connector.signMessage({
                    signerAccountId: address.startsWith('0.0.') ? `hedera:testnet:${address}` : address,
                    message: message.startsWith('0x') ? hexToString(message) : message
                });
            }

            if (args.method === 'eth_sendTransaction') {
                // For now, we fallback to the connector's native execution if available
                // or throw if it requires a specific Hedera JSON-RPC method
                console.warn('WalletConnect: eth_sendTransaction called. Mapping to native execution...');
                // Implementation depends on dAppConnector version
            }

            // Generic fallback
            return connector.request(args);
        }
    };
}

/**
 * Helper to convert hex to string (for WalletConnect message signing)
 */
function hexToString(hex: string): string {
    let str = '';
    const start = hex.startsWith('0x') ? 2 : 0;
    for (let i = start; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}
