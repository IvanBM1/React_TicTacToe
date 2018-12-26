import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className={"square "+ (props.mark? 'mark' : '')} onClick={props.onClick}>
            {props.value}
        </button> 
    )
}

class Board extends React.Component {

    renderSquare(i, mark) {
        return (
            <Square 
                key={i}
                mark={mark}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)} />
        )
    }

    render() {

        let num = 0 
        let board = []
        let row = []

        for(let i=0; i<3; i++) {
            for(let j=1; j<=3; j++) {
                let toMark = (!!this.props.winnerPlay)? this.props.winnerPlay.indexOf(num) >= 0 : false
                row.push(this.renderSquare(num, toMark))
                num++
            }
            board.push(<div key={i} className="board-row">{row}</div>)
            row = []
        }

        return board
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                x: 0,
                y: 0
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }

    calculateWinner(squares) {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]
    
        for(let i=0; i<lines.length; i++) {
            const [a,b,c] = lines[i]
            if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c])
                return {winner: squares[a], play: lines[i]}
        }
    
        return {winner: null, play: null}
    }

    jumpTo(step) {

        if(step === this.state.history.length || step < 0) return
        
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0
        })
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if(this.calculateWinner(squares).winner || squares[i]) return

        squares[i] = (this.state.xIsNext ? 'X' : 'O')
        this.setState({
            history: history.concat([{
                squares: squares,
                x: parseInt(i/3) +1,
                y: i%3 +1
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    isFinish(board) {
        let count = 0
        board.forEach(item => {
            if(item != null) count++
        })

        return count == 9
    }

    render() {

        const history = this.state.history
        const current = history[this.state.stepNumber]
        const {winner, play} = this.calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            let desc = move ? `Go to move #${move} in (${step.x} , ${step.y})`: 'Go to game start'
            if(this.state.stepNumber === move) desc = <b>{desc}</b>
            return (
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status
        if(winner) status = `Winner ${winner}`
        else status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`

        if(this.isFinish(current.squares)) status = 'Nobody has won the game.'

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winnerPlay={play}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.jumpTo(this.state.stepNumber-1) }>previous</button>
                        <button onClick={() => this.jumpTo(this.state.stepNumber+1)}>next</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)