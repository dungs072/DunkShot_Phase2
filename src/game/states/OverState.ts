import GameController from '../GameController'
import IState from '../../types/state'

class OverState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Over State')
        this.game.getBall().toggleBall(false)
        this.game.getBasketManager().toggleInteractive(false)
        this.game.getOverUI().toggleUI(true)
        this.game
            .getOverUI()
            .setHighScoreText(this.game.getScoreCalculator().getHighScore())
        //this.overGameUI.setHighScoreText(game.getHighScore())
    }
    public update(delta: number): void {}
    public exit(): void {
        console.log('end Over State')
        this.game.getOverUI().toggleUI(false)
    }
}
export default OverState
