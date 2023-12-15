import { useState, useEffect } from "react"
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
    const [playerHasHit, setPlayerHasHit] = useState(false)

    useEffect(() => {
        if (playerHasHit) {
            getRandomResult()
            // Reset the tracker
            setPlayerHasHit(false)
        }
    }, [playerHasHit])

    const playerHit = async () => {
        try {
            setIsLoading(true)
            const { contract } = state

            if (contract) {
                const tx = await contract.playerHitCard()
                setCounter(counter + 1)

                setIsLoading(false)
                setPlayerHasHit(true)
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
        if (result.length > 3) {
            let nestedProxy = result[counter]
            const rank = Number(nestedProxy[0])
            const suit = Number(nestedProxy[1])
            const cardValue = Number(nestedProxy[2])
            const hasBeenPlayed = nestedProxy[3]

            if (hasBeenPlayed && counter >= 3 && result[counter]) {
                setPlayerHand((prevPlayerHand) => {
                    const isCardAlreadyAdded = prevPlayerHand.some(
                        (card) =>
                            card.rank === rank &&
                            card.suit === suit &&
                            card.cardValue === cardValue
                    )

                    if (!isCardAlreadyAdded) {
                        return [...prevPlayerHand, { rank, suit, cardValue }]
                    } else {
                        console.log("Already added: ", nestedProxy)
                        return prevPlayerHand
                    }
                })
            } else {
                console.log(
                    "Already added or other conditions not met: ",
                    nestedProxy
                )
            }
            console.log(result[counter])
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
