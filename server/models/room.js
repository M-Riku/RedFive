const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: {
        type: String,
        default: function () {
            return this._id.toString();
        }
    },
    players: [
        {
            type: String,
            ref: 'Player',
            default: []
        }
    ]
});

roomSchema.methods.addPlayer = function (playerId) {
    const roomPlayerIndex = this.players.findIndex(id => id === playerId);

    if (roomPlayerIndex < 0) {
        if (this.players.length >= 5) {
            return false;
        }
        this.players.push(playerId);
    }
    return true;
}

module.exports = mongoose.model('Room', roomSchema);