import GameNet from "./GameNet";
import GameCtrl from "./GameCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    pokerContainer = null;

    @property(cc.Prefab)
    pokerPrefab: cc.Prefab = null;

    @property(cc.EditBox)
    playerIdEditBox: cc.EditBox = null;

    @property(cc.Button)
    startGameBtn: cc.Button = null;

    @property(cc.Button)
    playPokersBtn: cc.Button = null;

    @property(cc.Button)
    regretPokersBtn: cc.Button = null;

    @property(cc.Label)
    curPlayerLable: cc.Label = null;

    @property(cc.Label)
    playerIdNext1Lable: cc.Label = null;

    @property(cc.Label)
    playerIdNext2Lable: cc.Label = null;

    @property(cc.Label)
    playerIdNext3Lable: cc.Label = null;

    @property(cc.Label)
    playerIdNext4Lable: cc.Label = null;

    private otherPlayerLable: cc.Label[] = [];

    private m_gameCtrl: GameCtrl = null;

    public curPlayer: string = null;

    public otherPlayer: string[] = [];

    start() {
        this.startGameBtn.node.on('click', this.StartGame.bind(this));
        this.playPokersBtn.node.active = false;
        this.regretPokersBtn.node.active = false;

        this.otherPlayerLable.push(this.playerIdNext1Lable);
        this.otherPlayerLable.push(this.playerIdNext2Lable);
        this.otherPlayerLable.push(this.playerIdNext3Lable);
        this.otherPlayerLable.push(this.playerIdNext4Lable);

        this.m_gameCtrl = new GameCtrl();
    }

    private StartGame() {
        this.curPlayer = this.playerIdEditBox.string;
        this.curPlayerLable.string = this.curPlayer;
        this.showOtherPlayersName()
        this.m_gameCtrl.Init(this.pokerContainer, this.pokerPrefab,
            this.playPokersBtn, this.regretPokersBtn, this.curPlayer);

        GameNet.getInstance().init(this.PlayGame, this);

        this.playerIdEditBox.node.active = false;
        this.startGameBtn.node.active = false;

        this.playPokersBtn.node.active = true;
        this.regretPokersBtn.node.active = true;
    }

    private showOtherPlayersName() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:3000/game/list-other-players/${this.curPlayer}`, true);
        xhr.onload = () => {
            this.otherPlayer = JSON.parse(xhr.responseText);
            this.otherPlayer.forEach((player, index) => {
                this.otherPlayerLable[index].string = player;
            })
        };
        xhr.send();
    }

    private PlayGame(data: string) {
        let playerPokers = JSON.parse(data);
        let myPokers = playerPokers.find(playerPoker => playerPoker.playerId === this.curPlayer).pokers;
        let myPlayedPokers = playerPokers.find(
            playerPoker => playerPoker.playerId === this.curPlayer
        ).playedPokers;
        let otherPlayedPokers = playerPokers.filter(
            playerPoker => playerPoker.playerId !== this.curPlayer && playerPoker.playerId !== "庄家"
        );
        this.m_gameCtrl.ShowUIPoker(myPokers, myPlayedPokers, otherPlayedPokers, this.otherPlayer);
    }
}
