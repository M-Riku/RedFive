import { ESuit } from "./ConfigEnum";
import Players from "./Players";
import Poker from "./Poker";
import UIPoker from "./UIPoker";

interface PlayerPoker {
    playerId: string,
    pokers: Poker[]
}

let CUR_MAIN_POINT = 4;
let CUR_MAIN_SUIT = -1;

const CUR_PLAYER = "露露";

export default class GameCtrl {

    private pokerPrefab: cc.Prefab = null;

    private pokerContainer: cc.Node = null;

    private pokers: Poker[] = [];

    private playerPokers: PlayerPoker[] = [];

    private holePokers: Poker[] = [];

    public Init(pockerContainer: cc.Node, pokerPrefab: cc.Prefab) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
    }

    public Start() {
        this.ShufflePokers(3);

        this.DealPokersRedFive();

        let nowPlayerPokers = this.playerPokers.find(o => o.playerId === CUR_PLAYER);

        this.SortPokers(nowPlayerPokers.pokers);

        this.ShowUIPoker(nowPlayerPokers.pokers);

        setTimeout(() => {
            CUR_MAIN_SUIT = ESuit.HeiTao;
            nowPlayerPokers.pokers.forEach(poker => {
                this._SetPokerMain(poker, CUR_MAIN_POINT);
            })
            this.SortPokers(nowPlayerPokers.pokers);
            this.ShowUIPoker(nowPlayerPokers.pokers);
        }, 3000)
    }

    private ShufflePokers(deckNumber: number) {
        for (let deck = 0; deck < deckNumber; deck++) {
            for (let point = 1; point <= 13; point++) {
                for (let suit = 0; suit <= 3; suit++) {
                    let poker = new Poker(point, suit);
                    this._SetPokerMain(poker);
                    this.pokers.push(poker);
                }
            }

            this.pokers.push(new Poker(91, 4));
            this.pokers.push(new Poker(92, 4));
        }

        for (let i = this.pokers.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = this.pokers[i];
            this.pokers[i] = this.pokers[r];
            this.pokers[r] = tmp;
        }
    }

    private DealPokersRedFive() {
        Players.forEach((player, index) => {
            let playerPoker: PlayerPoker = {
                playerId: "",
                pokers: []
            };
            playerPoker.playerId = player;
            playerPoker.pokers = this.pokers.slice(index * 31, (index + 1) * 31);
            this.playerPokers.push(playerPoker);
        })
        this.holePokers = this.pokers.slice(-7);
    }

    private SortPokers(pokers: Poker[]) {
        pokers.sort((a, b) => (a.mainPoint > b.mainPoint) ? 1 : -1)
        pokers.sort((a, b) => (a.mainSuit < b.mainSuit) ? 1 : -1)
    }

    private CreateUIPoker(poker: Poker, x: number, y: number): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker = uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker)
        uiPoker.node.setPosition(x, y);
        return uiPoker
    }

    private ShowUIPoker(pokers: Poker[]) {
        pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, -375 + 25 * index, -200);
            this.pokerContainer.addChild(uiPoker.node);
        });
    }

    private _SetPokerMain(poker: Poker, mainSuit?: ESuit) {
        if (mainSuit) {
            if (poker.suit === CUR_MAIN_SUIT) {
                poker.mainSuit = ESuit.Joker;
                if (poker.point === 2) {
                    poker.mainPoint++;
                }
                if (poker.point === 3) {
                    poker.mainPoint = 81;
                }
            } else {
                if (poker.point === 3 && Math.abs(poker.suit - CUR_MAIN_SUIT) === 2) {
                    poker.mainSuit = ESuit.Joker;
                    poker.mainPoint = 80
                }
            }
        } else {
            if (poker.point === CUR_MAIN_POINT) {
                poker.mainPoint = 70
                poker.mainSuit = ESuit.Joker
            }
            if (poker.point === 5 && poker.suit === ESuit.HongXin) {
                poker.mainPoint = 100
                poker.mainSuit = ESuit.Joker
            }
            if (poker.point === 1) {
                poker.mainPoint = 20
            }
        }
    }
}