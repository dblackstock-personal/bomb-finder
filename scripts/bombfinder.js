//we need a space object which can record what is on the space (bomb, number, blank)
//and its status (unclicked, revealed, flagged)
//this should be enough information to draw the screen.

class Space {
    constructor() {
        this.content = 'blank';
        this.status = 'hidden';
    }
}

//we need to generate a grid of these spaces, which can be an array of arrays.
//numbered top-left to bottom-right.
// const space1 = new Space();
// const space2 = new Space();
// const space3 = new Space();
// const space4 = new Space();
// const space5 = new Space();
// const space6 = new Space();
// const space7 = new Space();
// const space8 = new Space();
// const space9 = new Space();
// const space10 = new Space();
// const space11 = new Space();
// const space12 = new Space();
// const space13 = new Space();
// const space14 = new Space();
// const space15 = new Space();
// const space16 = new Space();

const spaces = [];

for (let index = 0; index < 16; index++) {
    spaces.push(new Space());
}

let activePlayField;
let numberOfBombs = 2;
let gameOver = false; //to let the game know when to stop checking the win condition

// 1, 2, 3
// 4, 5, 6
// 7, 8, 9
// let playField9 = [[space1, space4, space7], [space2, space5, space8], [space3, space6, space9]];
let playField9 = [[spaces[0], spaces[3], spaces[6]], [spaces[1], spaces[4], spaces[7]], [spaces[2], spaces[5], spaces[8]]];


// 1,  2,  3,  4
// 5,  6,  7,  8
// 9,  10, 11, 12
// 13, 14, 15, 16
// let playField16 = [[space1, space5, space9, space13], [space2, space6, space10, space14], [space3, space7, space11, space15], [space4, space8, space12, space16]];
let playField16 = [[spaces[0], spaces[4], spaces[8], spaces[12]], [spaces[1], spaces[5], spaces[9], spaces[13]], [ spaces[2], spaces[7], spaces[11], spaces[15]], [spaces[3], spaces[7], spaces[11], spaces[15]]];


//now we need a way to randomly put a bomb somewhere on this field.

const generateBombs = (field, numberOfBombs) => {

    //this needs to generate a number from 0 to length-1
    const randomPosition = (array) => {
        return Math.floor(Math.random() * (array.length));
    }

    //loop to fill the board with the correct number of bombs
    for (let index = 0; index < numberOfBombs; index++) {
        let randomHoriz = randomPosition(field);
        let randomVert = randomPosition(field[0]);

        let space = field[randomHoriz][randomVert];

        //if it's already got a bomb in it, don't put a bomb here!
        if (space.content != 'bomb') {
            space.content = 'bomb';
            console.log('here1');
        } else {
            console.log('here2');
            index--;
        }
    }
}

//now we need something to generate numbers based on the nearby bombs.

const generateNumbers = (field) => {

    const countBombs = (field, horizontal, vertical) => {

        let bombsFound = 0;
        //complicated loops to check how many bombs surround the chosen space
        for (let horiz = (horizontal - 1); horiz <= (horizontal + 1); horiz++) {
            if (horiz < 0) { //this covers leftmost
                horiz = 0;
            } else if (horiz == field.length) {  //exit out if we start going too far right
                break;
            }

            for (let vert = (vertical - 1); vert <= (vertical + 1); vert++) {
                if (vert < 0) { //this covers topmost
                    vert = 0;
                } else if (vert == field[0].length) {    //this covers bottommost
                    break;
                }

                //this bit for the actual adding
                //we don't need to define the case where the loop looks at its own space, because that space will never have a bomb
                //we only call the function for spaces that aren't bombs
                if (field[horiz][vert].content == 'bomb') {
                    bombsFound++;
                }

            }

        }
        return bombsFound;
    }

    //iterate over every non-bomb element to run countBombs for each of them
    field.forEach((element, positionHoriz) => {

        element.forEach((space, positionVert) => {
            if (space.content != 'bomb') {
                space.content = countBombs(field, positionHoriz, positionVert);
            }
        });

    });
}

//--------all this is about actually playing the game--------


//stuff for the intro screen
const screenStart = document.getElementById("start");
const screenBoardSize = document.getElementById("board-size");
const screenBombNumber = document.getElementById("bomb-number");
const screenIntroPrompt = document.getElementsByClassName("prompt")[0];
//for the play screen
// const screenSpace1 = document.getElementsByClassName("space1")[0];
// console.log(screenSpace1);
// const screenSpace2 = document.getElementsByClassName("space2")[0];
// const screenSpace3 = document.getElementsByClassName("space3")[0];
// const screenSpace4 = document.getElementsByClassName("space4")[0];
// const screenSpace5 = document.getElementsByClassName("space5")[0];
// const screenSpace6 = document.getElementsByClassName("space6")[0];
// const screenSpace7 = document.getElementsByClassName("space7")[0];
// const screenSpace8 = document.getElementsByClassName("space8")[0];
// const screenSpace9 = document.getElementsByClassName("space9")[0];
// const screenSpace10 = document.getElementsByClassName("space10")[0];
// const screenSpace11 = document.getElementsByClassName("space11")[0];
// const screenSpace12 = document.getElementsByClassName("space12")[0];
// const screenSpace13 = document.getElementsByClassName("space13")[0];
// const screenSpace14 = document.getElementsByClassName("space14")[0];
// const screenSpace15 = document.getElementsByClassName("space15")[0];
// const screenSpace16 = document.getElementsByClassName("space16")[0];
const screenHeader = document.getElementsByClassName("status")[0];

let screenSpaces = [];

//this ties screenSpaces[0] to spaces[0] etc.

spaces.forEach(element => {
    let input = document.getElementsByClassName(`space${screenSpaces.length+1}`)[0];
    screenSpaces.push(input);
    console.log(screenSpaces[screenSpaces.length-1]);
});

//functions for playing

//a function to check a square to find a bomb
const checkForMine = (screenSpace, space) => {
    if (space.status == "hidden") {
        // console.log(space.content);
        screenSpace.textContent = `${space.content}`;
        if (space.content == "bomb") {
            screenHeader.textContent = "THE GAME IS OVER, A BOMB WAS FOUND";
            gameOver = true;
        }
        space.status = 'revealed';

        if (!gameOver){
        checkGameWon(activePlayField);
        }
    }
}

//a function to check if only the bombs remain
const checkGameWon = (playField) => {
    let fieldClear = true;

    playField.forEach(element => {

        element.forEach(space => {
            if (space.status == 'hidden' && space.content != 'bomb') {
                fieldClear = false;
            }
        });

    });

    if (fieldClear == true){
        screenHeader.textContent = "CONGRATULATIONS ALL BOMBS HAVE BEEN NOT FOUND";
    }
}

//eventListener to start the game based on user's choice of settings

screenStart.addEventListener("click", () =>{
    let screenSize = screenBoardSize.value
    let bombNumber = Number(screenBombNumber.value);
    let bombPrompt = 'Please enter a number of bombs less than or equal to the board size';
    let spaceWidth;

    console.log(Number.isInteger(bombNumber));
    console.log(bombNumber >= 0);
    console.log(bombNumber <= screenSize);

    //all this is to check the bombNumber input is valid
 if (Number.isInteger(bombNumber) && bombNumber >= 0 && bombNumber <= screenSize){
        }
        else{
            screenIntroPrompt.textContent = bombPrompt;
            return;
        }

    if (screenSize == '9'){
        activePlayField = playField9;
        spaceWidth = '30%';
    } else if(screenSize== '16'){
        activePlayField = playField16;

        screenSpace10.style.visibility = 'visible';
        screenSpace11.style.visibility = 'visible';
        screenSpace12.style.visibility = 'visible';
        screenSpace13.style.visibility = 'visible';
        screenSpace14.style.visibility = 'visible';
        screenSpace15.style.visibility = 'visible';
        screenSpace16.style.visibility = 'visible';

        spaceWidth = '21%';

        screenSpace10.style.width = spaceWidth;
        screenSpace11.style.width = spaceWidth;
        screenSpace12.style.width = spaceWidth;
        screenSpace13.style.width = spaceWidth;
        screenSpace14.style.width = spaceWidth;
        screenSpace15.style.width = spaceWidth;
        screenSpace16.style.width = spaceWidth;
    } else{
        screenIntroPrompt.textContent = 'Please enter a value for board size';
        return;
    }

    //TODO link screenSpaces to Space objects, so that we can iterate over the playfield array to set these values
    screenSpace1.style.visibility = 'visible';
    screenSpace2.style.visibility = 'visible';
    screenSpace3.style.visibility = 'visible';
    screenSpace4.style.visibility = 'visible';
    screenSpace5.style.visibility = 'visible';
    screenSpace6.style.visibility = 'visible';
    screenSpace7.style.visibility = 'visible';
    screenSpace8.style.visibility = 'visible';
    screenSpace9.style.visibility = 'visible';
    screenHeader.style.visibility = 'visible';

    screenSpace1.style.width = spaceWidth;
    screenSpace2.style.width = spaceWidth;
    screenSpace3.style.width = spaceWidth;
    screenSpace4.style.width = spaceWidth;
    screenSpace5.style.width = spaceWidth;
    screenSpace6.style.width = spaceWidth;
    screenSpace7.style.width = spaceWidth;
    screenSpace8.style.width = spaceWidth;
    screenSpace9.style.width = spaceWidth;

    screenStart.style.visibility = 'hidden';
    screenBoardSize.style.visibility = 'hidden';
    screenBombNumber.style.visibility = 'hidden';
    screenIntroPrompt.style.visibility = 'hidden';

    generateBombs(activePlayField, bombNumber);
    generateNumbers(activePlayField);
    console.log(activePlayField);

    //now to make the field visible


    screenHeader.textContent = `There are ${bombNumber} bombs on the field...`;

});

//now we need an eventListener for each square.
//there must be a better way to do this.

screenSpaces.forEach((element, index) => {

    element.addEventListener("click", function () {
        checkForMine(this, spaces[element]);
}, false);

});

// screenSpace1.addEventListener("click", function () {
//     checkForMine(this, space1);
// }, false);

// screenSpace2.addEventListener("click", function () {
//     checkForMine(this, space2);
// }, false);

// screenSpace3.addEventListener("click", function () {
//     checkForMine(this, space3);
// }, false);

// screenSpace4.addEventListener("click", function () {
//     checkForMine(this, space4);
// }, false);

// screenSpace5.addEventListener("click", function () {
//     checkForMine(this, space5);
// }, false);

// screenSpace6.addEventListener("click", function () {
//     checkForMine(this, space6);
// }, false);

// screenSpace7.addEventListener("click", function () {
//     checkForMine(this, space7);
// }, false);

// screenSpace8.addEventListener("click", function () {
//     checkForMine(this, space8);
// }, false);

// screenSpace9.addEventListener("click", function () {
//     checkForMine(this, space9);
// }, false);

// screenSpace10.addEventListener("click", function () {
//     checkForMine(this, space10);
// }, false);

// screenSpace11.addEventListener("click", function () {
//     checkForMine(this, space11);
// }, false);

// screenSpace12.addEventListener("click", function () {
//     checkForMine(this, space12);
// }, false);

// screenSpace13.addEventListener("click", function () {
//     checkForMine(this, space13);
// }, false);

// screenSpace14.addEventListener("click", function () {
//     checkForMine(this, space14);
// }, false);

// screenSpace15.addEventListener("click", function () {
//     checkForMine(this, space15);
// }, false);

// screenSpace16.addEventListener("click", function () {
//     checkForMine(this, space16);
// }, false);