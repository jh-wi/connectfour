document.addEventListener("DOMContentLoaded", () => {
    let xSize = 7;
    let ySize = 6;

    let clearID = 0;
    let redID = 1;
    let yellowID = 2;

    let gridDiv = document.getElementById("grid");
    let buttonDiv = document.getElementById("buttons");
    let status = document.getElementById("status");
    let restart = document.getElementById("restart");

    let redTurn = true;
    status.innerText = "Red's turn.";

    //keeps track of whether a space is clear, red, or yellow
    let grid = new Array(xSize * ySize);

    //references to the grids so we can change their colors
    let gridDivs = new Array(xSize * ySize);
    
    let gameover = false;

    //create a grid of empty divs
    for (let i = 0; i < xSize; i++) {

        //button div for each column
        let newButton = document.createElement("input");
        let buttonContent = document.createElement("div");
        buttonContent.innerText = "Place";
        newButton.className = "grid_button";
        newButton.type = "button";
        newButton.value = "Place";
        newButton.id = ("" + i);
        buttonDiv.appendChild(newButton);

        //grid div creation for every row in the column
        for (let j = 0; j < ySize; j++) {
            let el = document.createElement("div");

            el.className = "grid_item";
            el.id = "clear";

            gridDiv.appendChild(el);

            grid[i * ySize + j] = clearID;
            gridDivs[i * ySize + j] = el;
        }
    }

    //create a button for each column and add place functionality to it
    let buttons = document.getElementsByClassName("grid_button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (e) => {
            if (gameover) {
                return;
            }

            let x = parseInt(e.target.id); //which column the button was clicked
            let couldPlace = false;

            //go from bottom to top trying to place in column x
            for (let rowFromBottom = 0; rowFromBottom < ySize; rowFromBottom++) {

                //calculates the 2D grid location from a 1D array index
                let index = (xSize * (ySize - rowFromBottom - 1) + x);

                //only place if the space is clear
                if (grid[index] == clearID) {
                    if (redTurn) {
                        //place red
                        grid[index] = redID;
                        gridDivs[index].id = "red";
                        status.innerText = "Yellow's turn.";
                    } else {
                        //place yellow
                        grid[index] = yellowID;
                        gridDivs[index].id = "yellow";
                        status.innerText = "Red's turn.";
                    }
                    couldPlace = true;
                    redTurn = !redTurn;
                    if (completed(grid, xSize, ySize, !redTurn, gridDivs)) { //check if someone won when a move is made
                        gameover = true;
                        status.innerText = "GAME OVER. Red wins!";
                        if (redTurn) {
                            status.innerText = "GAME OVER. Yellow wins!";
                        }
                    } else if (!notFull(grid)) { //if there aren't any open slots left, it's a draw
                        gameover = true;
                        status.innerText = "Draw!";
                        return;
                    }
                    break;
                }
            }
            if (!couldPlace) {
                //tell the player to try another column, this one is full
                status.innerText = "That column is full! Yellow's turn.";
                if (redTurn) {
                    status.innerText = "That column is full! Red's turn.";
                }
            }
        });
    }
});

//returns true if it finds a clear space
function notFull(grid) {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] == 0) {
            return true;
        }
    }
    return false;
}

//takes in a grid and a position and returns as soon as it finds 4 reds in a row or 4 yellows in a row
function completed(grid, width, height, redTurn, gridDivs) {
    //need to search 4 directions on every tile: to the northeast, east, southeast, south

    //can change this to make it connect 5 or connect 6 instead of connect 4
    let winLength = 4;

    //for every spot in the grid, 
    for (let i = 0; i < grid.length; i++) {
        let x = i % width;
        let y = Math.floor(i / width);

        //don't search if we are looking at a clear space
        let id = grid[i];
        if (id == 0) {
            anyClear = true;
            continue;
        }

        //southeast
        let won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x + j, y + j)) {
                if (gridID(grid, width, x + j, y + j) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                continue;
            }
        }
        if (won) {
            for (let j = 0; j < winLength; j++) {
                let index = (x + j) + width * (y + j);
                if (redTurn) {
                    gridDivs[index].id = "redwin";
                } else {
                    gridDivs[index].id = "yellowwin";
                }
            }
            return true;
        }

        //north
        won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x, y + j)) {
                if (gridID(grid, width, x, y + j) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                continue;
            }
        }
        if (won) {
            for (let j = 0; j < winLength; j++) {
                let index = (x) + width * (y + j);
                if (redTurn) {
                    gridDivs[index].id = "redwin";
                } else {
                    gridDivs[index].id = "yellowwin";
                }
            }
            return true;
        }

        //east
        won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x + j, y)) {
                if (gridID(grid, width, x + j, y) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                continue;
            }
        }
        if (won) {
            for (let j = 0; j < winLength; j++) {
                let index = (x + j) + width * (y);
                if (redTurn) {
                    gridDivs[index].id = "redwin";
                } else {
                    gridDivs[index].id = "yellowwin";
                }
            }
            return true;
        }

        //southwest
        won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x - j, y + j)) {
                if (gridID(grid, width, x - j, y + j) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                continue;
            }
        }

        if (won) {
            for (let j = 0; j < winLength; j++) {
                let index = (x - j) + width * (y + j);
                if (redTurn) {
                    gridDivs[index].id = "redwin";
                } else {
                    gridDivs[index].id = "yellowwin";
                }
            }
            return true;
        }
    }

    //no string of winLength was found, so no one has won
    return false;
}

//make sure a spot in the grid is actually in the grid
function inbounds (width, height, x, y) {
    return (x < width && y < height && x >= 0 && y >= 0);
}

//returns whether the space in the grid is clear, red, or yellow
function gridID (grid, width, x, y) {
    return (grid[x + width * y]);
}

//just refreshes the page to reset the board
restart.addEventListener("click", () => {
    location.reload();
});