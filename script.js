const socket = io('https://damdam.glaasjemelk.com');
const board_div = document.getElementById('board');

const winnerDiv = document.getElementById('winner');

const form = document.getElementById('join-game');
const gameInput = document.getElementById('game-id');

const resignButton = document.getElementById('resign');
const offerDrawButton = document.getElementById('draw');

const dammen = require('dammen');
let board = new dammen.Dammen();
let turn = dammen.Player.White;

socket.on('receive-move', (newBoardArray, currentTurn, takeIndex) => {
    board.board = newBoardArray;
    turn = currentTurn;

    if (takeIndex !== null && board.boardArray[takeIndex].player === board.turn && board.boardArray[takeIndex].player === turn) {
        selected = document.getElementById('cell-' + takeIndex);
        selected.classList.add('selected');

        const moves = board.getLegalMovesFrom(takeIndex);
        for (const move of moves) {
            document.getElementById('cell-' + move.to).classList.add('possible');
        }
    }

    updateBoard();
});

socket.on('join-success', player => {
    board.turn = player;
    board = new dammen.Dammen();
    createBoard(player);
    console.log("Joined successfully!");
});

socket.on('opponent-disconnect', () => {
    alert("Opponent disconnected");
    board_div.innerHTML = "";
});

socket.on('game-over', winner => {
    winnerDiv.innerHTML += winner;
});

let selected = null;

function getIndex(target) {
    return Number(target.id.split('-')[1]);
}

function handleClick(event) {
    const target = event.target;
    const index = getIndex(target);

    if (selected !== null) {
        selected.classList.remove('selected');

        const moves = board.getLegalMovesFrom(getIndex(selected));
        let possibilities = [];
        for (const move of moves) {
            possibilities.push(document.getElementById('cell-' + move.to));
        }

        if (target.classList.contains('possible')) {
            const fromIndex = getIndex(selected);
            const move = board.getMatchingLegalMove(fromIndex, index);
            socket.emit('send-move', move);
        }

        for (const possible of possibilities) {
            possible.classList.remove('possible');
        }
    }

    if (board.boardArray[index].player !== board.turn || board.boardArray[index].player !== turn) {
        return;
    }

    target.classList.add('selected');
    selected = target;

    const moves = board.getLegalMovesFrom(index);
    for (const move of moves) {
        document.getElementById('cell-' + move.to).classList.add('possible');
    }
}

function createCellDiv(x, y) {
    let cell_div = document.createElement('div');
    cell_div.classList.add('cell');
    if ((x + y) % 2 === 0)
        return cell_div;
    
    let index = board.posToIndex(x, y);
    cell_div.id = `cell-${index}`;
    cell_div.addEventListener('click', handleClick);

    let piece = board.boardArray[index];
    if (piece.pieceType === dammen.PieceType.Empty) {
        return cell_div;
    }

    let color = piece.player === dammen.Player.White ? "white" : "black";
    let type = piece.pieceType === dammen.PieceType.Normal ? "normal" : "dam";

    cell_div.innerHTML = `<img src="images/${color}_${type}.png">`;

    return cell_div;
}

function createBoard(player) {
    board_div.innerHTML = "";
    winnerDiv.innerHTML = "The result is: "

    if (player === dammen.Player.White) {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                board_div.appendChild(createCellDiv(x, y));
            }
        }
    } else {
        for (let y = 9; y >= 0; y--) {
            for (let x = 9; x >= 0; x--) {
                board_div.appendChild(createCellDiv(x, y));
            }
        }
    }
}

function updateBoard() {
    for (let index = 0; index < 50; index++) {
        let piece = board.boardArray[index];
        if (piece.player === undefined) {
            document.getElementById('cell-' + index).innerHTML = ``;
            continue;
        }

        let color = piece.player === dammen.Player.White ? "white" : "black";
        let type = piece.pieceType === dammen.PieceType.Normal ? "normal" : "dam";

        document.getElementById('cell-' + index).innerHTML = `<img src="images/${color}_${type}.png">`;
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    socket.emit('join-game', gameInput.value);
});

resignButton.addEventListener('click', event => {
    event.preventDefault();
    socket.emit('resign');
});

offerDrawButton.addEventListener('click', event => {
    event.preventDefault();
    socket.emit('draw');
});
