// ##################### //
// created by XpycT #### //
// #last update 11.05.18 //

let canvas = document.createElement("canvas");
canvas.style.backgroundImage = "url('img/Forest-31.jpg')";
canvas.style.backgroundRepeat = "no-repeat";
canvas.style.backgroundPosition = "top center"
let context = canvas.getContext("2d");
let dpyWidth = window.innerWidth - 6;
let dpyHeight = window.innerHeight - 6;
canvas.width = dpyWidth;
canvas.height = dpyHeight;

let dpy = document.createElement("div");
dpy.id = "dpy";

let image = document.createElement("img");
image.setAttribute("src", "img/fruits.png");

let image2 = document.createElement("img");
image2.setAttribute("src", "img/girl.png");

let counterDown1 = document.createElement("audio");
counterDown1.src = "audio/timer/count1s.wav";
counterDown1.volume = 0.1;

let counterDown2 = document.createElement("audio");
counterDown2.src = "audio/timer/count2s.wav";
counterDown2.volume = 0.1;

let counterDown3 = document.createElement("audio");
counterDown3.src = "audio/timer/count3s.wav";
counterDown3.volume = 0.1;

let catchingFruitsAudio = document.createElement("audio");
catchingFruitsAudio.src = "audio/catchingFruits/softl-hitwhistle.wav";
catchingFruitsAudio.volume = 0.1;

let pauseAudio = document.createElement("audio");
pauseAudio.src = "audio/pause/sectionpass.wav";
pauseAudio.volume = 0.1;

let endOfGameAudio = document.createElement("audio");
endOfGameAudio.src = "audio/endOfGame/applause.wav";
endOfGameAudio.volume = 0.1;


let GAME_OVER = false;
let SCORE = 0;
let LOST = 0;
let TIME = 0;
let PAUSE = false;
let END_OF_GAME = false;
let GAME_LEVEL_TIME = 90;
let minutes,
	seconds;
let placeForTimer = {
	x:canvas.width / 2 - 105,
	y:50
};

n = 25;// if you want to add more fruits - change the value.
fruits = [];
let timeForCombo = 0;
let counter = 3;
let opac = 1.0;
let form = document.getElementById("tmp");
let USER_NAME;

let formOpacity = 1.0;
function start(login){
	USER_NAME = login;
	let id = setInterval(() => {
		if(formOpacity !== 0){
			formOpacity -= 0.01;
			if(formOpacity <= 0.01){
				formOpacity = 0;
			}
			form.style.opacity = formOpacity;
		}else{
			clearInterval(id);
			form.remove();
			startGame(login);
			return;
		}
	}, 1000/60);
};

let startGame = function(login){
	document.body.appendChild(dpy);
	dpy.appendChild(canvas);

	function setOpacity(){
		if(opac != 0){
			opac -= 0.0005;
			if(opac <= 0.01){
				opac = 0;
				GAME_OVER = true;
			}
		}
		context.globalAlpha = opac;
	}

	let countDown = function(){
		id = setInterval(() => {
			if(counter === 3){
				counterDown3.play();
			}
			if(counter === 2){
				counterDown2.play();
			}
			if(counter === 1){
				counterDown1.play();
			}
			counter -= 1;
			if(counter === 0){
				clearInterval(id);
				return;
			}
		},1000);
	}

	let startGameLevel = function(){
		minutes = Math.floor(GAME_LEVEL_TIME / 60);
		seconds = GAME_LEVEL_TIME % 60;
	};

	let getScore = function(){
		context.font = "50px BeerRegular";
		var gradient = context.createLinearGradient(0,0,canvas.width, canvas.height);
		gradient.addColorStop("0","white");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		context.fillStyle = gradient;
		context.fillText("Score:" + SCORE,20,120);
		context.fillText("Lost:" + LOST,20,170);
		context.fillText("Time " + minutes + ":"+ seconds, placeForTimer.x, placeForTimer.y);
		context.fillStyle = "#FF7900";
		if(Math.round(timeForCombo) > 0)context.fillText("COMBO " + Math.round(timeForCombo), placeForTimer.x, placeForTimer.y + 50);
		context.font = "20px Verdana";
		context.fillStyle = gradient;
		if(USER_NAME){context.fillText(USER_NAME, canvas.width - USER_NAME.length*15 , placeForTimer.y -10);}
		context.fillText("F2:Pause",20,50);
		context.fillText("Shif:Boost",20,25);
		context.fillText("<-left | ->right",20,75);
	};

	let SetCnvWH = function(){
		dpy.style.height = canvas.height;
		canvas.style.background = "url(img/Forest-31.jpg)";
		canvas.style.backgroundRepeat = "no-repeat";
		canvas.style.backgroundPosition = "top center"
		dpyWidth = window.innerWidth - 6;
		dpyHeight = window.innerHeight - 6;
		canvas.width = dpyWidth;
		canvas.height = dpyHeight;
		dpy.style.height = `${canvas.height}px`;
		placeForTimer.x = canvas.width / 2 - 105;
		context.clearRect(0,0, dpyWidth, dpyHeight);
	};

	function randomInteger(min, max) {
		var rand = min - 0.5 + Math.random() * (max - min + 1);
		rand = Math.round(rand);
		return rand;
	}

	let getRandomFruit = function(){
		switch(randomInteger(1, 10)){
			case 1: return {x:0, y:0, width:150, height:150, cnvImgWid:60, cnvImgHeig:60};
			case 2: return {x:176, y:0, width:150, height:150, cnvImgWid:60, cnvImgHeig:60};
			case 3: return {x:368, y:0, width:150, height:150, cnvImgWid:60, cnvImgHeig:60};
			case 4: return {x:559, y:0, width:150, height:150, cnvImgWid:60, cnvImgHeig:60};
			case 5: return {x:10, y:150, width:145, height:220, cnvImgWid:60, cnvImgHeig:89};
			case 6: return {x:222, y:158, width:133, height:206, cnvImgWid:60, cnvImgHeig:89};
			case 7: return {x:398, y:179, width:181, height:156, cnvImgWid:80, cnvImgHeig:80};
			case 8: return {x:0, y:369, width:177, height:188, cnvImgWid:80, cnvImgHeig:80};
			case 9: return {x:203, y:381, width:191, height:172, cnvImgWid:80, cnvImgHeig:80};
			case 10: return {x:415, y:376, width:197, height:180, cnvImgWid:90, cnvImgHeig:90};
		}

	};

	let Fruit = function (){
		this.displayed = true;
		let obj = getRandomFruit();
		this.imgW = obj.width;
		this.imgH = obj.height
		this.x = randomInteger(0, dpyWidth - this.imgW);
		this.y = -100;
		this.v = 0;
		this.dv = Math.random() * 3 + 0.5;
		this.imgPosX = obj.x;
		this.imgPosY = obj.y;
		this.width = obj.cnvImgWid;
		this.height = obj.cnvImgHeig;
	};

	Fruit.prototype = {
		moving:function(){
			this.y += this.dv;
		},

		draw:function(){
			if(END_OF_GAME){setOpacity()};
			context.drawImage(image, this.imgPosX, this.imgPosY, this.imgW, this.imgH, this.x, this.y, this.width, this.height);
		},

		isDisplay:function(){
			if(this.y >= dpyHeight){
				this.displayed = false;
				LOST += 1;
				timeForCombo = 0;
			}
		},

		isCollision:function(girlX, girlY){
			if(((this.y+this.height) >= girlY) && (this.y <= girlY+45) && (this.x >= girlX-45) && (this.x <= (girlX+150))){
				this.displayed = false;
				timeForCombo += 1.0;
				catchingFruitsAudio.play();
				if(Math.round(timeForCombo) >= 2){
					SCORE += Math.round(timeForCombo);
				}
					else SCORE+=1;
			}
		}
	};

	let Girl = function(){
		this.imgWidth = 321;
		this.imgHeight = 213;
		this.x = dpyWidth/2 - 50;
		this.y = dpyHeight - 83	;
		this.v = 15;
	};

	Girl.prototype = {
		setPosition:function(y){
			this.y = y;
		},

		draw:function(){
			context.drawImage(image2, 0, 20, this.imgWidth, this.imgHeight, this.x, this.y, 150, 90);
		},

		moveTo:function(x){
			this.x < x ? x-=58 : x -= 116;
			if(x === this.x) return;
			for(let i = 0; i < 80; i++){
				//this.x += 2;
				x > this.x ? this.x += 1 : this.x -= 1;
			}
		},

		moveRight:function(boost){
			if(this.x+150 >= dpyWidth){return}
			if(boost){this.v = boost}
			this.x += this.v;
		},

		moveLeft:function(boost){
			if(this.x <= 0){return}
			if(boost){this.v = boost}
			this.x -= this.v;
		},
	};

	let girl = new Girl();

	let creating = function(){
			for(let i = 0; i < n; i++){
				fruits.push(new Fruit());
			}
	};

	let timer = function(){
		TIME+=1;
		if(TIME>=240){
			TIME = 0;
			creating();
		}
	};

	let clearing = function(){

		if(fruits){
			for(let i = 0; i < fruits.length; i++){
				if(!fruits[i].displayed || opac === 0){
					fruits.splice(i, 1);
				}
			}
		}
	};
	let menu;
	let btnSendScore;
	let showRecords;
	let getButtonsForEndGame = () => {
		menu = document.createElement("div");
		menu.style.width = "25em";
		menu.style.background = "#33363F";
		menu.style.marginTop = "5em";
		menu.style.marginLeft = "auto";
		menu.style.marginRight = "auto";
		menu.style.height = "12em";
		menu.style.borderRadius = "5px";
		menu.style.boxShadow = "3px 3px 10px 3px #222222";
		menu.style.opacity = "0.7";
		dpy.appendChild(menu);
		divScore = document.createElement("div");
		inputScore = document.createElement("input");
		inputScore.name = "score";
		SCORE-=LOST;
		inputScore.style.fontSize = "20px";
		inputScore.value = "Score:" + SCORE;
		inputScore.disabled = true;
		inputScore.style.textAlign = "center";
		inputScore.style.background = "white";
		inputScore.style.height = "2em";
		inputScore.style.width = "140px";
		inputScore.style.borderRadius = "5px";
		divScore.style.marginTop = "2em";
		divScore.style.marginLeft = "auto";
		divScore.style.marginRight = "auto";
		divScore.style.height = "1em";
		divScore.style.width = "5em";
		divScore.style.boxShadow = "3px 3px 10px 3px #222222";
		divScore.appendChild(inputScore);
		menu.appendChild(divScore);
		btnSendScore = document.createElement("div");
		btnSendScore.style.width = "8em";
		btnSendScore.style.fontSize = "20px";
		btnSendScore.style.background = "white";
		btnSendScore.style.marginTop = "2em";
		btnSendScore.style.marginLeft = "auto";
		btnSendScore.style.marginRight = "auto";
		btnSendScore.style.height = "2em";
		btnSendScore.style.borderRadius = "5px";
		btnSendScore.style.boxShadow = "3px 3px 10px 3px #222222";
		btnSendScore.style.paddingTop = "15px";
		btnSendScore.style.textAlign = "center";
		btnSendScore.innerHTML = "Send Score";
		menu.appendChild(btnSendScore);
		showRecords = document.createElement("div");
		showRecords.style.fontSize = "20px";
		showRecords.style.width = "8em";
		showRecords.style.background = "white";
		showRecords.style.marginTop = "1em";
		showRecords.style.marginLeft = "auto";
		showRecords.style.marginRight = "auto";
		showRecords.style.height = "2em";
		showRecords.style.borderRadius = "5px";
		showRecords.style.boxShadow = "3px 3px 10px 3px #222222";
		showRecords.innerHTML = "Show Records";
		showRecords.style.paddingTop = "15px";
		showRecords.style.textAlign = "center";
		menu.appendChild(showRecords);
		let display = document.createElement("div");
		display.style.cssText = `background: #33363F;color: white;text-align: center;`;
		menu.appendChild(display);

		btnSendScore.onmouseenter = () => {
			btnSendScore.style.background = "#111111";
			btnSendScore.style.cursor = "pointer";
		};
		btnSendScore.onmouseleave = () => {
			btnSendScore.style.background = "white";
			btnSendScore.style.cursor = "default";
		};
		showRecords.onmouseenter = () => {
			showRecords.style.background = "#111111";
			showRecords.style.cursor = "pointer";
		};
		showRecords.onmouseleave = () => {
			showRecords.style.background = "white";
			showRecords.style.cursor = "default";
		};
		showRecords.onclick = () => {
			// alert("This feature does not work yet...");
			let xhr = new XMLHttpRequest();
			xhr.open("GET", "/game/score", true);
			xhr.onreadystatechange = () => {
				display.innerHTML = "";
				if (xhr.readyState != 4) return;
				if (xhr.status != 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					// console.log(JSON.parse(xhr.responseText));
					let table = JSON.parse(xhr.responseText);
					Array.prototype.forEach.call(table, (elem) => {
						display.innerHTML += `<p>${elem.login}:${elem.score}</p>`;
					});
				}
			};
			xhr.send();
		};
		btnSendScore.onclick = () => {
			let xhr = new XMLHttpRequest();
			xhr.open("POST", "/game/score", true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = () => {
				if (xhr.readyState != 4) return;
				if (xhr.status != 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					alert("ready");
				}
			};
			xhr.send(`score=${SCORE}&login=${login}`);
		};
	};


	let gameLoop = function(){
		if(GAME_OVER){
			cancelAnimationFrame(id);
			canvas.remove();
			getButtonsForEndGame();
			return;
		}
		id = requestAnimationFrame(gameLoop);
		SetCnvWH();
		girl.setPosition(dpyHeight-80);
		clearing();
		getScore();
		if(!mouseUp.value) girl.moveTo(mouseUp.pos);
		girl.draw();
		fruits.forEach(function(obj){
			obj.draw();
		});
		if(!PAUSE && !END_OF_GAME){
			timer();
			/// -= 0.06  was a good way
			if(timeForCombo > 0) timeForCombo -= 0.05
			fruits.forEach(function(obj){
				obj.isCollision(girl.x, girl.y);
				obj.moving();
				obj.draw();
				obj.isDisplay();
			});
			startGameLevel();
		}

	};
	// ##############
	// ouch events ##
	// ##############

	canvas.addEventListener("touchstart", handleStart, false);
	canvas.addEventListener("touchend", handleEnd, false);
	canvas.addEventListener("touchcancel", handleCancel, false);
	canvas.addEventListener("touchmove", handleMove, false);

	function handleStart(event){
		event.preventDefault();
		mouseUp.value = false;
		// mouseUp.pos = e.layerX;
		let touches = event.changedTouches;
		for (var i = 0; i < touches.length; i++) {
			mouseUp.pos = event.changedTouches[i].screenX;
			// console.log(event.changedTouches[0].screenX);
		}
	};
	function handleEnd(event){
		event.preventDefault();
		mouseUp.value = true;
		// event.preventDefault()
		//mouseUp.value = true;
	};
	function handleCancel(event){
		// event.preventDefault();
		//  log("touchcancel.");
		//  var touches = event.changedTouches;
		 
		//  for (var i = 0; i < touches.length; i++) {
		//    ongoingTouches.splice(i, 1);  // remove it; we're done
		//  }
	};
	function handleMove(event){
		event.preventDefault();
		mouseUp.value = false;
		let touches = event.changedTouches;
		for (var i = 0; i < touches.length; i++){
			mouseUp.pos = event.changedTouches[i].screenX;
		}
		// if(!mouseUp.value){
		// 	mouseUp.pos = touches.pageX[0];
		// }
		// event.preventDefault() 
		// if(!mouseUp.value){
		// 	mouseUp.pos = e.layerX;
		// }
	};

	// ##############
	// ##############
	// ##############

	window.addEventListener("keyup", function(){
		girl.v = 15;
	});
	let mouseUp = {
		value: true,
		pos: 0
	};

	canvas.addEventListener('mousemove', function(e){
		if(!mouseUp.value){
			mouseUp.pos = e.layerX;
		}
	});

	canvas.addEventListener('mousedown', function(e){
		mouseUp.value = false;
		mouseUp.pos = e.layerX;
	});

	canvas.addEventListener('mouseup', function(){
		mouseUp.value = true;
	});

	window.addEventListener("keydown", function(e){
		switch(e.keyCode){
			case 113: 	PAUSE = !PAUSE;
						pauseAudio.play();
				break;
			case 37:if(e.shiftKey){
						girl.moveLeft(30);
					}else{
						girl.moveLeft();
					}
				break;
			case 39:if(e.shiftKey){
						girl.moveRight(30);
					}else{
						girl.moveRight();
					}
				break;
		}
	});
	gameLoop();
	countDown();
	setTimeout(() => {
		let id = setInterval(() => {
			if(GAME_LEVEL_TIME === 0){
				endOfGameAudio.play();
				END_OF_GAME = true;
				context.clearRect(0,0, dpyWidth, dpyHeight);
				girl.draw();
				getScore();
				clearInterval(id);
				return;
			}
			if(!PAUSE)GAME_LEVEL_TIME -=1;
	},1000);
	},3000);
}