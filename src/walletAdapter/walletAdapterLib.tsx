"use client"

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, AlphaWalletAdapter, BitgetWalletAdapter, CloverWalletAdapter, LedgerWalletAdapter, NightlyWalletAdapter, BitpieWalletAdapter, CoinhubWalletAdapter, CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

type props = {
    children: React.ReactNode;
}

export const Wallet = ({ children }: props) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [

            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new AlphaWalletAdapter(),
            new BitgetWalletAdapter(),
            new CloverWalletAdapter(),
            new LedgerWalletAdapter(),
            new NightlyWalletAdapter(),
            new BitpieWalletAdapter(),
            new CoinhubWalletAdapter(),
            new CoinbaseWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* <WalletMultiButton /> */}
                    {/* <WalletDisconnectButton /> */}
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};