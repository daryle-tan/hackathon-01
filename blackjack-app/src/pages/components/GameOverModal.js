import React, { useEffect } from "react"

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
}) {
    useEffect(() => {
        gameOverResult()
    }, [state, counter, isGameOver])

    const gameOverResult = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getPlayerWins()
                if (tx) {
                    setIsGameOver(true)
                    setPlayerWins(true)
                    setPlayerHand([])
                    setDealerHand([])
                    setCardsAlreadyDealt(false)
                    setCounter(0)
                    console.log("Transaction details:", tx)
                }
                const result = await contract.getDealerWins()
                if (result) {
                    setIsGameOver(true)
                    setDealerWins(true)
                    setPlayerHand([])
                    setDealerHand([])
                    setCardsAlreadyDealt(false)
                    setCounter(0)
                    console.log("Transaction details:", result)
                }
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }
    return (
        <>
            {isGameOver && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    {playerWins && (
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={closeGameOverModal}
                            >
                                &times;
                            </span>
                            <h3>GAME OVER </h3>
                            <p>Player Wins!</p>
                        </div>
                    )}

                    {dealerWins && (
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={closeGameOverModal}
                            >
                                &times;
                            </span>
                            <h3>GAME OVER </h3>
                            <p>Dealer Wins!</p>
                        </div>
                    )}

                    {!playerWins && !dealerWins && isGameOver ? (
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={closeGameOverModal}
                            >
                                &times;
                            </span>
                            <h3>GAME OVER </h3>
                            <p>Player Wins!</p>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            )}
        </>
    )
}

export default GameOverModal
