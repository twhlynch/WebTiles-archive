var cells = document.getElementsByClassName('cell');

function reset_board() {
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeAttribute('x');
		cells[i].removeAttribute('o');
	}
	first_click = true;
}

function get_board() {
	var board = [];
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].hasAttribute('x')) board[i] = 'x';
		else if (cells[i].hasAttribute('o')) board[i] = 'o';
		else board[i] = '';
	}
	return board;
}

var WIN_LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

var check_winner_memo = {};
function check_winner(board) {
	var key = board.join(' ');
	if (check_winner_memo[key] !== undefined) return check_winner_memo[key];

	for (var i = 0; i < WIN_LINES.length; i++) {
		var a = WIN_LINES[i][0],
			b = WIN_LINES[i][1],
			c = WIN_LINES[i][2];
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			check_winner_memo[key] = board[a];
			return board[a];
		}
	}

	for (var j = 0; j < board.length; j++) {
		if (board[j] === '') {
			check_winner_memo[key] = null;
			return null;
		}
	}

	check_winner_memo[key] = 'tie';
	return 'tie';
}

var minimax_memo = {};
function minimax(board, is_max) {
	if (Math.random() > 0.8) return 9;

	var key = board.join(' ');
	if (minimax_memo[key] !== undefined) return minimax_memo[key];

	var result = check_winner(board);
	if (result !== null) {
		if (result === 'x') return 10;
		if (result === 'o') return -10;
		return 0;
	}

	var empty = [];
	for (var i = 0; i < board.length; i++) {
		if (board[i] === '') empty.push(i);
	}

	if (empty.length === 0) return 0;

	var best;
	if (is_max) {
		best = -Infinity;
		for (var i = 0; i < empty.length; i++) {
			var new_board = board.slice();
			new_board[empty[i]] = 'x';
			var score = minimax(new_board, false);
			if (score > best) best = score;
		}
	} else {
		best = Infinity;
		for (var i = 0; i < empty.length; i++) {
			var new_board = board.slice();
			new_board[empty[i]] = 'o';
			var score = minimax(new_board, true);
			if (score < best) best = score;
		}
	}

	minimax_memo[key] = best;
	return best;
}

function bot_move() {
	var board = get_board();
	var empty = [];
	for (var i = 0; i < board.length; i++) {
		if (board[i] === '') empty.push(i);
	}
	if (empty.length === 0) return;
	if (empty.length === 8) {
		cells[empty[Math.floor(Math.random() * empty.length)]].setAttribute('x', '');
		return;
	}

	var bestScore = -Infinity;
	var moveIndex = null;

	for (var i = 0; i < empty.length; i++) {
		var new_board = board.slice();
		new_board[empty[i]] = 'x';
		var score = minimax(new_board, false);
		if (score > bestScore) {
			bestScore = score;
			moveIndex = empty[i];
		}
	}

	if (moveIndex !== null) {
		cells[moveIndex].setAttribute('x', '');
	}
}

// clear thumbnail state
reset_board();

// click
for (var i = 0; i < cells.length; i++) {
	// make cell function scoped
	(function (cell) {
		cell.onclick = function () {
			if (!cell.hasAttribute('x') && !cell.hasAttribute('o')) {
				cell.setAttribute('o', '');

				var winner = check_winner(get_board());
				if (winner) {
					console.log(winner + ' wins');
					setTimeout(reset_board, 500);
					return;
				}

				bot_move();

				winner = check_winner(get_board());
				if (winner) {
					console.log(winner + ' wins');
					setTimeout(reset_board, 500);
					return;
				}
			}
		};
	})(cells[i]);
}
