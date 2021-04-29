import Poker from "./Poker";
import UIPoker from "./UIPoker";


export default class GameCtrl {

    private pokerPrefab: cc.Prefab = null;

    private pokerContainer: cc.Node = null;

    public Init(pockerContainer: cc.Node, pokerPrefab: cc.Prefab) {
        this.pokerContainer = pockerContainer;
        this.pokerPrefab = pokerPrefab;
    }

    public Start() {
        console.log('game start!');
    }

    private CreateUIPoker(poker: Poker, x: number, y: number): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker = uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker)
        uiPoker.node.setPosition(x, y);
        return uiPoker
    }

    public ShowUIPoker(pokers: []) {
        pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker, -375 + 25 * index, -200);
            this.pokerContainer.addChild(uiPoker.node);
        });
    }
}