// https://mrdoob.com/lab/javascript/effects/solitaire/

document.getElementById('text').remove();
document.getElementById('thumb').remove();

var canvas = document.getElementById('buffer1');
var ctx = canvas.getContext('2d');
canvas.width *= 1.6;
canvas.height = canvas.width;
console.log(canvas.width, canvas.height);

var id = 52;

var width = 71;
var height = 96;

var widthhalf = width / 2;
var heighthalf = height / 2;

var particles = [];

function Particle(id, x, y, sx, sy) {
	if (sx === 0) sx = 2;

	var cx = (id % 4) * width;
	var cy = Math.floor(id / 4) * height;

	this.update = function () {
		x += sx;
		y += sy;

		if (x < -widthhalf || x > canvas.width + widthhalf) {
			var index = particles.indexOf(this);
			particles.splice(index, 1);

			return false;
		}

		if (y > canvas.height - heighthalf) {
			y = canvas.height - heighthalf;
			sy = -sy * 0.85;
		}

		sy += 0.98;

		ctx.drawImage(image, cx, cy, width, height, Math.floor(x - widthhalf), Math.floor(y - heighthalf), width, height);

		return true;
	};
}

var image = document.getElementById('cards');

function throwCard(x, y) {
	id > 0 ? id-- : (id = 51);

	var particle = new Particle(id, x, y, Math.floor(Math.random() * 6 - 3) * 2, -Math.random() * 16);
	particles.push(particle);
}

image.parentElement.addEventListener('click', function (event) {
	throwCard(event.offsetX * 1.6 * 1.2, event.offsetY * 1.6);
});

function animate() {
	var i = 0,
		l = particles.length;

	while (i < l) {
		particles[i].update() ? i++ : l--;
	}
}

function update() {
	animate();

	setTimeout(update, 1000 / 60);
}

update();
