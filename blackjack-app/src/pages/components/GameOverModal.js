import React, { useEffect } from "react"
import styles from "../../styles/GameOverModal.module.css"

function GameOverModal({
    showGameOverModal,
    closeGameOverModal,
    state,
    isGameOver,
    setIsGameOver,
    playerWins,
    setPlayerWins,
    dealerWins,
    setDealerWins,
    setCardsAlreadyDealt,
    setCounter,
    counter,
    setPlayerHand,
    setDealerHand,
    setDealerTurn,
    noWinner,
    setNoWinner,
}) {
    useEffect(() => {
        gameOverResult()
    }, [state /*noWinner, isGameOver, playerWins, dealerWins */])

    const gameOverResult = async () => {
        try {
            const { contract } = state

            if (contract) {
                const callPlayerWins = await contract.getPlayerWins()
                if (callPlayerWins) {
                    setIsGameOver(true)
                    // setPlayerWins(true)
                    // setPlayerHand([])
                    // setDealerHand([])
                    // setDealerTurn(false)
                    // setCardsAlreadyDealt(false)
                    // setCounter(0)
                    console.log("Transaction details tx:", callPlayerWins)
                }
                const callDealerWins = await contract.getDealerWins()
                if (callDealerWins) {
                    setIsGameOver(true)
                    // setDealerWins(true)
                    // setPlayerHand([])
                    // setDealerHand([])
                    // setDealerTurn(false)
                    // setCardsAlreadyDealt(false)
                    // setCounter(0)
                    console.log("Transaction details result:", callDealerWins)
                }
                const callNoWinner = await contract.getNoWinner()
                if (callNoWinner) {
                    setIsGameOver(true)
                    // setNoWinner(true)
                    // setPlayerHand([])
                    // setDealerHand([])
                    // setDealerTurn(false)
                    // setCardsAlreadyDealt(false)
                    // setCounter(0)
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
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
                        <h3>GAME OVER</h3>
                        <p>Player Wins!</p>
                    </div>
                </div>
            )}

            {dealerWins && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className={styles.GameOverModal}>
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
                        <h3>GAME OVER </h3>
                        <p>Dealer Wins!</p>
                    </div>
                </div>
            )}

            {noWinner && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className={styles.GameOverModal}>
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
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
