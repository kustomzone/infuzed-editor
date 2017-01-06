
// https://github.com/lostdecade/simple_canvas_game

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.style.padding = '7px 0 0 42px';
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAHgBAMAAAAh+sjWAAAAMFBMVEUGDwYIFgkJGAoUMhYZEwocRx8fTyImUB0/gzA/hTA/hjBAbC1LOR9Mck5UPyNegGAQoePyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEz0lEQVR4Xu3aTXHjeBQA8T6EgCh4IMgQlsKKQiCMIXghhEKWQiAkEMYURGEPzmTsyFu6/7v7MvU876R6+Sr9nl6B5QAA5+s/qvkJeU9cDqeZdy7/rDy/gG3uAjicfl2WI/P6yvL8gm3uAgBOHFi5ME3XD01zF8Dpr4V3jq/LAhewzV0A59M8ceTwvlzef4Bt7gJgvXAEmA78+nG2zV0ATO8scHz9uRzXM7a5CwAuJ15ZFpjfwDZ3AcCJ6bIwv/B8/Uw1dwFwfv7758LMM29nLgfZ3AUAL6d/J96AMxxscxfAtHL++DhzWGYA29wFsPIB8wlmPmawzV0AMHN9NjPTim3uAgCY5uu0fn4qmrsA2L4/vz6p6ffzGm7OB9z0yAd8/tfnAxtvzgfc9sAHfNsYbs4H3PUE9+/LDeUDbtr6gGnl61vntI435wPu2/qAFb6+da4DzvmA+57YvD8fvXzAXQ98wJ/Wb78XjDHnA+565AP4/afz1wMca84H3PbIB3z+7Px8bOPN+YDbHviA363AiHM+4K5HPuC2Eed8wG0PfcDdl86Acz7gpkc+gLsvnfHmfMBtj3zAn8ac8wG3/Y8PWAef8wFf5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDkPfQBprkLYOsDVHMXsPUBrrkLgK0PMM1dwMYHyOYuYOMDZHMXwMYHuOYugI0PcM1dAGx8gGruAvj2vtw2dwFsfIBr7gLY+gDV3AV8f19um7sAtj5ANXcBwPzNB6jmLgBg6wM8s/4C/gPCHEonpOZggQAAAABJRU5ErkJggg==";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEUAAAAAAAAAAAAAAAAAfcVYRRtpgpBuViJvYD59kZyDo7SLeE6ctcPLpn7+0J7+2bH/xFH/x4v/yJj/8z7/9WX/+a7/+r7///8xDi3HAAAAA3RSTlMAZmcaB/wEAAAA1UlEQVQ4jZWS2xKDIAwFwaBYLXhplf//03qIqUxnWtJ9IZIdIInGGCKToQLZKZdvAtG+IyC6Z4YM7+SMSkAgKYFoXbdNI+AoBM+CxwHRsryrqAhcYJtBkqOrWI1wtanveYVgjFaQ9qbk3DTF6FxKMRYtrwhSID7jCeJ5xoNzJysCzkBrMSi5rDvhoWmEGIeh66DcMkgShYDL6gLROHofAi66Rg6hbb3XCjwaiCjYHxTjqgrcai62K/gY1k9BNFyBhM/8K1jLAj8NWKsX7An/uEgJTaMQXgQOGP28nGoKAAAAAElFTkSuQmCC";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAA+klEQVR42s2WvQ3CMBCFUWCJLEGXAaCghS4UdEh0sAO0mYIdGIOCEdjEYHRPAp4eJ9P4LH1FLPt90fknGaWUfvJsqQTKEFQTk+D7ebicilA5YcQk+Fd4OG8/ULnBxRwo+l3iiNWxEQE+6+MyI49ZFLF/cYglISAmYVAxC2/364thPMnQ5kI/xqlSxxM7pfSOkSo5l766WASLiQKINPSCwcSMF6xKH19MA5yPg1oiEoMwYlmqfT8vQf36UH89sRqglgCCftFleKNxSVujyVQX59YZu3eEGEKEuscJefCEFyNIiAkShhQ3RmtMjZnhXQQbY2VgHnJoc1UVPwARyA+KY6o4FwAAAABJRU5ErkJggg==";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();

reset();
main();

// ---------------------- End of file ------------------------
