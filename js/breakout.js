
const d = document
const w = window

const canvas = d.getElementById('canvas')
const ctx = canvas.getContext('2d')

const dialog_lose = document.getElementById("modal-lose");
const dialog_win = document.getElementById("modal-winner");
const closeBtnW = document.getElementById("btn-modal-w");
const closeBtnL = document.getElementById("btn-modal-l");

let window_width = w.innerWidth
let window_height = w.innerHeight

canvas.width = window_width
canvas.height = window_height



function resetGame(){
    location.reload();
}

let modalWin = function(){

    dialog_win.showModal();
    closeBtnW.addEventListener('click',()=>{
        dialog_win.close();
    })
}
let modalLose = function(){
    dialog_lose.showModal();
    closeBtnL.addEventListener('click',()=>{
        resetGame();
        dialog_lose.close();
    })
}

let lives = 3;
let attempts = lives;

class Circle{
    constructor(xpos,ypos,radius,color,speed){
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.dxr = this.dx;
        this.dyr = this.dy;
    }

    draw(context){
        context.beginPath();
        context.arc(this.xpos,this.ypos,this.radius,0,Math.PI*2,false);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'transparent'; //Elimina el borde
        context.stroke();
        context.closePath();
    }
    statusGame(){
   
        if(lives <= 0){
            this.dx = 0;
            this.dy = 0;
            modalLose();
            
        }
            lives--;
            this.xpos = 600;
            this.ypos = 250;    
            this.dx = 0;
            this.dy = 0;
            let random_dir = Math.random() < 0.5 ? -1 : 1;
        
            setTimeout(()=>{
                this.dx = this.dxr * random_dir;
                this.dy = this.dyr;
            },1200);
    
    }
    update() {
        this.draw(ctx);
    
        // Rebote en las paredes laterales
        if ((this.xpos + this.radius) > window_width || (this.xpos - this.radius) < 0) {
            this.dx = -this.dx;
        }
    
        // Rebote solo en la parte superior
        if ((this.ypos - this.radius) < 1) {
            this.dy = -this.dy;
        }
    
        // Verificar si toca la parte inferior
        if ((this.ypos + this.radius) > window_height+20) {
            this.statusGame();
            //console.log("Juego terminado");  // O cualquier otra acción
            
        }
    
        this.xpos += this.dx;
        this.ypos += this.dy;
    }
    
}

class Rect{
    static status = 1;
    constructor(xpos,ypos,width,height,color){
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(context){
        context.fillStyle = this.color;   
        context.fillRect(this.xpos, this.ypos, this.width, this.height);
   
    }
    update(){
        this.draw(ctx);
    }
    colision = function(){
        // Revisa si el círculo está dentro del rectángulo
        if(ball.xpos >= this.xpos && 
            ball.xpos <= this.xpos + this.width+20 &&
            ball.ypos >= this.ypos &&
            ball.ypos <= this.ypos + this.height+20){
                // Invierte la dirección x si la pelota choca con el lado izquierdo o derecho
                if (ball.xpos - ball.radius <= this.xpos || 
                    ball.xpos + ball.radius >= this.xpos + this.width+20) {
                    ball.dx *= 1;
                }
                // Invierte la dirección y si la pelota choca con la parte superior o inferior
                if (ball.ypos - ball.radius <= this.ypos || 
                    ball.ypos + ball.radius >= this.ypos + this.height+20) {
                    ball.dy *= -1;
                }
                this.status = 0;
                deleteBrick();
                
                //console.log(this.status)
            }
    }
}



const barSpeed = 10;   // Velocidad de la barra
let isMovingLeft = false;
let isMovingRight = false;

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') isMovingLeft = true;
    if (e.key === 'ArrowRight') isMovingRight = true;
});

// Detecta cuando se suelta una tecla
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') isMovingLeft = false;
    if (e.key === 'ArrowRight') isMovingRight = false;
});

let move = function(){
    if (isMovingLeft && paddle.xpos > 0) {
        paddle.xpos -= barSpeed;  // Mueve a la izquierda
    }
    if (isMovingRight && paddle.xpos + paddle.width < window_width) {
        paddle.xpos += barSpeed;  // Mueve a la derecha
    }
}

//Imprimir las columnas y filas de bricks
const brickColum = 5;
const brickRow = 3;
let brickHeight = window_height*.05;
let brickWidth = window_width*0.150;
let brickX = 0;
let brickY = 0;
let numBricks = (brickColum*brickRow);
let bricks = []

let generateBricks = function(){
    for(let i = 0; i < brickColum; i++){
        bricks[i] = [];
        for(let j = 0; j < brickRow; j++){
            bricks[i][j] = new Rect(0,0,window_width*0.150,window_height*.05,'#1c2833');
            //console.log( bricks[i][j])

        }
    }
}
let setBricks = function() {
    // Calcula el desplazamiento para centrar
    let offsetX = ((brickColum * brickHeight)) / 2; 
    let offsetY = 40;  // Margen superior opcional

    for (let i = 0; i < brickColum; i++) {
        for (let j = 0; j < brickRow; j++) {
            if(window_width < 480){
                brickX = i * (brickWidth + offsetX)*.60; 
                brickY = j * (brickHeight + offsetY)*.70;
            }else 
            if(window_width < 700){
                brickX = i * (brickWidth + offsetX)*.70; 
                brickY = j * (brickHeight + offsetY)*.80;
            }else if(window_width < 860){
                brickX = i * (brickWidth + offsetX)*.75; 
                brickY = j * (brickHeight + offsetY)*.95;
            }else if(window_width < 990){
                brickX = i * (brickWidth + offsetX)*.80; 
                brickY = j * (brickHeight + offsetY)*.95;
            }
            else if(window_width < 1190){
                brickX = i * (brickWidth + offsetX)*.90; 
                brickY = j * (brickHeight + offsetY)*.95;
            }else{
                brickX = i * (brickWidth + offsetX)*.98; 
                brickY = j * (brickHeight + offsetY)*.95;
            }
            bricks[i][j].xpos = brickX;
            bricks[i][j].ypos = brickY;

            // Dibuja los ladrillos
           // bricks[i][j].draw(ctx);
        }
    }
}
let deleteBrick = function(){
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            if(bricks[i][j].status == 0){
                numBricks--;
                bricks[i].splice(j,1);
             
                winGame();
               // console.log(ball.speed)
            }
        }
    }
}
let winGame = function(){
    console.log(numBricks)
    if(numBricks === 0){
        ball.dx = 0;
        ball.dy = 0;
        modalWin();
    }
}

    let ball = new Circle(500,400,25,'#b3d9ff',6);
    //let brick = new Rect(200,300,100,35,'#1c2833');
    let paddle = new Rect(canvas.width/2,canvas.height*.97,window_width*.150,window_height*.30,'#1c2833 ');
    
    paddle.draw(ctx);
    //brick.draw(ctx);
    ball.draw(ctx);
    paddle.draw(ctx);
    
    generateBricks();
    setBricks();
    

    
let updateCircle = function(){
    
    ctx.fillStyle = '#374151'; // Dibuja un rectángulo de fondo sobre todo el canvas
    ctx.fillRect(0, 0, window_width, window_height);
    move();
    
    ball.update();
    paddle.update();
    //brick.update();
    
    paddle.colision();
    //brick.colision();
    
    for(let i = 0; i < bricks.length; i++){
        for(let j = 0; j < bricks[i].length; j++){
            bricks[i][j].update();
            bricks[i][j].colision();
        }
    }
    
 

    requestAnimationFrame(updateCircle); // Llama a requestAnimationFrame nuevamente para crear un bucle
}

updateCircle();
updateCircle();


