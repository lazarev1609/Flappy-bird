let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

//Создание новых элементов изображения 
let bird = new Image(); 
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

let cactus = new Image();
let shot = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

cactus.src = "img/cactus.png";
shot.src = "img/shot.png";

let gap = 120;
let flag = false; //Есть ли пули
let score = 0;


//При нажатии на клавишу 
document.addEventListener("keydown", moveUp, false);
document.addEventListener("keydown", fireOn, false);

let shots = [];

function fireOn(e) {
	
	if(e.keyCode == 13){
		flag = true;
		shots.push({
			x : xPos,
			y : yPos
		});
	}
}

function moveUp(e) {
	if(e.keyCode == 32){
		yPos -= 20;
	}
}

//Создание блоков 
let pipe = [];
pipe[0] = {
	x : cvs.width,
	y : 0
}

//Позиция птички
let xPos = 10;
let yPos = 150;
let grav  = 1.6;

let shotX = 10;
let shotY = 150;

array_cactus = [];

let count = 0;

function draw(){
	ctx.drawImage(bg, 0,0);
	
	for(let i = 0; i < pipe.length; i++){

		ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
		ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
		
		pipe[i].x--;

		let r = pipe[i].x-xPos-32;
		let tmp;
		if(r == 240){
			tmp = Math.random();
			//console.log(tmp);
			if(tmp > 0.5){
				array_cactus[i] = true;
			}
		}

		console.log(i, array_cactus[i]);

		if(array_cactus[i] == true){
			//отрисовка кактуса 
			ctx.drawImage(cactus,pipe[i].x, pipe[i].y + pipeUp.height + gap-64,64,64);
		}
		
		if(pipe[i].x == 50){
			pipe.push({
				x : cvs.width,
				y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height 
			});
		}
		
		//Удаление лишних столбов и кактусов
		if(pipe[i].x + pipeUp.width < 0){
			pipe.shift();
			array_cactus.shift();
		}

		//Отрисовка пули
		if(flag == true){
			for(let j = 0; j < shots.length; j++){

				//Отслеживание попадания выстрела
				if(shots[j].x+32 >= pipe[i].x && shots[j].y >= pipe[i].y + pipeUp.height + gap-64 && shots[j].y <= pipe[i].y + pipeUp.height + gap){
					array_cactus[i] = false;
				}
			}
		}

		//Отслеживание столкновений
 		if(xPos + bird.width >= pipe[i].x
 				&& xPos <= pipe[i].x + pipeUp.width
 				&& (yPos <= pipe[i].y + pipeUp.height
 				|| yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height
 				|| xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + 64
 				&& (yPos >= pipe[i].y + pipeUp.height + gap -64 || yPos <= pipe[i].y + pipeUp.height)&&array_cactus[i]==true) {
 				location.reload(); // Перезагрузка страницы
 		}
 		
 		//Подсчет пройденных столбов
		if(pipe[i].x == 5){
			score++;
		}
	}

	//Отрисовка пули
	if(flag==true){
		for(let j = 0; j < shots.length; j++){
			//console.log(shots[j].x);
			if(shots[j].x >= 285){
				if(shots.length == 1){

					shots.shift();
					flag = false;
					break;

				}
				console.log(shots[j].x);
				shots.shift();
			}

			ctx.drawImage(shot, shots[j].x,shots[j].y,32,32);
			shots[j].x += 2;
		}	
	}
		
	ctx.drawImage(fg,0, cvs.height - fg.height);
	ctx.drawImage(bird, xPos, yPos);

	yPos += grav;

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Счёт:" + score, 10, cvs.height -20);
	requestAnimationFrame(draw);
}

pipeBottom.onload = draw;
// setInterval(draw, 10);