import React from "react"
import styles from "../../styles/PlayerHitButton.module.css"

export default function PlayerHitButton({ state }) {
    const playerHit = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.playerHitCard()

                console.log("Transaction details:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }
    return (
        <button className={styles.PlayerHitButton} onClick={playerHit}>
            Player Hit
        </button>
    )
}
