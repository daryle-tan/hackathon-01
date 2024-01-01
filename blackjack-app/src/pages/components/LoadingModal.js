import React from "react"
import styles from "../../styles/LoadingModal.module.css"

const LoadingModal = ({
    transactionHash,
    transactionConfirmed,
    transactionError,
}) => {
    return (
        <dialog open className={styles.loadingModal}>
            <div className={styles.spinner}></div>
            {/* Waiting for transaction to complete... */}
            {transactionHash && !transactionConfirmed && (
                <p>Transaction sent: {transactionHash}</p>
            )}
            {transactionConfirmed && <p>Transaction confirmed!</p>}
            {transactionError && <p>Error: {transactionError}</p>}
        </dialog>
    )
}

export default LoadingModal
