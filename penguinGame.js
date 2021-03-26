let cvs = document.getElementById("canvas");
let startBtn = document.getElementById("start-button");
let ctx = cvs.getContext("2d");

let bg_img = new Image();
let gr_img = new Image();
let penguin = new Image();
let orca = new Image();
let garbage = new Image();
let seal = new Image();
let gameClear = new Image();
let gameOver = new Image();

bg_img.src = "backGround.png";//------------------------ 画像読み込み
gr_img.src = "ground.png";
penguin.src = "penguin.png";
orca.src = "orca.png";
garbage.src = "garbage.png";
seal.src = "seal.png";
gameClear.src = "gameClear.png";
gameOver.src = "gameOver.png";

let nowPlaying = 0;
let from_start = 0;
let startTime = 0;
const e_images = [orca, seal, garbage];
let animals = [];
let player = 0;
let backGrounds = [];

startBtn.addEventListener('click', () =>{
    if(nowPlaying == 0) {gameStart();}
    startBtn.style.display ="none";
});

cvs.addEventListener('mousemove', e =>{
    player.y = e.offsetY;
    player.x = e.offsetX;
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

class DynamicObject {
    constructor(img,v, x, y) {
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.v = v;
        this.x = x;
        this.y = y;
    }
}

function addPlayer(){
    let img = penguin;
    player = (new DynamicObject(img));
}

function addEnemy() {
    let img = e_images[getRandomInt(0, 3)];
    let v = getRandomInt(3, 5);
    let x = cvs.width;
    let y = getRandomInt(0, (cvs.height - 70))
    animals.push(new DynamicObject(img,v, x, y));
}

function gameStart() {
    nowPlaying = 1;
    backGrounds.push(new DynamicObject(bg_img, 1, 0, 0));
    backGrounds.push(new DynamicObject(gr_img, 1, 0, cvs.height - gr_img.height));
    startTime = new Date().getTime();
    addPlayer();
    addEnemy();
    mainLoop();
}

function cleanUp() {
    nowPlaying = 0;
    startBtn.innerHTML　= "もう一度遊ぶ";
    startBtn.style.display ="block";
    // backGrounds.length = 0;
    animals.length = 0; 
}

function isHit(player, obj) {
    if(player.x + player.width >= obj.x && player.x - obj.width <= obj.x){//------------------------ 横方向の当たり判定
        if(player.y - obj.height <= obj.y && player.y + player.height >= obj.y){//------------------------ 縦方向の当たり判定
            return true;
        }
    }
    return false;
}

function mainLoop() {
    from_start = Math.floor((new Date().getTime() - startTime) / 1000);

    if (from_start >= 30) {
        cleanUp();
        ctx.drawImage(gameClear, 0, 0);
        return;
    }

    for(let i = 0; i < backGrounds.length; i++){
        let bg = backGrounds[i];
        if(bg.x < 0 - cvs.width) {
            backGrounds.splice(i, 1);
            backGrounds.push(new DynamicObject(bg.img, bg.v, 0, bg.y));
        }
        bg.x -= bg.v;
        ctx.drawImage(bg.img, bg.x, bg.y);
    }
    
    for(let i = 0; i < animals.length; i++){
        let animal = animals[i];

        animal.x -= animal.v;
        if (animal.x == cvs.width / 2) addEnemy();
        if (animal.x < 0 - animal.width) animals.splice(i, 1);
        if (isHit(player, animal)) {
            cleanUp();
            backGrounds.push(new DynamicObject(gameOver, 3, cvs.width, 0));
            // return;
        }
        ctx.drawImage(animal.img, animal.x, animal.y);
    }
    ctx.drawImage(player.img, player.x, player.y);
    requestAnimationFrame(mainLoop);
}