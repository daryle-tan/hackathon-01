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
    setNoWinner,
}) {
    const [transactionHash, setTransactionHash] = useState(null)
    const [transactionConfirmed, setTransactionConfirmed] = useState(false)
    const [transactionError, setTransactionError] = useState("")

    const startGame = async () => {
        setIsLoading(true)
        setTransactionHash(null)
        setTransactionConfirmed(false)
        setTransactionError("")

        try {
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.startGame()
                setTransactionHash(tx.hash)
                await tx.wait(1)
                setTransactionConfirmed(true)
                setGameStarted(true)

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
            setTransactionError(error.message)
            console.error("Error calling startGame function:", error)
        } finally {
            setIsLoading(false)
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
            setNoWinner(false)
        }
    }, [gameStarted])
    return (
        <>
            {isLoading && (
                <LoadingModal
                    transactionHash={transactionHash}
                    transactionConfirmed={transactionConfirmed}
                    transactionError={transactionError}
                />
            )}
            <button className={styles.StartGameButton} onClick={startGame}>
                Start Game
            </button>
        </>
    )
}

export default StartGameButton
