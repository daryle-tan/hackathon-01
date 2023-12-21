import React, { useEffect } from "react"
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
    dealerCardValue,
}) {
    useEffect(() => {
        if (!isLoading) {
            setPlayerTurn(false)
            setDealerTurn(true)
        }
    }, [isLoading])

    async function StandHand() {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.standHand()

                setIsLoading(false)
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
            {/* {isLoading ? (
                <LoadingModal />
            ) : ( */}
            <button className={styles.StandButton} onClick={StandHand}>
                Stand
            </button>
            {/* )} */}
        </>
    )
}
