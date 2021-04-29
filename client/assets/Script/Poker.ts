import { ESuit } from "./ConfigEnum";

export default class Poker {
    public point: number = null;
    public suit: ESuit = null;
    public mainPoint: number = null;
    public mainSuit: ESuit = null;

    constructor(point: number, suit: ESuit, mainPoint?: number, mainSuit?: ESuit) {
        this.point = point;
        this.suit = suit;

        if (mainPoint) {
            this.mainPoint = mainPoint;
        } else {
            this.mainPoint = point;
        }

        if (mainSuit) {
            this.mainSuit = mainSuit;
        } else {
            this.mainSuit = suit;
        }
    }
}