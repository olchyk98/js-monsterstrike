// Prototype

// Monsters -> ground, air, Weapons, One Stage, Lightnings, Lava, Animations (p5.game -> animation)

let image_background = image_block = null,
	image_lava = [],
	player = {
		idle: null,
		run: null,
		jump: null,
		OBJECT: null
	}

const settings = {
	sizes: {
		height: 445, // 445
		width: 800 // 700
	}
}

let touchableElements = [];

const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Element {
	constructor(isBlock = true, leftIndex, bottomIndex, texture) {
		if(isBlock) {
			this.size = settings.sizes.width / map[0].length;  // 30

			this.pos = {
				x: leftIndex * this.size,
				y: settings.sizes.height - bottomIndex * this.size
			}
		}
	}

	testTouch(pos, width, height) {
		let { x: px, y: py } = pos,
			{ x: ex, y: ey } = this.pos,
			b = 15; // padding

		return(
			(
				(py + height > ey && py < ey + this.size) &&
				(px >= ex - b && px + width < ex + this.size + b)
			) &&
			(
				(px + width > ex && px + width < ex + this.size) ||
				(px < ex + this.size && px > ex)
			)
		);
	}
}

class Block extends Element {
	constructor(leftIndex, bottomIndex) {
		super(true, leftIndex, bottomIndex);
	}

	render() {
		image(image_block, this.pos.x, this.pos.y, this.size, this.size);
		// rect(this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}
}

class Lava extends Element {
	constructor(leftIndex, bottomIndex) {
		super(true, leftIndex, bottomIndex);

		this.currentSprite = 0;
	}

	render() {
		// console.log(this.currentSprite);
		image(image_lava[this.currentSprite], this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		this.currentSprite = 230;

		// if(this.currentSprite + 1 > image_lava.length - 1) {
		// 	this.currentSprite = 0;
		// }

		return this;
	}
}

class Creature {
	constructor(maxHealth = 100, currentHealth) {
		this.isAlive = true;
		this.maxHealth = maxHealth;
		this.health = currentHealth || maxHealth;
	}
}

class Hero extends Creature {
	constructor() {
		super(125);

		this.model = player.idle;
		this.height = 35; // this.model.height
		this.width = 21; // this.model.width

		this.pos = {
			x: 0,
			y: 0
		}

		this.gravity = 1;
		this.velocity = 0;

		this.speed = 5;
		this.movement = 0;

		this.strictJump = true;
		this.maxJumps = 3;
		this.jumps = this.maxJumps;
	}

	render() {
		// Draw hero
		image(this.model, this.pos.x, this.pos.y);

		// Draw health bar
		noStroke();
		fill(255, 0, 0);

		// this.health

		rect(0, 0, settings.sizes.width / 100 * (100 / (this.maxHealth / this.health)), 17.5);
		textSize(12);
		textAlign(CENTER);
		fill(255);
		text('Health', settings.sizes.width / 2, 13);

		return this;
	}

	update() {
		let testYPassed = true;
		let testXPassed = true;

		// Test y
		touchableElements.forEach(io => {
			if(io.testTouch( // y
				{
					x: this.pos.x,
					y: this.pos.y + (this.velocity + this.gravity)
				},
				this.width,
				this.height
			)) {
				if(testYPassed) {
					testYPassed = false;
					this.velocity = this.gravity;
					this.jumps = this.maxJumps;
				}
			}

			if(io.testTouch( // x
				{
					x: this.pos.x + this.movement,
					y: this.pos.y
				},
				this.width,
				this.height
			)) {
				if(testXPassed) testXPassed = false;
			}
		});

		this.velocity += this.gravity;
		if(testYPassed) {
			this.pos.y += this.velocity;
		}

		if(testXPassed) {
			this.pos.x += this.movement;

			if(this.pos.x + this.width > settings.sizes.width) {
				this.pos.x = settings.sizes.width - this.width;
			} else if(this.pos.x < 0) {
				this.pos.x = 0;
			}
		}

		return this;
	}

	controlPos(mov) {
		this.movement = mov * this.speed;
		this.touches = { x: false, y: false };
	}

	jump() {
		if(!this.jumps) return;

		this.model = player.jump;
		this.velocity = -10;
		this.jumps--;
	}
}

function setup() {
	createCanvas(settings.sizes.width, settings.sizes.height);

	image_background = loadImage('./assets/background.jpg');
	image_block      = loadImage('./assets/block.png');
	player.idle      = loadImage('./assets/hero/idle.gif');
	player.run       = loadImage('./assets/hero/run.gif');
	player.jump      = loadImage('./assets/hero/jump.png');
	[
		'./assets/lava/1.png',
		'./assets/lava/2.png',
		'./assets/lava/3.png',
		'./assets/lava/4.png',
		'./assets/lava/5.png',
		'./assets/lava/6.png',
		'./assets/lava/7.png',
		'./assets/lava/8.png',
		'./assets/lava/9.png',
		'./assets/lava/10.png',
		'./assets/lava/11.png',
		'./assets/lava/12.png',
		'./assets/lava/13.png',
		'./assets/lava/14.png',
		'./assets/lava/15.png',
		'./assets/lava/16.png',
		'./assets/lava/17.png',
		'./assets/lava/18.png',
		'./assets/lava/19.png',
		'./assets/lava/20.png',
		'./assets/lava/21.png',
		'./assets/lava/22.png',
		'./assets/lava/23.png',
		'./assets/lava/24.png',
		'./assets/lava/25.png',
		'./assets/lava/26.png',
		'./assets/lava/27.png',
		'./assets/lava/28.png',
		'./assets/lava/29.png',
		'./assets/lava/30.png',
		'./assets/lava/31.png',
		'./assets/lava/32.png',
		'./assets/lava/34.png',
		'./assets/lava/35.png',
		'./assets/lava/36.png',
		'./assets/lava/37.png',
		'./assets/lava/38.png',
		'./assets/lava/39.png',
		'./assets/lava/40.png',
		'./assets/lava/41.png',
		'./assets/lava/42.png',
		'./assets/lava/43.png',
		'./assets/lava/44.png',
		'./assets/lava/45.png',
	].forEach(io => {
		image_lava.push(loadImage(io));
	});

	player.OBJECT = new Hero;
}

function draw() {
	frameRate(30);

	image(image_background, 0, 0, settings.sizes.width, settings.sizes.height);

	touchableElements = [];

	map.forEach((io, ia, arr1) => {
		io.forEach((ik, il, arr2) => {
			if(ik) {
				switch(ik) {
					case 1: // block
						var a = new Block(il, arr1.length - ia);
					break;
					case 2: // lava
						var a = new Lava(il, arr1.length - ia);
					break;
					default:return; // invalid element -> break function
				}

				touchableElements.push(a);
				a.render();
				a.update && a.update();
			}
		});
	});

	player.OBJECT.render().update();
}

function keyPressed() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos((keyCode === 65) ? -1 : 1);
	} else if(keyCode === 32) {
		player.OBJECT.jump();
	}
}

function keyReleased() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos(0);
	}
}