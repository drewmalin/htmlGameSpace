$(document).ready (
	function() {

		//---------- Global Variables ---------//
		var canvas, context, gameApp;
		var width = 0, height = 0;
		var stylePadLeft, stylePadTop, styleBorderLeft, styleBorderTop;

		var game = getUrlVars()["gameName"];
		runSelectedGame(game);

		function runSelectedGame(game) {
			if (typeof game !== 'undefined' && game) {
				switch(game) {
					case "snake":
						gameApp = new SnakeGame();
						document.getElementById("infoBar").innerHTML = 
						"\<strong\>Snake\<\/strong\>\<br\>Controls: Up, Left, Right, and Down arrow keys";
						break;
					case "breakout":
						gameApp = new BreakoutGame();
						document.getElementById("infoBar").innerHTML = 
						"\<strong\>Breakout\<\/strong\>\<br\>Controls: Left and Right arrow keys";
						break;
					case "tetris":
						gameApp = new TetrisGame();
						document.getElementById("infoBar").innerHTML = 
						"\<strong\>Tetris\<\/strong\>\<br\>Controls: Up, Left, Right, and Down arrow keys";
						break;
					default:
						alert("Error! Game not found!");
				}
			}
		}

		$(document).keydown(
            function(e) {
           		if (typeof game !== 'undefined' && game) {
           			gameApp.keydown(e);
				}
            }
        )
		
		function getUrlVars() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
				function(m, key, value) {
					vars[key] = value;
				});
			return vars;
		}
	}
)