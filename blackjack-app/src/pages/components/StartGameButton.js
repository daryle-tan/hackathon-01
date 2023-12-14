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
}) {
    const [gameStartedTx, setGameStartedTx] = useState(false)

    const startGame = async () => {
        try {
            setIsLoading(true)
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.startGame()

                setIsLoading(false)
                console.log(
                    "Transaction details:",
                    tx,
                    "Game has started:",
                    gameStarted
                )
                setGameStartedTx(true)
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
        if (gameStartedTx) {
            setIsGameOver(false)
            setPlayerHand([])
            setDealerHand([])
            setCardsAlreadyDealt(false)
            setCounter(0)
            setGameStarted(true)
        }
    }, [gameStartedTx])
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
