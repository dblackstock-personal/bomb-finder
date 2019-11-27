//we need a space object which can record what is on the space (bomb, number, error)
//and its status (unclicked, revealed, flagged)
//this should be enough information to draw the screen.

class Space {
    constructor() {
        this.content = 'error'; //this should never be seen by the player
        this.status = 'hidden';
    }
}

//we need to generate a grid of these spaces, which can be an array of arrays.
//numbered top-left to bottom-right.

let spaces = [];
let screenSpaces = [];

const newSpaces = () => {
    spaces = [];
    screenSpaces = [];
    for (let index = 0; index < 16; index++) {
        spaces.push(new Space());
    }

    //this ties screenSpaces[0] to spaces[0], creating a screen element for each space named e.g. 'space1' 'space2'
    spaces.forEach(element => {
        let input = document.getElementsByClassName(`space${screenSpaces.length + 1}`)[0];
        screenSpaces.push(input);
    });

    screenSpaces.forEach(element => {
        element.textContent = '?';
    });
}

//we define these here so that they can be reached by things like the Restart button
let activePlayField;
let bombNumber;
let screenSize;
let gameOver = false; //to let the game know when to stop checking the win condition
let playField9;
let playField16;

const newPlayFields = () => {
    // 1, 2, 3
    // 4, 5, 6
    // 7, 8, 9
    playField9 = [[spaces[0], spaces[3], spaces[6]], [spaces[1], spaces[4], spaces[7]], [spaces[2], spaces[5], spaces[8]]];

    // 1,  2,  3,  4
    // 5,  6,  7,  8
    // 9,  10, 11, 12
    // 13, 14, 15, 16
    playField16 = [[spaces[0], spaces[4], spaces[8], spaces[12]], [spaces[1], spaces[5], spaces[9], spaces[13]], [spaces[2], spaces[7], spaces[11], spaces[15]], [spaces[3], spaces[7], spaces[11], spaces[15]]];
}

newSpaces();
newPlayFields();

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
const screenIntroScreen = document.getElementById("opening-screen");
const screenStart = document.getElementById("start");
const screenBoardSize = document.getElementById("board-size");
const screenBombNumber = document.getElementById("bomb-number");
const screenIntroPrompt = document.getElementsByClassName("prompt")[0];
const screenRules = document.getElementById("rules");
//for the play screen
const screenGame = document.getElementById("game");
const screenHeader = document.getElementsByClassName("status")[0];
const screenRestartButton = document.getElementsByClassName("restart")[0];
const screenNewGameButton = document.getElementsByClassName("new-game")[0];

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

        if (!gameOver) {
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

    if (fieldClear == true) {
        screenHeader.textContent = "CONGRATULATIONS ALL BOMBS HAVE BEEN NOT FOUND";
    }
}

//function to clear the field and hide the spaces, ready for it to be regenerated
const clearField = (playField) => {

    console.log(playField);
    playField.forEach(matrix => {
        matrix.forEach(space => {
            space = new Space();
        })
    });

    // console.log(activePlayField);
    // for (let index = 0; index < 16; index++) {
    //     playField[index].content = "error";
    //     playField[index].status = "hidden";
    // }
}

//eventListener to start the game based on user's choice of settings

screenStart.addEventListener("click", () => {
    screenSize = screenBoardSize.value
    bombNumber = Number(screenBombNumber.value);
    let bombPrompt = 'Please enter a number of bombs less than or equal to the board size';
    let spaceWidth;

    //all this is to check the user input of bombNumber is valid
    if (Number.isInteger(bombNumber) && bombNumber >= 0 && bombNumber <= screenSize) {
    }
    else {
        screenIntroPrompt.textContent = bombPrompt;
        return;
    }

    //if statements to cope with rendering a 9-size or a 16-size playfield
    if (screenSize == '9') {
        activePlayField = playField9;
        spaceWidth = '30%';
    } else if (screenSize == '16') {
        activePlayField = playField16;
        spaceWidth = '21%';

        //this for loop sets spaces 10 to 16 to visible and with correct width
        for (let index = 9; index < 16; index++) {
            screenSpaces[index].style.display = 'block';
            screenSpaces[index].style.width = spaceWidth;
        }

    } else {
        screenIntroPrompt.textContent = 'Please enter a value for board size';
        return;
    }


    //this for loop sets spaces 0 to 9 to visible and with correct width
    for (let index = 0; index < 9; index++) {
        screenSpaces[index].style.display = 'block';
        screenSpaces[index].style.width = spaceWidth;
    }

    screenGame.style.display = 'flex';
    screenIntroScreen.style.display = 'none';

    // screenRules.style.display = 'none';

    generateBombs(activePlayField, bombNumber);
    generateNumbers(activePlayField);
    console.log(activePlayField);

    screenHeader.textContent = `There are ${bombNumber} bombs on the field...`;

});

//creates an eventListener for each space element

screenSpaces.forEach((element, index) => {

    element.addEventListener("click", function () {
        console.log(spaces[index])
        checkForMine(this, spaces[index]);
    }, false);

});

//eventListeners for the buttons

//restart needs to repopulate bombs and set playspaces to unclicked
screenRestartButton.addEventListener("click", () => {
    clearField(activePlayField);
    generateBombs(activePlayField, bombNumber);
    generateNumbers(activePlayField);
});

//new game returns user to intro menu
screenNewGameButton.addEventListener("click", () => {
    screenGame.style.display = 'none';
    screenIntroScreen.style.display = 'block';
    newSpaces();
    newPlayFields();
    activePlayField = '';
    // console.log(spaces);
    // console.log(activePlayField);

    //I created newSpaces, newPlayFields and clearField in order to reset the field but none work.
});