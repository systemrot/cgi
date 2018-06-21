let links = document.querySelector(".nav");
links.onmouseover = (e) => {
	if(e.target.toString()[0] === "h"){
		e.target.style.background = "#888888";
	}
};
links.onmouseout = (e) => {
	if(e.target.toString()[0] === "h"){
		e.target.style.background = "";
	}
};

