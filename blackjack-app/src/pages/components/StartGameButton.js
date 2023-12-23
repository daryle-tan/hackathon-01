import { useState, useEffect } from "react"
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
    setPlayerWins,
    setDealerWins,
}) {
    const startGame = async () => {
        setIsLoading(true)
        try {
            // const { contract } = state
            // Check if contract instance exists
            if (state) {
                // Trigger the startGame function
                const tx = await state.startGame()

                setGameStarted(true)
                setIsLoading(false)
                console.log(
                    "Transaction details:",
                    tx,
                    "Game has started:",
                    gameStarted
                )
            } else {
                setIsLoading(false)
                console.error("Contract instance not found")
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Error calling startGame function:", error)
        }
    }

    useEffect(() => {
        if (gameStarted) {
            setIsGameOver(false)
            setPlayerHand([])
            setDealerHand([])
            setCardsAlreadyDealt(false)
            setCounter(0)
            setGameStarted(true)
            setPlayerWins(false)
            setDealerWins(false)
        }
    }, [gameStarted])
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
