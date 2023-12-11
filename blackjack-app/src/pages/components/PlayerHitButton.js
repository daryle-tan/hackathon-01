import React from "react"
import styles from "../../styles/PlayerHitButton.module.css"
import LoadingModal from "./LoadingModal"

export default function PlayerHitButton({
    state,
    isLoading,
    setIsLoading,
    playerHand,
    setPlayerHand,
    getPlayerCardValue,
    setCounter,
    counter,
    isGameOver,
}) {
    const playerHit = async () => {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.playerHitCard()

                console.log("Transaction details:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
            setIsLoading(false)
            getRandomResult()
        } catch (error) {
            setIsLoading(false)
            console.error("Error calling dealCards function:", error)
        }
    }

    const getRandomResult = async () => {
        const { contract } = state
        if (contract) {
            const result = await contract.getRandomResult()
            if (counter >= 3 && result[counter]) {
                let nestedProxy = result[counter]
                const rank = Number(nestedProxy[0])
                const suit = Number(nestedProxy[1])
                const cardValue = Number(nestedProxy[2])
                const hasBeenPlayed = nestedProxy[3]

                if (
                    // result[counter].hasBeenPlayed &&
                    counter >= 3
                    // playerHand.length === counter + 1
                ) {
                    setPlayerHand((prevPlayerHand) => [
                        ...prevPlayerHand,
                        { rank, suit, cardValue },
                    ])
                } else {
                    console.log("Already added: ", nestedProxy)
                }
                setCounter(counter + 1)
                console.log(result[counter].hasBeenPlayed)
            }
            getPlayerCardValue()
            console.log(result[counter], isGameOver)
        }
    }
    return (
        <>
            {isLoading ? (
                <LoadingModal />
            ) : (
                <button className={styles.PlayerHitButton} onClick={playerHit}>
                    Player Hit
                </button>
            )}
            <button onClick={getRandomResult}>getRandomResult</button>
        </>
    )
}
