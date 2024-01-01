import { useState, useEffect } from "react"
import styles from "../../styles/StandButton.module.css"
import LoadingModal from "./LoadingModal"

export default function StandButton({
    state,
    setIsLoading,
    isLoading,
    isGameOver,
    setPlayerTurn,
    setDealerTurn,
    dealerCardValue,
}) {
    const [transactionHash, setTransactionHash] = useState(null)
    const [transactionConfirmed, setTransactionConfirmed] = useState(false)
    const [transactionError, setTransactionError] = useState("")

    useEffect(() => {
        if (!isLoading) {
            setPlayerTurn(false)
            setDealerTurn(true)
        }
    }, [isLoading])

    async function StandHand() {
        setIsLoading(true)
        setTransactionHash(null)
        setTransactionConfirmed(false)
        setTransactionError("")

        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.standHand()
                setTransactionHash(tx.hash)
                await tx.wait(1)
                setTransactionConfirmed(true)

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
            setTransactionError(error.message)
            console.error("Error calling dealCards function:", error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            {isLoading && (
                <LoadingModal
                    transactionHash={transactionHash}
                    transactionConfirmed={transactionConfirmed}
                    transactionError={transactionError}
                />
            )}
            <button className={styles.StandButton} onClick={StandHand}>
                Stand
            </button>
        </>
    )
}
