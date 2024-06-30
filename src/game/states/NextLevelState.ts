import IState from '../../types/state'
import NextLevelUI from '../../ui/NextLevelUI'
import GameController from '../GameController'

class NextLevelState implements IState {
    private game: GameController
    private nextLevelUI: NextLevelUI
    constructor(game: GameController) {
        this.game = game
        this.nextLevelUI = game.getNextLevelUI()
    }
    public enter(): void {
        console.log('Next level state')

        this.nextLevelUI.toggleUI(true)
    }
    public update(delta: number): void {}
    public exit(): void {
        this.nextLevelUI.toggleUI(false)
    }
}
export default NextLevelState
