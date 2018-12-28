// Prototype

/*
	Monsters -> ground, air,
	Weapons, Menu, Levels, Lightnings,
	Lava, Sounds,
	Animations, End Animations,
	Mate, Monsters Portal

	HUD -> Damage, Speed, Fireballs
*/

let player = {
	idle: null,
	run: null,
	jump: null,
	fly: null,
	OBJECT: null
},
	monsters = [];

const settings = {
	canvas: {
		height: 445, // 445
		width: 850, // 800 - 850
		FPS: 30,
	},
	inGame: true,
	playerHBHeight: 17.5, // 17.5
	gameAssets: {
		BACKGROUND: {
			type: "THEME",
			model: null
		},
		BLOCK: {
			id: 1,
			type: "BLOCK",
			model: null
		},
		LAVA: {
			id: 2,
			type: "BLOCK",
			model: []
		},
		ARMOR_1: {
			id: 20,
			type: "ITEM",
			health: 15,
			model: null
		},
		ARMOR_2: {
			id: 21,
			type: "ITEM",
			health: 25,
			model: null
		},
		ARMOR_3: {
			id: 22,
			type: "ITEM",
			health: 45,
			model: null
		},
		HELMET: {
			id: 23,
			type: "ITEM",
			health: 30,
			model: null
		},
		BOOTS: {
			id: 24,
			type: "ITEM",
			speed: 5,
			limit: 600,
			model: null
		},
		HEALTH_BOTTLE: {
			id: 25,
			type: "ITEM",
			health: 120,
			model: null
		},
		MATE_SPAWNER: {
			name: "Mate",
			id: 26,
			type: "ITEM",
			model: null
		},
		HERO_BULLET: {
			id: 40,
			type: "BULLET",
			model: null
		},
		MONSTER_1_BULLET: {
			id: 41,
			type: "BULLET",
			model: null
		},
		MONSTER_2_BULLET: {
			id: 41,
			type: "BULLET",
			model: null
		},
		LIZARD: {
			id: 90,
			type: "ENTITY",
			model: null
		}
	},
	itemKeys: [
		70, 71,
		66, 78
	]
}

let touchableElements = [],
	items = {},
	bullets = [],
	bulletsID = 0,
	itemsRefresh = {
		started: false,
		wait: 0,
		delta: 0
	}

// 0 - void
// 1 - block
// 2 - lava
const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
			{ x: ex, y: ey } = this.pos;

		if(
			(px + width >= ex) && (px <= ex + this.size) && // x (left, right)
			(py + height >= ey) && (py <= ey + this.size) // y (top, bottom)
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
	constructor(id = 0, race, pos, maxHealth = 100, currentHealth, models, width, height, regenPower, damage, speed, jh) {
		this.isAlive = true;
		this.race = race;
		this.id = id;

		this.models = models;
		this.model = this.models.idle || this.models;

		this.damage = damage;

		this.pos = pos || {
			x: 0,
			y: 0
		}

		this.width = width;
		this.height = height;
		if(!this.width || !this.height) {
			alert("ERROR! Check the console!");
			throw new Error("We couldn't load creature's dimensions. Please, provide these values.")
		}

		this.gravity = 30 / settings.canvas.FPS;
		this.velocity = 0;

		this.speed = speed;
		this.jumpHeight = jh;
		this.movement = 0;
		this.direction = 1;

		this.maxHealth = maxHealth;
		this.health = currentHealth || maxHealth;

		if(regenPower) {
			this.regenDelta = 0;
			this.regenPower = regenPower;
		}

		this.set = {
			helmet: null,
			armor: null
		}
	}

	update() {
		if(!this.isAlive) return this;

		let testYPassed = true,
			testXPassed = true,
			damage = 0,
			speed = this.speed + ((this.set.boots && this.set.boots.speed) || 1);

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
					x: this.pos.x + this.movement * speed,
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
						if(this.race === 'hero') {
							this.health += settings.gameAssets.HEALTH_BOTTLE.health;
							if(this.health > this.maxHealth) this.health = this.maxHealth;
						}
					break;
					case settings.gameAssets.ARMOR_1.id:
						delete items.ARMOR_1;
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_1",
								health: settings.gameAssets.ARMOR_1.health
							}
						}
					break;
					case settings.gameAssets.ARMOR_2.id:
						delete items.ARMOR_2;
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_2",
								health: settings.gameAssets.ARMOR_2.health
							}
						}
					break;
					case settings.gameAssets.ARMOR_3.id:
						delete items.ARMOR_3;
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_3",
								health: settings.gameAssets.ARMOR_3.health
							}
						}
					break;
					case settings.gameAssets.HELMET.id:
						delete items.HELMET;
						if(this.race === 'hero') {
							this.set.helmet = {
								name: "HELMET",
								health: settings.gameAssets.HELMET.health
							}
						}
					break;
					case settings.gameAssets.BOOTS.id:
						delete items.BOOTS;
						if(this.race === 'hero') {
							this.set.boots = {
								name: "BOOTS",
								speed: settings.gameAssets.BOOTS.speed,
								limit: settings.gameAssets.BOOTS.limit,
							}
						}
					break;
					case settings.gameAssets.MATE_SPAWNER.id:
						delete items.MATE_SPAWNER;
						if(this.race === 'hero') {
							let a = this.items,
								b = settings.itemKeys;

							if(a.length > b.length) a.splice(0, 1);

							a.push({
								name: "MATE_SPAWNER",
								runKey: b[a.length]
							});
						}
					break;
					default:break;
				}
			}
		});

		this.receiveDamage(damage);

		this.velocity += this.gravity;
		if(testYPassed) {
			this.pos.y += this.velocity;
		}

		if(testXPassed) {
			let a = this.set.boots;

			if(a) {
				a.limit -= abs(this.movement * speed);
				if(a.limit <= 0) this.set.boots = null;
			}

			this.pos.x += this.movement * speed;

			if(this.movement) this.direction = Math.sign(this.movement);

			if(this.pos.x + this.width > settings.canvas.width && this.race !== 'monster') {
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
		let { helmet: b, armor: c } = this.set,
			d = () => (this.health <= 0) ? this.declareDeath(this.race) : null;

		if(b) {
			let e = b.health - a;
			if(e > 0) {
				b.health = e;
			} else if(e === 0) {
				delete this.set.helmet;
			} else {
				this.health -= a -= b.health;
				d();
				delete this.set.helmet;
			}
		} else if(c) {
			let e = c.health - a;
			if(e > 0) {
				c.health = e;
			} else if(e === 0) {
				delete this.set.armor;
			} else {
				this.health -= a -= c.health;
				d();
				delete this.set.armor;
			}
		} else {
			this.health -= a;
			d();
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
		this.movement = mov;
		this.touches = { x: false, y: false };
	}

	jump() {
		if(!this.jumps) return;

		this.velocity = -this.jumpHeight;
		if(this.strictJump) this.jumps--;
	}

	declareDeath(entity = 'monster') {
		this.isAlive = false;
		this.health = 0;
		this.set = {}

		if(entity === 'hero') {
			settings.inGame = false;
			document.getElementById('defaultCanvas0').style.filter = "grayscale(100%)"; // XXX
			/*
				The p5.js library provides filter() function,
				but it needs a lot of memory.
				So, 'll' use CSS filter.
			*/
		} else if(entity === 'monster') {
			monsters.splice(this.id, 1);
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
		let a = touchableElements.filter(io => io.type !== this.type),
			b = true;
		a.forEach(io => {
			let c = io.predictObstacle(
				{
					x: this.pos.x + this.direction.x * this.speed,
					y: this.pos.y + this.direction.y * this.speed,
				},
				this.size,
				this.size
			);

			if(c) {
				b = false;

				let d = settings.gameAssets;
				delete items[Object.keys(d).filter(io => d[io].id === c)[0]];
			}
		})

		if(b) {
			this.pos.x += this.direction.x * this.speed;
			this.pos.y += this.direction.y * this.speed;
		}

		if(
			!b ||
			this.pos.x > settings.canvas.width ||
			this.pos.x + this.size < 0
		) bullets.splice(bullets.findIndex(io => io.id === this.id), 1); // splice self

		return this;
	}
}

class Hero extends Creature {
	constructor() {
		super(0, 'hero', null, 125, 125, {
			idle: player.idle,
			run: player.run,
			jump: player.jump,
			fly: player.fly,
		}, 21, 35, 5, 20, 5 / (settings.canvas.FPS / 30), 9);

		// this.width = 21; // this.model.width -> 1?
		// this.height = 35; // this.model.height -> 1?

		this.strictJump = true;
		this.maxJumps = 3;
		this.jumps = 0;

		this.items = [];
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

		// Draw the helmet bar
		if(this.set.helmet) {
			noStroke();
			fill(0, 255, 0);
			rect(0, 0, settings.canvas.width / 100 * (100 / (this.maxHealth / this.set.helmet.health)), settings.playerHBHeight);
		}

		{ // Draw effects
			let a = 20, // icon size
				b = 5, // margin
				c = Object.values(this.set)
						.filter(io => io)
						.map(io => io.name);

			c.forEach((io, ia) => {
				let c = settings.gameAssets[io].model;
				if(!c) return;

				fill(255);
				image(c, ia * (a + b) + b, settings.playerHBHeight + b, a, a);
			});

		}

		{ // Draw items
			let a = 20, // icon size
				b = 10; // padding

			textFont(mainFont);
			textSize(25);
			textAlign(RIGHT);
			fill(255);

			this.items.forEach((io, ia) => {
				let c = settings.gameAssets[io.name];
				if(!c) return;

				text(
					`${ c.name } ( ${ String.fromCharCode(io.runKey).toLowerCase() } )`,
					settings.canvas.width - a - b * 2,
					settings.playerHBHeight * 2 + ia * (15 + b)
				);

				image(
					c.model,
					settings.canvas.width - a - b,
					settings.playerHBHeight + 5 + ia * (15 + b),
					a, a
				)
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
	}

	useItem(a) {
		if(!this.isAlive) return;

		let b = this.items,
			c = b[b.findIndex(({ runKey: b }) => b === a)];

		if(!c) return;
		else console.log("ITEM:", c.name);
	}
}

class Monster extends Creature {
	constructor(health, model, regen = 1, pos, damage = 10, size) {
		super(
			monsters.length,
			'monster',
			pos,
			health,
			health,
			model,
			size,
			size,
			regen,
			damage,
			3,
			2
		);

		this.size = size;
	}

	render() {
		fill(255, 0, 0);
		rect(
			this.pos.x - this.size / 3.5,
			this.pos.y - this.size / 2,
			this.size * 1.5 / 100 * (100 / (this.maxHealth / this.health)),
			10
		);
		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}
}

class Lizard extends Monster {
	constructor() {
		super(120, settings.gameAssets.LIZARD.model, 0, {
			x: settings.canvas.width - 30 - 100,
			y: 0
		}, 20, 30);
	}

	think() {
		this.movement = -1;
	}
}

class Item extends Element {
	constructor(model, isVisible, typenum) {
		super(false, 0, 0, typenum);

		this.size = 30;
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

			// Prevent spawn under lava
			if(
				!d || d.type === settings.gameAssets.LAVA.id
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
	frameRate(settings.canvas.FPS);

	settings.gameAssets.BACKGROUND.model       = loadImage('./assets/background.jpg');
	settings.gameAssets.BLOCK.model            = loadImage('./assets/block.png');
	settings.gameAssets.HEALTH_BOTTLE.model    = loadImage('./assets/items/heal.png');
	settings.gameAssets.ARMOR_1.model          = loadImage('./assets/items/arm1.png');
	settings.gameAssets.ARMOR_2.model          = loadImage('./assets/items/arm2.png');
	settings.gameAssets.ARMOR_3.model          = loadImage('./assets/items/arm3.png');
	settings.gameAssets.HERO_BULLET.model      = loadImage('./assets/bullets/fireball.png');
	settings.gameAssets.MONSTER_1_BULLET.model = loadImage('./assets/bullets/monster1.gif');
	settings.gameAssets.MONSTER_2_BULLET.model = loadImage('./assets/bullets/monster2.gif');
	settings.gameAssets.BOOTS.model            = loadImage('./assets/items/boots.png');
	settings.gameAssets.HELMET.model           = loadImage('./assets/items/helm.png');
	settings.gameAssets.MATE_SPAWNER.model     = loadImage('./assets/items/mateSpawner.png');
	settings.gameAssets.LIZARD.model           = loadImage('./assets/monsters/lizard.gif');
	player.idle                                = loadImage('./assets/hero/idle.gif');
	player.run                                 = loadImage('./assets/hero/run.gif');
	player.jump                                = loadImage('./assets/hero/jump.png');
	player.fly                                 = loadImage('./assets/hero/fly.gif');

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
	monsters.push(new Lizard());

	// items.HEALTH_BOTTLE = new Item(settings.gameAssets.HEALTH_BOTTLE.model, true, settings.gameAssets.HEALTH_BOTTLE.id);
	// items.ARMOR_1 = new Item(settings.gameAssets.ARMOR_1.model, true, settings.gameAssets.ARMOR_1.id);
	// items.ARMOR_2 = new Item(settings.gameAssets.ARMOR_2.model, true, settings.gameAssets.ARMOR_2.id);
	// items.ARMOR_3 = new Item(settings.gameAssets.ARMOR_3.model, true, settings.gameAssets.ARMOR_3.id);
	// items.HELMET = new Item(settings.gameAssets.HELMET.model, true, settings.gameAssets.HELMET.id);
	// items.BOOTS = new Item(settings.gameAssets.BOOTS.model, true, settings.gameAssets.BOOTS.id);
	// items.BOOTS = new Item(settings.gameAssets.BOOTS.model, true, settings.gameAssets.BOOTS.id);
	// items.MATE_SPAWNER = new Item(settings.gameAssets.MATE_SPAWNER.model, true, settings.gameAssets.MATE_SPAWNER.id);
}

function draw() {
	image(settings.gameAssets.BACKGROUND.model, 0, 0, settings.canvas.width, settings.canvas.height);

	if(++itemsRefresh.delta >= itemsRefresh.wait) { // slow computers?
		if(!itemsRefresh.started) {
			itemsRefresh.started = true;
		} else { // spawn random item
			let a = settings.gameAssets,
				b = Object.keys(a).filter(io => a[io].type === "ITEM"),
				e = b[floor(random(b.length))],
				{ model, id } = a[e];

			items[e] = new Item(model, true, id)

		}

		itemsRefresh.wait = round(random(2000, 48000));
		itemsRefresh.delta = 1;
	}

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

	monsters.forEach(io => {
		io.render().update().think();
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
	} else {
		player.OBJECT.useItem(keyCode)
	}
}

function keyReleased() {
	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos(0);
	}
}