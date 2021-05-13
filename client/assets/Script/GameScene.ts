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
    otherPlayerLable: cc.Label[] = []

    private m_gameCtrl: GameCtrl = null;

    start() {
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
