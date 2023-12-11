import React from "react"
import styles from "../../styles/StandButton.module.css"
import LoadingModal from "./LoadingModal"

export default function StandButton({
    state,
    setIsLoading,
    isLoading,
    getDealerCardValue,
    isGameOver,
}) {
    async function StandHand() {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.standHand()
                getDealerCardValue()
                console.log("Transaction details:", tx, isGameOver)
            } else {
                console.error("Contract instance not found", contract)
            }
            setIsLoading(false)
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
