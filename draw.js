Thing.prototype.draw = function(client, context) {
	client.drawRect(this.x,this.y,6,9, this.teamColor);
};


Marble.prototype.draw = function(client, context) {
	var size = 50;
	context.beginPath();
	context.arc(this.x, this.y, 0.5 * size, 0, 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();
	context.closePath();
}