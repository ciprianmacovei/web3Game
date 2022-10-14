export default class StartGame {
    gameStart = false;
    gameOver = false;
    gameMap = null;
    players = []
    playerWon = null;

    constructor() {
        this.gameStart = true;
    }

    gameIsOverDraw = () => {
        this.gameStart = false;
        this.gameOver = true;
        this.playerWon = null;
    }

    gameIsOverPlayerNrWon = (nr) => {
        this.gameStart = false;
        this.gameOver = true;
        this.playerWon = nr;
    }

    setGameMap = (gameMap) => {
        this.gameMap = gameMap;
    }
}
