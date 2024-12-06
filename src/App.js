import "./styles.css";
import { useState } from "react";
import Header from "./Header";
import { DataGrid } from "@mui/x-data-grid";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ isOneNext, squares, onPlay, setStatus, status, count }) {
  // Check if there is a winner by calling calculateWinner
  const winner = calculateWinner(squares);

  // Set the status message when some one wins, else display nothing
  if (winner && winner !== "?") {
    setStatus("Winner! Player:" + winner);
  } else if (count === 9) {
    setStatus("Draw!");
  } else {
    setStatus(null);
  }

  function handleClick(i) {
    if (winner === "A" || winner === "B") {
      return;
    }

    // Get a copy of the squares array
    const nextSquares = squares.slice();

    // Check if the square hasn't been update before updating
    if (nextSquares[i] === "") {
      // Check who's turn is it to update accordingly
      if (isOneNext) {
        nextSquares[i] = "A";
      } else {
        nextSquares[i] = "B";
      }
      // Call onPlay which is function from the app component to update board
      onPlay(nextSquares);
    }
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function App() {
  const [squaresHistory, setSquaresHistory] = useState([Array(9).fill("")]);
  // A var declaration doesn't work remember to search, why?
  const [currentMove, setCurrentMove] = useState(0);
  const isOneNext = currentMove % 2 === 0;
  // Getting the current move after making the square grind into an array "squaresHistory"
  const currentSquares = squaresHistory[currentMove];
  // Storing Status here instead to display message on top of Content
  const [currentStatus, setCurrentStatus] = useState(null);

  // Update the squares, and move counter
  function handlePlay(nextSquares) {
    const nextHistory = [
      ...squaresHistory.slice(0, currentMove + 1),
      nextSquares,
    ];

    setCurrentMove(nextHistory.length - 1);
    setSquaresHistory(nextHistory);
  }
  // Reset the board an counter
  function HandleReset() {
    // Encapsulating the squares into an array to keep the history integrety
    setSquaresHistory([Array(9).fill("")]);
    setCurrentMove(0);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const columnDefs = [
    { field: "history", headerName: "History", width: 80 },
    {
      field: "teleport",
      width: 70,
      headerName: "",
      renderCell: (params) => (
        <button onClick={() => jumpTo(params.row.id)}>teleport</button>
      ),
    },
  ];

  // Prepare rows for the DataGrid
  const rows = squaresHistory.map((_, index) => ({
    id: index,
    history: index > 0 ? `Move #${index}` : "Start!",
  }));

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="container-winner">
        <div id="WinnerText">{currentStatus}</div>
      </div>
      <div className="content-container">
        <div className="container-turn">
          <div id="PlayersTurn">Players Turn: </div>
          <div id="PlayersTurnLetter">{isOneNext ? "A" : "B"}</div>
        </div>

        <div className="number-match-board">
          <Board
            isOneNext={isOneNext}
            squares={currentSquares}
            onPlay={handlePlay}
            setStatus={setCurrentStatus}
            status={currentStatus}
            count={currentMove}
          />
          <div className="container-reset">
            <button onClick={HandleReset} className="button-reset">
              Reset
            </button>
          </div>
        </div>

        <div className="container">
          <div
            className="container-history"
            style={{ height: "300px", width: "175px" }}
          >
            <DataGrid
              rows={rows}
              columns={columnDefs}
              disableSelectionOnClick={true}
              disableColumnSorting={true}
              disableColumnMenu={true}
              hideFooter={true}
              sx={{
                borderRadius: 2,
                fontWeight: "regular",
                bgcolor: "#F1D9D9",
              }}
            />
          </div>
        </div>
      </div>
      <div className="myName">
        <h2>By: Jesus Aguilar-Andrade </h2>
      </div>
    </>
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

  // Loop through the lines and check if there's a winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // Return null if no winner is found
  return null;
}
