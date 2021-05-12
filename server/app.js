const express = require('express');
const cors = require('cors');
// const ws = require('ws');
const mongoose = require('mongoose');

const gameAdminRoutes = require('./routes/gameAdmin');

const app = express();
app.use(cors());
app.use(express.json());

const server = mongoose
    .connect(
        'mongodb+srv://lu:luminghao@redfivecluster.o5tmu.mongodb.net/redfive?retryWrites=true&w=majority'
    )
    .then(
        () => app.listen(3000)
    )
// const server = app.listen(3000);

// const wss = new ws.Server({ server: server, path: "/wsgame" });

// sendFlag = [];
// players = [];
// playerPokers = [];
// const handlerPokers = (req, res, next) => {
//     req.players = players;
//     req.sendFlag = sendFlag;
//     req.playerPokers = playerPokers;
//     next();
// }

app.use('/game', gameAdminRoutes);

// wss.on("connection", () => {
//     console.log('client connect to server!');
//     wss.clients.forEach((client) => {
//         client.send(
//             JSON.stringify(playerPokers)
//         );
//     });
// });

// setInterval(() => {
//     if (sendFlag.length) {
//         wss.clients.forEach((client) => {
//             client.send(
//                 JSON.stringify(playerPokers)
//             );
//         });
//         sendFlag = [];
//     }
// }, 1000);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
})
