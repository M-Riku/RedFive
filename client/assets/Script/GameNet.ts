export default class GameNet {
    private static instance: GameNet = null;
    private ws: WebSocket = null;

    private constructor() { }

    public static getInstance(): GameNet {
        if (GameNet.instance === null) {
            GameNet.instance = new GameNet();
        }
        return GameNet.instance;
    }

    public init(callback: Function, target: any) {
        if (this.ws != null) return;
        this.ws = new WebSocket("ws://20.194.160.151/wsgame");
        this.ws.onopen = (event: Event) => {
            console.log('success to connect to websocket server!');
        }

        this.ws.onmessage = (event: MessageEvent) => {
            callback.call(target, event.data);
        }
    }
}
