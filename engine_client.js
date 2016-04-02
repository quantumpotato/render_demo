"use strict";

class Client {
	styleCanvas(canvas) {
		var context = canvas.getContext('2d');
		context.textAlign = 'center';
		context.font = '30pt Courier New';
	}

	scale() {
		return 1.0;
	}

	generateCanvas() {
		var canvas = document.createElement("canvas");

		canvas.width = 600 * this.scale();
		canvas.height = 600 * this.scale();
		//canvas = 
		this.styleCanvas(canvas);	
		return canvas;
	}

	installRendering() {
		this.installCanvas();
		this.installBuffer();
	}

	installCanvas() {
		this.canvas = this.generateCanvas();
		var game_container = document.getElementById("game_container");
		console.log(document.getElementsByClassName("canvas"));
		if (document.getElementsByClassName("canvas").length > 0) {
			var element = document.getElementsByClassName("canvas")[0]
			console.log("REMOVING");
			element.parentNode.removeChild(element);
		}
		document.getElementById("game_container").appendChild(this.canvas); 
	}

	installBuffer() {
//		this.buffer = this.generateCanvas();
	}

	installInput() {
		this.installMouseInput();
		this.installKeyboardInput();
	}

	installMouseInput() {
		this.canvas.addEventListener("click", this.onMouseDown.bind(this), false);
	}

	installKeyboardInput() {
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		this.key_pressed_map = [];

		this.key_map = {
			37: 'L1',
			38: 'U1',
			39: 'R1',
			40: 'D1',
			16: 'A1',	
			83: 'L2',
			69: 'U2',
			68: 'D2',
			70: 'R2',
			90: 'A2',

			49: 'DEBUG1',
			50: 'DEBUG2',
			51: 'DEBUG3',
			52: 'DEBUG4'
			

		}
	}

	installTime() {
		this.now, this.dt, this.last = Date.now();
		this.dt = 0.00;

		this.rate = 10;
	}


	installLoops() {
		window.requestAnimationFrame(this.loop.bind(this));
	}

	constructor(options) {
		this.installRendering();
		this.installInput();
		this.installGame()
		this.installTime();
		this.installLoops();
	}

	loop() {
		this.now = Date.now();
		var delta  = this.now - this.last;
		this.last = this.now;

		this.dt = this.dt + delta;

		if (this.dt < this.rate) {
			window.requestAnimationFrame(this.loop.bind(this));
			return;
		}

		this.game.loop(delta);
		this.draw();
		this.dt = 0; //-= delta;
		this.loopInput();

		window.requestAnimationFrame(this.loop.bind(this));
	}

	loopGamepadInput() {
		var pads = navigator.getGamepads();

		if (pads) {
			for (var i = 0; i < pads.length; i++) {
				var gp = pads[i];	
				if (!gp) {
					break;
				}
				var x = gp.axes[0];
				
	    	var y = gp.axes[1];
	    	x = (x > 0.1 || x < -0.1) ? x : 0;
	    	y = (y > 0.1 || y < -0.1) ? y : 0;

	    	if (x == 0 && y == 0) {
	    		x = gp.axes[2];
	    		y = gp.axes[3];

	    		x = (x > 0.1 || x < -0.1) ? x : 0;
	    		y = (y > 0.1 || y < -0.1) ? y : 0;
	    	}

	    	if (x > 0.9) {
	    		x = 1.0;
	    	} else if (x < -0.9) {
	    		x = -1.0;
	    	}

	    	if (y > 0.9) {
	    		y = 1.0;
	    	} else if (y < -0.9) {
	    		y = -1.0;
	    	}

				var input = {'x' : x, 'y': y, 'buttons' : gp.buttons};
				input = interpolateGamepad(input);
	    	if (usingGamepad(input)) {
	    		this.game.parseGamepadInput(i, input);		
	    	}	    	
			}
		}
			
	}

	loopInput() {
		this.game.loopKeyboardInput(this.key_pressed_map);
		this.loopGamepadInput();
	}

	draw() {
		this.setBackground();

		var group_names = this.game.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {
			var group = this.game.things[group_names[group_index]];

			for (var i = 0; i < group.length; i++) {
				var thing = group[i];
				if (thing.active) {
					thing.draw(this, this.context());
				}
			}

		}

		
	}

	context() {
		return this.canvas.getContext('2d');
	}

	drawRect(x,y,w,h, colour) {
		this.context().fillStyle = colour;
		this.context().fillRect(x,y,w,h)
	}

	setBackground() {
		this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
		this.context().fillStyle = "black";
		this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
	}


	installGame() {

	}

	onKeyUp(event) {
		this.key_pressed_map[this.key_map[event.keyCode]] = false;
	}

	onKeyDown(event) {
		// event.preventDefault();
		this.key_pressed_map[this.key_map[event.keyCode]] = true;
	}

	onMouseUp(event) {
		var x = event.layerX;
		var y = event.layerY;
		this.game.onMouseUp(x, y);
	}

	onMouseDown(event) {
		var x = event.layerX;
		var y = event.layerY;
		this.game.onMouseDown(x, y);
	}
}
