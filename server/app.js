const express = require('express');

const gameAdminRoutes = require('./routes/gameAdmin');

const app = express();

app.use('/game', gameAdminRoutes);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
})

const server = app.listen(3000);
const io = require('./socket').init(server);
io.on('connection', socket => {
    console.log('Client connected');
});
