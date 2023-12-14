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
    setPlayerHand,
    setDealerHand,
    setDealerTurn,
}) {
    useEffect(() => {
        gameOverResult()
    }, [state, isGameOver, playerWins, dealerWins])

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
                    setDealerTurn(false)
                    setCardsAlreadyDealt(false)
                    setCounter(0)
                    console.log("Transaction details tx:", tx)
                }
                const result = await contract.getDealerWins()
                if (result) {
                    setIsGameOver(true)
                    setDealerWins(true)
                    setPlayerHand([])
                    setDealerHand([])
                    setDealerTurn(false)
                    setCardsAlreadyDealt(false)
                    setCounter(0)
                    console.log("Transaction details result:", result)
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
            {isGameOver && playerWins && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className="modal-content">
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
                        <h3>GAME OVER</h3>
                        <p>Player Wins!</p>
                    </div>
                </div>
            )}

            {isGameOver && dealerWins && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className="modal-content">
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
                        <h3>GAME OVER </h3>
                        <p>Dealer Wins!</p>
                    </div>
                </div>
            )}

            {!playerWins && !dealerWins && isGameOver && (
                <div className={`modal ${showGameOverModal ? "show" : "hide"}`}>
                    <div className="modal-content">
                        <span className="close" onClick={closeGameOverModal}>
                            &times;
                        </span>
                        <h3>GAME OVER</h3>
                        <p>Draw Game</p>
                        <p> No Winner!</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default GameOverModal
