/* 
 * Fab Ball
 * 
 * A magic 8 ball for the Fab Academy
 *
 * Created by Erin RobotGrrl, 2014
 * Released under CC-BY
 *
 */

var s = 400;

var state = 0;
var mode = 1;
var party = true;

var img;

var flip = true;
var lastFlipFrame = 0;
var degCount = 0;

var spacerFlip = true;
var spacer = -50;

var lastBgFrame = 0;
var bgHues = new Array();

var glowCount = 0;
var glowCount2 = 100;
var glowCount3 = 200;
var lastGlowFlip = 0;
var glowFlip = true;

var shakeButton;
var partyButton;
var fortuneDiv;

var shakeX = 0;
var shakeY = 0;
var shakeFrame = 0;

var quotes_json;

function preload() {
  img = loadImage("images/piece.png");
  quotes_json = loadJSON("js/fab_ball_data.json");
}

function setup() {
	var myCanvas = createCanvas(s, s);
	myCanvas.parent('canvasContainer');
	frameRate(30);
	noStroke();

	shakeButton = createButton('SHAKE!!!');
	shakeButton.parent('buttonContainer');
	shakeButton.size(s);
 	shakeButton.mousePressed(shakePress);
	
	partyButton = createButton("Party Mode: On");
	partyButton.parent('buttonContainer');
	partyButton.size(s);
 	partyButton.mousePressed(partyPress);

 	fortuneDiv = createDiv("");
 	fortuneDiv.parent("fortuneContainer");

	for(var i=0; i<20; i++) {
		bgHues[i] = new Array();
		for(var j=0; j<20; j++) {
			bgHues[i][j] = random(0, 100);
		}
	}

}

function draw() {

	background(70, 70, 70);

	// party across all states
	if(mode == 1) {

		if(frameCount-lastBgFrame >= 30*0.1) {
			for(var i=0; i<20; i++) {
				for(var j=0; j<20; j++) {
					if(random(0,1) >= 0.5) bgHues[i][j] = random(0, 100);
				}
			}
			lastBgFrame = frameCount;
		}

		colorMode(HSB, 100);
		for(var i=0; i<20; i++) {
			for(var j=0; j<20; j++) {
				fill(bgHues[i][j], 100, 100);
				rect(50*i, 50*j, 50, 50);
			}
		}
		colorMode(RGB, 255);
	
	}

	if(state == 0) { // idle state
		if(mode == 0) {
			regIdle();
		} else if(mode == 1) {
			partyIdle();
		}
	} else if(state == 1) { // shake state
		
		shakeGen();

		if(mode == 0) {
			regShake();
		} else if(mode == 1) {
			partyShake();
		}

	}

}



// -- input

/*
function mouseReleased() {
	shakePress();
}
*/

function shakePress() {
	shakeButton.html("...");
	fortuneDiv.html("");
	shakeFrame = frameCount;
	degCount = 0;
	state = 1;
}

function partyPress() {
	
	if(party) {
		partyButton.html("Party Mode: Off");
		mode = 0;
	} else {
		partyButton.html("Party Mode: On");
		mode = 1;
	}

	party = !party;

}


// -- mode states

function regIdle() {

	if(frameCount-lastFlipFrame >= 30*5) {
		flip = !flip;
		lastFlipFrame = frameCount;
	}

	if(flip) {
		degCount += 5;
	} else {
		degCount -= 5;
	}

	if(frameCount-lastGlowFlip >= 30*0.5) {
		glowFlip = !glowFlip;
		lastGlowFlip = frameCount;
	}

	if(glowFlip) {
		glowCount += 8;
		glowCount2 += 10;
		glowCount3 += 20;
		if(glowCount > 255) glowCount = 255;
		if(glowCount2 > 220) glowCount2 = 220;
		if(glowCount3 > 200) glowCount3 = 200;
	} else {
		glowCount -= 8;
		glowCount2 -= 10;
		glowCount3 -= 20;
		if(glowCount < 50) glowCount = 50;
		if(glowCount2 < 70) glowCount2 = 70;
		if(glowCount3 < 90) glowCount3 = 90;
	}

	translate(200, 200);
	rotate(radians(degCount));

	push();
	  tint(0, 0, 0, glowCount);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9, 9);
	  tint(0, 0, 0, glowCount2);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9, 9);
	  tint(0, 0, 0, glowCount3);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
  pop();

}

function partyIdle() {

	if(frameCount-lastFlipFrame >= 30) {
		flip = !flip;
		lastFlipFrame = frameCount;
	}

	if(spacerFlip) {
		spacer--;
		if(spacer < -100) spacerFlip = !spacerFlip;
	} else {
		spacer++;
		if(spacer > 0) spacerFlip = !spacerFlip;
	}

	if(flip) {
		//background(255, 0, 0);
		degCount += 20;
		//degCount += (degCount/2)+0.001;//20;
		//if(degCount > 360) degCount = 0;
	} else {
		//background(0, 255, 0);
		degCount -= 20;
		//degCount -= (degCount/2)+0.001;//20;
		//if(degCount < 0) degCount = 360;
	}

	translate(200, 200);
	rotate(radians(degCount));

	push();
	  tint(80, 142, 91);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9+spacer, 9+spacer);
	  tint(181, 36, 43);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9+spacer, 9+spacer);
	  tint(34, 49, 82);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
  pop();

}

function regShake() {

	degCount += 25 + (degCount/100);

	if(frameCount-lastGlowFlip >= 30*0.5) {
		glowFlip = !glowFlip;
		lastGlowFlip = frameCount;
	}

	if(glowFlip) {
		glowCount += 8;
		glowCount2 += 10;
		glowCount3 += 20;
		if(glowCount > 255) glowCount = 255;
		if(glowCount2 > 220) glowCount2 = 220;
		if(glowCount3 > 200) glowCount3 = 200;
	} else {
		glowCount -= 8;
		glowCount2 -= 10;
		glowCount3 -= 20;
		if(glowCount < 50) glowCount = 50;
		if(glowCount2 < 70) glowCount2 = 70;
		if(glowCount3 < 90) glowCount3 = 90;
	}

	translate(200+shakeX, 200+shakeY);
	rotate(radians(degCount));

	push();
	  tint(0, 0, 0, glowCount);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9, 9);
	  tint(0, 0, 0, glowCount2);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9, 9);
	  tint(0, 0, 0, glowCount3);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
  pop();

}

function partyShake() {

	if(spacerFlip) {
		spacer--;
		if(spacer < -20) spacerFlip = !spacerFlip;
	} else {
		spacer++;
		if(spacer > 0) spacerFlip = !spacerFlip;
	}

	degCount += 30 + (degCount/100);
	
	translate(200+shakeX, 200+shakeY);
	rotate(radians(degCount));

	push();
	  tint(80, 142, 91);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9+spacer, 9+spacer);
	  tint(181, 36, 43);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
	  translate(9+spacer, 9+spacer);
	  tint(34, 49, 82);
	  image(img, -160, -80);
	  rotate((2/3)*PI);
  pop();

}

function shakeGen() {

	var r = floor(random(0, 4));
	
	switch(r) {
		case 0:
			shakeX = 20;
			shakeY = 0;
			break;
		case 1:
			shakeX = -20;
			shakeY = 0;
			break;
		case 2:
			shakeX = 0;
			shakeY = 20;
			break;
		case 3:
			shakeX = 0;
			shakeY = -20;
			break;
	}

	if(frameCount-shakeFrame >= 30*3) {
		shakeX = 0;
		shakeY = 0;
		shakeDone();
	}

}

function shakeDone() {

	var r = floor(random(0, quotes_json.results.length));
	var randomQuote = quotes_json.results[r];

	var quote = randomQuote.quote;
	var submitted = randomQuote.submittedby;

	if(submitted != "0") {
		fortuneDiv.html("" + quote + "<br><i>Submitted by: " + submitted + "</i>");
	} else {
		fortuneDiv.html(quote);
	}

	state = 0;
	degCount = 0;
	shakeButton.html("SHAKE!!!");
}
