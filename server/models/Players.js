players = [
    "露露",
    "哔芯",
    "源源",
    "王老师",
    "安杰"
];

function shuffle(array) {
    for (i = array.length - 1; i >= 0; i--) {
        rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
    return array;
}

players = shuffle(players);

players.push("庄家")

module.exports = players;