let boardCell;
let boardArray = [];
let userInput;
let savedInput;
let savedLocations = [];
let counter = 0;
const output = document.getElementById('output');
const submitInput = document.getElementById('submitInput');
const submitButton = document.getElementById('submitButton');
const gameOver = document.getElementById('gameOver');
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

// string = no shot 
// 1 = ship cell 
// 2 = miss 

//Generate table cells

(() => {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            boardCell = document.createElement('td');
            boardCell.innerHTML = '.';
            boardCell.setAttribute('id', i + "" + j);
            document.getElementById('row' + i).append(boardCell); 
        }
    }
})();

//Generate battlefield array

(() => {
    for (let i = 0; i < 10; i++) {
        boardArray.push([]);
        for (let j = 0; j < 10; j++) {
            boardArray[i].push(i + "" + j);
        }
    }
})();


//Build ships

class Ship {
    constructor(length) {
        this.length = length;
    }

    build() {
        let orientation = Math.floor(Math.random() * 2);
        let row;
        let col;
        let location = [];

        if (orientation == 1) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * (10 - this.length + 1));
            for (let i = 0; i < this.length; i ++) {
                location.push([row, col + i]);
            }
        }
        else {
            row = Math.floor(Math.random() * (10 - this.length + 1));
            col = Math.floor(Math.random() * 10);
            for (let i = 0; i < this.length; i ++) {
                location.push([row + i, col]);
            }
        }
        savedLocations.push(location);

        if (this.check() == false) {
            if (orientation == 1) {
                for (let i = 0; i < this.length; i ++) {
                    boardArray[row][col + i] = 1;
                }
            }
            else {
                for (let i = 0; i < this.length; i ++) {
                    boardArray[row + i][col] = 1;
                }
            }
        }
        else {
            savedLocations.pop();
            this.build();
        }
        
    }   

    check() {
        const checkingArr = savedLocations.flat().map(i => i = i[0] + "" + i[1]);
        function checkForDublicates(a) {
            return new Set(a).size !== a.length; 
        }
        return checkForDublicates(checkingArr);
    }
}


const battleship = new Ship(5);
battleship.build();
const destroyer1 = new Ship(4);
destroyer1.build();
const destroyer2 = new Ship(4);
destroyer2.build();

//Get input from the player

const getInput = (input) => {
    userInput = input.value.toUpperCase();
    savedInput = letters.indexOf(userInput.charAt(0)) + "" + (parseInt(userInput.slice(1)) - 1);
    return savedInput;
};

// "Show" option

const showShips = (arr, input) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== 1) {
                document.getElementById(i + "" + j).innerHTML = " ";
            }
            else {
                document.getElementById(i + "" + j).innerHTML = "x";
            }
        }
    }
};

//Check for sunken ships 

const checkShipStatus = (arr, item) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++)         {
            if (arr[i][j][0] == item[0] && arr[i][j][1] == item[1]) {
                arr[i].splice(j, 1);
            }
        }
    }
    for (let i = 0; i < savedLocations.length; i++) {
        if (savedLocations[i].length == 0){
            savedLocations.splice(i, 1);
            output.innerHTML = "*** Sunk ***";
        }
    }
    if (arr.length == 0) {
        gameOver.innerHTML = "Well done! You completed the game in " + counter + " shots!";
    }
};

//Generate message and update the grid

const updateBattlefield = (arr, input) => {
    output.innerHTML = "";
    let inputArr = input.split('');
    if (typeof(arr[inputArr[0]][inputArr[1]]) == "string") {
        arr[inputArr[0]][inputArr[1]] = 2;
        output.innerHTML = "*** Miss ***";
        document.getElementById(input).innerHTML = "-";
    }
    if (arr[inputArr[0]][inputArr[1]] == 1) {
        output.innerHTML = "*** Hit ***";
        document.getElementById(input).innerHTML = "x";
        let inputInt = inputArr.map(i => parseInt(i));
        checkShipStatus(savedLocations, inputInt);
    }
};
       
// Event listener

submitButton.onclick = () => {
    counter ++;
    getInput(submitInput);
    let result = /[A-J][1-9|10]/gi.test(userInput);
    if (userInput == "SHOW") {
        showShips(boardArray, userInput);
        return;
    }
    if (!result || parseInt(userInput.slice(1)) > 10) {
        output.innerHTML= "*** Error ***";
        return;
    }
    updateBattlefield(boardArray, savedInput);
};