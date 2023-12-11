import React from "react"
import styles from "../../styles/StartGameButton.module.css"

function StartGameButton({
    state,
    gameStarted,
    setGameStarted,
    setIsGameOver,
}) {
    const startGame = async () => {
        try {
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.startGame()
                setIsGameOver(false)
                setPlayerHand([])
                setDealerHand([])
                setCardsAlreadyDealt(false)
                setCounter(0)
                setGameStarted(true)
                console.log(
                    "Transaction details:",
                    tx,
                    "Game has started:",
                    gameStarted
                )
            } else {
                console.error("Contract instance not found")
            }
        } catch (error) {
            console.error("Error calling startGame function:", error)
        }
    }

    return (
        <button className={styles.StartGameButton} onClick={startGame}>
            Start Game
        </button>
    )
}

export default StartGameButton
