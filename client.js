"use strict";

class GameClient extends Client {
	installGame() {
		console.log("this.canvas" + this.canvas);
		this.game = new RenderDemo({'canvas': this.canvas});
		console.log("GAME" + this.game);
		Thing.prototype.scale = this.scale();
	}
}
