import PlayerPostion from "./PlayerPostion";
import Poker from "./Poker";
import UIPoker from "./UIPoker";


export default class GameCtrl {

    private pokerPrefab: cc.Prefab = null;

    private pokerContainer: cc.Node = null;

    private playPokersBtn: cc.Button = null;

    private regretPokersBtn: cc.Button = null;

    private setHolePokersBtn: cc.Button = null;

    private curPlayerLable: cc.Label = null;

    private otherPlayerLable: cc.Label[] = null;

    private curPlayer: string = null;

    private otherPlayers: string[] = [];

    private playPokers: { pokers: Poker[] } = { pokers: [] };

    public Init(pockerContainer: cc.Node, pokerPrefab: cc.Prefab,
        playPokersBtn: cc.Button, regretPokersBtn: cc.Button, setHolePokersBtn: cc.Button,
        curPlayerLable: cc.Label, otherPlayerLable: cc.Label[], curPlayer: string) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
        this.playPokersBtn = playPokersBtn;
        this.regretPokersBtn = regretPokersBtn;
        this.setHolePokersBtn = setHolePokersBtn;
        this.curPlayerLable = curPlayerLable;
        this.otherPlayerLable = otherPlayerLable;
        this.curPlayer = curPlayer;
        this.playPokersBtn.node.on('click', this.OnPlayPokersBtnClick.bind(this));
        this.regretPokersBtn.node.on('click', this.OnRegretPokersBtnClick.bind(this));
        this.setHolePokersBtn.node.on('click', this.OnSetHolePokersBtnClick.bind(this));
        this.getOtherPlayersName();
    }

    private OnPlayPokersBtnClick() {
        console.log('play pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers.pokers);
        xhr.open("POST", `/game/play-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        this.playPokers.pokers = [];
    }

    private OnRegretPokersBtnClick() {
        console.log('regret pokers');
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `/game/regret-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }

    private OnSetHolePokersBtnClick() {
        console.log('set hole pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers.pokers);
        xhr.open("POST", `/game/set-hole-pokers/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        this.playPokers.pokers = [];
    }

    private getOtherPlayersName() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `/game/list-other-players/${this.curPlayer}`, false);
        xhr.onload = () => {
            this.otherPlayers = JSON.parse(xhr.responseText);
        };
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
        if (curPokers.length > 31) {
            this.setHolePokersBtn.node.active = true;
        } else {
            this.setHolePokersBtn.node.active = false;
        }

        this.playPokers.pokers = [];

        // 描绘当前玩家名称和手牌数量
        this.curPlayerLable.string = `${this.curPlayer}: ${curPokers.length}张`;

        // 描绘当前玩家的手牌
        this.pokerContainer.destroyAllChildren();
        this.SortPokers(curPokers);
        let startX: number = -Math.floor(curPokers.length / 2) * 30;
        let startY: number = -250;
        curPokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, startX + 30 * index, startY);
            this.pokerContainer.addChild(uiPoker.node);
        });

        // 描绘当前玩家所出的牌
        this.SortPokers(myPlayedPokers);
        startX = -Math.floor(myPlayedPokers.length / 2) * 30;
        startY = -100;
        myPlayedPokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, startX + 30 * index, startY);
            uiPoker.selectBtn.node.active = false;
            this.pokerContainer.addChild(uiPoker.node);
        })

        // 描绘其他玩家
        this.otherPlayers.forEach((player, index) => {
            let otherPlayer = otherPlayerPokers.find(
                playerPoker => playerPoker.playerId === player
            );
            // 描绘其他玩家的名称和剩余牌数
            this.otherPlayerLable[index].string = `${player}: ${otherPlayer.pokers.length}张`;
            startX = PlayerPostion[index].x - Math.floor(otherPlayer.playedPokers.length / 2) * 30;;
            startY = PlayerPostion[index].y;
            // 描绘其他玩家当前出的牌
            otherPlayer.playedPokers.forEach((poker, indexP) => {
                let uiPoker = this.CreateUIPoker(poker, startX + 30 * indexP, startY);
                uiPoker.selectBtn.node.active = false;
                this.pokerContainer.addChild(uiPoker.node);
            })
        })
    }

    private SortPokers(pokers: Poker[]) {
        pokers.sort((a, b) => (a.mainPoint > b.mainPoint) ? 1 : -1)
        pokers.sort((a, b) => (a.mainSuit < b.mainSuit) ? 1 : -1)
    }
}