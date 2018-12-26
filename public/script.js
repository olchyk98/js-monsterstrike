// Prototype

// Monsters, Weapons, One Stage, Lightnings, Lava

let image_background = null,
	image_block = null,
	player = {
		idle: null,
		run: null,
		jump: null,
		OBJECT: null
	}

const settings = {
	sizes: {
		height: 445,
		width: 700
	}
}

let touchableElements = [];

const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

class Element {
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
		super();

		this.size = 30;
		this.pos = {
			x: leftIndex * this.size,
			y: settings.sizes.height - bottomIndex * this.size
		}
	}	

	render() {
		image(image_block, this.pos.x, this.pos.y, this.size, this.size);
		// rect(this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}
}

class Hero {
	constructor() {
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
	}

	render() {
		image(this.model, this.pos.x, this.pos.y);

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
		}

		return this;
	}

	control(dir, mov) {
		if(dir === 'x') {
			this.movement = mov * this.speed;
			this.touches = { x: false, y: false };
		}
	}

	jump() {
		this.model = player.jump;
		this.velocity = -10;
		this.locked = false;
	}
}

function setup() {
	createCanvas(settings.sizes.width, settings.sizes.height);

	image_background = loadImage('./assets/background.jpg');
	image_block      = loadImage('./assets/block.png');
	player.idle      = loadImage('./assets/hero/idle.gif');
	player.run       = loadImage('./assets/hero/run.gif');
	player.jump      = loadImage('./assets/hero/jump.png');

	player.OBJECT = new Hero;
}

function draw() {
	frameRate(30);

	image(image_background, 0, 0, settings.sizes.width, settings.sizes.height);

	touchableElements = [];

	map.forEach((io, ia, arr1) => {
		io.forEach((ik, il, arr2) => {
			if(ik) {
				let a = new Block(il, arr1.length - ia);
				touchableElements.push(a);

				a.render();
			}
		});
	});

	player.OBJECT.render();
	player.OBJECT.update();
}

function keyPressed() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.control('x', (keyCode === 65) ? -1 : 1);
	} else if(keyCode === 32) {
		player.OBJECT.jump();
	}
}

function keyReleased() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.control('x', 0);
	}
}