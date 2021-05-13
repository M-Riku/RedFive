const express = require('express');
const cors = require('cors');
const ws = require('ws');
const mongoose = require('mongoose');

const gameAdminRoutes = require('./routes/gameAdmin');

const MONGODB_URI = 'mongodb+srv://lu:luminghao@redfivecluster.o5tmu.mongodb.net/redfive';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/game', gameAdminRoutes);

mongoose.connect(MONGODB_URI)

const server = app.listen(3000);

const wss = new ws.Server({ server: server, path: "/wsgame" });

wss.on("connection", () => {
    console.log('client connect to server!');
    // wss.clients.forEach((client) => {
    //     client.send(
    //         JSON.stringify(playerPokers)
    //     );
    // });
});

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
