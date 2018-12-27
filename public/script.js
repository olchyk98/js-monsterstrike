// Prototype

/*
	Monsters -> ground, air,
	Weapons, Menu, Levels, Lightnings,
	Lava, Sounds,
	Animations, End Animations,

	HUD -> Damage, Speed, Fireballs
*/

let player = {
		idle: null,
		run: null,
		jump: null,
		fly: null,
		OBJECT: null
	}

const settings = {
	canvas: {
		height: 445, // 445
		width: 850 // 800 - 850
	},
	inGame: true,
	playerHBHeight: 17.5, // 17.5
	gameAssets: {
		BACKGROUND: {
			model: null
		},
		BLOCK: {
			id: 1,
			model: null
		},
		LAVA: {
			id: 2,
			model: []
		},
		ARMOR_1: {
			id: 21,
			health: 15,
			model: null
		},
		ARMOR_2: {
			id: 22,
			health: 25,
			model: null
		},
		ARMOR_3: {
			id: 23,
			health: 45,
			model: null
		},
		HEALTH_BOTTLE: {
			id: 20,
			health: 120,
			model: null
		},
		HERO_BULLET: {
			id: 40,
			model: null
		},
		MONSTER_1_BULLET: {
			id: 41,
			model: null
		},
		MONSTER_2_BULLET: {
			id: 41,
			model: null
		}
	}
}

let touchableElements = [],
	items = {},
	bullets = [],
	bulletsID = 0;

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
			this.size = settings.canvas.width / map[0].length;  // 30

			this.pos = {
				x: leftIndex * this.size,
				y: settings.canvas.height - bottomIndex * this.size
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
		image(settings.gameAssets.BLOCK.model, this.pos.x, this.pos.y, this.size, this.size);
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
		image(settings.gameAssets.LAVA.model[this.currentSprite], this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		if(!settings.inGame) return;

		if(++this.currentFrame % 5 === 0 && ++this.currentSprite > settings.gameAssets.LAVA.model.length - 1) {
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
		this.direction = 1;

		this.maxHealth = maxHealth;
		this.health = currentHealth || maxHealth;

		if(regenPower) {
			this.regenDelta = 0;
			this.regenPower = regenPower;
		}

		this.effects = [];
		this.set = {
			armor: null
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
					this.jumps = 0;
				} else {
					this.jumps = this.maxJumps;
				}

				if(yTest && testYPassed) {
					testYPassed = false;
					this.velocity = this.gravity;
				}

				if(xTest && testXPassed) {
					testXPassed = false;
				}
			} else { // if material is health bottle
				if(xTest !== yTest) return;

				switch(xTest) {
					case settings.gameAssets.HEALTH_BOTTLE.id: // health bottle
						delete items.HEALTH_BOTTLE;
						this.health += settings.gameAssets.HEALTH_BOTTLE.health;
						if(this.health > this.maxHealth) this.health = this.maxHealth;
					break;
					case settings.gameAssets.ARMOR_1.id: // armor 1
						delete items.ARMOR_1;
						this.set.armor = {
							name: "ARMOR_1",
							health: settings.gameAssets.ARMOR_1.health
						}
					break;
					case settings.gameAssets.ARMOR_2.id: // armor 2
						delete items.ARMOR_2;
						this.set.armor = {
							name: "ARMOR_2",
							health: settings.gameAssets.ARMOR_2.health
						}
					break;
					case settings.gameAssets.ARMOR_3.id: // armor 3
						delete items.ARMOR_3;
						this.set.armor = {
							name: "ARMOR_3",
							health: settings.gameAssets.ARMOR_3.health
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
			if(this.movement) this.direction = Math.sign(this.movement);

			if(this.pos.x + this.width > settings.canvas.width) {
				this.pos.x = settings.canvas.width - this.width;
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

		let с = this.set.armor;
		if(с) {
			if(с.health - a < 0) {
				a -= с.health;
				this.set.armor = null;
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
}

class Bullet extends Element {
	constructor(id, hostnum, damage = 1, model, pos, dir, speed) {
		super(false, -1, -1, hostnum);

		this.size = 25;

		this.damage = damage;
		this.model = model;

		this.pos = pos || { x: 0, y: 0 };
		this.direction = dir || { x: 1, y: 0 };

		this.speed = speed;
	}

	render() {
		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		this.pos.x += this.direction.x * this.speed;
		this.pos.y += this.direction.y * this.speed;

		if(
			this.pos.x > settings.canvas.width ||
			this.pos.x + this.size < 0
		) bullets.splice(bullets.findIndex(io => io.id === this.id), 1); // splice self

		return this;
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

		this.damage = 20;
	}

	render() {
		// Draw hero
		image(this.model, this.pos.x, this.pos.y);

		// Draw the health bar
		noStroke();
		fill(255, 0, 0);
		rect(0, 0, settings.canvas.width / 100 * (100 / (this.maxHealth / this.health)), settings.playerHBHeight);

		textFont(mainFont);
		textSize(24);
		textAlign(CENTER);
		fill(255);
		text(`Health (${ round(100 / (this.maxHealth / this.health)) })`, settings.canvas.width / 2, 13);

		// Draw the armor bar
		if(this.set.armor) {
			noStroke();
			fill(15, 0, 255);
			rect(0, 0, settings.canvas.width / 100 * (100 / (this.maxHealth / this.set.armor.health)), settings.playerHBHeight);
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
				let c = settings.gameAssets[io].model;
				if(!c) return;

				fill(255);
				image(c, ia * (a + b) + b, settings.playerHBHeight + b, a, a);
			});

		}

		return this;
	}

	shoot() {
		if(!this.isAlive) return;

		bullets.push(new Bullet(
			++bulletsID, // id
			40, // hostnum
			this.damage, // damage
			settings.gameAssets.HERO_BULLET.model, // model
			{ // pos
				x: this.pos.x + ((this.direction === 1) ? 15 : -15),
				y: this.pos.y // /2?
			},
			{
				x: this.direction,
				y: 0
			}, // dir
			10 // speed
		));
		// hostnum, damage = 1, model, pos, dir, speed
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

			// Validate if user can access this position
			if(
				!d || d.typenum === settings.gameAssets.BLOCK.id
			) return aa();

			// Validate if no items on this position
			e = false;
			Object.values(items).map(io => {
				if(
					io.pos &&
					io.type !== this.type &&
					io.pos.x === d.pos.x &&
					io.pos.y === d.pos.y
				) e = true;
			});
			if(e) return aa();

			// Validate if no blocks on this position
			e = false;
			map.forEach(io => io.forEach(({ object }) => {
				if( // XXX
					object &&
					object.pos.x === d.pos.x &&
					object.pos.y === d.pos.y - d.size
				) e = true;
			}));
			if(e) return aa();

			return d;
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
	createCanvas(settings.canvas.width, settings.canvas.height);

	settings.gameAssets.BACKGROUND.model       = loadImage('./assets/background.jpg');
	settings.gameAssets.BLOCK.model            = loadImage('./assets/block.png');
	settings.gameAssets.HEALTH_BOTTLE.model    = loadImage('./assets/items/heal.png');
	settings.gameAssets.ARMOR_1.model         = loadImage('./assets/items/arm1.png');
	settings.gameAssets.ARMOR_2.model         = loadImage('./assets/items/arm2.png');
	settings.gameAssets.ARMOR_3.model         = loadImage('./assets/items/arm3.png');
	settings.gameAssets.HERO_BULLET.model      = loadImage('./assets/bullets/fireball.png');
	settings.gameAssets.MONSTER_1_BULLET.model = loadImage('./assets/bullets/monster1.gif');
	settings.gameAssets.MONSTER_2_BULLET.model = loadImage('./assets/bullets/monster2.gif');
	player.idle                          = loadImage('./assets/hero/idle.gif');
	player.run                           = loadImage('./assets/hero/run.gif');
	player.jump                          = loadImage('./assets/hero/jump.png');
	player.fly                           = loadImage('./assets/hero/fly.gif');

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
		settings.gameAssets.LAVA.model.push(loadImage(io));
	});

	player.OBJECT = new Hero;
	items.HEALTH_BOTTLE = new Item(settings.gameAssets.HEALTH_BOTTLE.model, true, settings.gameAssets.HEALTH_BOTTLE.id);
	items.ARMOR_1 = new Item(settings.gameAssets.ARMOR_1.model, true, settings.gameAssets.ARMOR_1.id);
	items.ARMOR_2 = new Item(settings.gameAssets.ARMOR_2.model, true, settings.gameAssets.ARMOR_2.id);
	items.ARMOR_3 = new Item(settings.gameAssets.ARMOR_3.model, true, settings.gameAssets.ARMOR_3.id);
}

function draw() {
	frameRate(30);

	image(settings.gameAssets.BACKGROUND.model, 0, 0, settings.canvas.width, settings.canvas.height);

	if(!settings.inGame) {
		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(255);
		text('YOU DIED!', settings.canvas.width / 2, settings.canvas.height / 2 + 20);
	}

	touchableElements = [];

	map.forEach((io, ia, arr1) => {
		io.forEach((ik, il, arr2) => {
			if(ik) {
				if(Number.isInteger(ik)) { // generate class
					switch(ik) {
						case settings.gameAssets.BLOCK.id: // block
							var a = new Block(il, arr1.length - ia, ik);
						break;
						case settings.gameAssets.LAVA.id: // lava
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
		touchableElements.push(io);
		io.render().update();
	});

	player.OBJECT.render().update().regenerate();
}

function keyPressed() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos((keyCode === 65) ? -1 : 1);
	} else if(keyCode === 32) {
		player.OBJECT.jump();
	} else if(keyCode === 13) {
		player.OBJECT.shoot();
	}
}

function keyReleased() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos(0);
	}
}