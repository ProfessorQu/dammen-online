(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
//     0  1  2  3  4  5  6  7  8  9
//   -------------------------------
// 0 | -  0  -  1  -  2  -  3  -  4 
// 1 | 5  -  6  -  7  -  8  -  9  - 
// 2 | -  10 -  11 -  12 -  13 -  14
// 3 | 15 -  16 -  17 -  18 -  19 - 
// 4 | -  20 -  21 -  22 -  23 -  24
// 5 | 25 -  26 -  27 -  28 -  29 - 
// 6 | -  30 -  31 -  32 -  33 -  34
// 7 | 35 -  36 -  37 -  38 -  39 - 
// 8 | -  40 -  41 -  42 -  43 -  44
// 9 | 45 -  46 -  47 -  48 -  49 - 
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dammen = exports.Move = exports.Piece = exports.Player = exports.PieceType = void 0;
var PieceType;
(function (PieceType) {
    PieceType[PieceType["Empty"] = 0] = "Empty";
    PieceType[PieceType["Normal"] = 1] = "Normal";
    PieceType[PieceType["Dam"] = 2] = "Dam";
})(PieceType || (exports.PieceType = PieceType = {}));
var Player;
(function (Player) {
    Player[Player["White"] = 0] = "White";
    Player[Player["Black"] = 1] = "Black";
})(Player || (exports.Player = Player = {}));
var Piece = /** @class */ (function () {
    function Piece(type, player) {
        this.pieceType = type;
        this.player = player;
    }
    /**
     * Creates an empty piece
     * @returns an empty piece
     */
    Piece.empty = function () {
        return new Piece(PieceType.Empty);
    };
    /**
     * Creates a new normal piece of player
     * @param player the player of this piece
     * @returns a new normal piece
     */
    Piece.normal = function (player) {
        return new Piece(PieceType.Normal, player);
    };
    /**
     * Creates a new dam piece of player
     * @param player the player of this piece
     * @returns a new dam piece
     */
    Piece.dam = function (player) {
        return new Piece(PieceType.Dam, player);
    };
    return Piece;
}());
exports.Piece = Piece;
var Move = /** @class */ (function () {
    function Move(from, to, pieceType, hitPiece) {
        this.from = from;
        this.to = to;
        this.pieceType = pieceType;
        this.hitPiece = hitPiece;
    }
    /**
     * Checks for equality between two moves
     * @param other the move to compare this one to
     * @returns whether all fields match
     */
    Move.prototype.equals = function (other) {
        return this.from == other.from && this.to == other.to && this.pieceType == other.pieceType && this.hitPiece == other.hitPiece;
    };
    return Move;
}());
exports.Move = Move;
var Dammen = /** @class */ (function () {
    /**
     * Create a normal dam board
     */
    function Dammen() {
        this.board = Array(50).fill(Piece.empty());
        this.moves = [];
        this.dirty = true;
        this.turn = Player.White;
        for (var i = 0; i < 20; i++) {
            this.board[i] = Piece.normal(Player.Black);
        }
        for (var i = 30; i < 50; i++) {
            this.board[i] = Piece.normal(Player.White);
        }
    }
    /**
     * Make a move
     * @param move the move to make
     * @returns whether the move succeeded
     */
    Dammen.prototype.move = function (move) {
        if (!this.isLegalMove(move))
            return false;
        this.board[move.to] = new Piece(move.pieceType, this.board[move.from].player);
        this.board[move.from] = Piece.empty();
        this.dirty = true;
        if (move.hitPiece !== undefined) {
            this.board[move.hitPiece] = Piece.empty();
        }
        else {
            this.turn = this.opponent;
            return true;
        }
        this.takeIndex = move.to;
        var legalMoves = this.getLegalMoves();
        if (!(move.hitPiece !== undefined && legalMoves.length > 0 && legalMoves[0].hitPiece !== undefined)) {
            this.turn = this.opponent;
            this.takeIndex = undefined;
            this.dirty = true;
        }
        return true;
    };
    /**
     * Get the matching legal moves
     * @param fromIndex the index where the piece moves from
     * @param toIndex the index where the piece moves to
     * @returns the legal move that matches it
     */
    Dammen.prototype.getMatchingLegalMove = function (fromIndex, toIndex) {
        return this.getLegalMoves().find(function (loopMove) { return loopMove.from == fromIndex && loopMove.to == toIndex; });
    };
    /**
     * Get all legal moves
     * @returns a list of all moves
     */
    Dammen.prototype.getLegalMoves = function () {
        if (!this.dirty) {
            return this.moves;
        }
        var takeMoves = [];
        var shiftMoves = [];
        if (this.takeIndex !== undefined) {
            this.addMovesForIndex(this.takeIndex, shiftMoves, takeMoves);
        }
        else {
            for (var index = 0; index < 50; index++) {
                this.addMovesForIndex(index, shiftMoves, takeMoves);
            }
        }
        if (takeMoves.length > 0) {
            this.moves = takeMoves;
        }
        else {
            this.moves = shiftMoves;
        }
        return this.moves;
    };
    /**
     * Gets legal moves that start at the fromIndex
     * @param fromIndex the index from where the move starts
     * @returns a list of moves from a certain index
     */
    Dammen.prototype.getLegalMovesFrom = function (fromIndex) {
        return this.getLegalMoves().filter(function (move) { return move.from == fromIndex; });
    };
    /**
     * Is the game over
     * @returns true if the game is done
     */
    Dammen.prototype.gameOver = function () {
        return this.getLegalMoves().length === 0;
    };
    Object.defineProperty(Dammen.prototype, "boardArray", {
        /**
         * Get an array representation of the board
         */
        get: function () {
            return this.board;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates an empty board
     * @returns an empty board
     */
    Dammen.empty = function () {
        var dammen = new Dammen();
        dammen.board.fill(Piece.empty());
        return dammen;
    };
    /**
     * Add a new piece
     * @param index the index on the board
     * @param piece the piece to add
     */
    Dammen.prototype.addPiece = function (index, piece) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        this.board[index] = piece;
        this.dirty = true;
    };
    Dammen.prototype.posInBounds = function (x, y) {
        if (x < 0 || y < 0 || x >= 10 || y >= 10) {
            return false;
        }
        return true;
    };
    Dammen.prototype.indexInBounds = function (index) {
        return index >= 0 && index < 50;
    };
    /**
     * Converts a position to an index
     * @param x the x coordinate
     * @param y the y coordinate
     * @returns the index in the boardArray
     */
    Dammen.prototype.posToIndex = function (x, y) {
        if ((x + y) % 2 === 0) {
            throw new RangeError("Empty square on x: ".concat(x, ", y: ").concat(y));
        }
        else if (!this.posInBounds(x, y)) {
            throw new RangeError("Position (".concat(x, ", ").concat(y, ") out of bounds"));
        }
        return y * 5 + Math.floor(x / 2);
    };
    /**
     * Converts an index to a position
     * @param index the index in the board
     * @returns a tuple of the x and y coordinate
     */
    Dammen.prototype.indexToPos = function (index) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        var y = Math.floor(index / 5);
        var x = (index % 5) * 2 + 1 - y % 2;
        return [x, y];
    };
    Dammen.prototype.getPromotionRow = function () {
        return this.turn === Player.Black ? 9 : 0;
    };
    Dammen.prototype.getForwardDirection = function (player) {
        return player == Player.White ? -1 : 1;
    };
    Object.defineProperty(Dammen.prototype, "opponent", {
        get: function () {
            return this.turn === Player.Black ? Player.White : Player.Black;
        },
        enumerable: false,
        configurable: true
    });
    Dammen.prototype.isLegalMove = function (move) {
        return this.getLegalMoves().find(function (findMove) { return findMove.equals(move); }) !== undefined;
    };
    Dammen.prototype.hasPiece = function (index) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        return this.board[index].pieceType !== PieceType.Empty;
    };
    Dammen.prototype.hasEnemyPiece = function (index) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        return this.board[index].player === this.opponent;
    };
    Dammen.prototype.isEmpty = function (index) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        return this.board[index].pieceType === PieceType.Empty;
    };
    Dammen.prototype.shouldBeDam = function (fromIndex, toIndex) {
        if (!this.indexInBounds(fromIndex)) {
            throw new RangeError("Index 'fromIndex' (".concat(fromIndex, ") out of bounds"));
        }
        else if (!this.indexInBounds(toIndex)) {
            throw new RangeError("Index 'toIndex' (".concat(toIndex, ") out of bounds"));
        }
        return this.board[fromIndex].pieceType === PieceType.Dam || this.getPromotionRow() === this.indexToPos(toIndex)[1];
    };
    /**
     * Offset an index's position by some offset
     * @param index the index to start from
     * @param xOffset the x offset from the start
     * @param yOffset the y offset from the start
     * @returns the new index or undefined if it's out of bounds
     */
    Dammen.prototype.offsetIndex = function (index, xOffset, yOffset) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        var _a = this.indexToPos(index), x = _a[0], y = _a[1];
        var newX = x + xOffset;
        var newY = y + yOffset;
        return this.posInBounds(newX, newY) ? this.posToIndex(newX, newY) : undefined;
    };
    Dammen.prototype.createMove = function (fromIndex, toIndex, hitPiece) {
        if (!this.indexInBounds(fromIndex)) {
            throw new RangeError("Index 'fromIndex' (".concat(fromIndex, ") out of bounds"));
        }
        else if (!this.indexInBounds(toIndex)) {
            throw new RangeError("Index 'toIndex' (".concat(toIndex, ") out of bounds"));
        }
        var pieceType = this.shouldBeDam(fromIndex, toIndex) ? PieceType.Dam : PieceType.Normal;
        return new Move(fromIndex, toIndex, pieceType, hitPiece);
    };
    Dammen.prototype.addLegalShiftMoves = function (index, xOffset, yOffset, is_dam, shiftMoves) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        var offsetIndex = this.offsetIndex(index, xOffset, yOffset);
        if (offsetIndex === undefined || this.hasPiece(offsetIndex))
            return offsetIndex;
        do {
            shiftMoves.push(this.createMove(index, offsetIndex));
            offsetIndex = this.offsetIndex(offsetIndex, xOffset, yOffset);
        } while (is_dam && offsetIndex !== undefined && this.isEmpty(offsetIndex));
        return offsetIndex;
    };
    Dammen.prototype.addLegalTakeMoves = function (index, xOffset, yOffset, is_dam, takeMoves, offsetIndex) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        if (offsetIndex === undefined || !this.hasEnemyPiece(offsetIndex))
            return;
        var hitIndex = offsetIndex;
        offsetIndex = this.offsetIndex(offsetIndex, xOffset, yOffset);
        if (offsetIndex === undefined || this.hasPiece(offsetIndex))
            return;
        do {
            takeMoves.push(this.createMove(index, offsetIndex, hitIndex));
            offsetIndex = this.offsetIndex(offsetIndex, xOffset, yOffset);
        } while (is_dam && offsetIndex !== undefined && this.isEmpty(offsetIndex));
    };
    Dammen.prototype.addNormalMoves = function (index, player, shiftMoves, takeMoves) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        var forward = this.getForwardDirection(player);
        for (var xOffset = -1; xOffset <= 1; xOffset += 2) {
            this.addLegalShiftMoves(index, xOffset, forward, false, shiftMoves);
            for (var yOffset = -1; yOffset <= 1; yOffset += 2) {
                var offsetIndex = this.offsetIndex(index, xOffset, yOffset);
                this.addLegalTakeMoves(index, xOffset, yOffset, false, takeMoves, offsetIndex);
            }
        }
    };
    Dammen.prototype.addDamMoves = function (index, shiftMoves, takeMoves) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        for (var xOffset = -1; xOffset <= 1; xOffset += 2) {
            for (var yOffset = -1; yOffset <= 1; yOffset += 2) {
                var offsetIndex = this.addLegalShiftMoves(index, xOffset, yOffset, true, shiftMoves);
                this.addLegalTakeMoves(index, xOffset, yOffset, true, takeMoves, offsetIndex);
            }
        }
    };
    Dammen.prototype.addMovesForIndex = function (index, shiftMoves, takeMoves) {
        if (!this.indexInBounds(index)) {
            throw new RangeError("Index 'index' (".concat(index, ") out of bounds"));
        }
        var piece = this.board[index];
        if (piece.player !== this.turn)
            return;
        switch (piece.pieceType) {
            case PieceType.Dam:
                this.addDamMoves(index, shiftMoves, takeMoves);
                break;
            case PieceType.Normal:
                this.addNormalMoves(index, piece.player, shiftMoves, takeMoves);
                break;
        }
    };
    return Dammen;
}());
exports.Dammen = Dammen;

},{}],2:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./dammen"), exports);

},{"./dammen":1}],3:[function(require,module,exports){
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
    board = new dammen.Dammen();
    board.turn = player;
    createBoard(player);
    console.log(`Joined successfully as ${player}!`);
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

    console.log(board.boardArray[index].player, board.turn, turn);

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

},{"dammen":2}]},{},[3]);
