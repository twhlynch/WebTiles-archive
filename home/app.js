var canvas1 = document.getElementById('buffer1');
var canvas2 = document.getElementById('buffer2');

var dim = canvas1.width * 1.4;
canvas1.width = dim;
canvas2.width = dim;
canvas1.height = dim;
canvas2.height = dim;

var w = canvas1.width;
var h = canvas1.height;

var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');

canvas1.style.display = 'block';
canvas2.style.display = 'none';

var canvas = canvas1;
var ctx = ctx1;

// globals
var count = 15;
var max_connections = 3;
var particles = [];

// particles
function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.vx = (Math.random() - 0.5) * 3;
	this.vy = (Math.random() - 0.5) * 3;
}

for (var i = 0; i < count; i++) {
	particles.push(new Particle(Math.random() * w, Math.random() * h));
}

// helpers
function dist(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

// swap buffers
var canvas1_style = canvas1.style;
var canvas2_style = canvas2.style;
function swap() {
	if (canvas === canvas1) {
		canvas1_style.display = 'block';
		canvas2_style.display = 'none';
		canvas = canvas2;
		ctx = ctx2;
	} else {
		canvas2_style.display = 'block';
		canvas1_style.display = 'none';
		canvas = canvas1;
		ctx = ctx1;
	}
}

function update() {
	// clear
	ctx.fillStyle = '#000c';
	ctx.fillRect(0, 0, w, h);

	// update and draw
	ctx.fillStyle = 'white';
	ctx.lineWidth = 1;

	for (var i = 0; i < count; i++) {
		// update
		var p = particles[i];
		p.x += p.vx;
		p.y += p.vy;

		if (p.x < 0 || p.x > w) p.vx *= -1;
		if (p.y < 0 || p.y > h) p.vy *= -1;

		// draw
		var p = particles[i];

		ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);

		// nearest connections
		var connections = 0;
		for (var j = i + 1; j < count && connections < max_connections; j++) {
			var q = particles[j];
			var d = dist(p, q);
			if (d < 100) {
				ctx.strokeStyle = 'rgba(255,255,255,' + (1 - d / 100) + ')';
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(q.x, q.y);
				ctx.stroke();
				connections++;
			}
		}
	}

	swap(); // swap buffers
	setTimeout(update, 0);
}

update();
