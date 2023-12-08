import React from "react"
import styles from "../../styles/DealCardsButton.module.css"

export default function DealCardsButton({
    state,
    cardsAlreadyDealt,
    setCardsAlreadyDealt,
    playerTurn,
    setPlayerTurn,
    playerCardValue,
    setPlayerCardValue,
    dealerCardValue,
    setDealerCardValue,
}) {
    const dealCards = async () => {
        try {
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.dealCards()
                console.log(contract)
                setCardsAlreadyDealt(true)
                setPlayerTurn(true)
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
            console.error("Error calling dealCards function:", error)
        }
    }
    return (
        <button className={styles.DealCardsButton} onClick={dealCards}>
            Deal Cards
        </button>
    )
}
