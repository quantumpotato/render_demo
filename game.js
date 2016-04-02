"use strict";
class RenderDemo extends Game {
	resetGame() {
		super.resetGame();
		var blueMarble = new Marble({'color' : 'blue'});
		this.add('marbles', blueMarble);
	}

	loopKeyboardInput(key_map) {

	}
}

class RenderDemo2 extends Game {
	resetGame() {
		super.resetGame();
		console.log("demo 2");
		var redMarble = new Marble({'color' : 'red'});
		this.add('marbles', redMarble);
		console.log(this.things['marbles'][0].color);
	}

	loopKeyboardInput(key_map) {
		
	}
}

class Marble extends Thing {
	constructor(o) {
		super(o);
		this.x = 50;
		this.y = 50;
		this.color = o['color'];
	}
}