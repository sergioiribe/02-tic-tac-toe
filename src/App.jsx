import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import { Square } from './components/Square.jsx'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { TURNS } from './constants.js'
import { WinnerModal } from './components/WinnerModal.jsx'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? turnFromStorage : TURNS.X
  })
  //null es que no hay ganador, false que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // no actualizamos esta posicion
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    //revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
      window.localStorage.removeItem('board')
      window.localStorage.removeItem('turn')
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1>Juego 3 en linea</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  )
}

export default App
