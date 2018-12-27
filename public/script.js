// Prototype

// Monsters -> ground, air, Weapons, One Stage, Lightnings, Lava, Animations (p5.game -> animation)
// canvas - createCanvas() -> getElementById to canvas var

let image_background = image_block = image_healthBottle = mainFont = null,
	image_lava = [],
	player = {
		idle: null,
		run: null,
		jump: null,
		fly: null,
		OBJECT: null
	}

const settings = {
	sizes: {
		height: 445, // 445
		width: 850 // 800 - 850
	},
	inGame: true
}

let touchableElements = [],
	items = [];

// 0 - void
// 1 - block
// 2 - lava

// 20 - health bottle
const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Element {
	constructor(isBlock = true, leftIndex, bottomIndex, typenum) {
		if(isBlock) {
			this.size = settings.sizes.width / map[0].length;  // 30

			this.pos = {
				x: leftIndex * this.size,
				y: settings.sizes.height - bottomIndex * this.size
			}
		}

		this.type = typenum;
	}

	testTouch(pos, width, height) {
		let { x: px, y: py } = pos,
			{ x: ex, y: ey } = this.pos,
			b = 15; // padding

		if(
			(
				(py + height > ey && py < ey + this.size) &&
				(px >= ex - b && px + width < ex + this.size + b)
			) &&
			(
				(px + width > ex && px + width < ex + this.size) ||
				(px < ex + this.size && px > ex)
			)
		) {
			return this.type;
		}
	}
}

class Block extends Element {
	constructor(leftIndex, bottomIndex, number) {
		super(true, leftIndex, bottomIndex, number);
	}

	render() {
		image(image_block, this.pos.x, this.pos.y, this.size, this.size);
		// rect(this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}
}

class Lava extends Element {
	constructor(leftIndex, bottomIndex, number) {
		super(true, leftIndex, bottomIndex, number);

		this.currentFrame = 0;
		this.currentSprite = 0;
	}

	render() {
		image(image_lava[this.currentSprite], this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		if(++this.currentFrame % 5 === 0 && ++this.currentSprite > image_lava.length - 1) {
			this.currentSprite = 0;
		}

		return this;
	}
}

class Creature {
	constructor(maxHealth = 100, currentHealth) {
		this.isAlive = true;
		this.maxHealth = maxHealth;
		this.health = currentHealth || maxHealth;
	}

	declareDeath(entity) {
		if(entity === 'player') {
			this.isAlive = false;
			this.health = 0;
			settings.inGame = false;
			document.getElementById('defaultCanvas0').style.filter = "grayscale(100%)"; // XXX
		}
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

		// Draw the health bar
		noStroke();
		fill(255, 0, 0);

		rect(0, 0, settings.sizes.width / 100 * (100 / (this.maxHealth / this.health)), 17.5);
		textFont(mainFont);
		textSize(24);
		textAlign(CENTER);
		fill(255);
		text(`Health (${ round(100 / (this.maxHealth / this.health)) })`, settings.sizes.width / 2, 13);

		return this;
	}

	update() {
		if(!this.isAlive) return;

		let testYPassed = true;
		let testXPassed = true;

		// Test y
		touchableElements.forEach(io => {
			let yTest = io.testTouch( // y
				{
					x: this.pos.x,
					y: this.pos.y + (this.velocity + this.gravity)
				},
				this.width,
				this.height
			),
				xTest = io.testTouch( // x
				{
					x: this.pos.x + this.movement,
					y: this.pos.y
				},
				this.width,
				this.height
			);

			if(yTest) {
				if(testYPassed) {
					testYPassed = false;
					this.velocity = this.gravity;
					this.jumps = this.maxJumps;
				}
			}

			if(xTest) {
				if(testXPassed) {
					testXPassed = false;
				}
			}

			if([xTest, yTest].includes(2)) { // if material is lava
				this.declareDeath('player');


				
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

		if(Math.sign(this.velocity) !== -1) { // velocity is 0 or positive
			if(testYPassed) this.model = player.fly; // in air, but falls
			else this.model = player.idle // on the ground
		} else {
			this.model = player.jump;
		}

		return this;
	}

	controlPos(mov) {
		this.movement = mov * this.speed;
		this.touches = { x: false, y: false };
	}

	jump() {
		if(!this.jumps) return;

		this.velocity = -10;
		this.jumps--;
	}
}

class Item extends Element {
	constructor(model, isVisible, typenum) {
		super(false, 0, 0, typenum)

		this.size = 35;
		this.isVisible = isVisible;
		this.model = model

		this.pos = null;

		// TOOD: Shake
	}

	render() {
		if(!this.pos) this.pos = this.genPos();

		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	genPos() {
		function aa() {
			let a = a => floor(random(a)),
			b = a(map.length), // y in the array
			c = a(map[0].length), // x in the array
			d = map[b][c];

			return (typeof d !== "object") ? aa() : d.object;
		}

		let a = aa();

		return ({
			x: a.pos.x,
			y: a.pos.y - a.size
		});
	}
}

class HealthBottle extends Item {
	constructor(isVisible = false) {
		super(image_healthBottle, isVisible, 20);
	}
}

function preload() {
	mainFont = loadFont('./assets/mainFont.ttf')
}

function setup() {
	createCanvas(settings.sizes.width, settings.sizes.height);

	image_background   = loadImage('./assets/background.jpg');
	image_block        = loadImage('./assets/block.png');
	image_healthBottle = loadImage('./assets/items/heal.png');
	player.idle        = loadImage('./assets/hero/idle.gif');
	player.run         = loadImage('./assets/hero/run.gif');
	player.jump        = loadImage('./assets/hero/jump.png');
	player.fly         = loadImage('./assets/hero/fly.gif');

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
	items.push(new HealthBottle(true));
}

function draw() {
	frameRate(30);

	image(image_background, 0, 0, settings.sizes.width, settings.sizes.height);

	if(!settings.inGame) {
		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(255);
		text('YOU DIED!', settings.sizes.width / 2, settings.sizes.height / 2 + 20);
	}

	touchableElements = [];

	map.forEach((io, ia, arr1) => {
		io.forEach((ik, il, arr2) => {
			if(ik) {
				if(Number.isInteger(ik)) { // generate class
					switch(ik) {
						case 1: // block
							var a = new Block(il, arr1.length - ia, ik);
						break;
						case 2: // lava
							var a = new Lava(il, arr1.length - ia, ik);
						break;
						default:return; // invalid element -> break function
					}

					arr2[il] = {
						object: a,
						material: ik
					}
				} else { // use exists class
					touchableElements.push(ik.object);
					ik.object.render();
					ik.object.update && ik.object.update();
				}
			}
		});
	});

	items.forEach(io => {
		touchableElements.push(io);
		io.render();
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