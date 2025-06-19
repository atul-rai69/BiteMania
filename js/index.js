let inputDir = {x:0, y:0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed =15;
let score =0;
let lastPaintTime = 0;
let snakeArray = [
    {x:13, y:15}
];
food = {x:5, y:10};


//functions of the game
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
    //if bump into yourself
    for(let i = 1; i< snakeArray.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // if bump into the wall
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0  ){
        return true;
    }
    
}

function gameEngine(){
    //part 1 - updating the snake array
    if(isCollide(snakeArray)){
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x:0, y:0};
        alert("game over. Press any key to play again!");
        snakeArray = [{x:12, y:15}];
        musicSound.play();
        score= 0;
    }

    //if you eaten , score++ and new food appears
    if(snakeArray[0].y === food.y && snakeArray[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "hi score: " + hiscoreval;
        }
        scoreBox.innerHTML = "score: " + score; 
        snakeArray.unshift({x: snakeArray[0].x + inputDir.x , y: snakeArray[0].y});
        let a= 2;
        let b= 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a+ (b-a)* Math.random())};
    }


    // moving the snake
    for(let i= snakeArray.length -2 ; i>=0 ; i--){
        snakeArray[i+1] = {...snakeArray[i]};
    }

    snakeArray[0].x += inputDir.x;
    snakeArray[0].y += inputDir.y;

    //part 2 - render the snake and food
    //displaying the snake
    board.innerHTML = "";
    snakeArray.forEach((e,index)=> {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index == 0){
            snakeElement.classList.add('head');
        }else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    //displaying the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}






// main logic of the game
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "hi score: " + hiscore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e=> {

    if (musicSound.paused) {
        musicSound.play();
    }

    inputDir = {x:0,y:1} //start the game
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            console.log('ArrowUp');
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log('ArrowDown');
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log('ArrowLeft');
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log('ArrowRight');
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

document.getElementById("up").addEventListener("click", () => {
    inputDir = { x: 0, y: -1 };
    moveSound.play();
});
document.getElementById("down").addEventListener("click", () => {
    inputDir = { x: 0, y: 1 };
    moveSound.play();
});
document.getElementById("left").addEventListener("click", () => {
    inputDir = { x: -1, y: 0 };
    moveSound.play();
});
document.getElementById("right").addEventListener("click", () => {
    inputDir = { x: 1, y: 0 };
    moveSound.play();
});


// --- Swipe Controls for Touch Devices ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
});

window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Ignore small swipes
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 0 && inputDir.x !== -1) {
            inputDir = { x: 1, y: 0 };
            moveSound.play();
        } else if (diffX < 0 && inputDir.x !== 1) {
            inputDir = { x: -1, y: 0 };
            moveSound.play();
        }
    } else {
        // Vertical Swipe
        if (diffY > 0 && inputDir.y !== -1) {
            inputDir = { x: 0, y: 1 };
            moveSound.play();
        } else if (diffY < 0 && inputDir.y !== 1) {
            inputDir = { x: 0, y: -1 };
            moveSound.play();
        }
    }
}
