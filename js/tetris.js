var activePiece = {x:0,y:0,data:[],type:"",rotation:0};
var grid = [];
var cellWidth = 10;
var width, height;

function TetrisGame() {
	// Setup Canvas
	var canvas 	= $("#canvas")[0];
	var context = canvas.getContext("2d");
	width 	= $("#canvas").width();
	height 	= $("#canvas").height();

	// Start game
	restart();
	gameLoop = setInterval(paintGame, 120);

	function restart() {
		generatePiece();
		generateGrid();
	}

	function paintGame() {
		// Draw window
		context.fillStyle = "white";
		context.fillRect(0, 0, width, height);
		context.strokeStyle = "black";
		context.strokeRect(0, 0, width, height);

		updateActivePiece();
		drawActivePiece();
		drawGrid();
	}

	function generateGrid() {
		for (var i = 0; i < height/cellWidth; i++) {
			var row = [];
			for (var j = 0; j < width/cellWidth; j++) {
				row.push(0);
			}
			grid.push(row);
		}
	}

	function drawGrid() {
		for (var row = 0; row < height/cellWidth; row++) {
			for (var col = 0; col < width/cellWidth; col++) {
				if (grid[row][col] == 1) {
					drawCell(col, row);
				}
			}
		}
	}

	function updateGrid() {
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				if (activePiece.data[row][col] == 1) {
					grid[activePiece.y + row][activePiece.x + col] = 1;
				}
			}
		}
	}

	function cleanFullRow() {

		var clean = true;
		var cleanRow = [];

		for (var row = height/cellWidth - 1; row >= 0; row--) {
			for (var col = 0; col < width/cellWidth; col++) {
				if (grid[row][col] != 1)
					clean = false;
			}
			if (clean == true) {
				grid.splice(row, 1);
				grid.unshift(cleanRow);
			}
			clean = true;
		}
	}

	function updateActivePiece() {
		
		// Check collision with ground
		var bot = false;
		for (var row = 3; row >= 1; row--) {
			for (var col = 0; col < 4; col++) {
				if (activePiece.data[row][col] == 1) {
					if (activePiece.y + row == height/cellWidth - 1) {
						updateGrid();
						generatePiece();
						cleanFullRow();
						return;
					}
				}
			}
		}

		// Check collision with another piece
		for (var row = 3; row >= 1; row--) {
			for (var col = 0; col < 4; col++) {
				if (activePiece.data[row][col] == 1) {
					if (grid[activePiece.y + row + 1][activePiece.x + col] == 1) {
						updateGrid();
						generatePiece();
						cleanFullRow();
						return;
					}
				}
			}
		}
		
		activePiece.y++;


	}

	function drawActivePiece() {
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				if (activePiece.data[row][col] == 1) {
					drawCell(activePiece.x + col, activePiece.y + row);
				}
			}
		}
	}

	function drawCell(x, y) {
		context.fillStyle = "blue";
		context.fillRect(x * cellWidth,
					     y * cellWidth,
					     cellWidth,
					     cellWidth);
		context.strokeStyle = "white";
		context.strokeRect(x * cellWidth,
						   y * cellWidth,
						   cellWidth,
						   cellWidth);
	}

	function generatePiece() {
		var newPiece = {
			x: Math.round(width/cellWidth/2),
			y: 0,
			data: [],
			type: "",
			rotation: 0
		};

		var choice = Math.round(Math.random() * 6);
		
		switch (choice) {
			case 0:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 1, 1, 0]);
				newPiece.data.push([0, 1, 1, 0]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "square";
				break;
			case 1:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([1, 1, 1, 1]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "line";
				break;
			case 2:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 0, 1, 1]);
				newPiece.data.push([0, 1, 1, 0]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "s";
				break;
			case 3:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 1, 1, 0]);
				newPiece.data.push([0, 0, 1, 1]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "z";
				break;
			case 4:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 1, 1, 1]);
				newPiece.data.push([0, 1, 0, 0]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "l";
				break;
			case 5:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 1, 1, 1]);
				newPiece.data.push([0, 0, 0, 1]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "j";
				break;
			case 6:
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.data.push([0, 1, 1, 1]);
				newPiece.data.push([0, 0, 1, 0]);
				newPiece.data.push([0, 0, 0, 0]);
				newPiece.type = "t";
				break;
		}

		activePiece = newPiece;
	}
}

TetrisGame.prototype.keydown = function(e) {
	var key = e.which;
	if (key == "37") { // left
		checkCollision("left");
	}
	else if (key == "38") { // up
		rotateActivePiece();
	}	
	else if (key == "39") { // right
		checkCollision("right");
	}	
	else if (key == "40") { // down

	}


	function rotateActivePiece() {
		var newData = [];

		if (activePiece.type == "square") {
			return;
		}
		else if (activePiece.type == "line") {
			if (activePiece.rotation == 0) {
				activePiece.rotation = 1;
				
				newData.push([0, 0, 1, 0]);
				newData.push([0, 0, 1, 0]);
				newData.push([0, 0, 1, 0]);
				newData.push([0, 0, 1, 0]);
				
				activePiece.data = newData;
			}
			else {
				activePiece.rotation = 0;
				
				newData.push([0, 0, 0, 0]);
				newData.push([1, 1, 1, 1]);
				newData.push([0, 0, 0, 0]);
				newData.push([0, 0, 0, 0]);

				activePiece.data = newData;
			}
		}
		else {

			for (var col = 1; col < 4; col++) {
				var newRow = [];
				newRow.push(0);
				for (var row = 2; row >= 0; row--) {
					newRow.push(activePiece.data[row][col]);
				}
				newData.push(newRow);
			}
			newData.push([0, 0, 0, 0]);
			activePiece.data = newData;
		}
	}

	function checkCollision(direction) {
		var move = true;
		switch(direction){
			case "left":
				for (var col = 0; col < 4; col++) {
					for (var row = 0; row < 4; row++) {
						if (activePiece.data[row][col] == 1) {
							if ((activePiece.x + col) == 0 ||
								(grid[activePiece.y + row][activePiece.x + col - 1] == 1)) {
								move = false;
							}
						}
					}
				}

				if (move == true) {
					activePiece.x--;
					return;
				}

			break;
			case "right":
				for (var col = 3; col >= 0; col--) {
					for (var row = 0; row < 4; row++) {
						if (activePiece.data[row][col] == 1) {
							if ((activePiece.x + col) == width/cellWidth - 1 ||
								(grid[activePiece.y + row][activePiece.x + col + 1] == 1)) {
								move = false;
							}
						}
					}
				}
				if (move == true) {
					activePiece.x++;
					return;
				}
			break;
		}
	}
}