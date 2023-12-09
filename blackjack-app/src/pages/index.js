import Head from "next/head"
import styles from "@/styles/Home.module.css"
import abi from "../contractJson/Blackjack.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import StartGameButton from "./components/StartGameButton"
import DealCardsButton from "./components/DealCardsButton"
import PlayerHitButton from "./components/PlayerHitButton"
import StandButton from "./components/StandButton"
import GetDeck from "./components/GetDeck"

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
    const [dealerHand, setDealerHand] = useState([])
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
        getPlayerCardValue()
        getDealerCardValue()
        getRandomResultArray()
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
        // try {
        const { contract } = state

        // Check if contract instance exists
        if (contract) {
            // Call a function to get the full array-like structure
            const result = await contract.getRandomResult()
            console.log(result[0])
            result.map((card, index) => {
                // Access card properties directly
                let nestedProxy = card
                const rank = Number(nestedProxy[0])
                const suit = Number(nestedProxy[1])
                const cardValue = Number(nestedProxy[2])
                const hasBeenPlayed = nestedProxy[3]

                if (hasBeenPlayed && index == 0 && playerHand.length < 2) {
                    setPlayerHand((prevPlayerHand) => [
                        ...prevPlayerHand,
                        { rank, suit, cardValue },
                    ])
                } else if (
                    hasBeenPlayed &&
                    index == 2 &&
                    playerHand.length < 2
                ) {
                    setPlayerHand((prevPlayerHand) => [
                        ...prevPlayerHand,
                        { rank, suit, cardValue },
                    ])
                } else if (
                    hasBeenPlayed &&
                    index == 1 &&
                    dealerHand.length < 2
                ) {
                    setDealerHand((prevDealerHand) => [
                        ...prevDealerHand,
                        { rank, suit, cardValue },
                    ])
                } else if (
                    hasBeenPlayed &&
                    index == 3 &&
                    dealerHand.length < 2
                ) {
                    setDealerHand((prevDealerHand) => [
                        ...prevDealerHand,
                        { rank, suit, cardValue },
                    ])
                }
            })
            console.log(
                "player's hand:",
                playerHand,
                "dealer's hand:",
                dealerHand
            )
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

    function resetValues() {
        setPlayerHand([])
        setDealerHand([])
    }

    const cardImages = {
        0: {
            0: "/AceOfSpades.png",
            1: "/AceOfClubs.png",
            2: "/AceOfHearts.png",
            3: "/AceOfDiamonds.png",
        },
        1: {
            0: "/TwoOfSpades.png",
            1: "/TwoOfClubs.jpeg",
            2: "/TwoOfHearts.png",
            3: "/TwoOfDiamonds.svg",
        },
        2: {
            0: "/ThreeOfSpades.png",
            1: "/ThreeOfClubs.jpeg",
            2: "/ThreeOfHearts.png",
            3: "/ThreeOfDiamonds.jpeg",
        },
        3: {
            0: "/FourOfSpades.png",
            1: "/FourOfClubs.png",
            2: "/FourOfHearts.png",
            3: "/FourOfDiamonds.png",
        },
        4: {
            0: "/FiveOfSpades.png",
            1: "/FiveOfClubs.png",
            2: "/FiveOfHearts.png",
            3: "/FiveOfDiamonds.png",
        },
        5: {
            0: "/SixOfSpades.png",
            1: "/SixOfClubs.png",
            2: "/SixOfHearts.png",
            3: "/SixOfDiamonds.svg",
        },
        6: {
            0: "/SevenOfSpades.png",
            1: "/SevenOfClubs.png",
            2: "/SevenOfHearts.png",
            3: "/SevenOfDiamonds.png",
        },
        7: {
            0: "/EightOfSpades.png",
            1: "/EightOfClubs.png",
            2: "/EightOfHearts.png",
            3: "/EightOfDiamonds.png",
        },
        8: {
            0: "/NineOfSpades.png",
            1: "/NineOfClubs.png",
            2: "/NineOfHearts.png",
            3: "/NineOfDiamonds.png",
        },
        9: {
            0: "/TenOfSpades.png",
            1: "/TenOfClubs.png",
            2: "/TenOfHearts.webp",
            3: "/TenOfDiamonds.png",
        },
        10: {
            0: "/JackOfSpades.png",
            1: "/JackOfClubs.png",
            2: "/JackOfHearts.png",
            3: "/JackOfDiamonds.png",
        },
        11: {
            0: "/QueenOfSpades.png",
            1: "/QueenOfClubs.webp",
            2: "/QueenOfHearts.png",
            3: "/QueenOfDiamonds.png",
        },
        12: {
            0: "/KingOfSpades.webp",
            1: "/KingOfClubs.webp",
            2: "/KingOfHearts.png",
            3: "/KingOfDiamonds.webp",
        },
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
                <div className={styles.topContainer}>
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

                    {isConnected ? (
                        <div className={styles.ConnectButton}>
                            {userAddress.slice(0, 6) +
                                "..." +
                                userAddress.slice(-6)}
                        </div>
                    ) : (
                        <button
                            className={styles.connectWallet}
                            onClick={template}
                        >
                            Connect
                        </button>
                    )}
                </div>

                {!gameStarted && (
                    <StartGameButton
                        gameStarted={gameStarted}
                        setGameStarted={setGameStarted}
                        state={state}
                    />
                )}

                {/* <div className={styles.scoreContainer}>
                    <div>Dealer's Score: {dealerCardValue}</div>
                    <div>Player's Score: {playerCardValue}</div>
                </div> */}
                <div className={styles.scoreContainer}>
                    <div>Dealer's Score: {dealerCardValue}</div>
                </div>
                <div className={styles.dealersHandDiv}>
                    {dealerHand.map((card, index) => (
                        <div key={index}>
                            <img
                                className={styles.cardImage}
                                src={cardImages[card.rank][card.suit]}
                                alt={`${card.rank} of ${card.suit}`}
                            />
                            {/* <p>Rank: {card.rank}</p>
                            <p>Suit: {card.suit}</p>
                            <p>Card Value: {card.cardValue}</p> */}
                        </div>
                    ))}
                </div>

                <div className={styles.scoreContainer}>
                    <div>Player's Score: {playerCardValue}</div>
                </div>
                <div className={styles.playersHandDiv}>
                    {playerHand.map((card, index) => (
                        <div key={index}>
                            <img
                                className={styles.cardImage}
                                src={cardImages[card.rank][card.suit]}
                                alt={`${card.rank} of ${card.suit}`}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.buttonContainer}>
                    <PlayerHitButton
                        state={state}
                        setPlayerHand={setPlayerHand}
                    />
                    <StandButton state={state} />
                </div>

                <button onClick={getRandomResultArray}>
                    Get Random Result
                </button>
                <button onClick={resetValues}>Reset</button>
            </main>
        </>
    )
}
