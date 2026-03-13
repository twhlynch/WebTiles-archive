document.getElementById('thumb').remove();

var container = document.getElementById('container');

var size = 14;

var cells = [];
var grid = [];

// init
for (var i = 0; i < size; i++) {
	grid[i] = [];
	cells[i] = [];
	for (var j = 0; j < size; j++) {
		var cell = document.createElement('div');
		cell.className = 'cell';
		container.appendChild(cell);

		cells[i][j] = cell;

		// random start
		grid[i][j] = Math.random() > 0.5;
		color(i, j, grid[i][j]);

		// drawing
		(function (i, j) {
			cell.addEventListener('pointermove', function () {
				grid[i][j] = true;
				color(i, j, true);
			});
		})(i, j);
	}
}

function color(i, j, v) {
	cells[i][j].style.backgroundColor = v ? 'black' : 'white';
}

function count_neighbors(i, j) {
	var neighbors = 0;

	for (var di = -1; di <= 1; di++) {
		for (var dj = -1; dj <= 1; dj++) {
			if (di === 0 && dj === 0) continue;

			var ni = i + di;
			var nj = j + dj;

			if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
				neighbors += grid[ni][nj];
			}
		}
	}

	return neighbors;
}

function update() {
	var new_grid = [];
	for (var i = 0; i < size; i++) {
		new_grid[i] = [];
		for (var j = 0; j < size; j++) {
			var live_neighbors = count_neighbors(i, j);

			// rules
			if (grid[i][j]) {
				new_grid[i][j] = live_neighbors === 2 || live_neighbors === 3;
			} else {
				new_grid[i][j] = live_neighbors === 3;
			}

			color(i, j, new_grid[i][j]);
		}
	}
	grid = new_grid;
}

setInterval(update, 500);
