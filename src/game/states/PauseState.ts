import GameController from '../GameController'
import IState from '../../types/state'

class PauseState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Pause State')
        this.game.getPauseUI().toggleUI(true)
        this.game.getBall().pauseBall(true)
        this.game.getBasketManager().toggleInteractive(false)
    }
    public update(delta: number): void {}
    public exit(): void {
        console.log('end Pause State')
        this.game.getPauseUI().toggleUI(false)
        this.game.getBall().pauseBall(false)
        this.game.getBasketManager().toggleInteractive(true)
    }
}
export default PauseState
