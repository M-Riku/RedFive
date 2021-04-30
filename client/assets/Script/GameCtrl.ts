import Poker from "./Poker";
import UIPoker from "./UIPoker";


export default class GameCtrl {

    private pokerPrefab: cc.Prefab = null;

    private pokerContainer: cc.Node = null;

    private playPokersBtn: cc.Button = null;

    private regretPokersBtn: cc.Button = null;

    public curPlayer: string = null;

    public playPokers: { pokers: Poker[] } = { pokers: [] };

    public Init(pockerContainer: cc.Node, pokerPrefab: cc.Prefab,
        playPokersBtn: cc.Button, regretPokersBtn: cc.Button, curPlayer: string) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
        this.playPokersBtn = playPokersBtn;
        this.regretPokersBtn = regretPokersBtn;
        this.playPokersBtn.node.on('click', this.OnPlayPokersBtnClick.bind(this));
        this.regretPokersBtn.node.on('click', this.OnRegretPokersBtnClick.bind(this));
        this.curPlayer = curPlayer;
    }

    private OnPlayPokersBtnClick() {
        console.log('play pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers.pokers);
        this.playPokers.pokers = [];
        xhr.open("POST", `http://localhost:3000/game/play-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }

    private OnRegretPokersBtnClick() {
        console.log('regret pokers');
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:3000/game/regret-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }

    private CreateUIPoker(poker: Poker, x: number, y: number): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker = uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker, this.playPokers)
        uiPoker.node.setPosition(x, y);
        return uiPoker
    }

    public ShowUIPoker(curPokers: any, myPlayedPokers: any, otherPlayerPokers: any) {
        this.pokerContainer.destroyAllChildren();
        this.SortPokers(curPokers);
        let startX: number = -Math.floor(curPokers.length / 2) * 25;
        curPokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, startX + 25 * index, -225);
            this.pokerContainer.addChild(uiPoker.node);
        });

        this.SortPokers(myPlayedPokers);
        startX = -Math.floor(myPlayedPokers.length / 2) * 25;
        myPlayedPokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, startX + 25 * index, -50);
            this.pokerContainer.addChild(uiPoker.node);
        })

        otherPlayerPokers.forEach(playerPokers => {
            let otherPlayedPoker = playerPokers.playedPokers;
            otherPlayedPoker.forEach((poker, index) => {
                let uiPoker = this.CreateUIPoker(poker, startX + 25 * index, 200);
                this.pokerContainer.addChild(uiPoker.node);
            })
        });
    }

    private SortPokers(pokers: Poker[]) {
        pokers.sort((a, b) => (a.mainPoint > b.mainPoint) ? 1 : -1)
        pokers.sort((a, b) => (a.mainSuit < b.mainSuit) ? 1 : -1)
    }
}