import React from "react"

export default function GetDeck({ state }) {
    const getDeck = async () => {
        try {
            const { contract } = state
            // Check if contract instance exists
            if (contract) {
                // Trigger the startGame function
                const tx = await contract.getDeck()

                console.log("Transaction details:", tx)
            } else {
                console.error("Contract instance not found", contract)
            }
        } catch (error) {
            console.error("Error calling dealCards function:", error)
        }
    }
    return <button onClick={getDeck}>deckOfCards</button>
}
