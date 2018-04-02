var score = 0;
function setScore( s ) {
    score = s;
    updateScore( score );
}

// Base character for any moving sprite
var GameCharacter = function(spriteImg) {
    this.x = 0;
    this.y = 0;
    this.sprite = spriteImg;
};

// current column of the sprite
GameCharacter.prototype.col = function() {
    return pxToCols(this.x);
};

// current row of the sprite
GameCharacter.prototype.row = function() {
    return pxToRows(this.y);
};

// lower column boundary of the sprite
GameCharacter.prototype.minCol = function() {
    return pxToCols(this.xBounds[0]);
};

// upper column boundary of the sprite
GameCharacter.prototype.maxCol = function() {
    return pxToCols(this.maxX());
};

// upper pixel boundary of the sprite
GameCharacter.prototype.maxX = function() {
    return this.xBounds[1];
};

// lower row boundary of the sprite
GameCharacter.prototype.minRow = function() {
    return pxToRows(this.yBounds[0]);
};

// upper row boundary of the sprite
GameCharacter.prototype.maxRow = function() {
    return pxToRows(this.yBounds[1]);
};

// move to the x, y coordinates of the passed row and column
GameCharacter.prototype.moveTo = function(col, row) {
    this.x = colsToPx(col);
    this.y = rowsToPx(row) + rowOffset;
};

// move the sprite up or down by the difference
GameCharacter.prototype.moveUpOrDown = function(deltaC) {
    this.x += colsToPx(deltaC);
};

// move left or right by the difference
GameCharacter.prototype.moveLeftOrRight = function(deltaR) {
    this.y += rowsToPx(deltaR);
};

// Set a boundary for the sprite
GameCharacter.prototype.setEdges = function(colEdges, rowEdges) {
    if (colEdges !== undefined) {
        this.xBounds = [colsToPx(colEdges[0]), colsToPx(colEdges[1])];
    }
    // It's not necessary to set a row boundary for the enemy sprite
    if (rowEdges !== undefined) {
        this.yBounds = [rowsToPx(rowEdges[0]), rowsToPx(rowEdges[1])];
    }
};

// check whether this sprite is within a collision range of the passed other GameCharacter.
GameCharacter.prototype.hasCollided = function(otherGameCharacter) {
    var xCollided = Math.abs(this.x - otherGameCharacter.x) < colSize / 2;
    var yCollided = Math.abs(this.y - otherGameCharacter.y) < rowSize / 2;
    return xCollided && yCollided;
};

// Draws this sprite
GameCharacter.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemies our player must avoid
var Enemy = function() {
    const sprite_path = "images/enemy-bug.png";
    GameCharacter.call(this, sprite_path);
    this.setEdges([-1, 5]);
};

Enemy.prototype = Object.create(GameCharacter.prototype);
Enemy.prototype.constructor = Enemy;

// respawn the enemy
Enemy.prototype.respawn = function () {
    var scoreMultiplier = 0.5 * Math.pow( 2, score / 2 );
    this.speed = colsToPx( scoreMultiplier * Math.random() * 2 + 1 ); // make the speed of the enemy change

    this.moveTo( -1, Math.floor( Math.random() * 3 ) + 1 );
};

// Updates the state of the Enemy
Enemy.prototype.update = function(dt) {
    var delta_x = this.speed * dt;
    if (this.x + delta_x > this.maxX()) {
        this.respawn();
    } else {
        this.x += delta_x;
    }
};


//

//


// Player class
var Player = function () {
    const sprite_path = "images/char-boy.png";
    GameCharacter.call(this, sprite_path);
    this.setEdges([0, 4], [0, 4]);
};

Player.prototype = Object.create(GameCharacter.prototype);
Player.prototype.constructor = Player;

// This respawns the player to their origin
Player.prototype.respawn = function() {
    this.moveTo(2, 5);
};

// Handles input to the game.
// Acceptable inputs are up, down, left, and right, and the sprite checks to see
// if it has room to move in that direction without going out of bounds then
// executes the movement.
// Finally, it also checks to see if the movement would be in to the water - a win -
// and resets the player instead of letting them get wet.
Player.prototype.handleInput = function (keyCode) {
    switch (keyCode) {
        case "left":
            if (this.col() > this.minCol()) {
                this.moveUpOrDown(-1);
            }
            break;
        case "right":
            if (this.col() < this.maxCol()) {
                this.moveUpOrDown(1);
            }
            break;
        case "up":
            console.log(this.row());
            console.log(this.minRow());
            console.log(this.row() > this.minRow());
            if (this.row() === 0) {
                setScore(score+1);
                this.respawn();
            } else {
                if (this.row() > this.minRow()) {
                    console.log("shifting");
                    this.moveLeftOrRight(-1);
                }
            }
            break;
        case "down":
            if (this.row() < this.maxRow()) {
                this.moveLeftOrRight(1);
            }
            break;
    }
};

// Updates the state of the player object.
Player.prototype.update = function () {
    allEnemies.forEach(function (enemy) {
        if (this.hasCollided(enemy)) {
            console.log("collided");
            setScore(0);
            this.respawn();
        }
    }, this);
};


allEnemies = [new Enemy(), new Enemy(), new Enemy()];
allEnemies.forEach(function (enemy) {
    enemy.respawn();
});

player = new Player();
player.respawn();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
