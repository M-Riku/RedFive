const express = require('express');
const app = express();
const WebSocketServer = require("ws").Server;

const gameAdminRoutes = require('./routes/gameAdmin');

const server = app.listen(3000);
const wss = new WebSocketServer({ server: server, path: "/wsgame" });

sendFlag = [];
players = require('./models/Players');
playerPokers = [{ pokers: [] }];
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
            JSON.stringify(playerPokers[0].pokers)
        );
    });
});

setInterval(() => {
    if (sendFlag.length) {
        wss.clients.forEach((client) => {
            client.send(
                JSON.stringify(playerPokers[0].pokers)
            );
        });
        sendFlag = [];
    }
}, 1000);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
})
