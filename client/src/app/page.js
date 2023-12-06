"use client"

import { useState } from "react"
import styles from "../styles/globals.css"
import { abi } from "./components/constants.js"
const ethers = require("ethers")

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
            const account = await ethereum.request({
                method: "eth_requestAccounts",
            })

            window.ethereum.on("accountsChanged", () => {
                window.location.reload()
            })
            const address = ethers.utils.getAddress(account[0])

            setAccount(account)
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            )
            console.log(address)
            setState({ provider, signer, contract })
            setIsConnected(true)
            setUserAddress(address)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {" "}
            {/* <main className="flex min-h-screen flex-col items-center justify-between p-24"> */}
            <button className={styles.connectWallet} onClick={template}>
                Connect Wallet
            </button>
            {/* </main> */}
        </>
    )
}
