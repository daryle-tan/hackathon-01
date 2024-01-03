import React, { useEffect } from "react"
import styles from "../../styles/GameOverModal.module.css"

function GameOverModal({
    showGameOverModal,
    closeGameOverModal,
    state,
    setIsGameOver,
    playerWins,
    setPlayerWins,
    dealerWins,
    setDealerWins,
    noWinner,
    setNoWinner,
    playerCardValue,
}) {
    useEffect(() => {
        gameOverResult()
    }, [state, playerCardValue])

    const gameOverResult = async () => {
        try {
            const { contract } = state

            if (contract) {
                const callPlayerWins = await contract.getPlayerWins()
                if (callPlayerWins) {
                    setIsGameOver(true)
                    setPlayerWins(true)

                    console.log("Transaction details tx:", callPlayerWins)
                }
                const callDealerWins = await contract.getDealerWins()
                if (callDealerWins) {
                    setIsGameOver(true)
                    setDealerWins(true)

                    console.log("Transaction details result:", callDealerWins)
                }
                const callNoWinner = await contract.getNoWinner()
                if (callNoWinner) {
                    setIsGameOver(true)
                    setNoWinner(true)

                    console.log("Transaction details result:", callNoWinner)
                }
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling gameOverResult function:", error)
        }
    }
    return (
        <>
            {playerWins && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className={styles.GameOverModal}>
                        <span
                            className="close"
                            onClick={closeGameOverModal}
                        ></span>
                        <h3>GAME OVER</h3>
                        <p>Player Wins!</p>
                    </div>
                </div>
            )}

            {dealerWins && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className={styles.GameOverModal}>
                        <span
                            className="close"
                            onClick={closeGameOverModal}
                        ></span>
                        <h3>GAME OVER </h3>
                        <p>Dealer Wins!</p>
                    </div>
                </div>
            )}

            {noWinner && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className={styles.GameOverModal}>
                        <span
                            className="close"
                            onClick={closeGameOverModal}
                        ></span>
                        <h3>GAME OVER</h3>
                        <p>Draw Game</p>
                        <p>No Winner!</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default GameOverModal
