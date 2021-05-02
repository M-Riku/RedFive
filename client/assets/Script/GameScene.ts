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

    @property(cc.Button)
    setHolePokersBtn: cc.Button = null;

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

    private curPlayer: string = null;

    start() {
        this.startGameBtn.node.on('click', this.StartGame.bind(this));
        this.playPokersBtn.node.active = false;
        this.regretPokersBtn.node.active = false;
        this.setHolePokersBtn.node.active = false;

        this.otherPlayerLable.push(this.playerIdNext1Lable);
        this.otherPlayerLable.push(this.playerIdNext2Lable);
        this.otherPlayerLable.push(this.playerIdNext3Lable);
        this.otherPlayerLable.push(this.playerIdNext4Lable);

        this.m_gameCtrl = new GameCtrl();
    }

    private StartGame() {
        this.curPlayer = this.playerIdEditBox.string;
        this.curPlayerLable.string = this.curPlayer;
        this.m_gameCtrl.Init(this.pokerContainer, this.pokerPrefab,
            this.playPokersBtn, this.regretPokersBtn, this.setHolePokersBtn,
            this.curPlayerLable, this.otherPlayerLable, this.curPlayer);

        GameNet.getInstance().init(this.PlayGame, this);

        this.playerIdEditBox.node.active = false;
        this.startGameBtn.node.active = false;

        this.playPokersBtn.node.active = true;
        this.regretPokersBtn.node.active = true;
    }

    private PlayGame(data: string) {
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
        this.m_gameCtrl.ShowUIPoker(myPokers, myPlayedPokers, otherPlayedPokers);
    }
}
