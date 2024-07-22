export class Card {
    constructor(rank: CardRank, suit: CardSuit){
        this.rank = rank;
        this.suit = suit;
        this.value = getCardValue(rank);
        this.displayName = getDisplayName(rank, suit);
    }

    rank: CardRank;
    suit: CardSuit;
    value: number;
    displayName: string;
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

const getDisplayName = (rank: CardRank, suit: CardSuit) =>  {
    let suitIcon = "";
    switch (suit) {
        case CardSuit.Spades:
            suitIcon = '\u2660'
            break;
        case CardSuit.Hearts:
            suitIcon = '\u2665'
            break;
            case CardSuit.Diamonds:
            suitIcon = '\u2666'
            break;
            case CardSuit.Clubs:
            suitIcon = "\u2663"
            break;
    }
    let rankDisplay = "";
    switch (rank) {
        case CardRank.Ace:
            rankDisplay = "A";
            break;
        case CardRank.Two:
            rankDisplay = "2";
            break;
        case CardRank.Three:
            rankDisplay = "3";
            break;
        case CardRank.Four:
            rankDisplay = "4";
            break;
        case CardRank.Five:
            rankDisplay = "5";
            break;
        case CardRank.Six:
            rankDisplay = "6";
            break;
        case CardRank.Seven:
            rankDisplay = "7";
            break;
        case CardRank.Eight:
            rankDisplay = "8";
            break;
        case CardRank.Nine:
            rankDisplay = "9";
            break;
        case CardRank.Ten:
            rankDisplay = "10";
            break;
        case CardRank.Jack:
            rankDisplay = "J";
            break;
        case CardRank.Queen:
            rankDisplay = "Q";
            break;
        case CardRank.King:
            rankDisplay = "K";
            break;
    }

    return rankDisplay + suitIcon;
}

export enum CardSuit {
    Spades,
    Hearts,
    Diamonds,
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