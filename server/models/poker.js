const mongoose = require('mongoose');

const Schema = mongoose.Schema

const pokerSchema = new Schema({
    pokerId: {
        type: Number,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    suit: {
        type: Number,
        required: true
    },
    mainPoint: Number,
    mainSuit: Number
});

module.exports = pokerSchema;

// class Poker {
//     constructor(pokerId, point, suit, mainPoint = null, mainSuit = null) {
//         this.pokerId = pokerId;
//         this.point = point;
//         this.suit = suit;
//         if (mainPoint) {
//             this.mainPoint = mainPoint;
//         } else {
//             this.mainPoint = point;
//         }
//         if (mainSuit) {
//             this.mainSuit = mainSuit;
//         } else {
//             this.mainSuit = suit;
//         }
//     }
// }

// module.exports = Poker;