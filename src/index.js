import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className={`square ${props.winning ? ' winning' : ''}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winning={this.props.winningSquares.indexOf(i) !== -1}
        />;
    }

    render() {
        const boardSize = 3;

        return (
            <div>
                {Array(boardSize).fill(null).map((val, i) => (
                    <div className="board-row" key={i}>
                        {Array(boardSize).fill(null).map((val, j) => this.renderSquare(i * boardSize + j))}
                    </div>
                ))}

            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            ascOrder: true
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggleSorting() {
        this.setState({
            ascOrder: !this.state.ascOrder
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    render() {
        const boardSize = 3;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            if (!this.state.ascOrder) {
                move = history.length - 1 - move;
            }

            let desc = move ? 'Move #' + move : 'Game start';
            const className = (this.state.stepNumber === move) ? 'current' : null;

            if (move !== 0) {
                history[move].squares.forEach((current, ind) => {
                    if (current !== history[move - 1].squares[ind]) {
                        const row = Math.floor(ind / boardSize);
                        const x = row + 1;
                        const y = ind - row * boardSize + 1;
                        desc += ' [Player: ' + current + ', Coord: (' + x + ',' + y + ')]';
                    }
                });
            }

            return (
                <li key={move} className={className}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner.name;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? "X" : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={(winner) ? winner.squares : []}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div
                        className={`arrow ${this.state.ascOrder ? 'arrow-up' : 'arrow-down'}`}
                         onClick={() => this.toggleSorting()}
                    />
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let winner;
    let winningSquares = [];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner = squares[a];
            winningSquares = lines[i];
            break;
        }
    }

    if (squares.filter((value) => {
            return !value;
        }).length === 0) {
        winner = 'C';
    }

    return (winner)
        ? {
            name: winner,
            squares: winningSquares
        }
        : null;
}


// ========================================

ReactDOM.render(
    <Game />
    ,
    document.getElementById('root')
);
