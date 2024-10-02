class LiveGame {
	constructor(rowsInput, colsInput, startBtn, stopBtn, setParamsBtn, setRandomStartBtn) {
		this.rowsInput = rowsInput;
		this.colsInput = colsInput;
		this.gameInProcess = false;
		this.rowCount = rowsInput.value;
		this.colCount = colsInput.value;
		this.gameWrapper = document.querySelector('.game');
		this.maxCount = this.rowCount * this.colCount;
		this.position = null;
		this.startBtn = startBtn;
		this.stopBtn = stopBtn;
		this.setParamsBtn = setParamsBtn;
		this.setRandomStartBtn = setRandomStartBtn;

		this.setParamsBtn.addEventListener('click', () => {
			this.restart();
		});

		this.startBtn.addEventListener('click', () => {
			this.startGame();
		});
		this.stopBtn.addEventListener('click', () => {
			this.stopGame();
		});

		this.setRandomStartBtn.addEventListener('click', () => {
			this.setRandomPosition();
		});
	}

	init = () => {
		const table = document.createElement('table');
		const tbody = document.createElement('tbody');
		for (let i = 0; i < this.rowCount; i++) {
			const tr = document.createElement('tr');
			for (let j = 0; j < this.colCount; j++) {
				const td = document.createElement('td');
				td.classList.add(`element_${i * this.rowCount + j + 1}`);
				td.classList.add(`element`);
				td.classList.add(`${i * this.rowCount + j + 1}`);
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		this.gameWrapper.appendChild(table);
		this.addListener();
	};


	startGame = () => {
		this.startBtn.disabled = true;
		this.stopBtn.disabled = false;
		this.rowsInput.disabled = true;
		this.colsInput.disabled = true;
		this.setParamsBtn.disabled = true;
		this.setRandomStartBtn.disabled = true;
		console.log('startGame');

		this.gameInProcess = true;
		this.checkFirstPosition();
		this.nextStep();
	};


	nextStep = () => {
		this.newPosition();
		if ([...this.position.values()].filter(item => item).length) {
			setTimeout(this.nextStep, 1000);
		} else {
			this.stopGame();
		}
	};

	checkFirstPosition = () => {
		if (this.position) {
			this.position = null;
		}
		this.position = new Map();
		let temp = [];
		document.querySelectorAll('.active').forEach(item => {
			temp.push(parseInt(item.classList.value.match(/\d+/g)[0]));
		});
		for (let i = 1; i < this.maxCount; i++) {
			this.position.set(i, false);
		}
		for (let i = 0; i < temp.length; i++) {
			this.position.set(temp[i], true);
		}
	};

	newPosition = () => {
		let temp = [];
		for (let [number, isAlive] of this.position.entries()) {
			temp.push(this.checkItsAlive(number, isAlive));
		}
		this.position = new Map(temp);
		const listOfActive = [];
		for (let [number, isAlive] of this.position.entries()) {
			if (isAlive) {
				listOfActive.push(number);
			}
		}

		document.querySelectorAll('.active').forEach(item => {
			item.classList.remove('active');
		});

		for (let i = 0; i < listOfActive.length; i++) {
			document.querySelector(`.element_${listOfActive[i]}`).classList.add('active');
		}

	};

	checkItsAlive = (number, isAlive) => {
		const numOfCol = Math.round(number / this.colCount) + 1;
		const startOfCol = (numOfCol) * this.colCount - this.colCount + 1;
		const endOfCol = numOfCol * this.colCount;
		const position = number % numOfCol + 1;

		const temp1 = +number - 1 < startOfCol
			? endOfCol
			: number - 1;
		const temp2 = +number + 1 > endOfCol
			? startOfCol
			: number + 1;


		const temp3 = (number + +this.colCount) > this.maxCount ?
			position :
			number + +this.colCount;

		const temp4 = +number + +this.colCount - 1 > this.maxCount
			? position - 1
			: +number + +this.colCount - 1 < startOfCol + +this.colCount
				? endOfCol + +this.colCount
				: +number + +this.colCount - 1
		;

		const temp5 = +number + +this.colCount + 1 > +this.maxCount
			? position + 1
			: +number + +this.colCount + 1 > endOfCol + +this.colCount
				? startOfCol + +this.colCount
				: +number + +this.colCount + 1;

		const temp6 = +number - this.colCount < 0 ?
			+this.rowCount * (+this.colCount - 1) + +number
			: +number - this.colCount;

		const temp7 = +number - this.colCount + 1 < 0
			? +this.rowCount * (+this.colCount - 1) + position + 1 > +this.maxCount
				? +this.rowCount * (+this.colCount - 1)
				: this.maxCount - this.colCount + number + 1

			: +number - this.colCount + 1;


		const temp8 =
			+number - this.colCount - 1 < 0
				? +this.rowCount * (+this.colCount - 1) + position - 1 > +this.maxCount - this.colCount
					? +this.rowCount * (+this.colCount)
					: +this.maxCount - this.colCount + number - 1
				: +number - this.colCount - 1;
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
		let neighboursLen = 0;
		if (isAlive) {
			for (let i = 0; i < neighbours.length; i++) {
				if (this.position.get(neighbours[i])) {
					neighboursLen++;
				}
			}
			if (
				neighboursLen > 3 ||
				neighboursLen < 2
			) {
				return [number, false];

			}
			return [number, true];
		}
		for (let i = 0; i < neighbours.length; i++) {
			if (this.position.get(neighbours[i])) {
				neighboursLen++;
			}
		}
		if (neighboursLen === 3) {
			return [number, true];

		}
		return [number, false];
	};

	stopGame = () => {
		this.startBtn.disabled = false;
		this.stopBtn.disabled = true;
		this.rowsInput.disabled = false;
		this.colsInput.disabled = false;
		this.setParamsBtn.disabled = false;
		this.setRandomStartBtn.disabled = false;
		console.log('stopGame');
		this.gameInProcess = false;
		this.position = null;
	};


	clickForCel = ({ target }) => {
		if (this.gameInProcess) return;
		if (target.classList.contains('element')) {
			target.classList.toggle('active');
		}
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
		this.maxCount = this.rowCount * this.maxCount;
		this.init();
	};


	generateArray = (length, max) => (
		[...new Array(length)]
		.map(() => Math.round(Math.random() * max))
	);

	setRandomPosition = () => {
		const randomPosition = this.generateArray(Math.round(Math.random() * this.maxCount), this.maxCount);
		for (let i = 0; i < randomPosition.length; i++) {
			document.querySelector(`.element_${randomPosition[i]}`).classList.add('active');
		}
	};


}

function start() {
	const startBtn = document.querySelector('#startGame');
	const stopBtn = document.querySelector('#stopGame');
	const setParamsBtn = document.querySelector('#setParams');
	const setRandomStartBtn = document.querySelector('#setRandomStart');
	const rowsInput = document.querySelector('#rows');
	const colsInput = document.querySelector('#cols');
	const game = new LiveGame(rowsInput, colsInput, startBtn, stopBtn, setParamsBtn, setRandomStartBtn);
	game.init();

}


window.addEventListener('load', (event) => {
	start();
});