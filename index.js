class LiveGame {
	constructor(rowsInput, colsInput) {
		this.rowsInput = rowsInput;
		this.colsInput = colsInput;
		this.gameInProcess = false;
		this.rowCount = rowsInput.value;
		this.colCount = colsInput.value;
		this.gameWrapper = document.querySelector('.game');
		this.maxCount = this.rowCount * this.colCount;
		this.position = null;
	}

	startGame = () => {
		console.log('startGame');
		this.gameInProcess = true;
		this.checkFirstPosition();
		this.nextStep();
	};

	nextStep = () => {

		this.newPosition();
	};

	checkFirstPosition = () => {
		if (this.position){
			this.position = null;
		}
		let temp = [];
		document.querySelectorAll('.active').forEach(item => {
			temp.push([item.classList.value.match(/\d+/g)[0], true]);
		});
		for(let i = 1; i < this.maxCount; i++){
			this.position.set(i, false)
		}
		for(let i =0; i< temp.length; i++){
			this.position.set(temp[i], true)
		}
	};

	newPosition = () => {
		for (let i = 1; i < this.maxCount; i++) {
			this.checkItsAlive(this.position[i]);
		}
	};

	checkItsAlive = (item) => {
		const numOfCol = Math.round(item / this.colCount)
		const startOfCol = numOfCol * this.colCount;
		const endOfCol = (numOfCol + 1) * this.colCount - 1;
		const position = item % numOfCol;

		const temp1 = item - 1 < startOfCol ?  endOfCol :  item - 1;
		const temp2 = item + 1 > endOfCol ? startOfCol: item + 1;

		const temp3 = (item + this.colCount) > this.maxCount ? position : item + this.colCount;

		const temp4 = item + this.colCount - 1 > this.maxCount
			? position - 1
			: item + this.colCount - 1 < startOfCol + this.colCount
				?
				: item + this.colCount - 1
		;

		const temp5 = item + this.colCount + 1;

		const temp6 = item - this.colCount;
		const temp7 = item - this.colCount - 1;
		const temp8 = item - this.colCount + 1;

		const neighbours = [
			temp1,
			temp2,
			temp3,
			temp4,
			temp5,
			temp6,
			temp7,
			temp8,
		];

		let tempLength = this.position.filter(pos => neighbours.includes(pos)).length;
		if (
			tempLength > 3 ||
			tempLength < 2
		) {
			return false;
		}
		return true;
	};

	stopGame = () => {
		console.log('stopGame');
		this.gameInProcess = false;
		this.position = null;
	};

	init = () => {
		const table = document.createElement('table');
		const tbody = document.createElement('tbody');
		for (let i = 0; i < this.rowCount; i++) {
			const tr = document.createElement('tr');
			for (let j = 0; j < this.colCount; j++) {
				const td = document.createElement('td');
				td.classList.add('element');
				td.classList.add(`${i * this.rowCount + j + 1}`);
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		this.gameWrapper.appendChild(table);
		this.addListener();
	};

	clickForCel = ({ target }) => {
		if (this.gameInProcess) return;
		if (target.classList.contains('element')) {
			target.classList.toggle('active');
		}
		console.log(target);
	};


	addListener = () => {
		document.querySelector('table').addEventListener('click', this.clickForCel);
	};

	restart = () => {
		const gameTable = document.querySelector('table');
		gameTable.removeEventListener('click', this.clickForCel);
		this.gameWrapper.removeChild(gameTable);
		this.rowCount = this.rowsInput.value;
		this.colCount = this.colsInput.value;
		this.init();
	};


}

function start() {
	const startBtn = document.querySelector('#startGame');
	const stopBtn = document.querySelector('#stopGame');
	const setParamsBtn = document.querySelector('#setParams');
	const setRandomStartBtn = document.querySelector('#setRandomStart');
	const rowsInput = document.querySelector('#rows');
	const colsInput = document.querySelector('#cols');
	const game = new LiveGame(rowsInput, colsInput);
	game.init();


	setParamsBtn.addEventListener('click', () => {
		game.restart();

	});

	startBtn.addEventListener('click', () => {
		startBtn.disabled = true;
		stopBtn.disabled = false;
		rowsInput.disabled = true;
		colsInput.disabled = true;
		setParamsBtn.disabled = true;
		setRandomStartBtn.disabled = true;
		game.startGame();

	});
	stopBtn.addEventListener('click', () => {
		startBtn.disabled = false;
		stopBtn.disabled = true;
		rowsInput.disabled = false;
		colsInput.disabled = false;
		setParamsBtn.disabled = false;
		setRandomStartBtn.disabled = false;
		game.stopGame();
	});

}


window.addEventListener('load', function (event) {
	console.log('All resources finished loading!');
	start();
});