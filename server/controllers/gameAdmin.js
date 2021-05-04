const Poker = require('../models/Poker');
const ESuit = require('../models/ESuit');
const auth = require('../middleware/auth');


exports.PlayerLogin = (req, res, next) => {
    curPlayerId = req.params.playerId;
    if (!auth.validatPlayerId(curPlayerId)) {
        return res.status(401).send('请输入5位以下全英文的用户名');
    }
    if (req.players.find(player => player === curPlayerId)) {
        return res.status(200).send();
    }
    if (req.players.length < 5) {
        req.players.push(curPlayerId);
        req.playerPokers.push({ playerId: curPlayerId, pokers: [], playedPokers: [] })
        if (req.players.length === 5) {
            req.players.push("庄家");
            req.playerPokers.push({ playerId: "庄家", pokers: [], playedPokers: [] })
        }
        req.sendFlag.push(1);
        res.status(200).send();
    } else {
        res.status(401).send('玩家人数已满, 无法添加新玩家');
    }
}

exports.listOtherPlayer = (req, res, next) => {
    otherPlayers = [];
    curPlayerId = req.params.playerId;
    curPlayerIndex = -1
    req.playerPokers.forEach((playerPoker, index) => {
        if (playerPoker.playerId !== '庄家') {
            otherPlayers.push(playerPoker.playerId)
        }
        if (playerPoker.playerId === curPlayerId) {
            curPlayerIndex = index
        }
    })
    otherPlayers = otherPlayers.slice(curPlayerIndex + 1, 5).concat(otherPlayers.slice(0, curPlayerIndex));
    res.send(JSON.stringify(otherPlayers));
}

exports.createGame = (req, res, next) => {
    if (req.players.length >= 5) {
        console.log('create game');
        curMainPoint = Number(req.params.mainPoint);
        pokers = shufflePokers(3, curMainPoint);
        playerPokers = dealPokersRedFive(req.players, pokers);
        req.sendFlag.push(1);
    }
    res.send();
};

exports.setMain = (req, res, next) => {
    console.log('set main');
    curMainSuit = Number(req.params.mainSuit);
    req.playerPokers.forEach(playerPoker => {
        playerPoker.pokers.forEach(poker => {
            initPokerMain(poker);
            setPokerMain(poker, null, curMainSuit);
        })
    })
    req.sendFlag.push(1);
    res.send();
}

exports.playCards = (req, res, next) => {
    if (req.body.length !== 0) {
        playerId = req.params.playerId;
        let playerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
        playerPoker.playedPokers = [];
        req.body.forEach(poker => {
            playerPoker.playedPokers.push(poker);
            playerPoker.pokers = playerPoker.pokers.filter(ppoker => ppoker.pokerId !== poker.pokerId);
        })
        req.sendFlag.push(1);
    }
    res.send();
}

exports.regretCards = (req, res, next) => {
    playerId = req.params.playerId;
    let playerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
    if (playerPoker.playedPokers.length !== 0) {
        playerPoker.playedPokers.forEach(poker => {
            playerPoker.pokers.push(poker);
        })
        playerPoker.playedPokers = [];
        req.sendFlag.push(1);
    }
    res.send();
}

exports.getHolePokers = (req, res, next) => {
    playerId = req.params.playerId;
    let bankerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
    let holePokers = req.playerPokers.find(playerPoker => playerPoker.playerId === "庄家").pokers;
    let length = holePokers.length;
    if (bankerPoker) {
        if (length > 0) {
            for (i = 0; i < length; i++) {
                bankerPoker.pokers.push(holePokers.pop());
            }
            req.sendFlag.push(1);
        }
    }
    res.send();
}

exports.setHolePokers = (req, res, next) => {
    playerId = req.params.playerId;
    let playerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
    let hole = req.playerPokers.find(playerPoker => playerPoker.playerId === "庄家");
    if ((hole.pokers.length + req.body.length) <= 7) {
        req.body.forEach(poker => {
            hole.pokers.push(poker);
            playerPoker.pokers = playerPoker.pokers.filter(ppoker => ppoker.pokerId !== poker.pokerId);
        })
        req.sendFlag.push(1);
    }
    res.send();
}

shufflePokers = (deckNumber, curMainPoint) => {
    pokers = [];
    pokerId = 0;
    for (deck = 0; deck < deckNumber; deck++) {
        for (point = 1; point <= 13; point++) {
            for (suit = 0; suit <= 3; suit++) {
                poker = new Poker(pokerId, point, suit);
                setPokerMain(poker, curMainPoint);
                pokers.push(poker);
                pokerId++;
            }
        }

        pokers.push(new Poker(pokerId, 91, 4));
        pokerId++;
        pokers.push(new Poker(pokerId, 92, 4));
        pokerId++;
    }

    for (i = pokers.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = pokers[i];
        pokers[i] = pokers[r];
        pokers[r] = tmp;
    }
    return pokers;
}

dealPokersRedFive = (players, pokers) => {
    playerPokers = []
    players.forEach((player, index) => {
        playerPoker = {};
        playerPoker.playerId = player;
        playerPoker.playedPokers = [];
        if (player === '庄家') {
            playerPoker.pokers = pokers.slice(-7,);
        } else {
            playerPoker.pokers = pokers.filter((_, i) => i % 5 === index && i < pokers.length - 7);
        }
        playerPokers.push(playerPoker);
    })
    return playerPokers
}

initPokerMain = (poker) => {
    poker.mainSuit = poker.suit;
    if (poker.mainPoint === 70 || poker.mainPoint === 71) {
        poker.mainPoint = 70;
        poker.mainSuit = ESuit.Joker;
    }
    if (poker.mainPoint === 80 || poker.mainPoint === 81) {
        poker.mainPoint = 3;
    }
    if (poker.mainPoint === 100) {
        poker.mainSuit = ESuit.Joker;
    }
}

setPokerMain = (poker, curMainPoint, curMainSuit) => {
    if (curMainSuit !== undefined) {
        if (poker.suit === curMainSuit) {
            poker.mainSuit = ESuit.Joker;
            if (poker.mainPoint === 70) {
                poker.mainPoint = 71;
            }
            if (poker.point === 3) {
                poker.mainPoint = 81;
            }
        } else {
            if (poker.point === 3 && Math.abs(poker.suit - curMainSuit) === 2) {
                poker.mainSuit = ESuit.Joker;
                poker.mainPoint = 80
            }
        }
    } else {
        if (poker.point === curMainPoint) {
            poker.mainPoint = 70
            poker.mainSuit = ESuit.Joker
        }
        if (poker.point === 5 && poker.suit === ESuit.HongXin) {
            poker.mainPoint = 100
            poker.mainSuit = ESuit.Joker
        }
        if (poker.point === 1) {
            poker.mainPoint = 20
        }
    }
}