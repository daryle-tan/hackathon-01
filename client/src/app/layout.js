import { Inter } from "next/font/google"
import styles from "../styles/globals.css"
import Image from "next/image"

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
                <div>Crypto Blackjack</div>
            </body>
        </html>
    )
}
