import GameController from '../GameController'
import IState from '../../types/state'

class MenuState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Menu State')
        this.game.getMenuUI().toggleMenu(true)
        this.game
            .getMenuUI()
            .setFingerPosition(
                this.game.getBall().x - 100,
                this.game.getBall().y + 200
            )
    }
    public update(delta: number): void {
        this.game.getBall().update()
        this.game.getBasketManager().update(delta)
    }
    public exit(): void {
        this.game.getMenuUI().toggleMenu(false)
        console.log('end Menu State')
    }
}
export default MenuState
