const prompt = require('prompt')
const X='X', O='O'

class Board {
  constructor(game) {
    const rows = ['T','M','B']
    const cols = ['L','M','R']
    rows.forEach(row=>{
      cols.forEach(col=>{
        this[row+col] = ' '
      })
    })
  }
  render() {
    process.stdout.write('\x1B[2J\x1B[0f')
    const { TL, TM, TR, ML, MM, MR, BL, BM, BR } = this
    console.log(
      `input move in the following format:\n`+
      `first letter of row + \n`+
      `first letter of column\n`+
      `i.e. TL: Top Left, BM: Bottom Middle\n\n`+
      ` ${TL} | ${TM} | ${TR} \n`+
      `-----------\n`+
      ` ${ML} | ${MM} | ${MR} \n`+
      `-----------\n`+
      ` ${BL} | ${BM} | ${BR} \n`
    )
  }
}

class Game {
  constructor() {
    prompt.start()
    this.board = new Board()
    this.turn = X
    this.board.render()
    this.promptMove()
  }
  promptMove() {
    prompt.message=`${this.turn}'s turn\n`
    prompt.get({
      properties: {
        cell: {
          description:'Place Piece'
        }
      }
    },(err, result)=>{
      let cell = result.cell.toUpperCase()
      if (cell === 'QUIT') this.quit(this.turn)
      else {
        if (this.placePiece(cell)) {
          if (this.winCheck()) this.endGame()
          else {
            this.turn = this.turn === X ? O : X
            this.promptMove()
          }
        }
      }
    })
  }
  placePiece(cell) {
    if (!this.board[cell]) {
      console.error('invalid cell!')
      this.promptMove()
      return false
    }
    else if (this.board[cell] !== ' ') {
      console.error('cell taken!')
      this.promptMove()
      return false
    }
    else {
      this.board[cell] = this.turn
      this.board.render()
      return true;
    }
  }
  winCheck() {
    let winner = null
    const runs = [
      ['TL','TM','TR'],
      ['ML','MM','MR'],
      ['BL','BM','BR'],
      ['TL','ML','BL'],
      ['TM','MM','BM'],
      ['TR','MR','BR'],
      ['TL','MM','BR'],
      ['TR','MM','BL']      
    ]
    return runs.some(run=>{
      return run.every(cell=>{
        return this.board[cell] === this.turn
      })
    })
  }
  endGame() {
    console.log(`${this.turn} wins!`)
    prompt.message='Play again?'
    prompt.get({
      properties: {
        again: {
          description:'Y or N'
        }
      }
    },(err, result)=>{
      if (result.again.toUpperCase() === 'Y'){
        this.board = new Board()
        this.board.render()
        this.promptMove()
      } else {
        return
      }
      
    })
  }
  quit(player) {
    console.log(`${player} has quit the game`)
    return
  }
}

const game = new Game()
