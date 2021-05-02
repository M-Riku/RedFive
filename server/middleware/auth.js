const validator = require('validator');

exports.validatPlayerId = (playerId) => {
    return validator.isAlpha(playerId) &&
        validator.isLength(playerId, { min: 1, max: 5 });
}