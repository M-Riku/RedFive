const express = require('express');

const gameAdminController = require('../controllers/gameAdmin');

const router = express.Router();

router.use('/player-login', gameAdminController.playerLogin);

router.use('/create-room', gameAdminController.createRoom);

router.use('/join-room', gameAdminController.joinRoom);

router.get('/list-other-players/:playerId', gameAdminController.listOtherPlayer);

router.use('/create-game/:mainPoint', gameAdminController.createGame);

router.use('/set-main/:mainSuit', gameAdminController.setMain);

router.use('/play-cards/:playerId', gameAdminController.playCards);

router.use('/regret-cards/:playerId', gameAdminController.regretCards);

router.get('/get-hole-pokers/:playerId', gameAdminController.getHolePokers);

router.post('/set-hole-pokers/:playerId', gameAdminController.setHolePokers)

module.exports = router;