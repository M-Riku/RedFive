const express = require('express');

const gameAdminController = require('../controllers/gameAdmin');

const router = express.Router();

router.get('/list-other-players/:playerId', gameAdminController.listOtherPlayer);

router.use('/create-game/:mainPoint', gameAdminController.createGame);

router.use('/set-main/:mainSuit', gameAdminController.setMain);

router.use('/play-cards/:playerId', gameAdminController.playCards);

router.use('/regret-cards/:playerId', gameAdminController.regretCards);

module.exports = router;