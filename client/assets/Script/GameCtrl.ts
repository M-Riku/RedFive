import GameNet from "./GameNet";
import PlayerPostion from "./PlayerPostion";
import Poker from "./Poker";
import UIPoker from "./UIPoker";


export default class GameCtrl {

    private pokerContainer: cc.Node = null;

    private pokerPrefab: cc.Prefab = null;

    private playerIdEditBox: cc.EditBox = null;

    private startGameBtn: cc.Button = null;

    private notificationLable: cc.Label = null;

    private playPokersBtn: cc.Button = null;

    private regretPokersBtn: cc.Button = null;

    private setHolePokersBtn: cc.Button = null;

    private curPlayerLable: cc.Label = null;

    private otherPlayerLable: cc.Label[] = null;

    private curPlayer: string = null;

    private otherPlayers: string[] = [];

    private playPokers: { pokers: Poker[] } = { pokers: [] };

    public Init(
        pockerContainer: cc.Node,
        pokerPrefab: cc.Prefab,
        playerIdEditBox: cc.EditBox,
        startGameBtn: cc.Button,
        notificationLable: cc.Label,
        playPokersBtn: cc.Button,
        regretPokersBtn: cc.Button,
        setHolePokersBtn: cc.Button,
        curPlayerLable: cc.Label,
        otherPlayerLable: cc.Label[]
    ) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
        this.playerIdEditBox = playerIdEditBox;
        this.startGameBtn = startGameBtn;
        this.notificationLable = notificationLable;
        this.playPokersBtn = playPokersBtn;
        this.regretPokersBtn = regretPokersBtn;
        this.setHolePokersBtn = setHolePokersBtn;
        this.curPlayerLable = curPlayerLable;
        this.otherPlayerLable = otherPlayerLable;
        this.startGameBtn.node.on("click", this.OnStartGameBtnClick.bind(this));
        this.playPokersBtn.node.on('click', this.OnPlayPokersBtnClick.bind(this));
        this.regretPokersBtn.node.on('click', this.OnRegretPokersBtnClick.bind(this));
        this.setHolePokersBtn.node.on('click', this.OnSetHolePokersBtnClick.bind(this));
    }

    private PlayGame(data: string) {
        this.getOtherPlayersName();
        let playerPokers = JSON.parse(data);
        let myPlayer = playerPokers.find(
            playerPoker => playerPoker.playerId === this.curPlayer
        );
        let myPokers = []
        let myPlayedPokers = []
        if (myPlayer) {
            myPokers = myPlayer.pokers;
            myPlayedPokers = myPlayer.playedPokers;
        }
        let otherPlayedPokers = playerPokers.filter(
            playerPoker => playerPoker.playerId !== this.curPlayer && playerPoker.playerId !== "庄家"
        );
        this.ShowUIPoker(myPokers, myPlayedPokers, otherPlayedPokers);
    }

    private OnStartGameBtnClick() {
        let xhr = new XMLHttpRequest();
        xhr.open("Post", `http://localhost:3000/game/player-login/${this.playerIdEditBox.string}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.curPlayer = this.playerIdEditBox.string;
                this.curPlayerLable.string = this.curPlayer;
                GameNet.getInstance().init(this.PlayGame, this);

                this.notificationLable.string = "";

                this.playerIdEditBox.node.active = false;
                this.startGameBtn.node.active = false;

                this.playPokersBtn.node.active = true;
                this.regretPokersBtn.node.active = true;
            } else {
                this.notificationLable.string = xhr.response;
            }
        };
        xhr.send();
    }

    private OnPlayPokersBtnClick() {
        console.log('play pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers.pokers);
        xhr.open("POST", `http://localhost:3000/game/play-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        this.playPokers.pokers = [];
    }

    private OnRegretPokersBtnClick() {
        console.log('regret pokers');
        let xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:3000/game/regret-cards/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
    }

    private OnSetHolePokersBtnClick() {
        console.log('set hole pokers');
        let xhr = new XMLHttpRequest();
        let data = JSON.stringify(this.playPokers.pokers);
        xhr.open("POST", `http://localhost:3000/game/set-hole-pokers/${this.curPlayer}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        this.playPokers.pokers = [];
    }

    private getOtherPlayersName() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:3000/game/list-other-players/${this.curPlayer}`, false);
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

    private ShowUIPoker(curPokers: any, myPlayedPokers: any, otherPlayerPokers: any) {
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