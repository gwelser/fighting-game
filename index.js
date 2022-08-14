const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

paintCanvas();

const gravity = 0.7;
const speed = 5;
const jump = 20;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: "./img/background.png"
});

const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	imageSrc: "./img/shop.png",
	scale: 2.75,
	framesMax: 6
});

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
};

const player1 = new Fighter({
	imageSrc: "./img/samuraiMack/Fall.png",
	framesMax: 2,
	scale: 2.5,
	position: {
		x: 150,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: "./img/samuraiMack/Idle.png",
			framesMax: 8
		},
		run: {
			imageSrc: "./img/samuraiMack/Run.png",
			framesMax: 8
		},
		jump: {
			imageSrc: "./img/samuraiMack/Jump.png",
			framesMax: 2
		},
		fall: {
			imageSrc: "./img/samuraiMack/Fall.png",
			framesMax: 2
		},
		attack1: {
			imageSrc: "./img/samuraiMack/Attack1.png",
			framesMax: 6
		},
		takeHit: {
			imageSrc: "./img/samuraiMack/Take Hit.png",
			framesMax: 4
		},
		death: {
			imageSrc: "./img/samuraiMack/Death.png",
			framesMax: 6
		}
	},
	strength: 25,
	attackBox: {
		offset: {
			x: 160,
			y: 50
		},
		width: 100,
		height: 50
	}
});

const player2 = new Fighter({
	imageSrc: "./img/kenji/Fall.png",
	framesMax: 2,
	scale: 2.5,
	position: {
		x: 824,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 215,
		y: 170
	},
	sprites: {
		idle: {
			imageSrc: "./img/kenji/Idle.png",
			framesMax: 4
		},
		run: {
			imageSrc: "./img/kenji/Run.png",
			framesMax: 8
		},
		jump: {
			imageSrc: "./img/kenji/Jump.png",
			framesMax: 2
		},
		fall: {
			imageSrc: "./img/kenji/Fall.png",
			framesMax: 2
		},
		attack1: {
			imageSrc: "./img/kenji/Attack1.png",
			framesMax: 4
		},
		takeHit: {
			imageSrc: "./img/kenji/Take hit.png",
			framesMax: 3
		},
		death: {
			imageSrc: "./img/kenji/Death.png",
			framesMax: 7
		}
	},
	strength: 20,
	attackBox: {
		offset: {
			x: -172,
			y: 50
		},
		width: 100,
		height: 50
	}
});

function animate() {
	window.requestAnimationFrame(animate);
	paintCanvas();
	background.update();
	shop.update();

	player1.update();
	player2.update();

	player1.velocity.x = 0;
	player2.velocity.x = 0;

	// Player1 movement
	if (keys.a.pressed && player1.lastKey === "a") {
		player1.velocity.x = (speed * -1);
		player1.switchSprite("run");
	} else if (keys.d.pressed && player1.lastKey === "d") {
		player1.velocity.x = speed;
		player1.switchSprite("run");
	} else {
		player1.switchSprite("idle");
	}
	if (player1.velocity.y < 0) {
		player1.switchSprite("jump");
	} else if (player1.velocity.y > 0) {
		player1.switchSprite("fall");
	}

	// Player2 movement
	if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
		player2.velocity.x = (speed * -1);
		player2.switchSprite("run");
	} else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
		player2.velocity.x = speed;
		player2.switchSprite("run");
	} else {
		player2.switchSprite("idle");
	}
	if (player2.velocity.y < 0) {
		player2.switchSprite("jump");
	} else if (player2.velocity.y > 0) {
		player2.switchSprite("fall");
	}

	if (
		player1.isAttacking
		&& player1.framesCurrent === 4
		&& attackCollision({ rect1: player1, rect2: player2 })
	) {
		console.log("Player2 HIT!");
		player2.takeHit(player1.strength);
		player1.isAttacking = false;
		gsap.to("#player2", {
			width: player2.health + "%"
		});
	}
	if (
		player1.isAttacking
		&& player1.framesCurrent === 4
	) {
		player1.isAttacking = false;
	}

	if (
		player2.isAttacking
		&& player2.framesCurrent === 2
		&& attackCollision({ rect1: player2, rect2: player1 })
	) {
		console.log("Player1 HIT!");
		player1.takeHit(player2.strength);
		player2.isAttacking = false;
		gsap.to("#player1", {
			width: player1.health + "%"
		});
	}
	if (
		player2.isAttacking
		&& player2.framesCurrent === 4
	) {
		player2.isAttacking = false;
	}

	if (player1.health <= 0 || player2.health <= 0) {
		determineWinner({ player1, player2, timerId });
	}
}

window.addEventListener("keydown", (e) => {
	if (!player1.dead) {
		switch (e.key) {
			case "a":
				keys.a.pressed = true;
				player1.lastKey = "a";
				break;
			case "d":
				keys.d.pressed = true;
				player1.lastKey = "d";
				break;
			case "w":
				if (0 === player1.velocity.y) {
					player1.velocity.y = (jump * -1);
				}
				break;
			case " ":
				player1.attack();
				break;
		}
	}

	if (!player2.dead) {
		switch (e.key) {
			case "ArrowLeft":
				keys.ArrowLeft.pressed = true;
				player2.lastKey = "ArrowLeft";
				break;
			case "ArrowRight":
				keys.ArrowRight.pressed = true;
				player2.lastKey = "ArrowRight";
				break;
			case "ArrowUp":
				if (0 === player2.velocity.y) {
					player2.velocity.y = (jump * -1);
				}
				break;
			case "ArrowDown":
				player2.attack();
				break;
		}
	}
});

window.addEventListener("keyup", (e) => {
	switch (e.key) {
		case "a":
			keys.a.pressed = false;
			break;
		case "d":
			keys.d.pressed = false;
			break;

		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
	}
});

player1.draw();
player2.draw();
decreaseTimer();
animate();
