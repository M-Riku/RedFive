import Poker from "./Poker";
import UIPoker from "./UIPoker";


export default class GameCtrl {

    private pokerPrefab: cc.Prefab = null;

    private pokerContainer: cc.Node = null;

    private playPokersBtn: cc.Button = null;

    private regretPokersBtn: cc.Button = null;

    public playPokers: Poker[] = [];

    public Init(pockerContainer: cc.Node, pokerPrefab: cc.Prefab,
        playPokersBtn: cc.Button, regretPokersBtn: cc.Button) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
        this.playPokersBtn = playPokersBtn;
        this.regretPokersBtn = regretPokersBtn;
        this.playPokersBtn.node.on('click', this.OnPlayPokersBtnClick.bind(this));
        this.regretPokersBtn.node.on('click', this.OnRegretPokersBtnClick.bind(this));
    }

    private OnPlayPokersBtnClick() {
        console.log('play pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers);
        xhr.open("POST", 'http://localhost:3000/game/play-cards/露露', true); //playerid
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }

    private OnRegretPokersBtnClick() {
        console.log('regret pokers');
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:3000/game/regret-cards/露露', true); //playerid
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

    public ShowUIPoker(pokers: []) {
        this.pokerContainer.destroyAllChildren();
        pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, -375 + 25 * index, -200);
            this.pokerContainer.addChild(uiPoker.node);
        });
    }
}