// Array to hold information about each worm
let worms = [];

let pinkColor, blueColor, yellowColor, redColor;
let animationStarted = false;

function setup() {
  pinkColor = color(248, 86, 114);
  blueColor = color('#373CF7');
  yellowColor = color(250, 250, 124);
  redColor = color('#2B056F')

  createCanvas(600, 600);
  frameRate(25);
  background('rgb(255,255,247)');

  textSize(50);
  textAlign(CENTER, CENTER);

  // Initialize worms
  for (let i = 0; i < 20; i++) {
    worms.push(new Worm());
  }
  
  // Start animation immediately
  animationStarted = true;
}

function draw() {
  if (animationStarted) {
    for (let worm of worms) {
      worm.update(worms); // Pass all worms to allow for repulsion
      worm.display();
    }
  }
}

function startAnimation() {
  animationStarted = true;
}

// Worm class
class Worm {
  constructor() {
    this.x = random(50, 550); // Initial x position
    this.y = random(550, 550); // Initial y position
    this.speed = random(1, 3); // Speed of movement
    this.text = random(["Now accepting cryptocurrency payments"]); // Random text
    this.angle = random(-PI, PI); // Initial angle of movement
    this.verticalSpeed = random(-4, 4); // Random vertical speed
  }

  update(allWorms) {
    // Move the worm
    this.x += cos(this.angle) * this.speed;
    this.y += this.verticalSpeed;

    // Bounce off walls
    if (this.x < 0 || this.x > width) {
      this.angle = PI - this.angle;
    }
    if (this.y < 0 || this.y > height) {
      this.verticalSpeed *= -1;
    }

    // Repulsion between worms
    for (let otherWorm of allWorms) {
      if (otherWorm !== this) {
        let dx = otherWorm.x - this.x;
        let dy = otherWorm.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance < 10) { // If worms are too close
          let angleBetween = atan2(dy, dx);
          let pushForce = 1 / distance;

          // Apply force to move away from other worm
          this.x -= cos(angleBetween) * pushForce;
          this.y -= sin(angleBetween) * pushForce;
        }
      }
    }
  }

  display() {
    let lerpedColor = lerpColor(pinkColor, blueColor, frameCount / 1000);
    let lerpedColor2 = lerpColor(yellowColor, redColor, frameCount / 1500);

    fill(lerpedColor2);
    stroke(lerpedColor);
    strokeWeight(2);
    text(this.text, this.x, this.y);
  }
}
