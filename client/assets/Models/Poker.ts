import { ESuit } from "./Esuit";

export default class Poker {
    public pokerId: number = null
    public point: number = null;
    public suit: ESuit = null;
    public mainPoint: number = null;
    public mainSuit: ESuit = null;

    constructor(pokerId: number, point: number, suit: ESuit, mainPoint?: number, mainSuit?: ESuit) {
        this.pokerId = pokerId;
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