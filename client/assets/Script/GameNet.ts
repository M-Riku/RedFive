export default class GameNet {
    private static instance: GameNet = null;
    private ws: WebSocket = null;
    private callback: Function = null;
    private target: any = null;

    private constructor() { }

    public static getInstance(): GameNet {
        if (GameNet.instance === null) {
            GameNet.instance = new GameNet();
        }
        return GameNet.instance;
    }

    public createWebSocket(callback: Function, target: any) {
        this.callback = callback;
        this.target = target;
        this.init()
    }

    private init() {
        this.ws = new WebSocket("ws://localhost:3000/wsgame");
        this.ws.onopen = () => {
            console.log('success to connect to websocket server!');
        }

        this.ws.onclose = () => {
            console.log('connection to websocket closed, try to reconnect.');
            setTimeout(() => {
                this.init()
            }, 1000);
        }

        this.ws.onmessage = (event: MessageEvent) => {
            this.callback.call(this.target, event.data);
        }
    }
}
