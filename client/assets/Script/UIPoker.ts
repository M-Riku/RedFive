import { ESuit } from "./ConfigEnum";
import Poker from "./Poker";

const POINT_MAP = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
    91: '小',
    92: '大'
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPoker extends cc.Component {

    @property(cc.Sprite) bigSuitSprite: cc.Sprite = null;
    @property(cc.Sprite) smallSuitSprite: cc.Sprite = null;
    @property(cc.Label) pointLabel: cc.Label = null;

    // resources
    @property(cc.SpriteFrame) texFrontBG: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) texBackBG: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) bigSuits: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) smallSuits: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) texFaces: cc.SpriteFrame[] = [];
    @property(cc.Button) selectBtn: cc.Button = null;

    private redTextColor: cc.Color = cc.color(183, 24, 40);
    private blackTextColor: cc.Color = cc.Color.BLACK;

    public poker: Poker = null;
    public playPokers: Poker[] = [];

    public Init(poker: Poker, playPokers: Poker[]) {
        this.poker = poker;
        this.playPokers = playPokers;
        this.pointLabel.string = `${POINT_MAP[poker.point]}`;
        this.pointLabel.node.color = (poker.suit == ESuit.HeiTao || poker.suit == ESuit.MeiHua) ? this.blackTextColor : this.redTextColor;
        if (poker.point >= 11) {
            this.bigSuitSprite.spriteFrame = this.texFaces[poker.point - 11];
        } else {
            this.bigSuitSprite.spriteFrame = this.bigSuits[poker.suit];
        }
        this.smallSuitSprite.spriteFrame = this.smallSuits[poker.suit];
        this.selectBtn.node.on("click", this.OnSelectBtnClick.bind(this));
    }

    private OnSelectBtnClick() {
        let x: number = this.node.getPosition().x;
        let y: number = this.node.getPosition().y;
        if (y === -200) {
            y += 20
            this.playPokers.push(this.poker);
        } else {
            y -= 20
            this.playPokers = this.playPokers.filter(poker => poker.pokerId !== this.poker.pokerId)
        }
        console.log(this.playPokers);
        this.node.setPosition(x, y);
    }
}
