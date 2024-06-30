import IState from '../../types/state'
import GameController from '../GameController'

class ResumeState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Resume state')
        this.game.getGameUI().setVisible(true)
        this.game.getBasketManager().toggleInteractive(true)
        this.game
            .getBall()
            .setPosition(this.game.getBall().x, this.game.getBall().y - 50)
        this.game.getBall().resetBall()

        this.exit()
    }

    public update(delta: number) {}
    public exit(): void {
        console.log('end Resume state')
        this.game
            .getGameMachine()
            .transitionTo(this.game.getGameMachine().getPlayingState())
    }
}
export default ResumeState
