import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardLayout = [];
  let rowNum = 3;
  let colNum = 3;
  for (let i = 0; i < 3; i++) {
    boardLayout.push(
      <div className="board-row">
        {rowCreate(i * rowNum, i * rowNum + colNum, squares, handleClick)}{" "}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardLayout}
    </>
  );
}

// Make a row of squares, specifying start and end points (inclusive)
// (0,2) will give rows 0, 1, 2
function rowCreate(start, end, squares, handleClick) {
  const row = [];
  for (let i = start; i < end; i++) {
    row.push(
      <Square value={squares[i]} onSquareClick={() => handleClick(i)} />
    );
  }
  return row;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [moveOrder, setMoveOrder] = useState(true);
  let sortLabel;
  let sortButton;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let curMoves = history.map((squares, move) => {
    let description;
    if (currentMove === move) {
      return <li> You are at move #{move} </li>;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (moveOrder) {
    sortLabel = "Descending";
  } else {
    sortLabel = "Ascending";
    curMoves.reverse();
  }
  sortButton = <button onClick={() => sortOrder()}>{sortLabel}</button>;

  function sortOrder() {
    setMoveOrder(!moveOrder);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{sortButton}</ol>
        <ol>{curMoves}</ol>
      </div>
    </div>
  );
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
