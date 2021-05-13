import StartCtrl from "./StartCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Button)
    loginBtn: cc.Button = null;

    @property(cc.EditBox)
    playerIdEditBox: cc.EditBox = null;

    @property(cc.Button)
    joinRoomBtn: cc.Button = null;

    @property(cc.EditBox)
    roomIdEditBox: cc.EditBox = null;

    @property(cc.Label)
    notificationLable: cc.Label = null;

    private m_startCtrl: StartCtrl = null;

    start() {
        this.m_startCtrl = new StartCtrl();
        this.m_startCtrl.Init(
            this.loginBtn,
            this.playerIdEditBox,
            this.joinRoomBtn,
            this.roomIdEditBox,
            this.notificationLable
        );
    }
}
