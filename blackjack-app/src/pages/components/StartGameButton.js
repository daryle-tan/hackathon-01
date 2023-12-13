import React from "react"
import styles from "../../styles/StartGameButton.module.css"
import LoadingModal from "./LoadingModal"

function StartGameButton({
    state,
    gameStarted,
    setGameStarted,
    setIsGameOver,
    setPlayerHand,
    setDealerHand,
    setCardsAlreadyDealt,
    setCounter,
    setIsLoading,
    isLoading,
}) {
    const startGame = async () => {
        try {
            setIsLoading(true)
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.startGame()
                const gameSet = await setIsGameOver(false)
                const playerHandSet = await setPlayerHand([])
                const dealerHandSet = await setDealerHand([])
                const cardsAlreadyDealt = await setCardsAlreadyDealt(false)
                const counterReset = await setCounter(0)
                const gameStartSet = await setGameStarted(true)
                const loadingSet = await setIsLoading(false)
                console.log(
                    "Transaction details:",
                    tx,
                    "Game has started:",
                    gameStarted
                )
            } else {
                const loadingSet = await setIsLoading(false)
                console.error("Contract instance not found")
            }
        } catch (error) {
            const loadingSet = await setIsLoading(false)
            console.error("Error calling startGame function:", error)
        }
    }

    return (
        <>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <button className={styles.StartGameButton} onClick={startGame}>
                    Start Game
                </button>
            )}
        </>
    )
}

export default StartGameButton
