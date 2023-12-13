import React from "react"
import styles from "../../styles/StandButton.module.css"
import LoadingModal from "./LoadingModal"

export default function StandButton({
    state,
    setIsLoading,
    isLoading,
    getDealerCardValue,
    isGameOver,
    setPlayerTurn,
    setDealerTurn,
}) {
    async function StandHand() {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.standHand()
                const dealerCardValue = await getDealerCardValue()
                const playerTurnSet = await setPlayerTurn(false)
                const dealerTurnSet = await setDealerTurn(true)
                const loadingSet = await setIsLoading(false)
                console.log(
                    "Transaction details:",
                    tx,
                    isGameOver,
                    dealerCardValue
                )
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Error calling dealCards function:", error)
        }
    }
    return (
        <>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <button className={styles.StandButton} onClick={StandHand}>
                    Stand
                </button>
            )}
        </>
    )
}
