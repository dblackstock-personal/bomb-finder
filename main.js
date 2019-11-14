//we need a space object which can record what is on the space (mine, number, blank)
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
const space1 = new Space();
const space2 = new Space();
const space3 = new Space();
const space4 = new Space();
const space5 = new Space();
const space6 = new Space();
const space7 = new Space();
const space8 = new Space();
const space9 = new Space();

// 1, 2, 3
// 4, 5, 6
// 7, 8, 9
let playField = [[space1, space4, space7], [space2, space5, space8], [space3, space6, space9]];

//now we need a way to randomly put a mine somewhere on this field.

const generateMines = (field, numberOfMines) => {

    //this needs to generate a number from 0 to length-1
    const randomPosition = (array) => {
        return Math.floor(Math.random() * (array.length));
    }

    //loop to fill the board with the correct number of mines
    for (let index = 0; index < numberOfMines; index++) {
        let randomHoriz = randomPosition(field);
        let randomVert = randomPosition(field[0]);

        let space = field[randomHoriz][randomVert];

        //if it's already got a mine in it, don't put a mine here!
        if (space.content != 'mine') {
            space.content = 'mine';
            console.log('here1');
        } else {
            console.log('here2');
            index--;
        }
    }


    // console.log(field[randomHoriz][randomVert]);


}

//now we need something to generate numbers based on the nearby mines.

const generateNumbers = (field) => {

    const countMines = (field,horizontal,vertical) => {

        let minesFound = 0;
        //complicated loops to check how many mines surround the chosen space
        for (let horiz = (horizontal-1); horiz <= (horizontal+1); horiz++) { 
            if (horiz < 0){ //this covers leftmost
                horiz = 0;
            } else if (horiz == field.length){  //exit out if we start going too far right
                break;
            }

            for (let vert = (vertical-1); vert <= (vertical+1); vert++) {
                if (vert < 0){ //this covers topmost
                    vert = 0;
                } else if (vert == field[0].length){    //this covers bottommost
                    break;
                }

                //this bit for the actual adding
                if (horiz == horizontal && vert == vertical){ //for the case where we look at the square itself
                    vert++;
                } else if (field[horiz][vert].content == 'mine'){
                    minesFound ++;
                }

            }
            
        }
        return minesFound;
    }

    //iterate over every non-mine element to run countMines for each of them
    field.forEach((element, positionHoriz) => {

        element.forEach((space, positionVert) => {
            if (space.content != 'mine') {
                space.content = countMines(field,positionHoriz,positionVert);
            }
        });

    });
}



//this is all for playing the game
//we just need eventListeners for each space? maybe?


generateMines(playField, 2);
generateNumbers(playField);

console.log(playField);