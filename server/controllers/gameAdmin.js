const io = require('../socket');

let gameNumber = 1;

exports.createGame = (req, res, next) => {
    console.log('create game!');
    gameNumber++;
    io.getIO.emit('posts', {
        action: 'create',
        gameNumber: gameNumber
    });
};