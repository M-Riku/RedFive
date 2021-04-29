const { ccclass, property } = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Button)
    PlayBtn: cc.Button = null;

    start() {
        this.PlayBtn.node.on("click", this.OnPlayBtnClick.bind(this))
    }

    OnPlayBtnClick() {
        cc.director.loadScene("GameScene")
    }
}
