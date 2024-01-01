import { useState, useEffect } from "react"
import styles from "../../styles/DealCardsButton.module.css"
import LoadingModal from "./LoadingModal"

export default function DealCardsButton({
    state,
    cardsAlreadyDealt,
    setCardsAlreadyDealt,
    playerTurn,
    setPlayerTurn,
    isLoading,
    setIsLoading,
    getRandomResultArray,
    setCounter,
}) {
    const [transactionHash, setTransactionHash] = useState(null)
    const [transactionConfirmed, setTransactionConfirmed] = useState(false)
    const [transactionError, setTransactionError] = useState("")

    useEffect(() => {
        if (!isLoading) {
            setCardsAlreadyDealt(true)
            setPlayerTurn(true)
            setCounter(3)
            getRandomResultArray()
        }
    }, [isLoading])

    const dealCards = async () => {
        setIsLoading(true)
        setTransactionHash(null)
        setTransactionConfirmed(false)
        setTransactionError("")

        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.dealCards()
                setTransactionHash(tx.hash)
                await tx.wait(5)

                console.log(
                    "Transaction details:",
                    tx,
                    "Cards are dealt!:",
                    cardsAlreadyDealt,
                    "Player's turn:",
                    playerTurn
                )
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            setTransactionError(error.message)
            console.error("Error calling dealCards function:", error)
        } finally {
            setTransactionConfirmed(true)
            setIsLoading(false)
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
            <button className={styles.DealCardsButton} onClick={dealCards}>
                Deal Cards
            </button>
        </>
    )
}
