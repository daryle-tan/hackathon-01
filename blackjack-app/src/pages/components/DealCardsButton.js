import React from "react"
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
    const dealCards = async () => {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.dealCards()
                console.log(contract)
                setCardsAlreadyDealt(true)
                setPlayerTurn(true)
                setCounter(3)
                getRandomResultArray()
                setIsLoading(false)
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
            setIsLoading(false)
            console.error("Error calling dealCards function:", error)
        }
    }
    return (
        <>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <button className={styles.DealCardsButton} onClick={dealCards}>
                    Deal Cards
                </button>
            )}
        </>
    )
}
