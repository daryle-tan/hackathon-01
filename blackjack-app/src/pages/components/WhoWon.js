import { useEffect } from "react"

export default function WhoWon({
    state,
    setIsGameOver,
    setPlayerWins,
    setDealerWins,
    setGameStarted,
}) {
    useEffect(() => {
        getDealerWins()
        getPlayerWins()
    }, [state])

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
                console.log("Transaction details:", tx)
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
                // if (tx) {
                //     setIsGameOver(true)
                //     setPlayerWins(true)
                //     setGameStarted(false)
                // }
                console.log("Transaction details:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }
    return <button onClick={getPlayerWins}>Who Won?</button>
}
