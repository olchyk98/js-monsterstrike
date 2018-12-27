// Prototype

// Monsters -> ground, air, Weapons, One Stage, Lightnings, Lava, Sounds, Animations (p5.game -> animation)
// canvas - createCanvas() -> getElementById to canvas var

let player = {
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
	inGame: true,
	playerHBHeight: 17.5, // 17.5
	images: {
		BACKGROUND: null,
		BLOCK: null,
		ARMOUR_1: null,
		ARMOUR_2: null,
		ARMOUR_3: null,
		HEALTH_BOTTLE: null,
		LAVA: [],
		MONSTER_1_BULLET: null,
		MONSTER_2_BULLET: null
	},
	itemsData: {
		ARMOUR_1: {
			health: 15
		},
		ARMOUR_2: {
			health: 25
		},
		ARMOUR_3: {
			health: 45
		},
		HEALTH_BOTTLE: {
			health: 120
		}
	}
}

let touchableElements = [],
	items = {},
	bullets = [];

// 0 - void
// 1 - block
// 2 - lava

// 20 - health bottle
// 21 - Weak Armour
// 22 - Good Armour
// 23 - The best Armour

// 40 - player bullet
// 41 - monster bullet
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
	constructor(isBlock = false, leftIndex = -1, bottomIndex = -1, typenum) {
		if(isBlock) {
			this.size = settings.sizes.width / map[0].length;  // 30

			this.pos = {
				x: leftIndex * this.size,
				y: settings.sizes.height - bottomIndex * this.size
			}
		}

		this.type = typenum;
	}

	predictObstacle(pos, width, height) {
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
		image(settings.images.BLOCK, this.pos.x, this.pos.y, this.size, this.size);
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
		image(settings.images.LAVA[this.currentSprite], this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		if(!settings.inGame) return;

		if(++this.currentFrame % 5 === 0 && ++this.currentSprite > settings.images.LAVA.length - 1) {
			this.currentSprite = 0;
		}

		return this;
	}
}

class Creature {
	constructor(maxHealth = 100, currentHealth, models, width, height, regenPower) {
		this.isAlive = true;

		this.models = models;
		this.model = this.models.idle;

		this.pos = {
			x: 0,
			y: 0
		}

		this.width = width;
		this.height = height;
		if(!this.width || !this.height) {
			alert("ERROR! Check the console!");
			throw new Error("We couldn't load creature's dimensions. Please, provide these values.")
		}

		this.gravity = 1;
		this.velocity = 0;

		this.speed = 5;
		this.movement = 0;

		this.maxHealth = maxHealth;
		this.health = currentHealth || maxHealth;

		if(regenPower) {
			this.regenDelta = 0;
			this.regenPower = regenPower;
		}

		this.effects = [];
		this.set = {
			armour: null
		}
	}

	update() {
		if(!this.isAlive) return this;

		let testYPassed = true;
		let testXPassed = true;
		let damage = 0;

		// Test y
		touchableElements.forEach(io => {
			let yTest = io.predictObstacle( // y
				{
					x: this.pos.x,
					y: this.pos.y + (this.velocity + this.gravity)
				},
				this.width,
				this.height
			),
				xTest = io.predictObstacle( // x
				{
					x: this.pos.x + this.movement,
					y: this.pos.y
				},
				this.width,
				this.height
			);

			if([xTest, yTest].includes(1) || [xTest, yTest].includes(2)) { // if material is block or lava
				if([xTest, yTest].includes(2)) {
					if(!damage) damage = 10;
				}

				if(yTest && testYPassed) {
					testYPassed = false;
					this.velocity = this.gravity;
					this.jumps = this.maxJumps;
				}

				if(xTest && testXPassed) {
					testXPassed = false;
				}
			} else { // if material is health bottle
				if(xTest !== yTest) return; // ...?

				switch(xTest) {
					case 20: // health bottle
						delete items.HEALTH_BOTTLE;
						this.health += settings.itemsData.HEALTH_BOTTLE.health;
						if(this.health > this.maxHealth) this.health = this.maxHealth;
					break;
					case 21: // armour 1
						delete items.ARMOUR_1;
						this.set.armour = {
							name: "ARMOUR_1",
							health: settings.itemsData.ARMOUR_1.health
						}
					break;
					case 22: // armour 2
						delete items.ARMOUR_2;
						this.set.armour = {
							name: "ARMOUR_2",
							health: settings.itemsData.ARMOUR_2.health
						}
					break;
					case 23: // armour 3
						delete items.ARMOUR_3;
						this.set.armour = {
							name: "ARMOUR_3",
							health: settings.itemsData.ARMOUR_3.health
						}
					break;
				}
			}
		});

		this.receiveDamage(damage); //  // TODO: Hit function

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
			if(testYPassed) { // in air, but falls
				this.model = this.models.fly || this.model
			} else { // on the ground
				if(this.movement)
				this.model = this.models.idle || this.model;
			}
		} else {
			this.model = this.models.jump || this.model;
		}

		return this;
	}

	receiveDamage(a) {
		let b = () => {
			if(this.health <= 0) {
				this.declareDeath('player');
			}
		}

		let с = this.set.armour;
		if(с) {
			if(с.health - a < 0) {
				a -= с.health;
				this.set.armour = null;
				this.health -= a;
				b();
			} else {
				с.health -= a;
			}
		} else {
			this.health -= a;
			b();
		}
	}

	regenerate() {
		if(!this.regenPower || !this.isAlive || !settings.inGame) return;

		if(++this.regenDelta % 125 === 0) {
			this.regenDelta = 1;

			this.health += this.regenPower;
			if(this.health > this.maxHealth) this.health = this.maxHealth;
		}
	}

	controlPos(mov) {
		this.movement = mov * this.speed;
		this.touches = { x: false, y: false };
	}

	jump() {
		if(!this.jumps) return;

		this.velocity = -10;
		if(this.strictJump) this.jumps--;
	}

	declareDeath(entity = 'mob') {
		this.isAlive = false;
		this.health = 0;
		this.set = {}

		if(entity === 'player') {
			settings.inGame = false;
			document.getElementById('defaultCanvas0').style.filter = "grayscale(100%)"; // XXX
			/*
				The p5.js library provides filter() function,
				but it needs a lot of memory.
				So, 'll' use CSS filter.
			*/
		}
	}

	shoot() {

	}
}

class Bullet extends Element {
	constructor(hostnum, damage = 1, model, pos, dir) {
		super(false, -1, -1, hostnum);

		this.size = 25;

		this.damage = damage;
		this.model = model;

		this.pos = pos || { x: 0, y: 0 };
		this.dir = dir || { x: 0, y: 0 };
	}

	render() {
		image(this.model, this.pos.x, this.pos.y, this.size, this.size);
	}

	update() {

	}
}

class Hero extends Creature {
	constructor() {
		super(125, 125, {
			idle: player.idle,
			run: player.run,
			jump: player.jump,
			fly: player.fly,
		}, 21, 35, 5);

		// this.width = 21; // this.model.width -> 1?
		// this.height = 35; // this.model.height -> 1?

		this.strictJump = true;
		this.maxJumps = 3;
		this.jumps = 0;
	}

	render() {
		// Draw hero
		image(this.model, this.pos.x, this.pos.y);

		// Draw the health bar
		noStroke();
		fill(255, 0, 0);
		rect(0, 0, settings.sizes.width / 100 * (100 / (this.maxHealth / this.health)), settings.playerHBHeight);

		textFont(mainFont);
		textSize(24);
		textAlign(CENTER);
		fill(255);
		text(`Health (${ round(100 / (this.maxHealth / this.health)) })`, settings.sizes.width / 2, 13);

		// Draw the armour bar
		if(this.set.armour) {
			noStroke();
			fill(15, 0, 255);
			rect(0, 0, settings.sizes.width / 100 * (100 / (this.maxHealth / this.set.armour.health)), settings.playerHBHeight);
		}

		// Draw effects
		{
			let a = 20, // icon size
				b = 5, // margin
				c = Object.values(this.set)
						.filter(io => io)
						.map(io => io.name),
				d = [
					...this.effects,
					...c
				];

			d.forEach((io, ia) => {
				let c = settings.images[io];
				if(!c) return;

				fill(255);
				image(c, ia * (a + b) + b, settings.playerHBHeight + b, a, a);
			});

		}

		return this;
	}
}

class Item extends Element {
	constructor(model, isVisible, typenum) {
		super(false, 0, 0, typenum);

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
		let aa = () => {
			let a = a => floor(random(a)),
			b = a(map.length), // y in the array
			c = a(map[0].length), // x in the array
			d = map[b][c].object,
			e = false;

			// Validate, if no items on this position
			Object.values(items).map(io => {
				if(
					io.pos && d &&
					io.type !== this.type &&
					io.pos.x === d.pos.x &&
					io.pos.y === d.pos.y
				) e = true;
			});

			// Validate if no blocks on this position
			map.forEach(io => io.forEach(({ object }) => {
				if( // XXX
					object && d &&
					object.pos.x === d.pos.x &&
					object.pos.y === d.pos.y - d.size
				) e = true;
			}));


			if(e) return aa();

			return (typeof d !== "object") ? aa() : d;
		}

		let a = aa();

		return ({
			x: a.pos.x,
			y: a.pos.y - a.size
		});
	}
}

function preload() {
	mainFont = loadFont('./assets/mainFont.ttf')
}

function setup() {
	createCanvas(settings.sizes.width, settings.sizes.height);

	settings.images.BACKGROUND      = loadImage('./assets/background.jpg');
	settings.images.BLOCK           = loadImage('./assets/block.png');
	settings.images.HEALTH_BOTTLE   = loadImage('./assets/items/heal.png');
	settings.images.ARMOUR_1        = loadImage('./assets/items/arm1.png');
	settings.images.ARMOUR_2        = loadImage('./assets/items/arm2.png');
	settings.images.ARMOUR_3        = loadImage('./assets/items/arm3.png');
	settings.images.MONSTER_1_BULLET = loadImage('./assets/bullets/monster1.gif');
	settings.images.MONSTER_2_BULLET = loadImage('./assets/bullets/monster2.gif');
	player.idle                     = loadImage('./assets/hero/idle.gif');
	player.run                      = loadImage('./assets/hero/run.gif');
	player.jump                     = loadImage('./assets/hero/jump.png');
	player.fly                      = loadImage('./assets/hero/fly.gif');

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
		settings.images.LAVA.push(loadImage(io));
	});

	player.OBJECT = new Hero;
	items.HEALTH_BOTTLE = new Item(settings.images.HEALTH_BOTTLE, true, 20);
	items.ARMOUR_1 = new Item(settings.images.ARMOUR_1, true, 21);
	items.ARMOUR_2 = new Item(settings.images.ARMOUR_2, true, 22);
	items.ARMOUR_3 = new Item(settings.images.ARMOUR_3, true, 23);

	bullets.push(new Bullet(41, 1, settings.images.MONSTER_1_BULLET, null, null)); // Continue...
}

function draw() {
	frameRate(30);

	image(settings.images.BACKGROUND, 0, 0, settings.sizes.width, settings.sizes.height);

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

	Object.values(items).forEach(io => {
		if(io.isVisible) {
			touchableElements.push(io);
			io.render();
		}
	});

	bullets.forEach(io => {
		io.render();
	});

	player.OBJECT.render().update().regenerate();
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