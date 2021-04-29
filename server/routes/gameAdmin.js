const express = require('express');

const gameAdminController = require('../controllers/gameAdmin');

const router = express.Router();

router.use('/create-game/:mainPoint', gameAdminController.createGame);

router.use('/set-main/:mainSuit', gameAdminController.setMain);

module.exports = router;