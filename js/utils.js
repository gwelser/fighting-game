function paintCanvas() {
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
}

function attackCollision({ rect1, rect2 }) {
	return (
		rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
		&& rect1.attackBox.position.x <= rect2.position.x + rect2.width
		&& rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
		&& rect1.attackBox.position.y <= rect2.position.y + rect2.height
	)
}

function determineWinner({ player1, player2, timerId }) {
	clearTimeout(timerId);
	if (player1.health === player2.health) {
		document.querySelector("#gameEnd").innerHTML = "TIE";
	}

	if (player1.health > player2.health) {
		document.querySelector("#gameEnd").innerHTML = "PLAYER 1 WINS";
	}
	
	if (player2.health > player1.health) {
		document.querySelector("#gameEnd").innerHTML = "PLAYER 2 WINS";
	}
}

let timer = 60;
let tiemrId;
function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector("#timer").innerHTML = timer;
		return;
	}

	determineWinner({ player1, player2, timerId });
}
