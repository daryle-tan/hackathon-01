import { useState, useEffect } from "react"
import styles from "../../styles/PlayerHitButton.module.css"
import LoadingModal from "./LoadingModal"

export default function PlayerHitButton({
    state,
    isLoading,
    setIsLoading,
    setPlayerHand,
    getPlayerCardValue,
    setCounter,
    counter,
}) {
    const [transactionHash, setTransactionHash] = useState(null)
    const [transactionConfirmed, setTransactionConfirmed] = useState(false)
    const [transactionError, setTransactionError] = useState("")

    const playerHit = async () => {
        setIsLoading(true)
        setTransactionHash(null)
        setTransactionConfirmed(false)
        setTransactionError("")

        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.playerHitCard()
                setCounter((counter += 1))
                setTransactionHash(tx.hash)
                await tx.wait(1)
                getRandomResult()
                console.log("Transaction details:", tx, "Counter:", counter)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            setTransactionError(error.message)
            console.error("Error calling playerHit function:", error)
        } finally {
            setTransactionConfirmed(true)
            setIsLoading(false)
        }
    }

    const getRandomResult = async () => {
        setTransactionHash(null)
        setTransactionConfirmed(false)
        setTransactionError("")
        const { contract } = state
        try {
            if (contract) {
                const result = await contract.getRandomResult()
                setTransactionHash(result.hash)

                if (result) {
                    let nestedProxy = result[counter]
                    const rank = Number(nestedProxy[0])
                    const suit = Number(nestedProxy[1])
                    const cardValue = Number(nestedProxy[2])
                    const hasBeenPlayed = nestedProxy[3]

                    if (nestedProxy && hasBeenPlayed) {
                        setPlayerHand((prevPlayerHand) => {
                            const isCardAlreadyAdded = prevPlayerHand.some(
                                (card) =>
                                    card.rank === rank &&
                                    card.suit === suit &&
                                    card.cardValue === cardValue
                            )

                            if (!isCardAlreadyAdded) {
                                return [
                                    ...prevPlayerHand,
                                    { rank, suit, cardValue },
                                ]
                            } else {
                                console.log("Already added: ", nestedProxy)
                                return prevPlayerHand
                            }
                        })
                    } else {
                        console.log(
                            "Already added or other conditions not met: ",
                            nestedProxy
                        )
                    }
                    console.log(result[counter])
                } else {
                    console.error()
                }
            }
            getPlayerCardValue()
            setTransactionConfirmed(true)
        } catch (error) {
            setTransactionError(error.message)
            console.error("Contract instance not found", contract)
        }
    }

    return (
        <>
            {isLoading && (
                <LoadingModal
                    transactionHash={transactionHash}
                    transactionConfirmed={transactionConfirmed}
                    transactionError={transactionError}
                />
            )}

            <button className={styles.PlayerHitButton} onClick={playerHit}>
                Player Hit
            </button>

            {/* <button onClick={getRandomResult}>getRandomResult</button> */}
        </>
    )
}
