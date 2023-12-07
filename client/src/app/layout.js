"use client"

import "../styles/globals.css"
import { Inter } from "next/font/google"

import React from "react"
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { chain, configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [publicProvider()]
)

const { wallets } = getDefaultWallets({
    appName: "RainbowKit demo",
    projectId,
    chains,
})

const demoAppInfo = {
    appName: "Blackjack",
}

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: "Other",
        wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
])

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
})

const RootLayout = ({ Component, children }) => {
    return (
        <html lang="en">
            <body className="body-background">
                {/* <Providers> */}
                <WagmiConfig config={wagmiConfig}>
                    <RainbowKitProvider chains={chains}>
                        <Component {...children} />
                    </RainbowKitProvider>
                </WagmiConfig>
                {/* </Providers> */}
            </body>
        </html>
    )
}

export default RootLayout
