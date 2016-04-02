"use strict";

class Game {
	constructor(options) {
		this.canvas = options['canvas'];
		this.resetBoard();
		this.resetGame();
		this.installGroupLoops();
		this.installSounds();
	}

	installSounds() {
		
	}

	installGroupLoops() {
		this.loopForGroup = {};
	}

	setupPlayers() {
		this.players = {};
	}

	resetBoard() {
		this.board = [];
		this.things = {};
	}

	resetGame() {
		this.resetBoard();
		this.setupPlayers();
	}

	add(group_name, thing) {
		if (!this.things[group_name]) {
			this.things[group_name] = [];
		}

		var group = this.things[group_name];
	
		group.push(thing);
	}


	destroyThings(to_destroy, group_name) {
		var group = this.things[group_name];
		if (!group) {
			return [];
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var index = group.indexOf(to_destroy[i]);
			
			if (index >= 0) {
				group.splice(index, 1);
			}
		}
		
		return group;
	}

	outOfBounds(group_name, thing) {
 		return thing.x < -10 || thing.y < -10 || thing.x > this.canvas.width || thing.y > this.canvas.height;
	}

	groupNames() {
		return Object.keys(this.things);		
	}

	handleOutOfBounds(group_name, thing) {
		thing.gone = true;
	}

	shouldDestroyThing(group_name, thing) {
		return false;
	}

	checkBounds(group_name, thing) {
		if (this.outOfBounds(group_name, thing)) {
			this.handleOutOfBounds(group_name, thing);
		}
	}

	groupLoop(group_name) {
		var to_destroy = [];

		var group = this.things[group_name];
		if (group == undefined) {
			return;
		}

		for (var i = 0; i < group.length; i++) {
			var thing = group[i];
			if (thing.active === true) {
				thing.loop();
				if (this.loopForGroup[group_name]) {
					thing = this.loopForGroup[group_name](thing, this);
				}
				thing.afterLoop();	
			}

			this.checkBounds(group_name, thing);

			if (this.shouldDestroyThing(group_name, thing)) {
				thing.gone = true;
			}

			if (thing.gone) {
				to_destroy.push(thing);
			}

			if (thing.endedRound) {
				return;
			}
		}

		group = this.destroyThings(to_destroy, group_name);			
		this.things[group_name] = group;
	}

	loop() {
		var group_names = this.groupNames();

		for (var group_index = 0; group_index < group_names.length; group_index++) {

			this.groupLoop(group_names[group_index]);
		}
	}

	destroyThingsInRadius(group_name, point, radius) {
		var things = this.things[group_name];
		if (!things) {
			return;
		}
		for (var i = 0; i < things.length; i++) {
			var thing = things[i];
			if (getDistance(thing.position(), point) <= radius) {
				thing.gone = true;
			}
		}
	}

	onMoveComplete(req) {
		this.announceMove(req);
		this.evaluateResolution();
	}

	evaluateResolution() {
		//override
	}

	onKeyUp(key) {
	}

	onKeyDown(key) {

	}

	onMouseUp(x, y) {

	}

	onMouseDown(x, y) {

	}

}

class Thing {
	constructor(options) {
		if (options && options['position']) {
			this.x = options['position'].x;
			this.y = options['position'].y;
		} else {
			this.x = 2.0;
			this.y = 2.0;	
		}
		
		this.mx = 0.0;
		this.my = 0.0;
		this.active = true;
	}

	speedMod() {
		return 1.0;
	}

	move() {
		var total = Math.abs(this.mx) + Math.abs(this.my);
		if (total <= 0) {
			return;
		}
		var xx = this.mx / total * this.speedMod();
		var yy = this.my / total * this.speedMod();
		this.x = this.x + xx * this.speed();
		this.y = this.y + yy * this.speed();
	}

	loop() {
		this.move();
	}	

	afterLoop() {

	}

	speed() {
		return 1.0;
	}

	position() {
		return {'x' : this.x, 'y' : this.y};
	}
}



