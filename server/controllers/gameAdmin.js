const Poker = require('../models/Poker');
const ESuit = require('../models/ESuit');


exports.createGame = (req, res, next) => {
    console.log('create game');
    curMainPoint = Number(req.params.mainPoint);
    pokers = shufflePokers(3, curMainPoint);
    playerPokers = dealPokersRedFive(req.players, pokers);
    req.sendFlag.push(1);
    res.send();
};

exports.setMain = (req, res, next) => {
    console.log('set main');
    curMainSuit = Number(req.params.mainSuit);
    req.playerPokers.forEach(playerPoker => {
        playerPoker.pokers.forEach(poker => {
            setPokerMain(poker, null, curMainSuit);
        })
    })
    req.sendFlag.push(1);
    res.send();
}

exports.playCards = (req, res, next) => {
    console.log('play cards');
    if (req.body.length !== 0) {
        playerId = req.params.playerId;
        let playerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
        playerPoker.playedPokers = [];
        req.body.forEach(poker => {
            playerPoker.playedPokers.push(poker);
            playerPoker.pokers = playerPoker.pokers.filter(ppoker => ppoker.pokerId !== poker.pokerId);
        })
    }
    req.sendFlag.push(1);
    res.send();
}

exports.regretCards = (req, res, next) => {
    console.log('regret cards');
    playerId = req.params.playerId;
    let playerPoker = req.playerPokers.find(playerPoker => playerPoker.playerId === playerId);
    playerPoker.playedPokers.forEach(poker => {
        playerPoker.pokers.push(poker);
    })
    playerPoker.playedPokers = [];
    req.sendFlag.push(1);
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
                pokerId++
            }
        }

        pokers.push(new Poker(pokerId, 91, 4));
        pokerId++
        pokers.push(new Poker(pokerId, 92, 4));
        pokerId++
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
        playerPoker.pokers = pokers.slice(index * 31, (index + 1) * 31);
        playerPokers.push(playerPoker);
    })
    return playerPokers
}

setPokerMain = (poker, curMainPoint, curMainSuit) => {
    if (curMainSuit !== undefined) {
        if (poker.suit === curMainSuit) {
            poker.mainSuit = ESuit.Joker;
            if (poker.point === 70) {
                poker.mainPoint++;
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