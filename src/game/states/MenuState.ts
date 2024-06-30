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
    }
    public update(delta: number): void {
        this.game.getBall().update(delta)
        this.game.getBasketManager().update(delta)
    }
    public exit(): void {
        this.game.getMenuUI().toggleMenu(false)
        console.log('end Menu State')
    }
}
export default MenuState