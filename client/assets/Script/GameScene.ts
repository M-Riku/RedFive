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

    private m_gameCtrl: GameCtrl = null;

    public curPlayer: string = null;

    start() {
        this.startGameBtn.node.on('click', this.StartGame.bind(this));
        this.playPokersBtn.node.active = false;
        this.regretPokersBtn.node.active = false;

        this.m_gameCtrl = new GameCtrl();
    }

    private StartGame() {
        this.curPlayer = this.playerIdEditBox.string;
        this.m_gameCtrl.Init(this.pokerContainer, this.pokerPrefab,
            this.playPokersBtn, this.regretPokersBtn, this.curPlayer);

        GameNet.getInstance().init(this.PlayGame, this);

        this.playerIdEditBox.node.active = false;
        this.startGameBtn.node.active = false;

        this.playPokersBtn.node.active = true;
        this.regretPokersBtn.node.active = true;
    }

    private PlayGame(data: string) {
        let playerPokers = JSON.parse(data);
        let myPokers = playerPokers.find(playerPoker => playerPoker.playerId === this.curPlayer).pokers;
        let myPlayedPokers = playerPokers.find(playerPoker => playerPoker.playerId === this.curPlayer).playedPokers;
        let otherPlayedPokers = playerPokers.filter(playerPoker => playerPoker.playerId !== this.curPlayer && playerPoker.playerId !== "庄家");
        this.m_gameCtrl.ShowUIPoker(myPokers, myPlayedPokers, otherPlayedPokers);
    }
}
