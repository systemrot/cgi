// Make connection
var hostName = document.getElementById('host-name').innerHTML;

var socket = io.connect('http://' + hostName);

// Query DOM
var message = document.getElementById('message'),
	handle = document.getElementById('handle'),
	btn = document.getElementById('send'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback'),
	usersCounter = document.getElementById('users-counter');

let getHoursMinutesSeconds = () => {
	let date = new Date();
	return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ';
};

let getChatHistory = () => {
	xhr = new XMLHttpRequest();
	xhr.open("GET", "/chat_history", true);
	xhr.onreadystatechange = () => {
		if(xhr.readyState != 4) return;
		if(xhr.status != 200){
			alert(xhr.status + " : " + xhr.statusText);
		} else{
			if(xhr.responseText !== "OK"){// if server didn't send object but did string "OK"
				let history = JSON.parse(xhr.responseText)
				Array.prototype.forEach.call(history, (elem) => {
					output.innerHTML += elem;
				})
			}
		}
	};
	xhr.send();
};

getChatHistory();

// Emit events
btn.addEventListener('click', function(){
	if(message.value === "") {
		return;
	}
	let HMS = getHoursMinutesSeconds();
	socket.emit('chat', {
		message: '<span style="color:#FF00C2">' + message.value + '</span>',
		handle: handle.value,
		time: HMS
	});
	message.value = "";
});

message.addEventListener('keypress', function(e){
	if(message.value !== ""){
		socket.emit('typing', handle.value)
	}
	let HMS = getHoursMinutesSeconds();
	if(e.keyCode === 13 && message.value !== ""){
		socket.emit('chat', {
			message: '<span>' + message.value + '</span>',
			handle: handle.value,
			time:HMS
		});
		message.value = "";
	}
})

// Listen for events
socket.on('numberofuserschanged',function(data){
	let HMS = getHoursMinutesSeconds();
	usersCounter.innerHTML = ''+data.counter;
	output.innerHTML += '<p><small>'+ HMS + 'guest' + ' connected...</small></p>';
});

socket.on('userdisconnect',function(data){
	let HMS = getHoursMinutesSeconds();
	output.innerHTML += '<p><small>'+ HMS + data.name + ' disconnected...</small></p>';
	usersCounter.innerHTML = ''+data.counter;
});

socket.on('chat', function(data){
	feedback.innerHTML = '';
	output.innerHTML += '<p><small>' + data.time + '</small><strong>' + data.handle + ': </strong>' + data.message + '</p>';
	messages = document.getElementsByTagName("p");
	lastMessage = messages[messages.length - 1];
	if(lastMessage)lastMessage.scrollIntoView(true);
});

socket.on('typing', function(data){
	feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
