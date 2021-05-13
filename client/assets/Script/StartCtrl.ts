import { player, room } from '../Models/Common';

export default class StatCtrl {

    private loginBtn: cc.Button = null;

    private playerIdEditBox: cc.EditBox = null;

    private joinRoomBtn: cc.Button = null;

    private roomIdEditBox: cc.EditBox = null;

    private notificationLable: cc.Label = null;

    public Init(
        loginBtn: cc.Button,
        playerIdEditBox: cc.EditBox,
        joinRoomBtn: cc.Button,
        roomIdEditBox: cc.EditBox,
        notificationLable: cc.Label
    ) {
        this.loginBtn = loginBtn;
        this.playerIdEditBox = playerIdEditBox;
        this.joinRoomBtn = joinRoomBtn;
        this.roomIdEditBox = roomIdEditBox;
        this.notificationLable = notificationLable;

        this.joinRoomBtn.node.active = false;
        this.roomIdEditBox.node.active = false;

        this.loginBtn.node.on("click", this.OnLoginBtnBtnClick.bind(this));
        this.joinRoomBtn.node.on("click", this.OnJoinRoomBtnClick.bind(this));
    }

    private OnLoginBtnBtnClick() {
        let xhr = new XMLHttpRequest();
        player.playerId = this.playerIdEditBox.string;
        let data = JSON.stringify({ player: player, room: room });
        xhr.open("Post", `http://localhost:3000/game/playerLogin`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.notificationLable.string = "";

                this.playerIdEditBox.node.active = false;
                this.loginBtn.node.active = false;

                this.joinRoomBtn.node.active = true;
                this.roomIdEditBox.node.active = true;
            } else {
                this.notificationLable.string = xhr.response;
            }
        };
        xhr.send(data);
    }

    private OnJoinRoomBtnClick() {
        let xhr = new XMLHttpRequest();
        room.roomId = this.roomIdEditBox.string;
        let data = JSON.stringify({ player: player, room: room });
        xhr.open("Post", `http://localhost:3000/game/joinRoom`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.notificationLable.string = "";

                cc.director.loadScene("GameScene");
            } else {
                this.notificationLable.string = xhr.response;
            }
        }
        xhr.send(data);
    }
}