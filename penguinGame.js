var cvs = document.getElementById("canvas");//------------------------ 変数を準備
var ctx = cvs.getContext("2d");

var backGround = new Image(); 
var penguin = new Image();
var orca = new Image();
var startImage = new Image();
var gameClear = new Image();
var gameOver = new Image();
var pY = 30;
var pX = 85;
var from_start = 0;
var startTime = 0;


function getRandomInt(min, max) {//------------------------ 指定された範囲でランダムな整数を返す
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

backGround.src = "/subdomains/media-cache.php?ak=backGround.png";//------------------------ 画像読み込み
penguin.src = "/subdomains/media-cache.php?ak=penguin.png";
orca.src = "/subdomains/media-cache.php?ak=orca.png";
gameClear.src = "/subdomains/media-cache.php?ak=gameClear.png";
gameOver.src = "/subdomains/media-cache.php?ak=gameOver.png";
startImage.src = "/subdomains/media-cache.php?ak=startImage.png";

var enemies = [];//------------------------ 障害物のオブジェクトを用意
enemies[0] = {
    x : cvs.width,
    y : getRandomInt(0, 170)
}

function drowStartMenu(){//------------------------ スタート画像を表示
    ctx.drawImage(startImage, 0, 0);
    requestAnimationFrame(drowStartMenu);
}

window.addEventListener('mousemove', () =>{//------------------------ マウスカーソルの位置を取得
    document.getElementById("canvas").addEventListener('mousemove', logPosition);
});

function logPosition(event) {//------------------------ 操作キャラの座標にマウスカーソルの座標を代入
    pY = event.offsetY;
    pX = event.offsetX;
}

function gameStart(){//------------------------ ゲームの本体
    ctx.drawImage(backGround, 0, 0);
    ctx.drawImage(penguin, pX, pY);
    for(var i=0 ; i < enemies.length; i ++){
        from_start = new Date().getTime() - startTime;
        ctx.drawImage(orca, enemies[i].x, enemies[i].y);
        enemies[i].x -=3;

        if(enemies[i].x == 300){ //  ブロックを追加する処理
            enemies.push({
                x : cvs.width,
                y : getRandomInt(30, 170)
            });
        }
        
        if(from_start >= 15000){
            ctx.drawImage(gameClear, 225, 25);
            alert('ゲームクリアです。');
            return true;
        }

        if((pX + penguin.width >= enemies[i].x && pX - orca.width <= enemies[i].x) && (pY - orca.height <= enemies[i].y && pY + penguin.height >= enemies[i].y)) { //  当たり判定処理
            ctx.drawImage(gameOver, 225, 25);
            alert('ゲームオーバーです。');
            return true;
        }
    }
    requestAnimationFrame(gameStart);
}

drowStartMenu();

cvs.addEventListener('click', () =>{//------------------------ クリック町
    startTime = new Date().getTime();
    gameStart();
});