const mongoose = require('mongoose');

const Poker = require('./poker');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    playerId: {
        type: String,
        required: true
    },
    pokers: {
        type: [Poker],
        default: []
    },
    playedPokers: {
        type: [Poker],
        default: []
    },
    password: String,
    gameStatus: {
        isBanker: Boolean,
        rank: Number,
        handPokers: [Poker]
    }
});

module.exports = mongoose.model('Player', playerSchema);
