import GameNet from "./GameNet";
import GameCtrl from "./GameCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    pokerContainer = null;

    @property(cc.Prefab)
    pokerPrefab: cc.Prefab = null;

    @property(cc.Button)
    playPokersBtn: cc.Button = null;

    @property(cc.Button)
    regretPokersBtn: cc.Button = null;

    private m_gameCtrl: GameCtrl = null;

    start() {
        // init logic
        this.label.string = '这是游戏场景';
        this.m_gameCtrl = new GameCtrl();
        this.m_gameCtrl.Init(this.pokerContainer, this.pokerPrefab,
            this.playPokersBtn, this.regretPokersBtn);

        GameNet.getInstance().init(this.PlayGame, this);
    }

    private PlayGame(data: string) {
        let nowPlayerPokers: [] = JSON.parse(data);
        this.m_gameCtrl.ShowUIPoker(nowPlayerPokers);
    }
}
