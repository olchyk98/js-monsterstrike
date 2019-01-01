// Prototype

/*
	Monsters -> ground, air,
	Lava,
	Animations, Damage light,
	Mage,
	Rages ( stronger monsters:
		hp: x2,
		damage: x2,
		hero regeneration: x.5
	), Raves (more monsters),
	Boss, Spikes (Complete assets->items->1)

	Sounds, BgMusic - Undertale - Megalovania

	Menu,
	Save Game / Restore Game (Local Storage).

	///
	meteor (+)
	shield (+)
	gorilla (+)
	fix gorilla bomb delta (+)
	bomb (+)
	bird (+)
	mage (+)
	monsters can't attack mage-fix (+)
	mage -> display armor (+)
	_1.1 : story lines for items, monsters, hero (ex: Gorilla) (+)
	_1.2 : rave (+),
	_1.3 : rage (+),
	_1.4 : boss --> till levels,
	_1.5 : sounds,
	_1.6 : menu -> play, controls, rules,
	_1.7 : auto save => (if exit during action -> e-dialog), settings,

	remove p5js library -> clear canvas
*/

/*
	
	-- PERFORMANCE --
	VOID: Mage -> run, jump, attack

*/

const settings = {
	canvas: {
		height: 445, // 445
		width: 850, // 800 - 850
		FPS: 30,
		target: null
	},
	inGame: true,
	playerHBHeight: 17.5, // 17.5
	rave: {
		ravesTime: 35,
		ravesTimeRange: 15
	},
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
		ARMOR_4: {
			id: 23,
			type: "ITEM",
			health: 115,
			model: null
		},
		HELMET: {
			id: 24,
			type: "ITEM",
			health: 30,
			model: null
		},
		BOOTS: {
			id: 25,
			type: "ITEM",
			speed: 5,
			limit: 600,
			model: null
		},
		SHIELD_ITEM: {
			id: 26,
			type: "ITEM",
			model: null
		},
		HEALTH_BOTTLE: {
			id: 27,
			type: "ITEM",
			health: 120,
			model: null
		},
		MAGE_SPAWNER: {
			name: "Mage",
			id: 28,
			type: "ITEM",
			model: null
		},
		METEOR_SUMMONER: {
			name: "Meteor",
			id: 29,
			type: "ITEM",
			model: null
		},
		METEOR: {
			id: 50,
			type: "OBJECT",
			model: null,
			speed: 24
		},
		SHIELD: {
			id: 51,
			type: "OBJECT",
			model: null,
			time: 175 // frames // 1000(30fps) -> 32s, 175 ~ 6s
		},
		BOMB: {
			id: 52,
			type: "OBJECT",
			model: null
		},
		HERO_BULLET: {
			id: 70,
			type: "BULLET",
			model: null
		},
		LIZARD_BULLET: {
			id: 71,
			type: "BULLET",
			model: null
		},
		MONSTER_2_BULLET: {
			id: 72,
			type: "BULLET",
			model: null
		},
		MAGE_BULLET: {
			id: 73,
			type: "BULLET",
			model: null
		},
		SLIME: {
			id: 90,
			class: 'Slime',
			type: "MONSTER",
			subType: "GROUND",
			model: null,
			health: 75,
			regeneration: 0,
			damage: 15,
			attackDelta: 30,
			minSpeed: 1.5,
			maxSpeed: 2,
			maxJumps: 1,
			jumpHeight: 12
		},
		LIZARD: {
			id: 91,
			class: 'Lizard',
			type: "MONSTER",
			subType: "GROUND",
			model: null,
			health: 20,
			regeneration: 5,
			minSpeed: 4.5,
			maxSpeed: 5,
			damage: 10,
			bulletRange: 400,
			bulletSpeed: 20,
			attackDelta: 40,
			maxJumps: 2,
			jumpHeight: 12
		},
		GORILLA: {
			id: 92,
			class: 'Gorilla',
			type: "MONSTER",
			subType: "GROUND",
			model: null,
			health: 200,
			regeneration: 75,
			minSpeed: 1,
			maxSpeed: 1.5,
			damage: 20,
			attackDelta: 20,
			bombDelta: 200,
			maxJumps: 1,
			jumpHeight: 5,
			bombRange: 400,
			bombTime: 200,
			bombDamage: 20
		},
		BIRD: {
			id: 93,
			class: 'Bird',
			type: "MONSTER",
			subType: "FLY",
			model: null,
			health: 5,
			minSpeed: 5,
			maxSpeed: 15,
			bombDelta: 150,
			bombTime: 100,
			bombDamage: 80,
			throwRange: 30
		},
		SMOKE: {
			id: 110,
			type: "VISUAL",
			model: []
		},
		ELECTRO: {
			id: 111,
			type: "VISUAL",
			model: []
		},
		MAGE: {
			id: 130,
			type: "HERO",
			models: {
				app: [],
				attack: [],
				go: [],
				jump: [],
				stay: [],
				summon: [],
				dead: []
			},
			health: 100,
			regeneration: 15,
			shootDamage: 5,
			hitDamage: 20,
			teleportDamage: 15,
			minSpeed: 2,
			maxSpeed: 6,
			bulletRange: Infinity,
			bulletSpeed: 20,
			shootDelta: 60,
			hitDelta: 180,
			teleportDelta: 150,
			hitRange: 300,
			alive: 1000 // dep frames
		}
	},
	itemKeys: [
		70, 71,
		66, 78
	]
}

let player = {
	id: 600,
	models: {
		idle: null,
		run: null,
		jump: null,
		fly: null,
	},
	OBJECT: null,
	heatlh: 125,
	regeneration: 5,
	damage: 10,
	minSpeed: 4.5,
	maxSpeed: 5,
	bulletRange: settings.canvas.width * .75
},
	monsters = [],
	monstersID = 0,

	bullets = [],
	bulletsID = 0,

	meteors = [],
	meteorsID = 0,

	bombs = [],
	bombsID = 0,

	mages = [],
	magesID = 0,

	items = [],
	itemsID = 0,
	itemsRefresh = {
		started: false,
		wait: 0,
		delta: 0
	},

	touchableElements = [],

	session = {
		startTime: settings.canvas.FPS * 5, // 5s
		monsterMinTime: settings.canvas.FPS, // 1s
		monsterMaxTime: settings.canvas.FPS * 3, // 3s
		monsterDelta: 0,

		isRave: false,
		raveDelta: Math.floor(Math.random() * 2000),
		raveEnd: 1200,
		ravesTi: Infinity, // null

		isRage: false,
		rageDelta: Math.floor(Math.random() * 4000),
		rageEnd: 1200,
		ragesTi: Infinity, // null
	}

// 0 - void
// 1 - block
// 2 - lava
const map = [
	[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Element {
	constructor(isBlock = false, leftIndex = -1, bottomIndex = -1, typenum, id = 0) {

		this.isBlock = isBlock;
		if(isBlock) {
			this.size = settings.canvas.width / map[0].length; // 30

			this.leftIndex = leftIndex;
			this.bottomIndex = bottomIndex;

			this.pos = {
				x: leftIndex * this.size,
				y: settings.canvas.height - (map.length - bottomIndex) * this.size
			}
		}

		this.type = typenum;
		this.id = id;
	}

	predictObstacle(pos, width, height) {
		let { x: px, y: py } = pos,
			{ x: ex, y: ey } = this.pos;

		if(
			(px + width >= ex) && (px <= ex + this.size) && // x (left, right)
			(py + height >= ey) && (py <= ey + this.size) // y (top, bottom)
		) {
			return this;
		}
	}
}

class Block extends Element {
	constructor(leftIndex, bottomIndex, number) {
		super(true, leftIndex, bottomIndex, number, 0);
	}

	render() {
		image(settings.gameAssets.BLOCK.model, this.pos.x, this.pos.y, this.size, this.size);
		// rect(this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}
}

class Lava extends Element {
	constructor(leftIndex, bottomIndex, number) {
		super(true, leftIndex, bottomIndex, number, 0);

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
	constructor(id = 0, race, pos, maxHealth, currentHealth, models, width, height, regenPower, damage, asl, speed, jh, maxJumps = 3, bulletRange = 0, bulletSpeed = 0, typenum) {
		this.isAlive = true;

		this.race = race;
		this.id = id;
		this.typenum = typenum;

		this.models = models;
		this.model = (this.models && this.models.idle) || this.models;

		this.damage = damage;
		this.bulletRange = bulletRange;
		this.bulletSpeed = bulletSpeed;

		this.asl = asl; // Attack Speed Limit

		if(typeof asl !== "object") {
			this.aslDelta = 0;
		} else {
			let a = Object.assign({}, asl);

			Object.keys(a).forEach(io => {
				a[io] = 0;
			});

			this.aslDelta = a;
		}


		this.pos = pos || {
			x: 0,
			y: 0
		}

		this.strictJump = true;
		this.maxJumps = maxJumps;
		this.jumps = 0;

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
			armor: null,
			shield: null
		}
	}

	update() {
		if(!this.isAlive) return this;

		if(typeof this.aslDelta !== "object") { // 22
			if(--this.aslDelta < 0) {
				this.aslDelta = 0;
			}
		} else { // {}
			Object.keys(this.aslDelta).forEach(io => {
				if(--this.aslDelta[io] < 0) this.aslDelta[io] = 0;
			});
		}

		if(this.race === 'hero' && this.set.shield && --this.set.shield.time <= 0) {
			this.set.shield = null;
		}

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

			if(xTest) {
				var xTestObject = xTest;
				xTest = xTest.type;
			}
			if(yTest) {
				var yTestObject = yTest;
				yTest = yTest.type;
			}

			if([xTest, yTest].includes(1) || [xTest, yTest].includes(2)) { // if magerial is block or lava
				if([xTest, yTest].includes(2)) {
					if(!damage) damage += 10;
					if(this.race === 'hero') this.jumps = 0;
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

				// Notify monster about blocks around him.
				if(this.race === 'monster' && this.detectObstacle && settings.inGame && this.isAlive) {
					let a = xTestObject,
						b = yTestObject;
					
					(a || b) && this.detectObstacle(a, b);
				}
			} else if(xTest || yTest) { // if magerial is health bottle
				if(xTest !== yTest) return;

				switch(xTest) {
					case settings.gameAssets.HEALTH_BOTTLE.id:
						xTestObject.destroy();
						this.health += settings.gameAssets.HEALTH_BOTTLE.health;
						if(this.health > this.maxHealth) this.health = this.maxHealth;
					break;
					case settings.gameAssets.ARMOR_1.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_1",
								health: settings.gameAssets.ARMOR_1.health
							}
						}
					break;
					case settings.gameAssets.ARMOR_2.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_2",
								health: settings.gameAssets.ARMOR_2.health
							}
						}
					break;
					case settings.gameAssets.ARMOR_3.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_3",
								health: settings.gameAssets.ARMOR_3.health
							}
						}
					break;
					case settings.gameAssets.ARMOR_4.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.armor = {
								name: "ARMOR_4",
								health: settings.gameAssets.ARMOR_4.health
							}
						}
					break;
					case settings.gameAssets.HELMET.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.helmet = {
								name: "HELMET",
								health: settings.gameAssets.HELMET.health
							}
						}
					break;
					case settings.gameAssets.BOOTS.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.boots = {
								name: "BOOTS",
								speed: settings.gameAssets.BOOTS.speed,
								limit: settings.gameAssets.BOOTS.limit,
							}
						}
					break;
					case settings.gameAssets.SHIELD_ITEM.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.set.shield = {
								name: "SHIELD_ITEM",
								time: settings.gameAssets.SHIELD.time
							}
						}
					break;
					case settings.gameAssets.MAGE_SPAWNER.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.takeItem("MAGE_SPAWNER");
						}
					break;
					case settings.gameAssets.METEOR_SUMMONER.id:
						xTestObject.destroy();
						if(this.race === 'hero') {
							this.takeItem("METEOR_SUMMONER");
						}
					break;
					case settings.gameAssets.HERO_BULLET.id:
					case settings.gameAssets.MAGE_BULLET.id:
						if(this.race !== 'hero') {
							xTestObject.destroy();
							damage += xTestObject.damage;
						}
					break;
					case settings.gameAssets.LIZARD_BULLET.id:
						if(this.race !== 'monster') {
							xTestObject.destroy();
							damage += xTestObject.damage;
						}
					break;
					case settings.gameAssets.METEOR.id:
						if(this.race !== 'hero') {
							damage += xTestObject.damage;
						}
					break;
					default:break;
				}
			}
		});

		this.declareDamage(damage);

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

	declareDamage(a) {
		let { helmet: b, armor: c, shield: aa } = this.set,
			d = () => (this.health <= 0) ? this.declareDeath() : null;

		if(aa) {
			return;
		} else if(b) {
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
	}

	jump(iterations = 1) {
		for(let ma = 0; ma < iterations; ma++) {
			if(!this.jumps) return;
		
			this.velocity = -this.jumpHeight;
			if(this.strictJump) this.jumps--;
		}
	}

	declareDeath() {
		this.isAlive = false;
		this.health = 0;
		this.set = {}

		if(this.race === 'hero') {
			if(this.typenum === player.id) {
				settings.inGame = false;
				settings.canvas.target.style.filter = "grayscale(100%)";
				/*
					The p5.js library provides filter() function,
					but it needs a lot of memory.
					So, 'll' use CSS filter.
				*/
			} else if(this.typenum === settings.gameAssets.MAGE.id) {
				this.die();
			}
		} else if(this.race === 'monster') {
			let a = monsters;
			a.splice(a.findIndex(io => io.id === this.id), 1);
		}
	}
}

class Meteor extends Element {
	constructor(id, pos = null, dir = null, target) {
		let a = settings.gameAssets.METEOR;
		super(false, -1, -1, a.id, id);

		this.damage = 400;

		this.model = a.model;
		this.size = 150;

		this.speed = a.speed;
		{
			let b = target,
				c = settings.canvas,
				d = (b.x > c.width / 2);

			this.pos = pos || {
				y: b.y - c.height,
				x: (d) ? b.x - c.height : b.x + c.height
			}
			this.direction = {
				x: (d) ? 1 : -1 , // pos- => +, pos+ => -
				y: 1,
			}
		}

	}

	render() {
		push();
			tint(255, 100);
			image(this.model, this.pos.x, this.pos.y, this.size, this.size);
		pop();

		return this;
	}

	update() {
		this.pos.x += this.direction.x * this.speed;
		this.pos.y += this.direction.y * this.speed;
	}
}

class Bullet extends Element {
	constructor(id, hostnum, damage = 1, model, pos, dir, speed, rangeX) {
		super(false, -1, -1, hostnum, id);

		this.size = 25;

		this.damage = damage;
		this.model = model;

		this.rangeX = rangeX;
		this.ranged = 0;

		this.pos = pos || { x: 0, y: 0 };
		this.direction = dir || { x: 1, y: 0 };

		this.speed = speed;
	}

	render() {
		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		if(!settings.inGame) return;

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

			if(
				c && c.constructor.name !== this.constructor.name &&
				c.type !== settings.gameAssets.BOMB.id
			) { // c and is not a bullet and is not a bomb
				b = false;

				(c.destroy && c.destroy()); // if can be destroyed then destroy
			}
		})

		if(b) {
			let c = this.direction.x * this.speed;

			this.pos.x += c;
			this.ranged += c;
			if(this.ranged > this.rangeX) { // destroy
				this.destroy();
			}

			this.pos.y += this.direction.y * this.speed;
		}

		if(
			!b ||
			this.pos.x > settings.canvas.width ||
			this.pos.x + this.size < 0
		) this.destroy(); // splice self

		return this;
	}

	destroy() {
		bullets.splice(bullets.findIndex(io => io.id === this.id), 1);
	}
}

class Hero extends Creature {
	constructor(...props) {
		super(...props);

		this.items = [];
	}

	takeItem(item) {
		let a = this.items,
			b = settings.itemKeys,
			c = false;

		if(a.length > b.length - 1) {
			a.splice(0, 1);
			c = true;
		}

		a.forEach((io, ia, arr) => { // restore keys order
			arr[ia].runKey = b[ia];
		});

		a.push({
			name: item,
			runKey: b[a.length]
		});
	}

	useItem(a) {
		if(!this.isAlive) return;

		let b = this.items,
			c = b.findIndex(({ runKey: b }) => b === a); // Find the first item with that id and use it.

		if(c < 0) return;

		let d = settings.gameAssets[b[c].name].id; // get id
		b.splice(c, 1);

		switch(d) {
			case settings.gameAssets.MAGE_SPAWNER.id: {
				mages.push(new Mage(++magesID, this));
			}
			break;
			case settings.gameAssets.METEOR_SUMMONER.id: {
				let e = Object.assign({}, this.pos);
				e.y -= this.height * 2;

				e.height = 2;

				meteors.push(new Meteor(++meteorsID, null, null, e));
			}
			break;
			default:break;
		}
	}
}

class Player extends Hero {
	constructor() {
		super(
			0, // id
			'hero', // race
			null, // pos (default 0 - 0)
			player.heatlh, // maxHealth
			player.heatlh, // health
			{ // models / model
				idle: player.models.idle,
				run: player.models.run,
				jump: player.models.jump,
				fly: player.models.fly,
			},
			21, // width*
			35, // height*
			5, // regenPower
			20, // damage
			7.5, // asl (Attack Speed Limit)
			5 / (settings.canvas.FPS / 30), // speed
			9, // jh (Jump Height)
			3, // maxJumps
			player.bulletRange,
			10,
			player.id // typenum
		);

		// this.width = 21; // this.model.width -> 1?
		// this.height = 35; // this.model.height -> 1?
	}

	render() {
		// Draw hero
		image(this.model, this.pos.x, this.pos.y);

		{ // Draw the health bar
			let a;
			let b;

			if(!this.set.shield) {
				// ${ round(100 / (this.maxHealth / this.health)) }
				a = `Health (${ this.health }hp)`;
				b = "red";
			} else {
				a = `Shield (${ round(this.set.shield.time / settings.canvas.FPS) }s)`;
				b = "purple";
			}

			// Rectangle
			noStroke();
			fill(b);
			rect(0, 0, settings.canvas.width / 100 * (100 / (this.maxHealth / this.health)), settings.playerHBHeight);

			// Text
			textFont(mainFont);
			textSize(24);
			textAlign(CENTER);
			fill(255);
			text(a, settings.canvas.width / 2, 13);
		}

		if(!this.set.shield) {
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

		if(this.set.shield) { // Draw shield
			let a = 40; // size

			image(settings.gameAssets.SHIELD.model, this.pos.x + this.width / 2 - a / 2, this.pos.y + this.height / 2 - a / 2, a, a);

		}

		return this;
	}

	shoot() {
		if(!this.isAlive || this.aslDelta > 0) return;

		this.aslDelta = this.asl;

		bullets.push(new Bullet(
			++bulletsID, // id
			settings.gameAssets.HERO_BULLET.id, // hostnum
			this.damage, // damage
			settings.gameAssets.HERO_BULLET.model, // model
			{ // pos
				x: this.pos.x + ((this.direction === 1) ? 15 : -15),
				y: this.pos.y + this.height / 6
			},
			{
				x: this.direction,
				y: 0
			}, // dir
			this.bulletSpeed, // speed
			this.bulletRange // rangeX
		));
	}
}

class Mage extends Hero {
	/*
		Player's friend that always will come to the rescure if he asks. From the childhood he could to attract attention.
		When a portal with monsters was opened he learned special spells. By teleporting a target,
		he instantly throws it away from him.

		+ Attract monster's attention.
		- He can teleport only one monster.
	*/

	constructor(id, post) {
		let a = settings.gameAssets.MAGE;

		super(
			id,
			'hero',
			{
				x: post.pos.x + (post.direction * 45),
				y: 0
			},
			a.health,
			a.health,
			null, // init after the super action
			20,
			20,
			a.regeneration,
			a.hitDamage, // damage
			50, // asl
			5, // speed
			10, // jh
			2, // mj
			a.bulletRange,
			a.bulletSpeed,
			a.id
		);

		this.frame = 0;
		this.delay = 5;

		this.stable = false;
		this.target = null;

		this.models = a.models;
		this.status = "app"; // app, attack, go, stay, jump, summon, dead

		this.alive = a.alive;
		this.dead = false;

		this.shootAsl = a.shootDelta;
		this.shootDelta = 0;
		this.teleportAsl = a.teleportDelta;
		this.teleportDelta = 0;
		this.hitAsl = a.hitDelta;
		this.hitDelta = 0;

		this.hiting = true;
		this.hitFrame = 0;

		this.shootDamage = a.shootDamage;
		this.teleportDamage = a.teleportDamage;
	}

	render() {
		// Display hp and items

		// TODO: Action animations
		// Draw model
		let a = this.models[this.status][this.frame];

		if(a.height > this.height) { // I have no another idea how to fix that.
			this.pos.y -= a.height - this.height;
		}
		this.height = a.height;
		this.width = a.width;

		image(a.model, this.pos.x, this.pos.y, this.width, this.height);

		if(!this.set.shield) {
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
		}

		if(this.status !== 'app') {
			let a = 12.5,
				b = 10,
				c = 10,
				d = 45;

			// Draw alive time
			textFont(mainFont);
			textSize(24);
			textAlign(CENTER);
			fill(255);
			text(
				`${ floor(this.alive / settings.canvas.FPS) }s`,
				this.pos.x + d / 2 - c,
				this.pos.y - 7.5 - b
			);

			// Draw health bar
			fill('green');
			rect(
				this.pos.x - d / 2 + c,
				this.pos.y - 12.5,
				d / 100 * (100 / (this.maxHealth / this.health)),
				b
			);

			// Draw hit effect
			if(this.hitting) {
				let a = 100;

				image(
					settings.gameAssets.ELECTRO.model[this.hitFrame],
					this.pos.x - this.width - 5,
					this.pos.y - this.height + 10,
					a,
					a
				);
			}

			if(!this.set.shield) {
				// Draw the armor bar
				if(this.set.armor) {
					noStroke();
					fill(15, 0, 255);
					rect(
						this.pos.x - d / 2 + c,
						this.pos.y - 12.5,
						d / 100 * (100 / (this.maxHealth / this.set.armor.health)),
						b
					);
				}

				// Draw the helmet bar
				if(this.set.helmet) {
					noStroke();
					fill(0, 255, 0);
					rect(
						this.pos.x - d / 2 + c,
						this.pos.y - 12.5,
						d / 100 * (100 / (this.maxHealth / this.set.helmet.health)),
						b
					);
				}
			}
		}

		return this;
	}

	animate() {
		if(!this.dead && --this.alive <= 0) {
			this.die();
		}

		if(--this.shootDelta < 0) {
			this.shootDelta = 0;
		}
		if(--this.teleportDelta < 0) {
			this.teleportDelta = 0;
		}
		if(--this.hitDelta < 0) {
			this.hitDelta = 0;
		}

		if(this.hitting && ++this.hitFrame > settings.gameAssets.ELECTRO.model.length - 1) {
			this.hitting = false;
		}

		if(--this.delay < 0) {
			if(++this.frame > this.models[this.status].length - 1) {
				if(this.status === "app") {
					this.status = 'summon';
					this.stable = true;
				} else if(this.status === "dead" && this.dead) {
					mages.splice(mages.findIndex(io => io.id === this.id), 1);
				}
			}
			if(this.frame > this.models[this.status].length - 1) {
				this.frame = 0;
			}
			this.delay = 5;
		}

		return this;
	}

	think() {
		if(!this.target) {
			let a = monsters;

			let tr = null;
			if(a.length) { // monster
				if(a.length === 1) {
					tr = a[0];
				} else {
					let aa = (isTarget = false) => {
						return a.find(io => io.health === max(
							a.filter(io => (io.type === "GROUND" && io.isTarget === isTarget))
							.map(io => io.health)
						));
					}

					tr = aa(false);
					if(!tr) tr = aa(true);
				}
			} else {
				return this.pause();
			}

			this.target = tr;
			this.target.isTarget = true;
		} else { // validate target
			if(this.target.isAlive === false) { // notarget?
				this.target = null; // notarget
				return this.think(); // restart alg
			} else { // follow target
				// attack if y1=y2 and throw to random(mage or hero) if y1!=y2
				let b = 30, // y range
					c = 40, // x range
					d = this.target,
					e = abs(this.pos.x - d.pos.x),
					f = (
						(this.pos.y > d.pos.y - b) &&
						(this.pos.y < d.pos.y + d.size + b)
					);

				if(f && e > c && this.shootDelta <= 0) {
					this.shoot();
				} else if(this.teleportDelta <= 0 && e > c) { // throw + damage
					this.teleport(this.target);
				} else if(this.hitDelta <= 0 && e <= c) { // hit
					this.hit(this.target);
				}
			}
		}

		return this;
	}

	teleport(target) {
		this.teleportDelta = this.teleportAsl;
		this.target.pos = Object.assign({}, this.pos);

		this.hit(); // force
	}

	shoot() {
		this.shootDelta = this.shootAsl;
		bullets.push(new Bullet(
			++bulletsID, // id
			settings.gameAssets.MAGE_BULLET.id, // hostnum
			this.shootDamage, // damage
			settings.gameAssets.MAGE_BULLET.model, // model
			{ // pos
				x: this.pos.x,
				y: this.pos.y
			},
			{ // dir
				x: (this.target.pos.x > this.pos.x) ? 1 : -1,
				y: 0
			},
			this.bulletSpeed, // speed
			this.bulletRange // rangeX
		));
	}

	hit(target) {
		this.hitDelta = this.hitAsl;

		this.hitting = true;
		this.hitFrame = 0;

		let a = settings.gameAssets.MAGE;

		monsters.forEach(io => {
			if(
				(io.pos.x >= this.pos.x - a.hitRange && io.pos.x <= this.pos.x + this.width + a.hitRange) && // x
				(io.pos.y >= this.pos.y - a.hitRange && io.pos.y <= this.pos.y + this.height + a.hitRange) // y
			) {
				if(io.pos.x < this.pos.x) {
					io.pos.x -= 100;
				} else {
					io.pos.x -= 100;
				}
				io.velocity -= 15;
				io.declareDamage(a.hitDamage);
			}
		});

	}

	pause() {
		this.status = "dead";
	}

	die() {
		if(this.target) {
			monsters.find(io => io.id === this.target.id).isTarget = false;
		}

		this.dead = true;
		this.delay = 5;
		this.status = "dead";
		this.frame = 0;
	}
}

class Bomb extends Element {
	constructor(id, pos, time, damage, target = null, gstatic = true, color = 'red') {
		super(false, 0, 0, settings.gameAssets.BOMB.id, 0);

		this.model = settings.gameAssets.BOMB.model;
		this.size = 20;
		this.color = color;

		this.id = id;

		this.frame = 0;
		this.time = 100 || time;

		this.ex = this.exp = false;

		this.range = 50;
		this.power = 10;
		this.damage = damage;

		this.gravity = +!gstatic; // Number(!gstatic) // (gstatic) ? 0 : 1
		this.velocity = 0;

		this.target = target || null; // WARNING: linked object (live position)

		{
			let a = player.OBJECT.pos,
				b = 30; // range

			this.pos = pos || {
				x: random(a.x - 30, a.x + 30),
				y: random(a.y - 30, a.y + 30)
			}
		}
	}

	render() {
		fill({
			red: 'rgba(255, 0, 0, .25)',
			blue: 'rgba(0, 0, 255, .25)'
		}[this.color]);
		ellipse(this.pos.x + this.size / 2, this.pos.y + this.size / 2, this.frame, this.frame);

		if(this.ex && this.frame <= settings.gameAssets.SMOKE.model.length) {
			let a = settings.gameAssets.SMOKE.model,
				b = a[a.length - (a.length - this.frame)];

			if(b) image(b, this.ex.x - b.width / 2, this.ex.y);
		} else {
			image(this.model, this.pos.x, this.pos.y, this.size, this.size);
		}

		return this;
	}

	update() {
		if(this.gravity) {
			let a = this.pos.y + (this.velocity + this.gravity),
				b = false;

			touchableElements
				.filter(io => io.constructor.name !== this.constructor.name)
				.forEach(io => {
				let c = io.predictObstacle(
					{
						x: this.pos.x,
						y: a
					},
					this.size,
					this.size
				);

				if(!b && c) b = true;
			});

			if(!b) {
				this.velocity += this.gravity;
				this.pos.y += this.velocity;
			}
		}

		if(this.time < 150 && this.time > 50 && !this.ex) this.frame += 5;
		else if(this.time < 50 && !this.ex) this.frame += 10;
		else this.frame++;

		if(this.frame > 30) this.frame = 0;

		this.time--;

		if(this.time <= 0 && !this.ex && !this.exp) {
			this.explode();
			this.exp = true;
		} else if(
			(this.ex && this.frame > settings.gameAssets.SMOKE.model.length) || (
				!this.ex && this.time <= 0
			)
		) {
			bombs.splice(bombs.findIndex(io => io.id === this.id), 1);
		}
	}

	explode() {
		if(!settings.inGame) return;

		let a = player.OBJECT,
			b = (b, bb) => bb >= b - this.range && bb <= b + this.size + this.range;

		if(b(a.pos.x, this.pos.x) && b(a.pos.y, this.pos.y)) {
			this.frame = 0;
			this.ex = Object.assign({}, a.pos);

			if(this.target) {
				a.pos = {
					x: this.target.x,
					y: this.target.y
				}
			} else {
				let aa = () => {
					let a = a => floor(random(a)),
					b = a(map.length),
					c = a(map[0].length),
					d = map[b][c].object,
					e = false;

					if(!d || d.type === settings.gameAssets.LAVA.id) return aa();

					e = false;
					items.map(io => {
						if(e) return;

						if(
							io.pos &&
							io.type !== this.type &&
							io.pos.x === d.pos.x &&
							io.pos.y === d.pos.y - d.size
						) e = true;
					});
					if(e) return aa();

					e = false;
					map.forEach(io => io.forEach(({ object }) => {
						if(e) return;

						if(
							object &&
							object.pos.x === d.pos.x &&
							object.pos.y === d.pos.y - d.size
						) e = true;
					}));
					if(e) return aa();

					return d;
				}

				let c = aa();

				a.pos = {
					x: c.pos.x,
					y: c.pos.y - a.height - 1
				}
			}

			a.velocity -= this.power;
			a.declareDamage(this.damage);
		}
	}
}

class Monster extends Creature {
	constructor(id, health, model, regen = 1, pos, damage = 10, size, maxJumps, minSpeed, maxSpeed, bulletRange, bulletSpeed, asl, jh, subType, typenum) {
		let a = (!session.isRage) ? 1 : 2;

		if(typeof asl !== "object") {
			asl *= a;
		} else {
			Object.keys(asl).forEach(io => {
				asl[io] = asl[io] * a;
			});
		}

		super(
			id,
			'monster',
			pos,
			health * a,
			health * a,
			model,
			size,
			size,
			regen * a,
			damage * a,
			asl,
			random(minSpeed * a, maxSpeed * a),
			jh,
			maxJumps,
			bulletRange,
			bulletSpeed * a,
			typenum
		);

		this.type = subType;
		this.size = size;

		this.isTarget = false;
	}

	render() {
		let hpHeight = 10,
			hpMargin = 2.5;

		// Draw target point
		if(this.isTarget) {
		fill('blue');
			ellipse(
				this.pos.x + this.size / 2 - 2.5,
				this.pos.y - (hpHeight + hpMargin) - 30,
				10,
				10
			);
		}

		// Draw health bar
		fill(255, 0, 0);
		rect(
			this.pos.x - this.size / 3.5,
			this.pos.y - (hpHeight + hpMargin),
			this.size * 1.5 / 100 * (100 / (this.maxHealth / this.health)),
			hpHeight
		);

		// Draw model
		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		textFont(mainFont);
		textSize(25);
		textAlign(CENTER);
		fill(255);
		text(`${ this.health }hp`, this.pos.x + this.size / 2, this.pos.y - hpHeight - hpMargin - 5);

		return this;
	}
}

window.Slime = class Slime extends Monster {
	/*
		A green clot of a radioactive substance from the another world.
	*/

	constructor(id, rs) {
		let a = settings.gameAssets.SLIME,
			b = 30;

		super(
			id,
			a.health, // heatlh
			a.model, // model
			a.regeneration, // regeneration power
			{ // position
				x: (rs) ? settings.canvas.width : 0 - b,
				y: 0
			},
			a.damage, // damage
			b, // size
			a.maxJumps, // maxJumps
			a.minSpeed, // minSpeed
			a.maxSpeed, // maxSpeed
			0,
			0,
			a.attackDelta,
			a.jumpHeight,
			a.subType,
			a.id
		);
	}

	think() {
		if(!settings.inGame) return;

		// Move to the target
		let a = mages[0] || player.OBJECT,
			b = this.pos,
			c = 20, // rangeX
			f = 5, // rangeY
			d = a.pos.x + this.size / 2,
			e = ( // REWRITE
				(this.pos.x > a.pos.x - c && this.pos.x < a.pos.x + a.width + c) &&
				(this.pos.y > a.pos.y - c && this.pos.y < a.pos.y + a.height + c)
			);

			// d > b.x - c && d < b.x + this.size + c && // x
			// !(a.pos.y < b.y - f) && !(a.pos.y > b.y + this.size + f)

		if(a.pos.x !== this.pos.x && !e) {
			this.movement = {
				true: 1,
				false: -1,
			}[a.pos.x > this.pos.x];
		}

		if(e && this.aslDelta <= 0) this.attack();
	}

	attack() {
		this.jump();
		this.aslDelta = this.asl;
		(mages[0] || player.OBJECT).declareDamage(this.damage);
	}

	detectObstacle(a, b) {
		let c = settings.gameAssets;

		// Simple movement (It's the easiest monster)
		if((a && a.type === c.BLOCK.id) || (b && b.type === c.LAVA.id)) {
			this.jump();
		}
	}
}

window.Lizard = class Lizard extends Monster {
	/*
		Fast shit that can kill you without any problems.
		Takes a long distance from a target to could attack and protect itself.
	*/

	constructor(id, rs) {
		let a = settings.gameAssets.LIZARD,
			b = 30; // size

		super(
			id,
			a.health, // heatlh
			a.model, // model
			a.regeneration, // regeneration power
			{ // position
				x: (rs) ? settings.canvas.width : 0 - b,
				y: 0
			},
			a.damage, // damage
			b, // size
			a.mapJumps, // maxJumps
			a.minSpeed, // minSpeed
			a.maxSpeed, // maxSpeed
			a.bulletRange, // bulletrange
			a.bulletSpeed, // bulletSpeed
			a.attackDelta, // Bullet time restore
			a.jumpHeight,
			a.subType,
			a.id
		);
	}

	think() {
		if(!settings.inGame) return;

		let a = mages[0] || player.OBJECT,
			b = this,
			c = abs(a.pos.x - b.pos.x),
			d = this.bulletRange,
			e = abs(a.height - b.size), // difference between heights
			f = "pos",
			g = "height",
			h = a[f].y - e < b[f].y && a[f].y + a[g] + e > b[f].y + b[g];

		if(c > d * .9 || !h) { // 
			this.movement = {
				true: 1,
				false: -1,
			}[a.pos.x > b.pos.x];
		} else if(c < d * .65) { // if too near
			this.movement = {
				true: 1,
				false: -1,
			}[a.pos.x < b.pos.x];
		} else {
			this.movement = 0;
		}

		if(c < d && h && this.aslDelta <= 0) {
			this.attack(a);
		}
	}

	attack(player) {
		this.aslDelta = this.asl;
		bullets.push(new Bullet(
			++bulletsID, // id
			settings.gameAssets.LIZARD_BULLET.id, // hostnum
			this.damage, // damage
			settings.gameAssets.LIZARD_BULLET.model, // model
			{ // pos
				x: this.pos.x,
				y: this.pos.y + this.height / 6
			},
			{
				x: (player.pos.x > this.pos.x) ? 1 : -1,
				y: 0
			}, // dir
			this.bulletSpeed, // speed
			this.bulletRange // rangeX
		));
	}

	detectObstacle(a, b) {
		if(a) {
			let c = a.bottomIndex,
				d = a.leftIndex,
				e = map[c]; // next block

			if(![undefined, 0].includes(e[d])) {
				this.jump();
			}
			if(![undefined, 0].includes(e[d + this.movement])) {
				this.jump(2);
			}
		}
		if(b) {
			let c = b.bottomIndex,
				d = b.leftIndex,
				e = map[c],
				f = e[d],
				g = e[d + this.movement];

			if([f && f.magerial, g && g.magerial].includes(settings.gameAssets.LAVA.id)) {
				this.jump();
			}
		}
	}
}

window.Gorilla = class Gorilla extends Monster {
	/*
	    Big and slow monster that learned how to use the Magnific Bombs and now can teleport you.
        Has a lot of HP, and can kill a target without any help.
	*/

	constructor(id, rs) {
		let a = settings.gameAssets.GORILLA,
			b = 45; // size

		super(
			id,
			a.health, // heatlh
			a.model, // model
			a.regeneration, // regeneration power
			{ // position
				x: (rs) ? settings.canvas.width : 0 - b,
				y: 0
			},
			a.damage, // damage
			b, // size
			a.mapJumps, // maxJumps
			a.minSpeed, // minSpeed
			a.maxSpeed, // maxSpeed
			0, // bulletrange
			0, // bulletSpeed
			{
				hit: a.attackDelta,
				bomb: a.bombDelta
			}, // attack time restore
			a.jumpHeight,
			a.subType,
			a.id
		);
	}

	think() {
		if(!settings.inGame) return;

		let a = mages[0] || player.OBJECT,
			b = this.pos,
			c = abs(a.pos.x - b.x),
			d = settings.gameAssets.GORILLA.bombRange,
			e = 40, // hand hit range
			f = 15,
			g = (b.y > a.pos.y - f && b.y < a.pos.y + a.height + f);

		if(a.pos.x !== b.x) { // too big distance
			this.movement = {
				true: 1,
				false: -1,
			}[a.pos.x > b.x];
		}

		if(c <= e && g && this.aslDelta.hit <= 0) { // hit
			this.hit();
		} else if(c < d && this.aslDelta.bomb <= 0) {
			this.spawnBomb(a);
		}
	}

	spawnBomb(a, b) {
		this.aslDelta.bomb = this.asl.bomb;

		bombs.push(new Bomb(
			++bombsID,
			null,
			settings.gameAssets.GORILLA.bombTime,
			settings.gameAssets.GORILLA.bombDamage,
			this.pos,
			true,
			'red'
		));
	}

	hit() {
		let a = mages[0] || player.OBJECT;
		this.aslDelta.hit = this.asl.hit;

		this.jump();
		a.declareDamage(this.damage);
		a.velocity -= 15; // 15
		this.jumps = 0;

	}
}

window.Bird = class Bird extends Element {
	/*
		Fast monster that looks like a bird drops a Magnific Bomb when a target is under him.
	*/

	constructor(id, rs) {
		let a = settings.gameAssets.BIRD,
			b = {
				true: -1,
				false: 1
			}[rs];

		super(
			false,
			-1,
			-1,
			a.id,
			id,
			a.subType
		);

		this.id = id;
		this.size = 50;

		this.pos = {
			x: (b === -1) ? settings.canvas.width : 0 - this.size,
			y: random(settings.playerHBHeight, settings.playerHBHeight + this.size)
		}

		this.dir = {
			x: b,
			y: 0
		}
		this.speed = {
			x: random(a.minSpeed, a.maxSpeed),
			y: .25
		}

		this.model = a.model;
		this.health = a.health;

		this.bombAsl = a.bombDelta;
		this.bombDelta = 0;
		this.bombTime = a.bombTime;
		this.bombDamage = a.bombDamage;
		this.throwRange = a.throwRange;
	}

	render() {
		image(settings.gameAssets.BIRD.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	update() {
		this.pos.x += this.dir.x * this.speed.x;
		this.pos.y += random(-1, 1) * this.dir.y;

		// Detect bullets
		touchableElements.forEach(io => {
			if(io.type === settings.gameAssets.HERO_BULLET.id) {
				let a = io.predictObstacle(
					this.pos,
					this.size,
					this.size
				);

				if(a) {
					this.kill();
					a.destroy();
				}
			}
		})

		if(--this.bombDelta < 0) {
			this.bombDelta = 0;
		}

		if(
			(this.dir.x === -1 && this.pos.x + this.size < 0) ||
			(this.dir.x === 1 && this.pos.x > settings.canvas.width)
		) {
			this.kill();
		}

		return this;
	}

	think() {
		let a = player.OBJECT;

		if(
			(this.pos.y < a.pos.y) &&
			(a.pos.x > this.pos.x - this.throwRange && a.pos.x < this.pos.x + this.size + this.throwRange) &&
			this.bombDelta <= 0
		) {
			this.throwBomb();
		}

		return this;
	}

	throwBomb() {
		this.bombDelta = this.bombAsl;
		
		// id, pos, time, damage, target = null, gstatic = true, color = 'red'

		bombs.push(new Bomb(
			++bombsID,
			{
				x: this.pos.x,
				y: this.pos.y + this.size
			},
			this.bombTime,
			this.bombDamage,
			null,
			false,
			'blue'
		));
	}

	kill() {
		monsters.splice(monsters.findIndex(io => io.id === this.id), 1);
	}
}

class Item extends Element {
	constructor(id, model, isVisible, typenum) {
		super(false, 0, 0, typenum, 0);

		this.size = 30;
		this.isVisible = isVisible;
		this.model = model;

		this.id = id;

		this.pos = null;
	}

	render() {
		if(!this.isVisible) return;
		if(!this.pos) this.pos = this.genPos();

		image(this.model, this.pos.x, this.pos.y, this.size, this.size);

		return this;
	}

	destroy() {
		let a = items;
		a.splice(a.findIndex(io => io.id === this.id), 1);
	}

	genPos() {
		let aa = () => {
			let a = a => floor(random(a)),
			b = a(map.length), // y in the array
			c = a(map[0].length), // x in the array
			d = map[b][c].object,
			e = false;

			// Prevent spawn above lava
			if(!d || d.type === settings.gameAssets.LAVA.id) return aa();

			// Validate if no items on this position
			e = false;
			items.map(io => {
				if(e) return;

				if(
					io.pos &&
					io.type !== this.type &&
					io.pos.x === d.pos.x &&
					io.pos.y === d.pos.y - d.size
				) e = true;
			});
			if(e) return aa();

			// Validate if no blocks on this position
			e = false;
			map.forEach(io => io.forEach(({ object }) => {
				if(e) return;

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
	mainFont = loadFont('./assets/mainFont.ttf');
}

function setup() {
	settings.canvas.target = createCanvas(settings.canvas.width, settings.canvas.height).elt;
	frameRate(settings.canvas.FPS);

	settings.gameAssets.BACKGROUND.model       = loadImage('./assets/background.jpg');
	settings.gameAssets.BLOCK.model            = loadImage('./assets/block.png');
	settings.gameAssets.HEALTH_BOTTLE.model    = loadImage('./assets/items/heal.png');
	settings.gameAssets.ARMOR_1.model          = loadImage('./assets/items/arm1.png');
	settings.gameAssets.ARMOR_2.model          = loadImage('./assets/items/arm2.png');
	settings.gameAssets.ARMOR_3.model          = loadImage('./assets/items/arm3.png');
	settings.gameAssets.ARMOR_4.model          = loadImage('./assets/items/arm4.png')
	settings.gameAssets.HERO_BULLET.model      = loadImage('./assets/bullets/fireball.png');
	settings.gameAssets.LIZARD_BULLET.model    = loadImage('./assets/bullets/monster1.gif');
	settings.gameAssets.MONSTER_2_BULLET.model = loadImage('./assets/bullets/monster2.gif');
	settings.gameAssets.MAGE_BULLET.model      = loadImage('./assets/bullets/mage.png');
	settings.gameAssets.BOOTS.model            = loadImage('./assets/items/boots.png');
	settings.gameAssets.HELMET.model           = loadImage('./assets/items/helm.png');
	settings.gameAssets.MAGE_SPAWNER.model     = loadImage('./assets/items/mageSpawner.png');
	settings.gameAssets.SHIELD_ITEM.model      = loadImage('./assets/items/shield.png');
	settings.gameAssets.SHIELD.model           = loadImage('./assets/items/shieldEffect.png');
	settings.gameAssets.METEOR_SUMMONER.model  = loadImage('./assets/items/sMeteor.png');
	settings.gameAssets.METEOR.model           = loadImage('./assets/items/meteor.png');
	settings.gameAssets.BOMB.model             = loadImage('./assets/items/poison.png')
	settings.gameAssets.SLIME.model            = loadImage('./assets/monsters/slime.gif');
	settings.gameAssets.LIZARD.model           = loadImage('./assets/monsters/lizard.gif');
	settings.gameAssets.GORILLA.model          = loadImage('./assets/monsters/gorilla.png');
	settings.gameAssets.BIRD.model             = loadImage('./assets/monsters/bird.gif');
	player.models.idle                         = loadImage('./assets/hero/idle.gif');
	player.models.run                          = loadImage('./assets/hero/run.gif');
	player.models.jump                         = loadImage('./assets/hero/jump.png');
	player.models.fly                          = loadImage('./assets/hero/fly.gif');

	// Lava models
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
		'./assets/lava/45.png'
	].forEach(io => {
		settings.gameAssets.LAVA.model.push(loadImage(io));
	});

	// Visual Smoke models
	[
		'./assets/tpsmoke/1.gif',
		'./assets/tpsmoke/2.gif',
		'./assets/tpsmoke/3.gif',
		'./assets/tpsmoke/4.gif',
		'./assets/tpsmoke/5.gif',
		'./assets/tpsmoke/6.gif',
		'./assets/tpsmoke/7.gif'
	].forEach(io => {
		settings.gameAssets.SMOKE.model.push(loadImage(io));
	});

	// Mage models
	[ // -> app
		{
			model: './assets/mage/app_1.png',
			height: 20,
			width: 20,
			arr: 'app'
		},
		{
			model: './assets/mage/app_2.png',
			height: 20,
			width: 20,
			arr: 'app'
		},
		{
			model: './assets/mage/app_3.png',
			height: 20,
			width: 20,
			arr: 'app'
		},
		{
			model: './assets/mage/app_4.png',
			height: 20,
			width: 20,
			arr: 'app'
		},
		{
			model: './assets/mage/attack_1.png',
			height: 20,
			width: 20,
			arr: 'attack'
		},
		{
			model: './assets/mage/attack_2.png',
			height: 20,
			width: 20,
			arr: 'attack'
		},
		{
			model: './assets/mage/attack_3.png',
			height: 20,
			width: 20,
			arr: 'attack'
		},
		{
			model: './assets/mage/attack_4.png',
			height: 20,
			width: 20,
			arr: 'attack'
		},
		{
			model: './assets/mage/go_1.png',
			height: 20,
			width: 20,
			arr: 'go'
		},
		{
			model: './assets/mage/go_2.png',
			height: 20,
			width: 20,
			arr: 'go'
		},
		{
			model: './assets/mage/jump.png',
			height: 20,
			width: 20,
			arr: 'jump'
		},
		{
			model: './assets/mage/stay.png',
			height: 35,
			width: 20,
			arr: 'stay'
		},
		{
			model: './assets/mage/summon.gif',
			height: 40,
			width: 35,
			arr: 'summon'
		},
		{
			model: './assets/mage/dead_1.png',
			height: 20,
			width: 20,
			arr: 'dead'
		},
		{
			model: './assets/mage/dead_2.png',
			height: 20,
			width: 20,
			arr: 'dead'
		},
		{
			model: './assets/mage/dead_3.png',
			height: 20,
			width: 20,
			arr: 'dead'
		},
		{
			model: './assets/mage/dead_4.png',
			height: 20,
			width: 20,
			arr: 'dead'
		},
	].forEach(io => {
		settings.gameAssets.MAGE.models[io.arr].push({
			model: loadImage(io.model),
			height: io.height,
			width: io.width
		});
	});

	[
		'./assets/electro/1.png',
		'./assets/electro/2.png',
		'./assets/electro/3.png',
		'./assets/electro/4.png',
		'./assets/electro/5.png',
		'./assets/electro/6.png',
		'./assets/electro/7.png',
		'./assets/electro/8.png',
		'./assets/electro/9.png',
		'./assets/electro/10.png',
		'./assets/electro/11.png',
		'./assets/electro/12.png',
		'./assets/electro/13.png',
		'./assets/electro/14.png',
		'./assets/electro/15.png',
		'./assets/electro/16.png',
		'./assets/electro/17.png',
		'./assets/electro/18.png',
		'./assets/electro/19.png',
		'./assets/electro/20.png',
		'./assets/electro/21.png',
		'./assets/electro/22.png',
		'./assets/electro/23.png',
		'./assets/electro/24.png',
		'./assets/electro/25.png',
		'./assets/electro/26.png',
		'./assets/electro/27.png',
		'./assets/electro/28.png',
		'./assets/electro/29.png',
		'./assets/electro/30.png',
		'./assets/electro/31.png',
		'./assets/electro/32.png',
		'./assets/electro/33.png',
		'./assets/electro/34.png',
		'./assets/electro/35.png',
		'./assets/electro/36.png',
		'./assets/electro/37.png',
		'./assets/electro/38.png',
		'./assets/electro/39.png',
		'./assets/electro/40.png',
		'./assets/electro/41.png',
		'./assets/electro/42.png',
		'./assets/electro/43.png',
		'./assets/electro/44.png',
		'./assets/electro/45.png',
		'./assets/electro/46.png',
		'./assets/electro/47.png',
		'./assets/electro/48.png',
		'./assets/electro/49.png',
		'./assets/electro/50.png',
		'./assets/electro/51.png',
		'./assets/electro/52.png',
		'./assets/electro/53.png',
		'./assets/electro/54.png',
		'./assets/electro/55.png',
		'./assets/electro/56.png',
		'./assets/electro/57.png',
		'./assets/electro/58.png',
		'./assets/electro/59.png',
		'./assets/electro/60.png',
		'./assets/electro/61.png',
		'./assets/electro/62.png',
		'./assets/electro/63.png'
	].forEach(io => {
		settings.gameAssets.ELECTRO.model.push(loadImage(io));
	});

	player.OBJECT = new Player;

	// monsters.push(new Slime(++monstersID, true));
	// monsters.push(new Lizard(++monstersID, true));
	// monsters.push(new Gorilla(++monstersID, true));
	// monsters.push(new Bird(++monstersID, true));

	// items.push(new Item(++itemsID, settings.gameAssets.HEALTH_BOTTLE.model, true, settings.gameAssets.HEALTH_BOTTLE.id));
	// items.push(new Item(++itemsID, settings.gameAssets.ARMOR_1.model, true, settings.gameAssets.ARMOR_1.id));
	// items.push(new Item(++itemsID, settings.gameAssets.ARMOR_2.model, true, settings.gameAssets.ARMOR_2.id));
	// items.push(new Item(++itemsID, settings.gameAssets.ARMOR_3.model, true, settings.gameAssets.ARMOR_3.id));
	// items.push(new Item(++itemsID, settings.gameAssets.ARMOR_4.model, true, settings.gameAssets.ARMOR_4.id));
	// items.push(new Item(++itemsID, settings.gameAssets.HELMET.model, true, settings.gameAssets.HELMET.id));
	// items.push(new Item(++itemsID, settings.gameAssets.BOOTS.model, true, settings.gameAssets.BOOTS.id));
	// items.push(new Item(++itemsID, settings.gameAssets.MAGE_SPAWNER.model, true, settings.gameAssets.MAGE_SPAWNER.id));
	// items.push(new Item(++itemsID, settings.gameAssets.METEOR_SUMMONER.model, true, settings.gameAssets.METEOR_SUMMONER.id));
	// items.push(new Item(++itemsID, settings.gameAssets.SHIELD_ITEM.model, true, settings.gameAssets.SHIELD_ITEM.id));

	// bombs.push(new Bomb(++bombsID, null, settings.gameAssets.GORILLA.bombTime, settings.gameAssets.GORILLA.bombTime, null, true, 'red'));
	// meteors.push(new Meteor(++meteorsID, player.OBJECT.pos));
}

function draw() {
	// Background
	image(settings.gameAssets.BACKGROUND.model, 0, 0, settings.canvas.width, settings.canvas.height);

	// Draw start time
	if(session.startTime) {
		session.startTime--;

		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(245);
		text(`STARTING IN: ${ round(session.startTime / settings.canvas.FPS) }`, settings.canvas.width / 2, settings.playerHBHeight + 75);
	}

	// Rave
	if(session.ravesTi && --session.raveDelta <= 0) {
		if(--session.ravesTi <= 0) {
			session.ravesTi = null; // NO raves on this level.
		}

		session.isRave = true;
	}

	if(!session.startTime && session.isRave && --session.raveEnd) {
		let a = a => session.raveEnd % a,
			b = '';

		if(a(2) === 0) {
			b = 'red';
		} else {
			b = 'blue'
		}

		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(b);
		text("RAVE", settings.canvas.width / 2, settings.playerHBHeight + 75);

		if(session.raveEnd <= 0) {
			session.isRave = false;
		}
	}

	// Rage
	if(session.ragesTi && --session.rageDelta <= 0) {
		if(--session.ragesTi <= 0) {
			session.ragesTi = null;
		}

		session.isRage = true;
	}

	if(!session.startTime && session.isRage && --session.rageEnd) {
		let a = a => session.rageEnd % a,
			b = '';

		if(a(2) === 0) {
			b = 'red';
		} else {
			b = 'blue'
		}

		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(b);
		text("RAGE", settings.canvas.width / 2, settings.playerHBHeight + 75);

		if(session.rageEnd <= 0) {
			session.isRage = false;
		}
	}

	// Spawn Monster
	if(!session.startTime && settings.inGame && --session.monsterDelta <= 0) { // spawn new monster
		session.monsterDelta = (!session.isRave) ? ( // reload monster delta
			random(session.monsterMinTime, session.monsterMaxTime)
		) : (
			random(settings.rave.ravesTime - settings.rave.ravesTimeRange, settings.rave.ravesTime + settings.rave.ravesTimeRange)
		);

		let a = Object.values(settings.gameAssets) // set variable, create an array with all objects from gameAssets pack
			.filter(io => io.type === "MONSTER") // get all monsters in the gameAssets array
			.map(io => io.class); // return array that contains only class names

		monsters.push( // spawn random monster
			new window[a[floor(random(a.length))]](++monstersID, [true, false][round(random(0, 1))])
		);
	}

	// Spawn item
	if(++itemsRefresh.delta >= itemsRefresh.wait && settings.inGame) {
		if(!itemsRefresh.started) {
			itemsRefresh.started = true;
		} else { // spawn random item
			let a = settings.gameAssets,
				b = Object.keys(a).filter(io => a[io].type === "ITEM"),
				e = b[floor(random(b.length))],
				{ model, id } = a[e];

			items.push(new Item(++itemsID, model, true, id));

		}

		itemsRefresh.wait = round(random(300, 900)); // 500 - 5000
		itemsRefresh.delta = 1;
	}

	// Game Over text
	if(!settings.inGame) {
		textFont(mainFont);
		textSize(64);
		textAlign(CENTER);
		fill(255);
		text('YOU DIED!', settings.canvas.width / 2, settings.canvas.height / 2 + 20);
		noLoop();
	}

	touchableElements = [];

	map.forEach((io, ia, arr1) => {
		io.forEach((ik, il, arr2) => {
			if(ik) {
				if(Number.isInteger(ik)) { // generate class
					switch(ik) {
						case settings.gameAssets.BLOCK.id: // block
							var a = new Block(il, ia, ik);
						break;
						case settings.gameAssets.LAVA.id: // lava
							var a = new Lava(il, ia, ik);
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

	bombs.forEach(io => {
		touchableElements.push(io);
		io.render().update();
	});

	bullets.forEach(io => {
		touchableElements.push(io);
		io.render().update();
	});

	meteors.forEach(io => {
		touchableElements.push(io);
		io.render().update();
	});

	monsters.forEach(io => {
		io.render().update().think();
	});

	mages.forEach(io => {
		io.render().update().animate();
		if(io.stable) io.think();
	});
	player.OBJECT.render().update().regenerate();
}

function keyPressed() {
	if(!player.OBJECT) return;

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
	if(!player.OBJECT) return;

	if([65, 68].includes(keyCode)) {
		player.OBJECT.controlPos(0);
	}
}