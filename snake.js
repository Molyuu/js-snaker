let snakeArray = []; /*初始化蛇关节的数组*/
let isPause = false; /*游戏是否暂停：未暂停*/
let snakeSize = 5; /*蛇的初始长度*/
let direct = "right"; /*蛇初始方向：向右*/
let speed = 80; /*蛇移动初始速度：80*/
let score, timer, board, bean; /*游戏初始分数显示区，定时器，面板，豆*/

// 初始化(){
onload = () => {
    //     初始化游戏面板和游戏分数显示区
    board = document.querySelector("#board");
    score = document.querySelector("#score");
    //     造蛇()
    createSnake();
    //     造豆()
    createBean();
    //     监听键盘()
    keyListener();
};

// 造蛇(){
function createSnake() {
    //     循环蛇初始化长度次{
    for (let i = 0; i < snakeSize; i++) {
        //         创造蛇的新关节，每个关节都是一个div
        let snake = document.createElement("div");
        //         蛇头变红
        if (i === 0) {
            snake["style"]["backgroundColor"] = "red";
        }
        //         蛇的新关节推入数组
        snakeArray.push(snake);
        //         蛇的新关节的左距离为上一个蛇关节左侧
        snake["style"]["left"] = (snakeSize - i - 1) * 20 + "px";
        //         蛇的新关节展示在面板上
        board.appendChild(snake);
    }
}

// 造豆(){
function createBean() {
    //     if(存在旧豆){
    if (bean) {
        //     从游戏面板上删除旧豆
        board.removeChild(bean);
    }
    //     创建新豆，每个豆都是一个span
    bean = document.createElement("span");
    let x = null,
        y = null;
    //     调用随机坐标()，为新豆生成出生坐标
    randomXY();

    //     随机坐标(){
    function randomXY() {
        //         面板宽度1000除以20（豆子宽20px），等分成500份
        //         乘以一个随机数并取整，得出一个0-500的整数
        //         乘以20得到一个0-1000范围内的20的整数倍，即横坐标
        //         纵坐标同理
        x = parseInt("" + Math.random() * (1000 / 20)) * 20;
        y = parseInt("" + Math.random() * (500 / 20)) * 20;

        //         遍历蛇关节数组{
        for (let i = 0; i < snakeArray.length; i++) {
            //             if(和当前豆的坐标冲突){
            if (snakeArray[i]["offsetLeft"] === x) {
                if (snakeArray[i]["offsetTop"] === y) {
                    //                 随机坐标();
                    randomXY();
                    break;
                }
            }
        }
    }

    //     为新豆赋值横纵坐标
    bean["style"]["left"] = x + "px";
    bean["style"]["top"] = y + "px";
    //     将新豆追加到面板中
    board.appendChild(bean);
}

//监听键盘
function keyListener() {
    document.onkeydown = (event) => {
        let oEvent = event || window.event;
        switch (oEvent.keyCode) {
            case 37:
                //     按了左键：当方向不为右，方向改为左
                if (direct !== "right") {
                    direct = "left";
                }
                break;
            case 38:
                //     按了上键：当方向不为下，方向改为上
                if (direct !== "down") {
                    direct = "up";
                }
                break;
            case 39:
                //     按了右键：当方向不为左，方向改为右
                if (direct !== "left") {
                    direct = "right";
                }
                break;
            case 40:
                //     按了下键：当方向不为上，方向改为下
                if (direct !== "up") {
                    direct = "down";
                }
                break;
            case 32:
                //     按了空格键：暂停和开始游戏效果切换
                if (!isPause) {
                    pause();
                } else {
                    start();
                }
                isPause = !isPause;
                break;
        }
    };
}

// 游戏开始(){
function start() {
    //     清除旧定时器
    clearInterval(timer);
    //     开启新定时器{
    timer = setInterval(() => {
        //     蛇移动()
        move();
        //     撞自己()：判断本次移动蛇是否撞到自己
        isHit();
        //      吃豆子()：判断本次移动蛇是否吃到豆子
        isEat();
    }, speed);
}

// 蛇移动(){
function move() {
    //     获取蛇头左距离和上距离
    let hLeft = snakeArray[0].offsetLeft;
    let hTop = snakeArray[0].offsetTop;
    //     判断当前蛇的移动方向{
    switch (direct) {
        case "left":
            //         if(对应方向上出界){
            if (hLeft <= 0) {
                //             游戏结束()
                gameover();
                return;
            }
            //         蛇身移动()
            snakeBodyMove();
            //         蛇头移动
            snakeArray[0]["style"]["left"] = hLeft - 20 + "px";
            break;
        case "up":
            if (hTop <= 0) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeArray[0]["style"]["top"] = hTop - 20 + "px";
            break;
        case "right":
            if (hLeft >= 1000 - 20) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeArray[0]["style"]["left"] = hLeft + 20 + "px";
            break;
        case "down":
            if (hTop >= 500 - 20) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeArray[0]["style"]["top"] = hTop + 20 + "px";
            break;
    }

    //     蛇身移动(){
    function snakeBodyMove() {
        //         循环所有蛇身{
        for (let i = snakeArray.length - 1; i > 0; i--) {
            //             后面的关节横向顶替前面的关节
            snakeArray[i]["style"]["left"] = snakeArray[i - 1]["style"]["left"];
            //             后面的关节纵向顶替前面的关节
            snakeArray[i]["style"]["top"] = snakeArray[i - 1]["style"]["top"];
        }
    }
}

/*判断本次移动是否撞到自己*/
function isHit() {
    //     遍历所有蛇身{
    for (let i = 1, j = snakeArray.length; i < j; i++) {
        //         if(蛇头坐标与某个蛇身关节坐标冲突){
        if (snakeArray[0].offsetLeft === snakeArray[i].offsetLeft) {
            if (snakeArray[0].offsetTop === snakeArray[i].offsetTop) {
                //             结束游戏()
                gameover();
                break;
            }
        }
    }
}

// 吃豆子(){
function isEat() {
    //     if(蛇头坐标和当前豆的坐标一致){
    if (snakeArray[0].offsetLeft === bean.offsetLeft) {
        if (snakeArray[0].offsetTop === bean.offsetTop) {
            //         分数++
            score.innerText = parseInt(score.innerText) + 1;
            //         创建一个新的蛇关节
            let snake = document.createElement("div");
            //         新蛇关节的出生坐标就是被吃掉豆子的坐标
            snake["style"]["left"] = bean["style"]["left"];
            snake["style"]["top"] = bean["style"]["top"];
            //         新蛇关节加入到蛇的数组中
            snakeArray.push(snake);
            //         新蛇关节展示在游戏面板中
            board.appendChild(snake);
            //         造豆()
            createBean();
        }
    }
}

// 游戏结束(){
function gameover() {
    //     清空定时器
    clearInterval(timer);
    //     刷新页面
    location.reload();
    //     提示游戏结束
    alert("game over!");
}

// 游戏暂停(){
function pause() {
    //     清空定时器
    clearInterval(timer);
}

// 游戏重置(){
function reset() {
    //     刷新页面
    location.reload();
}