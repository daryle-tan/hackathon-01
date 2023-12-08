import Head from "next/head"
import styles from "@/styles/Home.module.css"
import abi from "../contractJson/Blackjack.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import StartGameButton from "./components/StartGameButton"
import DealCardsButton from "./components/DealCardsButton"
import PlayerHitButton from "./components/PlayerHitButton"
import StandButton from "./components/StandButton"

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
    const [playerHand, setPlayerHand] = useState([])
    const [dealerHnd, setDealerHand] = useState([])
    const [userAddress, setUserAddress] = useState("")
    const [account, setAccount] = useState("Not Connected")
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    })

    useEffect(() => {
        if (cardsAlreadyDealt) {
            getPlayerCardValue()
            getDealerCardValue()
        }
    }, [state])

    const template = async () => {
        const contractAddress = "0x1b72080fC9ed5eB162b9C099686e46CEA2C019fc"
        const contractABI = abi.abi

        try {
            const addresses = await window.ethereum.request({
                method: "eth_requestAccounts",
            })

            setAccount(addresses[0])
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()

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

    const getRandomResultArray = async () => {
        try {
            const { contract } = state

            // Check if contract instance exists
            if (contract) {
                // Call a function to get the full array-like structure
                const result = await contract.getRandomResult()
                console.log(typeof result)
                // Accessing data within the nested structure
                if (result && result[0]) {
                    const nestedProxy = result[0]
                    const dataAtIndex0 = nestedProxy[0]
                    const dataAtIndex1 = nestedProxy[1]
                    // Logging retrieved data
                    console.log("Nested Proxy:", nestedProxy)
                    console.log(
                        "Data at index 1 within nested Proxy:",
                        dataAtIndex1.toString()
                    )
                } else {
                    console.error("Nested Proxy or data at index 0 not found")
                }
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error retrieving data:", error)
        }
    }

    const getPlayerCardValue = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getPlayerValue()
                setPlayerCardValue(Number(tx))
                console.log(
                    "player value:",
                    tx,
                    "set player value:",
                    playerCardValue
                )
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error retrieving data:", error)
        }
    }

    const getDealerCardValue = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getDealerValue()
                setDealerCardValue(Number(tx))
                console.log(
                    "dealer value:",
                    tx,
                    "set dealer value:",
                    dealerCardValue
                )
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error retrieving data:", error)
        }
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
                <div>{dealerCardValue}</div>
                <div>{playerCardValue}</div>
                <StartGameButton
                    gameStarted={gameStarted}
                    setGameStarted={setGameStarted}
                    state={state}
                />

                <DealCardsButton
                    state={state}
                    cardsAlreadyDealt={cardsAlreadyDealt}
                    setCardsAlreadyDealt={setCardsAlreadyDealt}
                    playerTurn={playerTurn}
                    setPlayerTurn={setPlayerTurn}
                    playerCardValue={playerCardValue}
                    setPlayerCardValue={setPlayerCardValue}
                    dealerCardValue={dealerCardValue}
                    setDealerCardValue={setDealerCardValue}
                />

                <PlayerHitButton />

                <StandButton />

                <button onClick={getRandomResultArray}>
                    Get Random Result
                </button>

                <div className={styles.dealersHand}>Dealer's Hand</div>
                <div className={styles.playersHand}>Player's Hand</div>
            </main>
        </>
    )
}
