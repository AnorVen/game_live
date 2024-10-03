class LiveGame {
	constructor(rowsInput, colsInput, startBtn, stopBtn, setParamsBtn, setRandomStartBtn) {
		this.rowsInput = rowsInput;
		this.colsInput = colsInput;
		this.gameInProcess = false;
		this.rowCount = rowsInput.value;
		this.colCount = colsInput.value;
		this.gameWrapper = document.querySelector('.game');
		this.maxCount = this.rowCount * this.colCount;
		this.position = new Map;
		this.startBtn = startBtn;
		this.stopBtn = stopBtn;
		this.setParamsBtn = setParamsBtn;
		this.setRandomStartBtn = setRandomStartBtn;

		this.canvas = null;
		this.context = null

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
		const canvas = document.createElement('canvas');
		canvas.style.width = `${this.colCount}px`;
		canvas.style.height = `${this.rowCount}px`;
		canvas.style.border = '1px solid black'
		this.canvas = canvas;
		this.gameWrapper.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');
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
		this.nextStep();
	};


	draftPosition = () =>{
		for (let [number, isAlive] of this.position.entries()) {
			let coordinates = number.split(',')
			if (isAlive){
				this.context.fillStyle = "rgb(200,0,0)";
			}else {
				this.context.fillStyle = "rgb(0,0,0)";
			}
			this.context.fillRect(coordinates[0], coordinates[1], 1, 1);
		}

	}
	nextStep = () => {
		this.draftPosition()
		this.newPosition();
		if ([...this.position.values()].filter(item => item).length) {
			setTimeout(this.nextStep, 1000);
		} else {
			this.stopGame();
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


	mousedownEventHandler = (draw, mouse, e) => {
		let ClientRect = this.canvas.getBoundingClientRect();
		mouse.x = e.clientX - ClientRect.left;
		mouse.y = e.clientY - ClientRect.top;

		draw = true;
		this.context.beginPath();
		this.context.moveTo(mouse.x, mouse.y);
	};

	mousemoveEventHandler = (draw, mouse, e) => {

		if (draw === true) {
			let ClientRect = this.getBoundingClientRect();

			mouse.x = e.clientX - ClientRect.left;
			mouse.y = e.clientY - ClientRect.top;

			this.context.lineTo(mouse.x, mouse.y);
			this.context.stroke();
		}
	};

	mouseupEventHandler = (draw, mouse, e) => {
		let ClientRect = this.canvas.getBoundingClientRect();
		mouse.x = e.clientX - ClientRect.left;
		mouse.y = e.clientY - ClientRect.top;
		this.context.lineTo(mouse.x, mouse.y);
		this.context.stroke();
		this.context.closePath();
		draw = false;
	};

	addListener = () => {
		let draw = false;
		let mouse = { x: 0, y: 0 };

		this.canvas.addEventListener('mousedown',
			(e) => this.mousedownEventHandler( draw, mouse, e),
		);

		this.canvas.addEventListener('mousemove',
			(e) => this.mousemoveEventHandler(draw, mouse, e),
		);

		this.canvas.addEventListener('mouseup',
			(e) => this.mouseupEventHandler(draw, mouse, e),
		);
	};

	restart = () => {
		this.canvas.removeEventListener('mousedown',
			(e) => this.mousedownEventHandler(draw, mouse, e),
		);

		this.canvas.removeEventListener('mousemove',
			(draw, mouse, e) => this.mousemoveEventHandler(draw, mouse, e),
		);

		this.canvas.removeEventListener('mouseup',
			(draw, mouse, e) => this.mouseupEventHandler(draw, mouse, e),
		);
		this.gameWrapper.removeChild(this.canvas);
		this.rowCount = this.rowsInput.value;
		this.colCount = this.colsInput.value;
		this.maxCount = this.rowCount * this.maxCount;
		this.canvas = null;
		this.position = new Map
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