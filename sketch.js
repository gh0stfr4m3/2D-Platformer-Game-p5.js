// Global Variable Declarations
let gameChar_x;
let gameChar_y;
let floorPos_y;
let isLeft = false;
let isRight = false;
let isFalling = false;
let isPlummeting = false;
let collectables = [];
let canyons = [];
let isFound = false;
let collectableDistance;
let trees_x;
let clouds;
let mountains;
let cameraPosX = 0;
let collectSound;
let jumpSound;
let deathSound;
let moonX;
let moonY;
let gameScore = 0;
let flagpole;
let lives;
let flagDistance;
let emit;
let platforms;
let enemies;
let bullets = [];
let timeLimit = 60;
let startTime;
let timeRemaining;
let timePassed;
let gameActive = true;
let timeSoundPlayed = false;
let stars = [];

// Sound Effects
function preload() {
    backgroundMusic = loadSound("assets/Background_Music.mp3");
    collectSound = loadSound("assets/Collectable_Item_Sound.wav");
    jumpSound = loadSound("assets/Jump_Sound.wav");
    deathSound = loadSound("assets/Death_Sound.wav");
    levelComplete = loadSound("assets/Level_Complete_Sound.mp3");
    myFont = loadFont("assets/myFont.otf");
    timeSound = loadSound("assets/Time_Sound.mp3");
}

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 3; // Character Lives
    startGame(); // Call The startGame() Function
    startTime = millis(); // Store The Start Time Of The Game
    backgroundMusic.loop(); // Loop The Sound
    backgroundMusic.setVolume(0.2); // Adjust Volume
    myStars(); // Call The myStars() Function
}

function draw() {
    // Time Limit
    if (gameActive && !flagpole.isReached) {
        timePassed = floor((millis() - startTime) / 1000); // Calculate Time That Has Passed
        timeRemaining = timeLimit - timePassed; // Calculate Remaining Time
        if (timeRemaining == 0) { // If Time Runs Out, End The Game & Set Lives To 0
            gameActive = false;
            lives = 0;
            deathSound.play(); // Play deathSound When Time Runs Out
        }

        if (timeRemaining <= 3 && !timeSoundPlayed) {
            timeSound.play(); // Play timeSound
            backgroundMusic.stop(); // Stop The Background Music
            timeSoundPlayed = true;
        }
    }

    cameraPosX = gameChar_x - width / 2; // Adjust Camera Position

    background(50, 50, 50); // Sky
    noStroke();

    // Grass
    fill("#3E6B3F");
    rect(0, floorPos_y, width, height - floorPos_y);
    fill("#2E4A2F");
    rect(0, floorPos_y, width, 8);
    
    push();
    translate(-cameraPosX, 0);

    drawStars(); // Call The drawStars() Function

    // Moon
    moonX = 217 + cameraPosX; // Stationary Moon
    moonY = 81;
    fill(220, 20, 60);
    ellipse(moonX, moonY, 50, 50);
    fill(50, 50, 50);
    ellipse(moonX + 13, moonY - 10, 50, 50);

    // Clouds
    drawClouds();

    // Mountains
    drawMountains();

    // Trees
    drawTrees();

    // Canyons
    for (let i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    // Collectable Items
    for (let i = 0; i < collectables.length; i++) {
        drawCollectable(collectables[i]);
        checkCollectable(collectables[i]);
    }

    // Flagpole
    drawFlagpole();
    checkFlagpole();

    // Platforms
    for (let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    // Enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();

        let isContact = enemies[i].checkEnemy(gameChar_x, gameChar_y);

        if (isContact) {
            if (lives > 0) {
                lives--
                deathSound.play();
                startGame();
                break;
            }
        }
    }

    updateBullets(); // Call The updateBullets() Function
    
    if (lives > 0) {
        // Game Character
        if (isLeft && isFalling) {
            // Jumping To The Left
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 19, gameChar_y - 45, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x - 8, gameChar_y - 55, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x - 13, gameChar_y - 55, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 15, gameChar_y - 15, 10, 15);
            rect(gameChar_x, gameChar_y - 15, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 18, gameChar_y - 3, 13, 8);
            rect(gameChar_x - 3, gameChar_y - 3, 13, 8);

        } else if (isRight && isFalling) {
            // Jumping To The Right
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 11, gameChar_y - 45, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x + 8, gameChar_y - 55, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x + 13, gameChar_y - 55, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 10, gameChar_y - 15, 10, 15);
            rect(gameChar_x + 5, gameChar_y - 15, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 10, gameChar_y - 3, 13, 8);
            rect(gameChar_x + 5, gameChar_y - 3, 13, 8);

        } else if (isLeft) {
            // Walking Left
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 19, gameChar_y - 50, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x - 8, gameChar_y - 62, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x - 13, gameChar_y - 62, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 15, gameChar_y - 20, 10, 15);
            rect(gameChar_x - 5, gameChar_y - 20, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 20, gameChar_y - 8, 25, 8);

        } else if (isRight) {
            // Walking Right
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 11, gameChar_y - 50, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x + 8, gameChar_y - 62, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x + 13, gameChar_y - 62, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 5, gameChar_y - 20, 10, 15);
            rect(gameChar_x + 5, gameChar_y - 20, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 5, gameChar_y - 8, 25, 8);

        } else if (isFalling || isPlummeting) {
            // Jumping Facing Forward
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 15, gameChar_y - 45, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x, gameChar_y - 55, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x - 5, gameChar_y - 55, 5);
            ellipse(gameChar_x + 5, gameChar_y - 55, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 15, gameChar_y - 15, 10, 15);
            rect(gameChar_x + 5, gameChar_y - 15, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 18, gameChar_y - 3, 13, 8);
            rect(gameChar_x + 5, gameChar_y - 3, 13, 8);

        } else {
            // Standing Front Facing
            noStroke();
            // Body
            fill("#008080");
            rect(gameChar_x - 15, gameChar_y - 50, 30, 30, 5);
            // Face
            fill("#FFDBAC");
            ellipse(gameChar_x, gameChar_y - 62, 25);
            // Eyes
            fill(0);
            ellipse(gameChar_x - 5, gameChar_y - 62, 5);
            ellipse(gameChar_x + 5, gameChar_y - 62, 5);
            // Legs
            fill("#1E1E1E");
            rect(gameChar_x - 12, gameChar_y - 20, 10, 15);
            rect(gameChar_x + 2, gameChar_y - 20, 10, 15);
            // Feet
            fill("#8B4513");
            rect(gameChar_x - 15, gameChar_y - 8, 13, 8);
            rect(gameChar_x + 2, gameChar_y - 8, 13, 8);
        }
    }

    pop();

    if (lives < 1 || timeRemaining == 0) { // If Character Has No Lives Left Or Has No Time Left, Display "Game Over!"
        fill(255, 0, 0);
        textFont(myFont); // Custom Font
        textSize(50);
        text("Game Over!", width / 2, 200); // Display "Game Over!"
        backgroundMusic.stop(); // Stop The Background Music
        return;
    }

    function shiftClouds() {
        for (let i = 0; i < clouds.length; i++) {
            if (isLeft) {
                // Move Clouds To The Left
                clouds[i].x_pos -= 0.75;
    
                // Reset Position Of The Clouds When Moving Left
                if (clouds[i].x_pos > cameraPosX + width + 1000) {
                    clouds[i].x_pos = cameraPosX - 200;
                }
            } else if (isRight) {
                // Move Clouds To The Right
                clouds[i].x_pos += 0.75;
    
                // Reset Position Of The Clouds When Moving Right
                if (clouds[i].x_pos < cameraPosX - 1000) {
                    clouds[i].x_pos = cameraPosX + width + 200;}
            }
        }
    }

    shiftClouds(); // Call The shiftClouds() Function

    // Game Complete
    if (flagpole.isReached) {
        fill("purple");
        textFont(myFont); // Custom Font
        textSize(50);
        text("Game Complete!", width / 2, 200); // Display "Game Complete!"
        emit.updateParticles(); // Particle System
        return;
    }

    // Display Timer
    fill(255);
    textSize(30);
    textFont("system");
    text("⏱️", 25, 70);
    textFont(myFont); // Custom Font
    text(" " + timeRemaining + "s", 60, 65);

    // Display The Number Of Coins Collected
    fill(192, 192, 192);
    textSize(25);
    textFont("system");
    text("🪙", width - 50, 41);
    textSize(30);
    textFont(myFont); // Custom Font
    text(" " + gameScore, width - 25, 35);

    // Display Remaining Lives
    for (let i = 0; i < 3; i++) {
        if (i < lives) {
            // Heart (Remaining Lives)
            fill(0);
            textSize(25);
            textAlign(CENTER, CENTER);
            textFont("system");
            text("💖", 20 + (i * 30), 30);
        } else {
            // Skull (Lost Lives)
            fill(0);
            textSize(25);
            text("💀", 20 + (i * 30), 30);
        }
    }

    // Moving Left & Right
    if (isLeft) {
        gameChar_x -= 6;
    } else if (isRight) {
        gameChar_x += 6;
    }

    // Gravity
    if (gameChar_y < floorPos_y) {
        let isPlatformContact = false;
        
        for (let i = 0; i < platforms.length; i++) {
            if (platforms[i].checkPlatform(gameChar_x, gameChar_y)) {
                isPlatformContact = true;
                isFalling = false;
                gameChar_y = platforms[i].y;
                break;
            }
        }
        
        if (!isPlatformContact) {
            gameChar_y += 2;
            isFalling = true;
        }
        
        if (gameChar_y >= floorPos_y) {
            gameChar_y = floorPos_y;
            isFalling = false;
        }
    }

    checkPlayerDie(); // Call The checkPlayerDie() Function
}

function keyPressed() {
    if (lives < 1 || flagpole.isReached || !gameActive) {
        return;
    }

    if (isPlummeting) {
        return;
    }
    
    if (keyCode == 37) { // Left Arrow Key
        isLeft = true;
    } else if (keyCode == 39) {
        isRight = true; // Right Arrow Key
    } else if (keyCode == 32 && isFalling == false) { // Spacebar
        gameChar_y = gameChar_y - 100;
        jumpSound.play(); // Play Sound When The Character Jumps
    }
}

function keyReleased() {
    if (keyCode == 37) {
        isLeft = false;
    } else if (keyCode == 39) {
        isRight = false;
    }
}

function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        fill(180, 180, 180);
        noStroke();
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size, clouds[i].size - 20);
        ellipse(clouds[i].x_pos + 30, clouds[i].y_pos, clouds[i].size + 10, clouds[i].size - 10);
        ellipse(clouds[i].x_pos - 30, clouds[i].y_pos, clouds[i].size - 10, clouds[i].size - 25);
    }
}

function drawMountains() {
    // Mountains
    for (let i = 0; i < mountains.length; i++) {
        fill("#503C28");
        noStroke();
        triangle(
            mountains[i].x_pos, mountains[i].y_pos, 
            mountains[i].x_pos + mountains[i].width / 2, mountains[i].y_pos - mountains[i].height,
            mountains[i].x_pos + mountains[i].width, mountains[i].y_pos
        );

        fill("#755A3E");
        triangle(
            mountains[i].x_pos, mountains[i].y_pos,
            mountains[i].x_pos + mountains[i].width / 2, mountains[i].y_pos - mountains[i].height,
            mountains[i].x_pos + mountains[i].width / 4, mountains[i].y_pos
        );
        
        fill("#2A1F15");
        triangle(
            mountains[i].x_pos + mountains[i].width * 3/4, mountains[i].y_pos,
            mountains[i].x_pos + mountains[i].width / 2, mountains[i].y_pos - mountains[i].height,
            mountains[i].x_pos + mountains[i].width, mountains[i].y_pos
        );
    }

    // Snowcaps
    for (let i = 0; i < snowcaps.length; i++) {
        fill(255);
        noStroke();

        beginShape();
        vertex(snowcaps[i].x1, snowcaps[i].y1);
        vertex(snowcaps[i].x2, snowcaps[i].y2);
        vertex(snowcaps[i].x3, snowcaps[i].y3);
        vertex(snowcaps[i].x4, snowcaps[i].y4);
        endShape(CLOSE);
    }
}

function drawTrees() {
    for (let i = 0; i < trees_x.length; i++) {
        fill("brown");
        rect(trees_x[i], floorPos_y - 45, 20, 45);
        fill("#4A5D23");
        triangle(
            trees_x[i] - 20, floorPos_y - 45,
            trees_x[i] + 10, floorPos_y - 107,
            trees_x[i] + 40, floorPos_y - 45
        );

        triangle(
            trees_x[i] - 15, floorPos_y - 75,
            trees_x[i] + 10, floorPos_y - 135,
            trees_x[i] + 35, floorPos_y - 75
        );

        triangle(
            trees_x[i] - 10, floorPos_y - 105,
            trees_x[i] + 10, floorPos_y - 165,
            trees_x[i] + 30, floorPos_y - 105
        );
    }
}

function drawCollectable(t_collectable) {
    if (!t_collectable.isFound) {
        // Update Rotation
        t_collectable.angleRotation += 0.1;
        
        // Update Hover Position
        t_collectable.hoverShift += t_collectable.hoverDirection / 2;
        
        // Change Direction
        if (t_collectable.hoverShift >= 5) {
            t_collectable.hoverDirection = -1;
        } else if (t_collectable.hoverShift <= -10) {
            t_collectable.hoverDirection = 1;
        }
        
        // Update Colour Lerping
        t_collectable.colourTimer += t_collectable.colourSpeed;
        if (t_collectable.colourTimer >= 1) {
            let temp = t_collectable.startColour;
            t_collectable.startColour = t_collectable.endColour;
            t_collectable.endColour = temp;
            t_collectable.colourTimer = 0;
        }
        
        t_collectable.currentColour = lerpColor(t_collectable.startColour, t_collectable.endColour, t_collectable.colourTimer);

        push();
        translate(t_collectable.x_pos, t_collectable.y_pos - 17 + t_collectable.hoverShift);
        rotate(t_collectable.angleRotation);

        stroke(t_collectable.currentColour);
        strokeWeight(2);
        fill("black");
        ellipse(0, 0, t_collectable.size - 28);
        
        textFont("system");
        textSize(10);
        textAlign(CENTER, CENTER);
        text("⭐", 0, 0);

        pop();
    }
}

function drawCanyon(t_canyon) {
    fill(50, 50, 50);
    noStroke();
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, t_canyon.width + 70);
    
    // Layers
    fill(40, 40, 40);
    rect(t_canyon.x_pos + 10, floorPos_y, t_canyon.width - 20, t_canyon.width + 70);
    fill(30, 30, 30);
    rect(t_canyon.x_pos + 20, floorPos_y, t_canyon.width - 40, t_canyon.width + 70);
    
    // Rocky Edges
    fill("red");

    beginShape();
    vertex(t_canyon.x_pos, floorPos_y);
    vertex(t_canyon.x_pos + 15, floorPos_y + 50);
    vertex(t_canyon.x_pos + 5, floorPos_y + 50);
    vertex(t_canyon.x_pos + 18, floorPos_y + 50);
    vertex(t_canyon.x_pos + 8, floorPos_y + 100);
    vertex(t_canyon.x_pos, floorPos_y + 120);
    endShape(CLOSE);
    
    beginShape();
    vertex(t_canyon.x_pos + t_canyon.width, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width - 15, floorPos_y + 50);
    vertex(t_canyon.x_pos + t_canyon.width - 5, floorPos_y + 50);
    vertex(t_canyon.x_pos + t_canyon.width - 20, floorPos_y + 55);
    vertex(t_canyon.x_pos + t_canyon.width - 8, floorPos_y + 100);
    vertex(t_canyon.x_pos + t_canyon.width, floorPos_y + 90);
    endShape(CLOSE);
    
    fill("#8B0000");
    
    beginShape();
    vertex(t_canyon.x_pos + 5, floorPos_y);
    vertex(t_canyon.x_pos + 12, floorPos_y + 15);
    vertex(t_canyon.x_pos + 5, floorPos_y + 25);
    vertex(t_canyon.x_pos, floorPos_y + 20);
    endShape(CLOSE);
    
    beginShape();
    vertex(t_canyon.x_pos + t_canyon.width - 5, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width - 12, floorPos_y + 15);
    vertex(t_canyon.x_pos + t_canyon.width - 5, floorPos_y + 25);
    vertex(t_canyon.x_pos + t_canyon.width, floorPos_y + 20);
    endShape(CLOSE);

    for (let i = 0; i < 20; i++) {
        let alphaValue = map(i, 0, 20, 150, 0);
        noStroke();
        fill(255, 100, 0, alphaValue);
        rect(t_canyon.x_pos - i/2, floorPos_y, i, height - floorPos_y);
        rect(t_canyon.x_pos + t_canyon.width - i/2, floorPos_y, i, height - floorPos_y);
    }
    
    // Flickering Light Effect
    if (random() > 0.5) {
        let flickerSize = random(10, 40);
        let flickerX = random(t_canyon.x_pos + 20, t_canyon.x_pos + t_canyon.width - 20);
        let flickerY = random(floorPos_y + 50, floorPos_y + 150);
        
        fill(255, 200, 0, 100);
        ellipse(flickerX, flickerY, flickerSize, flickerSize);
    }
}

function checkCollectable(t_collectable) {
    collectableDistance = dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos); // Calculate Distance Between Character & Collectable Item
    if (collectableDistance < t_collectable.size / 2 && !t_collectable.isFound) {
        t_collectable.isFound = true;
        collectSound.play(); // Play collectSound When The Character Collects A Collectable Item
        gameScore++; // Increment gameScore
    }
}

function checkCanyon(t_canyon) {
    if (gameChar_x > t_canyon.x_pos + 15 && gameChar_x < t_canyon.x_pos + t_canyon.width - 15 && gameChar_y >= floorPos_y) {
        // Freeze Controls When The Character Falls Into The Canyon
        isPlummeting = true;
        isLeft = false;
        isRight = false;
    }
    
    if (isPlummeting && lives > 0) {
        gameChar_y += 1.25; // Character Falling Speed In The Canyon
        if (gameChar_y >= height) {
            deathSound.play(); // Play Sound When The Character Falls Into The Canyon
        }
    }
}

function drawFlagpole() {
    // Draw The Flagpole
    if (!flagpole.isReached) {
        stroke(2);
        fill("#5C4033");
        rect(flagpole.x_pos, floorPos_y - 150, 10, 150);
        fill(255, 0, 0);
        triangle(flagpole.x_pos, floorPos_y - 150, flagpole.x_pos, floorPos_y - 120, flagpole.x_pos - 50, floorPos_y - 135);
    } else {
        stroke(2);
        fill("#5C4033"); 
        rect(flagpole.x_pos, floorPos_y - 150, 10, 150);
        fill(255, 255, 0);
        triangle(flagpole.x_pos, floorPos_y - 150, flagpole.x_pos, floorPos_y - 120, flagpole.x_pos - 50, floorPos_y - 135);
        textSize(15);
        textFont("system");
        text("✔️", flagpole.x_pos - 15, floorPos_y - 135);
    }
}

function checkFlagpole() {
    if (gameChar_x > flagpole.x_pos - 20 && gameChar_x < flagpole.x_pos + 20 && !flagpole.isReached) {
        if (gameScore == collectables.length) { // Check If The Character Has Collected All The Collectable Items
            flagpole.isReached = true;
            gameChar_y = floorPos_y;
            levelComplete.play(); // Play levelComplete Sound When The Character Completes The Game
        } else {
            textSize(50);
            textFont(myFont); // Custom Font
            text("Collect All Coins!", gameChar_x, gameChar_y - 200); // Display "Collect All Coins!" If The Character Reaches The Flagpole Without Collecting All The Collectable Items
        }
    }
}

function checkPlayerDie() {
    if (gameChar_y >= height) {
        lives--; // Decrement Lives
        if (lives > 0) {
            startGame(); // Call The startGame() Function
        }
    }
}

function createPlatforms(x, y, length, moveType = "", range = 0) {
    let myPlatform = {
        x: x,
        y: y,
        length: length,
        moveType: moveType, // Horizontal Or Vertical
        range: range,
        initialX: x,
        initialY: y,
        speed: 2, // Speed Of The Platform
        moveDirection: 1,
        
        draw: function() {
            noStroke();
            if (this.moveType == "horizontal") {
                this.x += this.speed * this.moveDirection;
                
                // Reverse The Platform Direction For Horizontal Movement
                if (this.x >= this.initialX + this.range) {
                    this.moveDirection = -1; // Move Left
                } else if (this.x <= this.initialX - this.range) {
                    this.moveDirection = 1; // Move Right
                }

            } else if (this.moveType == "vertical") {
                this.y += this.speed * this.moveDirection;
                
                // Reverse The Platform Direction For Vertical Movement
                if (this.y >= this.initialY + this.range) {
                    this.moveDirection = -1; // Move Down
                } else if (this.y <= this.initialY - this.range) {
                    this.moveDirection = 1; // Move Up
                }
            }
            
            // Draw The Platform
            fill("grey");
            rect(this.x, this.y, this.length, 20);
            for (let i = 0; i < 6; i++) { // Dots On The Platforms
                fill("#FFD700");
                ellipse(this.x + (i * 15) + 13, this.y + 10, 5, 5);
            }
        },

        checkPlatform: function(gc_x, gc_y) {
            if (gc_x > this.x && gc_x < this.x + this.length) {
                let distance = this.y - gc_y;
                if (distance >= -2 && distance < 5) {
                    // Move The Character Along With The Platform For Horizontal Movement
                    if (this.moveType == "horizontal") {
                        gameChar_x += this.speed * this.moveDirection;
                    }
                    return true;
                }
            }
            return false;
        }
    }
    return myPlatform;
}

class Enemy {
    constructor(x, y, range) {
        this.x = x;
        this.y = y;
        this.range = range;

        this.currentX = x;
        this.increment = 1;
        
        // Bullet Properties
        this.bulletCooldown = 0;
        this.maxCooldown = 120;
        this.bulletSpeed = 5;
        this.bulletRange = 150;

        this.update = function () {
            this.currentX += this.increment; // Move The Enemy

            // Reverse The Direction Of Enemy Movement
            if (this.currentX >= this.x + this.range) {
                this.increment = -1;
            } else if (this.currentX < this.x) {
                this.increment = 1;
            }
            
            if (this.bulletCooldown > 0) {
                this.bulletCooldown--;
            }
            
            // Fire Bullet
            let xDistance = gameChar_x - this.currentX;
            let yDistance = gameChar_y - this.y;
            let inXRange = (xDistance > 0 && xDistance < this.bulletRange) || (xDistance < 0 && xDistance > -this.bulletRange);
            let inYRange = (yDistance > 0 && yDistance < 100) || (yDistance < 0 && yDistance > -100);
            
            if (this.bulletCooldown === 0 && inXRange && inYRange && gameActive && !flagpole.isReached) {
                this.fireBullet();
                this.bulletCooldown = this.maxCooldown;
            }
        };

        this.fireBullet = function() {
            let direction;
            if (gameChar_x > this.currentX) {
                direction = 1;
            } else {
                direction = -1;
            }
            
            // Create Bullet
            let bullet = {
                x: this.currentX,
                y: this.y - 15,
                speed: this.bulletSpeed * direction,
                size: 8,
                distanceTraveled: 0,
                maxDistance: this.bulletRange,
                active: true
            };
            
            bullets.push(bullet);
        };

        this.draw = function () {
            this.update();

            // Head
            fill(150);
            rect(this.currentX - 15, this.y - 30, 30, 25);

            // Antenna
            fill(100);
            rect(this.currentX - 2, this.y - 40, 4, 10);
            ellipse(this.currentX, this.y - 42, 6);

            // Eyes
            fill(0);
            rect(this.currentX - 12, this.y - 25, 24, 8);
            fill(255, 0, 0);
            rect(this.currentX - 8, this.y - 23, 4, 4);
            rect(this.currentX + 4, this.y - 23, 4, 4);

            // Neck
            fill(100);
            rect(this.currentX - 5, this.y - 5, 10, 5);
        };

        // Check If The Character Comes In Contact With The Enemy
        this.checkEnemy = function (gc_x, gc_y) {
            let enemyDistance = dist(gc_x, gc_y, this.currentX, this.y);
            if (enemyDistance < 25) {
                return true;
            }
            return false;
        };
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        
        // Update Bullet Position
        bullet.x += bullet.speed;
        
        if (bullet.speed > 0) {
            bullet.distanceTraveled += bullet.speed;
        } else {
            bullet.distanceTraveled += -bullet.speed;
        }
        
        // Check If The Bullet Hits The Character
        let bulletDistance = dist(bullet.x, bullet.y, gameChar_x, gameChar_y - 40);
        if (bulletDistance < 20 && bullet.active) {
            bullet.active = false;
            if (lives > 0) {
                lives--;
                deathSound.play();
                startGame();
            }
        }
        
        // Check If The Bullet Exceeds The Maximum Distance
        if (bullet.distanceTraveled > bullet.maxDistance) {
            bullets.splice(i, 1); // Remove The Bullet
            continue;
        }
        
        // Draw The Bullet
        fill(255, 0, 0);
        ellipse(bullet.x, bullet.y, bullet.size);
        fill(255, 165, 0, 150);
        ellipse(bullet.x - bullet.speed, bullet.y, bullet.size - 2);
        fill(255, 255, 0, 100);
        ellipse(bullet.x - bullet.speed, bullet.y, bullet.size - 5);
    }
}

class GameCompleteParticle {
    constructor(x, y, xSpeed, ySpeed, size) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = size;

        // Assigns A Random Colour To The Particle
        this.colour = color(random(0, 255), random(0, 255), random(0, 255), 100);

        // Draw The Particle
        this.drawParticle = function () {
            fill(this.colour);
            ellipse(this.x, this.y, this.size);
        };

        // Update The Position Of The Particle
        this.updateParticle = function () {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        };
    }
}

// Manages Multiple Particles
class GameCompleteEmitter {
    constructor(x, y, xSpeed, ySpeed, size) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = size;

        this.startParticles = 0;
        this.particles = [];

        this.startEmitter = function (startParticles) {
            this.startParticles = startParticles;

            for (let i = 0; i < startParticles; i++) {
                let myParticle = new GameCompleteParticle(
                    random(this.x - 10, this.x + 10),
                    random(this.y - 10, this.y + 10),
                    random(this.xSpeed - 1, this.xSpeed + 1),
                    random(this.ySpeed - 1, this.ySpeed + 1),
                    random(this.size - 5, this.size + 5)
                );

                this.particles.push(myParticle);
            }

            // Update & Draw All Particles
            this.updateParticles = function () {
                for (let i = 0; i < this.particles.length; i++) {
                    this.particles[i].drawParticle();
                    this.particles[i].updateParticle();
                }
            };
        };
    }
}

function myStars() {
    // Generate Random Stars
    for (let i = 0; i < 300; i++) {
        let star = {
            x: random(-1000, 4000),
            y: random(10, floorPos_y - 50),
            size: random(1, 3),
            brightness: random(150, 255),
            twinkleSpeed: random(0.1, 0.3),
            twinkleAmount: random(20, 25),
            twinkleState: random(0, 7)
        };
        stars.push(star);
    }
}

function drawStars() {
    noStroke();
    for (let i = 0; i < stars.length; i++) {
        let randomChange = random(-stars[i].twinkleAmount, stars[i].twinkleAmount);
        let currentBrightness = stars[i].brightness + randomChange;
        currentBrightness = constrain(currentBrightness, 100, 255);
        
        // Draw The Star
        fill(currentBrightness);
        ellipse(stars[i].x + cameraPosX, stars[i].y, stars[i].size);
    }
}

function startGame() {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;

    isPlummeting = false;
    isFalling = false;

    // Array Of Canyon Objects
    canyons = [
        {x_pos: 150, width: 130},
        {x_pos: 1200, width: 275},
        {x_pos: -1200, width: 400},
        {x_pos: 2000, width: 200}
    ];

    // Array Of Collectable Objects
    collectables = [
        {x_pos: 350, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 600, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 900, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 1625, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 1825, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: -50, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: -280, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: -510, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 2500, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)},
        {x_pos: 2800, y_pos: floorPos_y, size: 50, isFound: false, angleRotation: 0, hoverShift: 0, hoverDirection: 1, colourTimer: 0, colourSpeed: random(0.01, 0.03), startColour: color(255, 165, 0), endColour: color(255, 0, 0), currentColor: color(255, 255, 0)}
    ];
    
    // Array Of Tree Positions
    trees_x = [-630, -400, -170, 630, 860, 1090];

    // Array Of Cloud Objects
    clouds = [
        {x_pos: 100, y_pos: 100, size: 50},
        {x_pos: 400, y_pos: 150, size: 70},
        {x_pos: 700, y_pos: 120, size: 60},
        {x_pos: 1300, y_pos: 140, size: 60},
        {x_pos: 1000, y_pos: 150, size: 50},
        {x_pos: -200, y_pos: 100, size: 70},
        {x_pos: -500, y_pos: 120, size: 60}
    ];

    // Array Of Mountain Objects
    mountains = [
        {x_pos: 300, y_pos: floorPos_y, width: 350, height: 175},
        {x_pos: 600, y_pos: floorPos_y, width: 300, height: 200},
        {x_pos: 850, y_pos: floorPos_y, width: 250, height: 175}
    ];

    // Array Of Snowcap Objects
    snowcaps = [
        {x1: 474, y1: 257, x2: 503, y2: 285, x3: 472, y3: 275, x4: 452, y4: 281},
        {x1: 749, y1: 231, x2: 727, y2: 263, x3: 756, y3: 253, x4: 775, y4: 266},
        {x1: 975, y1: 257, x2: 957, y2: 282, x3: 977, y3: 277, x4: 996, y4: 286}
    ];

    gameScore = 0;

    flagpole = {x_pos: 3000, isReached: false};

    emit = new GameCompleteEmitter(width / 2, height - 100, 0, -1, 10, color(200, 0, 200, 50));
    emit.startEmitter(200, 100);

    platforms = [];
    platforms.push(createPlatforms(1285, floorPos_y - 75, 100, "horizontal", 100));  // Horizontal Movement
    platforms.push(createPlatforms(165, floorPos_y - 120, 100, "vertical", 100));    // Vertical Movement
    platforms.push(createPlatforms(2050, floorPos_y - 120, 100, "vertical", 100));   // Vertical Movement

    enemies = [];
    bullets = [];
    enemies.push(new Enemy(30, floorPos_y - 10, 100));
    enemies.push(new Enemy(1675, floorPos_y - 10, 100));
    enemies.push(new Enemy(2250, floorPos_y - 10, 100));

    gameActive = true;
    timeSoundPlayed = false;
}