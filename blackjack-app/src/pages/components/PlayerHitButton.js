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
                const counterSet = await setCounter(counter + 1)
                const randomGet = await getRandomResult()
                const loadingSet = await setIsLoading(false)
                console.log("Transaction details:", tx, randomGet, counterSet)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Error calling dealCards function:", error)
        }
    }

    const getRandomResult = async () => {
        const { contract } = state
        const result = await contract.getRandomResult()
        if (result.length >= 3) {
            let nestedProxy = result[counter]
            const rank = Number(nestedProxy[0])
            const suit = Number(nestedProxy[1])
            const cardValue = Number(nestedProxy[2])
            const hasBeenPlayed = nestedProxy[3]
            if (hasBeenPlayed && counter >= 3 && result[counter]) {
                setPlayerHand((prevPlayerHand) => [
                    ...prevPlayerHand,
                    { rank, suit, cardValue },
                ])
            } else {
                console.log("Already added: ", nestedProxy)
            }
            console.log(result[counter], isGameOver)
        }
        getPlayerCardValue()
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
