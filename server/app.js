const express = require('express');

const cors = require('cors');

const ws = require('ws');

const gameAdminRoutes = require('./routes/gameAdmin');

const app = express();
app.use(cors());
app.use(express.json());
const server = app.listen(3000);

const wss = new ws.Server({ server: server, path: "/wsgame" });

sendFlag = [];
players = require('./models/Players');
playerPokers = [];
players.forEach(player => {
    playerPokers.push({ playerId: player, pokers: [], playedPokers: [] })
});
const handlerPokers = (req, res, next) => {
    req.players = players;
    req.sendFlag = sendFlag;
    req.playerPokers = playerPokers;
    next();
}

app.use('/game', handlerPokers, gameAdminRoutes);

wss.on("connection", () => {
    console.log('client connect to server!');
    wss.clients.forEach((client) => {
        client.send(
            JSON.stringify(playerPokers)
        );
    });
});

setInterval(() => {
    if (sendFlag.length) {
        wss.clients.forEach((client) => {
            client.send(
                JSON.stringify(playerPokers)
            );
        });
        sendFlag = [];
    }
}, 1000);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
})
