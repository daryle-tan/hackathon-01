import { useEffect } from "react"

export default function WhoWon({
    state,
    dealerHand,
    playerHand,
    counter,
    setDealerWins,
    setPlayerWins,
    setIsGameOver,
    setGameStarted,
}) {
    useEffect(() => {
        getDealerWins()
        getPlayerWins()
    }, [state])

    const getWhoWon = async () => {
        getDealerWins()
        getPlayerWins()
        console.log("DH:", dealerHand, "PH:", playerHand, "Counter:", counter)
    }

    const getDealerWins = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getDealerWins()
                if (tx) {
                    setIsGameOver(true)
                    setDealerWins(true)
                    setGameStarted(false)
                }
                console.log("Transaction details Dealer Wins:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }

    const getPlayerWins = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getPlayerWins()
                if (tx) {
                    setIsGameOver(true)
                    setPlayerWins(true)
                    setGameStarted(false)
                }
                console.log("Transaction details Player Wins:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling getPlayerWins function:", error)
        }
    }
    return <button onClick={getWhoWon}>Who Won?</button>
}
