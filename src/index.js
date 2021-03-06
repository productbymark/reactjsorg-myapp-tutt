import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function getWhosNext(b) {
  return b ? "X" : "O";
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

function fetchCoords(i) {
  const coords = [
    [1, 1], [2, 1], [3, 1],
    [1, 2], [2, 2], [3, 2],
    [1, 3], [2, 3], [3, 3],
  ];
  let col, row;
  
  [col, row] = coords[i];
  return `(${col}, ${row})`;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Row(props) {
  return (
    <div className="board-row">
      {props.elems}
    </div>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(e) {
    return <Row elems={e} />
  }

  render() {
    let counter = 0;
    let rows = [];

    for (let i=0; i<3; i++) {
      let cols = [];
      for (let y=0; y<3; y++) {
        cols = cols.concat([this.renderSquare(counter)]);
        counter++;
      }
      rows = rows.concat(this.renderRow(cols));
    }

    return (
      <div>{rows}</div>
      
    );
  }
}



class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
          boardPosition: null,
      }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = fetchCoords(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = getWhosNext(this.state.xIsNext);
    this.setState({
        history: history.concat([{
            squares: squares,
            positionChange: position,      
        }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const activeStep = this.state.stepNumber;

      const moves = history.map((step, move) => {
        const desc = move ? 
          `Go to move # ${move} at ${step.positionChange}` : 
          'Go to game start';

        return (
          <li key={move}>
            <button className={activeStep === move ? 'active-step' : ''}
              onClick={ () => this.jumpTo(move) }>
              {desc}
            </button>
          </li>
        );

      });
      
      let status;

      if (winner) {
        status = `Winner ${winner}`;
      } else {
        status = `Next player: ${getWhosNext(this.state.xIsNext)}`;
      }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
