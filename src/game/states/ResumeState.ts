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
            .getGameMachine()
            .transitionTo(this.game.getGameMachine().getPlayingState())
    }

    public update(delta: number) {}
    public exit(): void {
        console.log('end Resume state')
    }
}
export default ResumeState
