let fields = document.getElementsByTagName("input");

let submit = document.getElementById("sendData");

fields[0].onkeydown = () => {
	if(fields[0].value.length > 49){
		fields[0].value = fields[0].value.slice(0,49);
	}
};

fields[1].onkeydown = () => {
	if(fields[1].value.length > 14){
		fields[1].value = fields[1].value.slice(0,14);
	}
};

fields[2].onkeydown = () => {
	if(fields[2].value.length > 49){
		fields[2].value = fields[2].value.slice(0,49);
	}
};

fields[3].onkeydown = () => {
	if(fields[3].value.length > 19){
		fields[3].value = fields[3].value.slice(0,19);
	}
};

fields[4].onkeydown = () => {
	if(fields[4].value.length > 19){
		fields[4].value = fields[4].value.slice(0,19);
	}
};

// fields[1].onchange = () => {
// 	if(fields[1].value.length > 15){
// 		fields[1].value = fields[1].value.slice(0,15);
// 	}
// };

// Array.prototype.forEach.call(fields, (elem) => {
// 	console.log(elem.value);
// });
// submit.style.visibility = "hiddesn";
submit.onclick = (e) => {
	let flagOfEmpty = false;
	Array.prototype.forEach.call(fields, (elem) => {
		if(elem.value === "") flagOfEmpty = true;
	});
	if(flagOfEmpty){
		e.preventDefault();
		alert("There are empty fields!");
		return;
	}
	if(fields[fields.length-1].value !== fields[fields.length-2].value){
		alert("different passwords!");
		e.preventDefault();
		return;
	}
};