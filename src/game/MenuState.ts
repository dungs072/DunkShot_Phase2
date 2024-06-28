import GameController from './GameController'
import IState from '../types/state'

class MenuState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Menu State')
        //this.menu.setFingerPosition(this.x, this.y)
        //this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)
    }
    public update(): void {}
    public exit(): void {
        console.log('end Menu State')
    }
}
export default MenuState
