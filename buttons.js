var button1 = document.getElementById('button1');
button1.addEventListener("click", clicked1);

var button2 = document.getElementById('button2');
button2.addEventListener("click", clicked2);

function clicked1(event) {
	var target = event.srcElement || event.currentTarget || event.target;
	window.client.game = new RenderDemo({'canvas' : window.client.canvas});
};

function clicked2(event) {
	var target = event.srcElement || event.currentTarget || event.target;
	window.client.game = new RenderDemo2({'canvas' : window.client.canvas});
}
