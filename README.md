### 开发

1. 安装cocos-creator 2.4.5

1. 安装nodejs 10.16.2

1. 克隆本项目,运行服务器端

    ```bash
    git clone https://github.com/M-Riku/RedFive
    cd server
    npm start
    ```

1. 运行客户端: 用cocos-creator打开本项目, 访问`localhost:7456`

### 部署

1. 部署服务器的系统尽量选择ubuntu 18.04系统,其他系统不保证可以成功允许

1. 首先在本地的开发环境切换到`deploy`分枝,并适用`main`分枝上的更新

    ```bash
    git checkout deploy
    git merge main
    ```

1. 手动修改`client/assets/Script/GameNet.ts`中WebSocket服务器地址为真实服务器地址(如下)

    ```typescript
    this.ws = new WebSocket("ws://localhost/wsgame");
    => this.ws = new WebSocket("ws://20.20.20.20/wsgame");
    ```

1. 手动去掉`client/assets/Script/GameCtrl.ts`中所有的`http://localhost:3000`

1. 在cocos-creator中构建项目,平台为web-desktop和web-mobile

1. 将所有变动提交到github的`deploy`分枝上

1. 移动到服务器上,安装docker和docker-compose

    ```bash
    sudo apt-get update
    sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

1. 克隆代码,切换到刚才push的`deploy`分枝上,启动游戏

    ```bash
    git clone https://github.com/M-Riku/RedFive
    cd RedFive
    git checkout deploy
    sudo docker-compose up -d
    ```
