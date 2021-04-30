class Poker {
    constructor(pokerId, point, suit, mainPoint = null, mainSuit = null) {
        this.pokerId = pokerId;
        this.point = point;
        this.suit = suit;
        if (mainPoint) {
            this.mainPoint = mainPoint;
        } else {
            this.mainPoint = point;
        }
        if (mainSuit) {
            this.mainSuit = mainSuit;
        } else {
            this.mainSuit = suit;
        }
    }
}

module.exports = Poker;