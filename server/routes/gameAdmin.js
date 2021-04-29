const express = require('express');

const gameAdminController = require('../controllers/gameAdmin');

const router = express.Router();

router.use('/create-game', gameAdminController.createGame);

module.exports = router;