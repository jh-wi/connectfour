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

    let grid = new Array(xSize * ySize);
    let gridDivs = new Array(xSize * ySize);
    
    let gameover = false;

    //create a grid of empty divs
    for (let i = 0; i < xSize; i++) {
        let newButton = document.createElement("input");
        let buttonContent = document.createElement("div");
        buttonContent.innerText = "Place";
        newButton.className = "grid_button";
        newButton.type = "button";
        newButton.value = "Place";
        newButton.id = ("" + i);

        //newButton.appendChild(buttonContent);
        buttonDiv.appendChild(newButton);

        //buttons[i] = newButton;

        //grid[i] = new Array(ySize);
        for (let j = 0; j < ySize; j++) {
            let el = document.createElement("div");

            //let content = document.createTextNode("" + (i * ySize + j));
            el.className = "grid_item";
            el.id = "clear";

            //el.appendChild(content);
            gridDiv.appendChild(el);

            grid[i * ySize + j] = clearID;
            gridDivs[i * ySize + j] = el;
        }
    }

    //create a button for each column and add functionality
    let buttons = document.getElementsByClassName("grid_button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (e) => {
            if (gameover) {
                return;
            }

            let x = parseInt(e.target.id);
            //let rowFromBottom = 3;
            //let bottom = (xSize * (ySize - rowFromBottom - 1) + x);
            //console.log(bottom);
            let couldPlace = false;
            for (let rowFromBottom = 0; rowFromBottom < ySize; rowFromBottom++) {
                let index = (xSize * (ySize - rowFromBottom - 1) + x);
                console.log(index + ", " + grid[index]);
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
                    if (completed(grid, xSize, ySize, !redTurn, gridDivs)) {
                        gameover = true;
                        status.innerText = "GAME OVER. Red wins!";
                        if (redTurn) {
                            status.innerText = "GAME OVER. Yellow wins!";
                        }
                    } else if (!notFull(grid)) {
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
            } else {
                //check if someone won
            }
        });
    }
});

function notFull(grid) {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] == 0) {
            return true;
        }
    }
    return false;
}

//TODO: add a function that takes in a grid and position and returns if there are at least 4 reds in a row or 4 yellows in a row
function completed(grid, width, height, redTurn, gridDivs) {
    //need to search 4 directions on every tile: to the northeast, east, southeast, south
    let winLength = 4;
    for (let i = 0; i < grid.length; i++) {
        //let c = i;
        let x = i % width;
        let y = Math.floor(i / width);
        //console.log(x + ", " + y);

        let id = grid[i];
        if (id == 0) {
            anyClear = true;
            continue;
        }

        //northwest
        let won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x + j, y + j)) {
                if (gridID(grid, width, x + j, y + j) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                break;
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
                break;
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
                break;
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

        //southeast
        won = true;
        for (let j = 0; j < winLength; j++) {
            if (inbounds(width, height, x - j, y + j)) {
                if (gridID(grid, width, x - j, y + j) != id) {
                    won = false;
                    break;
                }
            } else {
                won = false;
                break;
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
    return false;
}

function inbounds (width, height, x, y) {
    return (x < width && y < height && x >= 0 && y >= 0);
}

function gridID (grid, width, x, y) {
    return (grid[x + width * y]);
}

restart.addEventListener("click", () => {
    location.reload();
});