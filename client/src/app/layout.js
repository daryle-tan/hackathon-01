// "use client"
import "../styles/globals.css"
import { Inter } from "next/font/google"
import Providers from "./providers"
import "@rainbow-me/rainbowkit/styles.css"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Crypto Blackjack",
    description:
        "Blackjack game built using smart contract and chainlink's Verifiable Randomness Function",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="body-background">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
