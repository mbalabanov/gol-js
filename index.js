const readline = require('readline');

let playfield = [];
const playfieldSize = {xwidth: 0, yheight: 0};

function initializePlayfield (xwidth, yheight) {
	for (let line = 1; line <= yheight; line++) {
		const cellStates = [];
		for (let column = 1; column <= xwidth; column++) {	
			const cellRandomizer = Math.floor(Math.random() * 10);
			if (cellRandomizer <= 4) {
				const cell = 0;
				cellStates.push(cell);
			} else {
				const cell = 1;
				cellStates.push(cell);
			}
		}
		playfield.push(cellStates);
	}
}

function plotPlayfield(playfield, xwidth, yheight) {
	for (let lineNumber = 0; lineNumber < yheight; lineNumber++) {
		let thisLine = '';
		for (let columnNumber = 0; columnNumber < xwidth; columnNumber++) {
			if (playfield[lineNumber][columnNumber]) {
				thisLine += '█';
			} else {
				thisLine += '.';
			}
		}
		console.log(thisLine);
	}
}

function generateSeparator(xwidth) {
	let separatorRow = '';
	for (let separatorCharacter = 0; separatorCharacter < xwidth; separatorCharacter++) {
		separatorRow += ' - ';
	}
	return separatorRow;
} 

function getUserInput(question, propertyName, callback) {
	let userInput = '';
	
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	
	rl.question(question + ': ', (userAnswer) => {
	  let numberInput = Number(userAnswer);
	  if(Number.isInteger(numberInput)) {
		  console.log("Valid input");
		  playfieldSize[propertyName] = numberInput;
		  rl.close();
		  callback(true);
	  } else {
		  console.log("Not a valid input");
	      rl.close();
		  getUserInput(question, propertyName, callback)
		  callback(false);
	  };
	});
}

function applyRules(cellValue, neighborsValue) {
// Any live cell with two or three live neighbours survives.
	if ((cellValue == 1 && neighborsValue == 2) || (cellValue == 1 && neighborsValue == 3)) {
		return 1;
	}

// Any dead cell with three live neighbours becomes a live cell.
	if (cellValue == 0 && neighborsValue == 3) {
		return 1;
	}

// All other live cells die in the next generation. Similarly, all other dead cells stay dead.
	return 0;
}

function outputWelcome() {
	console.log("\n* - - - - - - - - - - - - - - - - - *");
	console.log("  Welcome to Conway's  GAME OF LIFE");
	console.log("* - - - - - - - - - - - - - - - - - *\n\n");
}

function getNeignborValue(neighborCellx, neighborCelly) {
	const maxPlayfieldSizeX = playfieldSize.xwidth - 1;
	const maxPlayfieldSizeY = playfieldSize.yheight - 1;

	if (neighborCellx < 0 || neighborCellx >= playfieldSize.xwidth || neighborCelly < 0 || neighborCelly >= playfieldSize.yheight) {
		return 0;	
	}
	return playfield[neighborCelly][neighborCellx];
}

function getNeighbors(cell) {
	const allNeighbors = {
		ne: getNeignborValue(cell.cellx-1, cell.celly-1),
		n: getNeignborValue(cell.cellx, cell.celly-1),
		nw: getNeignborValue(cell.cellx+1, cell.celly -1),
		w: getNeignborValue(cell.cellx+1, cell.celly),
		sw: getNeignborValue(cell.cellx+1, cell.celly+1),
		s: getNeignborValue(cell.cellx, cell.celly+1),
		se: getNeignborValue(cell.cellx-1, cell.celly+1),
		e: getNeignborValue(cell.cellx-1, cell.celly)
	}
		
	const total = allNeighbors.ne + allNeighbors.n + allNeighbors.nw + allNeighbors.e + allNeighbors.w + allNeighbors.se +allNeighbors.s + allNeighbors.sw;

	return total;
}

function evaluatePlayfield(thisPlayfield) {
	let updatedPlayfield = JSON.parse(JSON.stringify(thisPlayfield));

	for (let thisLine = 0; thisLine < playfieldSize.yheight; thisLine++) {
		for (let thisColumn = 0; thisColumn < playfieldSize.xwidth; thisColumn++) {
			const totalNeighborsValue = getNeighbors({ celly: thisLine, cellx: thisColumn });
			
			const currentCellValue = playfield[thisLine][thisColumn];

			let newCellValue = 0;

			newCellValue = applyRules(currentCellValue, totalNeighborsValue);
			
			updatedPlayfield[thisLine][thisColumn] = newCellValue;
		}
	}

    return JSON.parse(JSON.stringify(updatedPlayfield));
}

function generateNextRound() {
	process.stdout.write('\u001Bc');
	generateSeparator(playfieldSize.xwidth);
	playfield = evaluatePlayfield(playfield);
	plotPlayfield(playfield, playfieldSize.xwidth, playfieldSize.yheight)
	generateSeparator(playfieldSize.xwidth);
	console.log("\nPress CTRL + C to stop.")
}

function playGame() {
  process.stdout.write('\u001Bc');
  outputWelcome()
  getUserInput("Enter the WIDTH of the playfield", "xwidth", (success1) => {
    if (success1) {
      getUserInput("Enter the HEIGHT of the playfield", "yheight", (success2) => {
        if (success2) {
			initializePlayfield(playfieldSize.xwidth, playfieldSize.yheight);
			console.log("\nGenerating playfield...\n")
			let intervalID = setInterval(generateNextRound, 2000);
        }
      });
    }
  });
}

playGame();
