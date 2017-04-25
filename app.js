const prompt = require('prompt')
const X='X', O='O'

class Board {
  constructor(game) {
    this.game = game;
    this.cells = {}
    const rows = ['T','M','B']
    const cols = ['L','M','R']
    rows.forEach(row=>{
      cols.forEach(col=>{
        this.cells[row+col] = ' '
      })
    })
  }
  placePiece(cell) {
    if (!this.cells[cell]) {
      console.error('invalid cell')
    }
    else if (this.cells[cell] !== ' ') {
      console.error('cell taken')
    }
    else {
      this.cells[cell] = this.game.turn
      this.render()
    }
  }
  render() {
    process.stdout.write('\x1B[2J\x1B[0f')
    const { TL, TM, TR, ML, MM, MR, BL, BM, BR } = this.cells
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
    this.board = new Board(this)
    this.turn = X
  }
  promptMove() {
    prompt.message=`${game.turn}'s turn\n`
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
        this.board.placePiece(cell)
        this.turn = this.turn === X ? O : X
        this.winCheck()
          ? this.endGame()
          : this.promptMove()
      }
    })
  }
  winCheck() {
    let winner = null
    const runs = [
      ['TR','TM','TL'],
      ['MR','MM','MR'],
      ['BR','BM','BR'],
      ['TR','MR','BR'],
      ['TM','MM','BM'],
      ['TL','ML','BL'],
      ['TL','MM','BR'],
      ['TR','MM','BL']      
    ]
    runs.forEach(run=>{
      if (run[0]===run[1] && run[1]===run[2])
        winner = run[0]
    })
    console.log('winner:',winner)
    return winner
  }
  quit(player) {
    console.log(`${player} has quit the game`)
    return
  }
}

const game = new Game()
game.board.render()
prompt.start()
game.promptMove()