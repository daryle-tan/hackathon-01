"use client"

import { useState } from "react"
import styles from "../styles/globals.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from "wagmi"
import StartGameButton from "./components/StartGameButton"
import { abi } from "./components/contract-abi.js"
const ethers = require("ethers")

export default function Home() {
    const [playerCardValue, setPlayerCardValue] = useState(0)
    const [dealerCardValue, setDealerCardValue] = useState(0)
    const [playerWins, setPlayerWins] = useState(false)
    const [dealerWins, setDealerWins] = useState(false)
    const [noWinner, setNoWinner] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [cardsAlreadyDealt, setCardsAlreadyDealt] = useState(false)
    const [playerTurn, setPlayerTurn] = useState(false)
    const [dealerTurn, setDealerTurn] = useState(false)

    const { isConnected } = useAccount()
    const account = useAccount({
        onConnect({ address, connector, isReconnected }) {
            console.log("Connected", { address, connector, isReconnected })
        },
    })

    const { config } = usePrepareContractWrite({
        addressOrName: "0x1b72080fC9ed5eB162b9C099686e46CEA2C019fc",
        abi: abi,
        functionName: "startGame",
    })

    const { write } = useContractWrite(config)

    return (
        <>
            <div className="hi">Hiiiiiiiii</div>
            {/* <ConnectButton /> */}

            {isConnected && <StartGameButton />}
            <StartGameButton />
        </>
    )
}
