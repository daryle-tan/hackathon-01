import { useEffect } from "react"

export default function WhoWon({
    state,
    setIsGameOver,
    setPlayerWins,
    setDealerWins,
    setGameStarted,
    dealerHand,
    playerHand,
}) {
    useEffect(() => {
        getDealerWins()
        getPlayerWins()
    }, [])

    const getWhoWon = async () => {
        getDealerWins()
        getPlayerWins()
        console.log("DH:", dealerHand, "PH:", playerHand)
    }

    const getDealerWins = async () => {
        try {
            const { contract } = state

            if (contract) {
                const tx = await contract.getDealerWins()
                if (tx) {
                    // setIsGameOver(true)
                    // setDealerWins(true)
                    // setGameStarted(false)
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

                console.log("Transaction details Player Wins:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }
    return <button onClick={getWhoWon}>Who Won?</button>
}
