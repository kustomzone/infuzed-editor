var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function mousemove(e) {
	console.log(e.pageX, e.pageY);
}

function init() {
	window.addEventListener('resize', resize);
	window.addEventListener('mousemove', mousemove);

	document.body.appendChild(canvas);

	resize();
}

function destory() {
	document.body.appendChild(canvas);

	window.removeEventListener('resize', resize);
	window.removeEventListener('mousemove', mousemove);
}

function draw() {

}

init();