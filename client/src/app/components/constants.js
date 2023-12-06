export const abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "Blackjack__CardHasAlreadyBeenPlayed",
        type: "error",
    },
    {
        inputs: [],
        name: "Blackjack__CardsAlreadyDealt",
        type: "error",
    },
    {
        inputs: [],
        name: "Blackjack__DealerTurn",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "Blackjack__IncorrectRequestId",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        name: "Blackjack__IndexOutOfRange",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        name: "Blackjack__MustDealCards",
        type: "error",
    },
    {
        inputs: [],
        name: "Blackjack__MustStartGameFirst",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        name: "Blackjack__NotDealerTurn",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        name: "Blackjack__NotPlayerTurn",
        type: "error",
    },
    {
        inputs: [],
        name: "Blackjack__RandomCardsNotYetGenerated",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        name: "Blackjack__StillPlayerTurn",
        type: "error",
    },
    {
        inputs: [],
        name: "dealerHitCard",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "have",
                type: "address",
            },
            {
                internalType: "address",
                name: "want",
                type: "address",
            },
        ],
        name: "OnlyCoordinatorCanFulfill",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "cardValue",
                type: "uint8",
            },
        ],
        name: "Blackjack__CardValue",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [],
        name: "Blackjack__DealerWins",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "enum Blackjack.Rank",
                name: "",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "enum Blackjack.Suit",
                name: "",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        name: "Blackjack__PlayerHit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [],
        name: "Blackjack__PlayerStands",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [],
        name: "Blackjack__PlayerWins",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [],
        name: "Blackjack__PushNoWinner",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
        ],
        name: "Blackjack__RandomWordsRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct Blackjack.Card",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct Blackjack.Card",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct Blackjack.Card",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct Blackjack.Card",
                name: "",
                type: "tuple",
            },
        ],
        name: "Blackjack__ReturnedFirstRandomFourCards",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                indexed: false,
                internalType: "struct Blackjack.Card[]",
                name: "",
                type: "tuple[]",
            },
        ],
        name: "Blackjack__ReturnedRandomness",
        type: "event",
    },
    {
        inputs: [],
        name: "dealCards",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "playerHitCard",
        outputs: [
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                internalType: "struct Blackjack.Card",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
            {
                internalType: "uint256[]",
                name: "randomWords",
                type: "uint256[]",
            },
        ],
        name: "rawFulfillRandomWords",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "standHand",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "startGame",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "checkUpkeep",
        outputs: [
            {
                internalType: "bool",
                name: "upkeepNeeded",
                type: "bool",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "deck",
        outputs: [
            {
                internalType: "enum Blackjack.Rank",
                name: "rank",
                type: "uint8",
            },
            {
                internalType: "enum Blackjack.Suit",
                name: "suit",
                type: "uint8",
            },
            {
                internalType: "uint8",
                name: "cardValue",
                type: "uint8",
            },
            {
                internalType: "bool",
                name: "hasBeenPlayed",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCardsAlreadyDealt",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCounter",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDealerTurn",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDealerValue",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDealerWins",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDeck",
        outputs: [
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                internalType: "struct Blackjack.Card[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getGameStarted",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPlayerTurn",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPlayerValue",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPlayerWins",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRandomResult",
        outputs: [
            {
                components: [
                    {
                        internalType: "enum Blackjack.Rank",
                        name: "rank",
                        type: "uint8",
                    },
                    {
                        internalType: "enum Blackjack.Suit",
                        name: "suit",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "cardValue",
                        type: "uint8",
                    },
                    {
                        internalType: "bool",
                        name: "hasBeenPlayed",
                        type: "bool",
                    },
                ],
                internalType: "struct Blackjack.Card[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "s_randomResult",
        outputs: [
            {
                internalType: "enum Blackjack.Rank",
                name: "rank",
                type: "uint8",
            },
            {
                internalType: "enum Blackjack.Suit",
                name: "suit",
                type: "uint8",
            },
            {
                internalType: "uint8",
                name: "cardValue",
                type: "uint8",
            },
            {
                internalType: "bool",
                name: "hasBeenPlayed",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_requestId",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
]
