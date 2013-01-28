var direction;

function SnakeGame() {

	// Setup the canvas, uses the html id established in
    // index.html
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    // Global variables
    var cellWidth = 10;
    var food;
    var score = 0;

    // Main game loop
    restart();
    gameLoop = setInterval(paintGame, 60);
    
    //-------- Start/Restart game--------//
    function restart() {
        direction = "right";
        score = 0;
        createSnake();
        createFood();
    }
    //-------- Create Snake ---------//
    function createSnake() {
        var length = 5;
        snakeArray = [];

        for (var i = length-1; i >= 0; i--) {
            snakeArray.push({x: i, y: 0});
        }
    }
    //-------- Create Food --------//
    function createFood() {
        food = {
            x: Math.round(Math.random() * (w - cellWidth)/cellWidth),
            y: Math.round(Math.random() * (h - cellWidth)/cellWidth)
        }
    }
    //-------- Paint Game----------//
    function paintGame() {

        // Paint canvas
        // Draw a rectangle to frame the canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        updateSnake();
        paintSnake();

        // Draw Food
        paintCell(food.x, food.y);
        paintScore();
    }
    //--------- Paint Score ------------//
    function paintScore() {
        var scoreText = "Score: " + score;
        ctx.fillText(scoreText, 5, h-5);
    }
    //--------- Paint Snake ------------//
    function paintSnake() {
        // Draw Snake
        for (var i = 0; i < snakeArray.length; i++) {
            var cell = snakeArray[i];
            paintCell(cell.x, cell.y);
        }
    }
    //--------- Update Snake -----------//
    function updateSnake() {
        // Update snake position
        var headX = snakeArray[0].x;
        var headY = snakeArray[0].y;

        // Move tail based on snake direction
        if (direction == "right")
            headX = snakeArray[0].x + 1;
        else if (direction == "left")
            headX = snakeArray[0].x - 1;
        else if (direction == "up")
            headY = snakeArray[0].y - 1;
        else if (direction == "down")
            headY = snakeArray[0].y + 1;

        // Check to see if we hit a wall/snake body
        if (headX == -1 || headY == -1 ||
            headX == w/cellWidth ||
            headY == h/cellWidth ||
            checkSnakeCollision(headX, headY, snakeArray)) {
            
            restart();
            return;
        }
        
        // Check to see if we are eating food
        var tail;
        if (headX == food.x && headY == food.y) {
            tail = {x: headX, y: headY};
            createFood();
            score++;
        }
        else {
            tail = snakeArray.pop();
            tail.x = headX;
            tail.y = headY;
        }
        // Put the new cell at the front of the snake
        snakeArray.unshift(tail);

    }
    //-------- Check Snake Collision ------//
    function checkSnakeCollision(x, y, body) {
        for (var i = 0; i < body.length; i++) {
            if (x == body[i].x && y == body[i].y)
                return true;
        }
        return false;
    }
    //--------- Paint Cell ---------------//
    function paintCell(x, y) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * cellWidth,
                     y * cellWidth,
                     cellWidth,
                     cellWidth);
        ctx.strokeStyle = "white"
        ctx.strokeRect(x * cellWidth,
                       y * cellWidth,
                       cellWidth,
                       cellWidth);
    }
}

SnakeGame.prototype.keydown = function(e) {
    var key = e.which;
    if (key == "37" && direction != "right")
        direction = "left";
    else if (key == "38" && direction != "down")
        direction = "up";
    else if (key == "39" && direction != "left")
        direction = "right";
    else if (key == "40" && direction != "up")
        direction = "down";
}