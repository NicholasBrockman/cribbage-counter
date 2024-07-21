export class Card {
    constructor(rank: CardRank, suit: CardSuit){
        this.rank = rank;
        this.suit = suit;
        this.value = getCardValue(rank);
    }

    rank: CardRank;
    suit: CardSuit;
    value: number;
}

const getCardValue = (rank: CardRank) =>  {
    switch (rank) {
        case CardRank.Ace:
            return 1;
        case CardRank.Two:
            return 2;
        case CardRank.Three:
            return 3;
        case CardRank.Four:
            return 4;
        case CardRank.Five:
            return 5;
        case CardRank.Six:
            return 6;
        case CardRank.Seven:
            return 7;
        case CardRank.Eight:
            return 8;
        case CardRank.Nine:
            return 9;
        case CardRank.Ten:
        case CardRank.Jack:
        case CardRank.Queen:
        case CardRank.King:
            return 10;
    }

}

export enum CardSuit {
    Hearts,
    Diamonds,
    Spades,
    Clubs
}

export enum CardRank {
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
}


export const FullDeckCards = Object.values(CardSuit).filter((suit) => typeof suit !== "string").flatMap(s =>
    Object.values(CardRank).filter((rank) => typeof rank !== "string").map((r) => {return new Card(r, s) })
);

// export var FullDeckCards = () => {
//     var suits = Object.values(CardSuit).filter((suit) => typeof suit !== "string");
//     var ranks = Object.values(CardRank).filter((rank) => typeof rank !== "string");
//     return suits.flatMap(s => ranks.map((v) => { return new Card(v, s) }));
// }
// Object.values(CardSuit).filter((suit) => typeof suit !== "string").forEach((cardSuit) => {
//         Object.values(CardRank).filter((rank) => typeof rank !== "string").map((cardRank) => {
//             return new Card(cardRank, cardSuit)
//         })
//         let fullDeck = suits.map(s => values.map(v => s + v));
//         return deckNew;
//     });
    // return cards;