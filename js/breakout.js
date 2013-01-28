var player;

function BreakoutGame() {

	// Setup Canvas
	var canvas 	= $("#canvas")[0];
	var context = canvas.getContext("2d");
	var width 	= $("#canvas").width();
	var height 	= $("#canvas").height();

	// Constants
	var cellWidth = 10;
	var targetWidth = width/cellWidth;
	var targetHeight = 10;
	var projectileSpeed = .1;

	// Globals
	targets = [];
	var projectile;

	// Start game
	restart();
	gameLoop = setInterval(paintGame, 10);

	function restart() {
		createBar();
		createTargets();
		createProjectile();
	}

	function paintGame() {

		// Draw window
		context.fillStyle = "white";
		context.fillRect(0, 0, width, height);
		context.strokeStyle = "black";
		context.strokeRect(0, 0, width, height);

		drawBar();
		drawTargets();
		drawProjectile();
		updateProjectile();
		
	}

	function drawTargets() {
		for (var j = 0; j < targetHeight; j++) {
			for (var i = 0; i < targetWidth; i++) {
				if (targets[j][i].alive == true) {
					drawCell(targets[j][i].x, targets[j][i].y);
				}
			}
		}
	}

	function createBar() {

		player = {x: 5, y: 40, length: 5};
	}

	function createTargets() {

		for (var j = 0; j < targetHeight; j++) {
			var row = [];
			for (var i = 0; i < targetWidth; i++) {
				row.push(
					{x: i, y: j, alive: true}
				);
			}
			targets.push(row);
		}
	}

	function createProjectile() {
		var dirX = Math.round(Math.random() * 2) - 1;
		var dirY = Math.round(Math.random() * 2) - 1;

		if (dirX > 0)
			dirX = 1;
		else
			dirX = -1;
		if (dirY > 0)
			dirY = 1;
		else 
			dirY = -1;

		projectile = {
			x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
			y: Math.round((height / 2) / cellWidth),
			dirX: dirX,
			dirY: dirY
		};
		console.info(projectile.dirX + " " + projectile.dirY);
	}

	function updateProjectile() {
		// Check world collision
		if (projectile.x <= 0 || projectile.x + 1 >= width/cellWidth) {
			projectile.dirX = -projectile.dirX;
		}
		else if (projectile.y <= 0) {
			projectile.dirY = -projectile.dirY;
		}
		else if (projectile.y + 1 >= height/cellWidth) {
			restart();
		}
		else {
			// Check bar collision
			if (projectile.y + 1 >= player.y && projectile.y <= player.y + player.length) {
				if (projectile.x <= player.x + player.length && projectile.x + 1 >= player.x) {
					projectile.dirY = -projectile.dirY;
					
					projectile.x += projectile.dirX * projectileSpeed;
					projectile.y += projectile.dirY * projectileSpeed;
					return;
				}
			}
			
			// Check target collision
			for (var j = targetHeight - 1; j >= 0; j--) {
				for (var i = 0; i < targetWidth; i++) {
					if (targets[j][i].alive == true) {
						if (checkCollision(projectile, targets[j][i])) {

							//projectile.dirY = -projectile.dirY;
							
							var checkLeft = {x: projectile.x - projectile.dirX, y: projectile.y};
							//checkLeft.x -= projectile.dirX;
							if (checkCollision(checkLeft, targets[j][i])) {
								projectile.dirY = -projectile.dirY;
							}
							else {
								projectile.dirX = -projectile.dirX;
							}
							
							targets[j][i].alive = false;
	
							projectile.x += projectile.dirX * projectileSpeed;
							projectile.y += projectile.dirY * projectileSpeed;
							return;
						}
					}
				}
			}
		}

		projectile.x += projectile.dirX * projectileSpeed;
		projectile.y += projectile.dirY * projectileSpeed;
	}

	function checkCollision(proj, target) {
		if (proj.y + 1 < target.y || proj.y > target.y + 1) {
			return false;
		}
		if (proj.x > target.x + 1 || proj.x + 1 < target.x) {
			return false;
		}
		return true;
	}

	function drawProjectile() {
		drawCell(projectile.x, projectile.y);
	}

	function drawBar() {
		for (var i = 0; i < player.length; i++) {
			drawCell(player.x + i, player.y);
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
}

BreakoutGame.prototype.keydown = function(e) {
	var key = e.which;
	if (key == "37") { // left
		player.x -= 1;
	}
	else if (key == "39") { // right
		player.x += 1;
	}
}