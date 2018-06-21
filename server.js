let getHtml;

let getMain,
	getaboutUs,
	getDownloads,
	getChat,
	getGame,
	getStartGame,
	ipToFile,
	foolRequestToFile,
	makeLog,
	getIp,
	connectToDb;

let checkLocation;
let serverAdr; // variable contains host ip 

let express = require("express");
var socket = require('socket.io');
let bodyParser = require('body-parser');
let mysql = require("mysql");
let fs = require("fs");
let path = require("path");
let con;

connectToDb = (callback) => {
	con = mysql.createConnection({
		host:"localhost",
		user:"client",
		password:"lost_23031995"
	});

	try{
		con.connect((err) => {
			if(err) console.log(err);
			con.query("use game" , (err, res) => {
				if(err) console.log(err);
				if(callback) callback();
			})
		});
	}catch(e){
		console.log(e)
	}

	
};



let server = express();
server.disable("x-powered-by");


server.use(express.static("public"));

server.get("/", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
})

server.get("/main", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
});

server.get("/aboutUs", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
});

server.get("/downloads", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
});

server.get("/chat", (request, response) => {
	let ip = getIp(request);
	serverAdr = request.headers.host;
	ipToFile('path:' + request.url + ' ' + ip + ' time:' + new Date());
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
});

let history = [];
const _LengthOfHistory = 256; // set to change allowable size  of history 

server.get("/chat_history", (request, response) => {
	if(!history.length)response.sendStatus(200)
		else{response.send(history)}
});

server.get("/game", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getGame());
});

server.get("/phones.json", (request, response) => {
	var ip = getIp(request);
	ipToFile('path:' + request.url + ' ' + ip + ' time:' + new Date());
	foolRequestToFile(request.headers);
	if(ip !== "::ffff:192.168.1.254" && ip !== "::ffff:195.46.185.160"){
		response.send(`F*ck you b*tch! I have only two friends...And you (${ip}) are not one of them!`);
		return;
	}
	fs.readFile("ip.txt", (err, res) => {
		if (err) console.log(err);
		response.send('' + res);
	});
});

server.get("/registration", (request, response) => {
	let ip = makeLog(request);
	foolRequestToFile(request.headers);
	response.send(getHtml(request.url, ip));
});

// server.use('/form_handler', bodyParser.urlencoded({
//     extended: true
// }));

// server.post('/form_handler', function(req, res, next) {
//     // Объект req.body содержит данные из переданной формы
//     console.dir(req.body);
//     let ip = getIp(req);
//     ipToFile(ip);
//     res.send(getHtml(req.url, ip));
// });

let urlencodedParser = bodyParser.urlencoded({extended: false});

server.post("/game/score", urlencodedParser, (request, response) => {
	connectToDb(() => {
		con.query(`update users set score=${request.body.score} where login='${request.body.login}'`,(err,res) => {
			if(err){console.log(err)}
				else{
					response.sendStatus(200)
				}
			con.end();
		});
	});
});

server.get("/game/score", (request, response) => {
	connectToDb(() => {
		con.query(`select login, score from users order by score desc limit 5`,(err,res) => {
			if(err) console.log(err)
				else{
					response.send(res);
				}
		});
	});
});

server.post("/registration", urlencodedParser, function (request, response) {
	let ip = makeLog(request);
	connectToDb(() => {
		con.query(`select * from users where login="${request.body.UserLogin}" or email="${request.body.UserMail}"` , (err, res) => {
			if(err) throw err;
			if(res[0]){
				response.send(getHtml(request.url, ip, false));
				return;
			}
			try{
				con.query(`insert into users values(NULL, "${request.body.UserName}", "${request.body.UserLogin}", "${request.body.UserMail}", "${request.body.UserPassword}", 0, "no", "no")`, (err,res) => {
					if(err) throw err;
					if(err) response.send(getHtml(request.url, ip, false))
						else{
							response.send(getHtml(request.url, ip, true));
						}
				con.end();
				});
			}
			catch(err){
				console.log(err);
				return;
			}
			
		})
	});
	if(!request.body) return response.sendStatus(400);

});

server.post("/game", urlencodedParser, function(request, response) {
	let ip = makeLog(request);
	connectToDb(() => {
		con.query(`select * from users where email="${request.body.login}" and password="${request.body.password}"`, (err, res) => {
			if(err) console.log(err);
			if(res[0]){
				let user_login = res[0].login;
				response.send(getStartGame(user_login));
			}else{
				response.send(getGame());
			}
		con.end();
		});
	});
	if(!request.body) return response.sendStatus(400);
});

let port = 80;
let app = server.listen(port, () => {
	console.log(`Listen on port:${port}`)
});
var io = socket(app);
let users = [];

io.on('connection', (socket) => {

	console.log('made socket connection', socket.id);
	users[socket.id] = '';
	io.sockets.emit('numberofuserschanged', {counter: Object.keys(users).length});

	// Handle chat event
	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
		users[socket.id] = data.handle;
		history.push('<p><small>' + data.time + '</small><strong>' + data.handle + ': </strong>' + data.message + '</p>');
		if(history.length > _LengthOfHistory) history.splice(0, 1);
	});

	// Handle typing event
	socket.on('typing', function(data){
		socket.broadcast.emit('typing', data);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected <' + users[socket.id] + '>');
		let userName = users[socket.id] === '' ? "guest" : users[socket.id];
		delete users[socket.id];
		io.sockets.emit('userdisconnect', {
			counter: Object.keys(users).length,
			name: userName
		});
	});

});

// io.on('disconnect', (socket) => {
// 	console.log(socket.id + " disconected");
// });



// let folder = "trash_old";
// fs.readdir("trash_old/", (err, files) => {
// 	if(err) throw err;
// 	files.forEach((file) => {
// 		let ext = path.extname(file);
// 		fs.renameSync(folder + "/" + file, folder + "/" + path.basename(file, ext) + "_old" + ext);
// 		console.log(file);
// 	});
// });
getIp = (request) => {
	let ip = request.headers['x-forwarded-for'] || 
		request.connection.remoteAddress || 
		request.socket.remoteAddress ||
		(request.connection.socket ? request.connection.socket.remoteAddress : null);
	return ip;
};

ipToFile = (ip) => {
	fs.appendFile("ip.txt", "\r\n" + ip, (err) => {
		if(err) console.log(err);
	});
};

foolRequestToFile  = (request) => {
	fs.appendFile("requests.txt", "\r\n" + request, (err) => {
		if(err) console.log(err);
	});
};

makeLog = (request) => {
	let ip = getIp(request);
	ipToFile('path:' + request.url + ' ' + ip + ' time:' + new Date());
	console.log('path:' + request.url + ' ' + ip + ' time:' + new Date());
	return ip;
};

// <link rel="stylesheet" href="index_css/iphone.css" media="only screen and (max-device-width: 751px)" />
// <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
// <meta name="viewport" content="width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no;user-scalable=0;"/>
// 		<meta name="viewport" content="width=device-width; initial-scale=0.85; maximum-scale=0.85; user-scalable=0;" />
getHtml = (path, ip, done) => {
	let url = path || "";
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>XpycT</title>
		<meta charset="utf-8">
		
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,user-scalable=no">
		<link rel="shortcut icon" href="https://www.softwareok.com/img/ico/Windows-8.png" type="image/png">
		<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="index_css/iphone.css" media="only screen and (max-device-width: 751px)" />
		<link rel="stylesheet" href="index_css/padding.css">
		${path === '/chat' ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.dev.js"></script>' : ''}
		${path === '/chat' ? '<link href="chat_css/chat.css" rel="stylesheet" />' : ''}
		${path === '/downloads' ? '<link rel="stylesheet" href="index_css/cube.css" />' : ''}
	</head>
	<body>
	<div class="container">
		<hr>
		<ul class="nav">
			<a href="/"><div class="button"><span>Home</span></div></a>
			<a href="downloads"><div class="button"><span>Downloads</span></div></a>
			<a href="chat"><div class="button"><span>Chat</span></div></a>
			<a href="game"><div class="button"><span>Game</span></div></a>
			<a href="registration"><div class="button"><span>Sign up</span></div></a>
		</ul>
		<hr>
		<div class="content">${done ? getRegistrationDone() : checkLocation(url,ip)}
			<div id="data">	</div>
		</div>
	</div>
	</body>
	</html>`;
};

checkLocation = (url,ip) =>{
	let content;
	switch(url){
		case"/":content = '';
			break;
		case"/main": content = getMain();
			break;
		case"/aboutUs": content = getAbout();
			break;
		case"/downloads": content = getDownloads();
			break;
		case"/chat": content = getChat(ip);
			break;
		case"/registration": content = getRegistration();
			break;
	}
	return content;
};

getMain = () => {
	return `
	This is the <strong>main</strong> page
	<hr>
	<p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro consequuntur dolores unde commodi, ipsa excepturi eveniet distinctio ut. Obcaecati qui, accusantium iste inventore deserunt repellat eos, nesciunt nihil nulla. Obcaecati facere modi amet sequi praesentium facilis quidem ad? Asperiores fugit nemo numquam esse sunt iure cumque nostrum id, repellendus commodi perspiciatis veniam eos placeat tempora quas quisquam mollitia? Eligendi dignissimos, quidem fuga totam iste iusto iure consectetur quae sunt, sed minus animi odio sint alias quisquam minima impedit rem sit voluptatibus dolore quod! Commodi impedit error debitis aspernatur architecto reiciendis fugiat quasi culpa laboriosam, eum, deserunt optio voluptatum perferendis aut?</p>
	<p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci nulla omnis illum itaque numquam nobis voluptas consequatur, quas deserunt hic illo temporibus, iste at. Possimus maiores eaque accusantium corporis doloribus ipsum laborum minima voluptate tempore tempora, est vel veniam excepturi error aliquid ut architecto odio repellendus dicta natus cumque eveniet! Est aperiam facere expedita placeat, nemo pariatur dicta reiciendis omnis quasi, consequuntur soluta vero? Dolorem debitis sint nobis, provident deleniti voluptas inventore veritatis incidunt quaerat necessitatibus expedita, dolorum corporis est voluptate sit magnam neque assumenda aspernatur fuga labore iure eaque. Facere harum, fugiat earum aliquam molestiae pariatur asperiores, numquam ut consectetur sunt, voluptas debitis quae optio cupiditate autem distinctio culpa animi illum assumenda dolores! Illo voluptate ad aut molestiae ducimus hic, harum labore, dolore mollitia ea obcaecati saepe. Dolorum, aperiam eligendi fuga! Nostrum pariatur ad libero explicabo odio facere quis quasi alias nesciunt eligendi, debitis rem possimus unde, vel commodi.</p>`;
};
getAbout = () => {
	return `
	There is information <strong>about</strong> my page
	<hr>
	<p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit mollitia et recusandae quod, praesentium impedit vitae dolorum sunt, architecto eos officiis incidunt tempore omnis doloremque consequuntur reprehenderit porro corporis magnam non, ducimus dicta. Quam eum, ut esse culpa vero tempore tenetur perspiciatis adipisci ipsam praesentium labore, obcaecati nemo fugiat. Praesentium vel deleniti nobis architecto, ad corrupti pariatur a! Voluptatum provident, nemo voluptates quae tempora maxime officia vitae vero dignissimos tempore, dolorem iure minima! Non beatae distinctio, nam asperiores, reiciendis illo natus repudiandae minima blanditiis ratione libero minus, ad cumque odio. Et in dolor, repellat itaque numquam sed vero voluptate eius impedit neque suscipit odit repudiandae quibusdam expedita tenetur magni consequatur fuga molestiae. Officiis laboriosam ea quaerat natus minima quae repudiandae expedita, nesciunt cupiditate maxime, quas tenetur aspernatur accusantium! Odio, ab. Enim libero nulla voluptatum deserunt perspiciatis sint ipsam nihil, autem aliquid non. Nisi molestiae quia quam sed, expedita odit fugiat laudantium mollitia aliquam voluptas harum culpa libero deserunt voluptatum possimus, nemo praesentium itaque ducimus enim voluptatem animi dolor! A, laboriosam!</p>`;
};
getDownloads = () => {
	return `
	<strong>I have nothing for you yet : (</strong>
	<hr>
	<div class="wrap">
	  <div class="cube">
		<div class="front">
		  <span class="cube-side">I'm working...</span>
		</div>
		<div class="back">
		  <span class="cube-side">I'm working...</span>
		</div>
		<div class="top">
		  <span class="cube-side">I'm working...</span>
		</div>
		<div class="bottom">
		  <span class="cube-side">I'm working...</span>
		</div>
		<div class="left">
		  <span class="cube-side">I'm working...</span>
		</div>
		<div class="right">
		  <span class="cube-side">I'm working...</span>
		</div>
	  </div>
	</div>
	`;
};
	
getChat = (ip) => {
	return `
	 <strong>Welcome to our Chat-Room</strong>
	<div id="users-counter"></div>
	<p id="host-name">${serverAdr}</p>
	<hr>
	<div id="mario-chat">
		<div id="chat-window">
			<div id="output"></div>
			<div id="feedback"></div>
		</div>
		<input id="handle" type="text" placeholder="Name" />
		<input id="message" type="text" placeholder="Message" />
		<button id="send">Send</button>
	</div>
	${ip === '::ffff:192.168.1.254' || ip === '::ffff:192.168.1.56' ? '<script src="chatForAdmin.js"></script>' : '<script src="chat_js/chat.js"></script>'}
	`
};

// getChat = () => {
// 	return `
// 	Welcome to our <strong>Chat-Room</strong>
// 	<hr>
// 	<div id="send" class="button" onclick="loadPhones()">Загрузить phones.json!></div>

// 	<script>
// 	  function loadPhones() {

// 	    var xhr = new XMLHttpRequest();

// 	    xhr.open('GET', 'phones.json', true);


// 	    xhr.send();

// 		var button = document.getElementById("send");
// 		var data = document.getElementById("data");
// 	    xhr.onreadystatechange = function() {
// 	      if (xhr.readyState != 4) return;

// 	      button.innerHTML = 'Готово!';

// 	      if (xhr.status != 200) {
// 	        // обработать ошибку
// 	        alert(xhr.status + ': ' + xhr.statusText);
// 	      } else {
// 	        // вывести результат
// 	        // alert(xhr.responseText);
// 	        data.innerHTML = xhr.responseText;
// 	      }

// 	    }

// 	    button.innerHTML = 'Загружаю...';
// 	    // button.disabled = true;
// 	  }
// 	</script>
// 	`
// };

getGame = () => {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,user-scalable=no">
		<link rel="shortcut icon" href="https://www.softwareok.com/img/ico/Windows-8.png" type="image/png">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
	<form method="post" action="" class="login">
	<p>
	  <label for="login">Login:</label>
	  <input type="text" name="login" id="login" value="">
	</p>

	<p>
	  <label for="password">Password:</label>
	  <input type="password" name="password" id="password" value="">
	</p>

	<p class="login-submit">
	  <button type="submit" class="login-button">Войти</button>
	</p>

	<p class="forgot-password"><a href="#">Forgot password?</a></p>
  </form>
		<script src="game.js"></script>
	</body>
	</html>
	`
};

getRegistration = () => {
	return `
	<form action="/registration" id="form" method="post">
		<b><span class="title">Create an account</span></b>
		<p><label for="name">Name:</label></p>
		<p><input type="text" id="name" name="UserName"/></p>
		<p><label for="name">Login:</label></p>
		<p><input type="text" id="login" name="UserLogin"/></p>
		<p><label for="name">E-mail:</label></p>
		<p><input type="email" id="mail" name="UserMail"/></p>
		<p><label for="name">Password:</label></p>
		<p><input type="password" id="pass" name="UserPassword"/></p>
		<p><label for="name">Confirm Password:</label></p>
		<p><input type="password" id="repass" /></p>
		<p><button class="button" id="sendData" type="submit" name="submit">Sign Up</button></p>
	</form>
	<script src="validation.js"></script>
	`
};

getRegistrationDone = () => {
	return `
	<h2>Registration completed successfully</h2>
	`
};

getStartGame = (login) => {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,user-scalable=no">
		<link rel="shortcut icon" href="https://www.softwareok.com/img/ico/Windows-8.png" type="image/png">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
	<div id="tmp">
		<p><h1>Welcome ${login}!</h1></p>
		<div class="button" onclick="start('${login}')">Start</div>
	</div>
	
		<script src="game.js"></script>
	</body>
	</html>
	`;
};


// <form id="tmp" method="post" action="" class="login">
// 		<p><h1>Welcome ${login}!</h1></p>
// 		<p>
// 			<label for="login">Логин:</label>
// 			<input type="text" name="login" id="login" value="">
// 		</p>

// 		<p>
// 			<label for="password">Пароль:</label>
// 			<input type="password" name="password" id="password" value="">
// 		</p>

// 		<p class="login-submit">
// 			<button class="login-button" form="notThatForm" onclick="start('${login}')">Войти</button>
// 		</p>

// 		<p class="forgot-password"><a href="index.html">Забыл пароль?</a></p>
// 	</form>