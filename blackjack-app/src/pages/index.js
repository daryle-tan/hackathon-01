import Head from "next/head"
import styles from "@/styles/Home.module.css"
import abi from "../contractJson/Blackjack.json"
import { useState } from "react"
import { ethers } from "ethers"

export default function Home() {
    const [userAddress, setUserAddress] = useState("")
    const [account, setAccount] = useState("Not Connected")
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    })

    const template = async () => {
        const contractAddress = "0x1b72080fC9ed5eB162b9C099686e46CEA2C019fc"
        const contractABI = abi.abi

        try {
            const { ethereum } = window
            const addresses = await window.ethereum.request({
                method: "eth_requestAccounts",
            })

            // const address = ethers.utils.getAddress(addresses[0])

            setAccount(addresses[0])
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = provider.getSigner()

            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            )
            console.log(provider, signer, contract)
            console.log(addresses[0])
            setState({ provider, signer, contract })
            setIsConnected(true)
            setUserAddress(addresses[0])
        } catch (error) {
            console.log(error)
        }
    }

    const doSomething = async () => {
        const addresses = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        console.log(addresses[0])
        // const address = await ethers.utils.getAddress(addresses[0])
        // console.log(address)
    }
    return (
        <>
            <Head>
                <title>Blackjack App</title>
                <meta
                    name="description"
                    content="Blackjack game created with a smart contract"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {isConnected ? (
                    <div className={styles.ConnectButton}>
                        {userAddress.slice(0, 6) +
                            "..." +
                            userAddress.slice(-6)}
                    </div>
                ) : (
                    <button className={styles.connectWallet} onClick={template}>
                        Connect
                    </button>
                )}
            </main>
        </>
    )
}
