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

    @property(cc.Label)
    notificationLable: cc.Label = null;

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

    start() {
        this.playPokersBtn.node.active = false;
        this.regretPokersBtn.node.active = false;
        this.setHolePokersBtn.node.active = false;

        this.otherPlayerLable.push(this.playerIdNext1Lable);
        this.otherPlayerLable.push(this.playerIdNext2Lable);
        this.otherPlayerLable.push(this.playerIdNext3Lable);
        this.otherPlayerLable.push(this.playerIdNext4Lable);

        this.m_gameCtrl = new GameCtrl();

        this.m_gameCtrl.Init(
            this.pokerContainer,
            this.pokerPrefab,
            this.playerIdEditBox,
            this.startGameBtn,
            this.notificationLable,
            this.playPokersBtn,
            this.regretPokersBtn,
            this.setHolePokersBtn,
            this.curPlayerLable,
            this.otherPlayerLable
        );

    }
}
