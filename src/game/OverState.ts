import { Scene } from 'phaser'
import OverGameUI from '../ui/OverGameUI'
import GameController from './GameController'
import IState from '../types/state'

class OverState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Over State')
        //this.overGameUI.setHighScoreText(game.getHighScore())
    }
    public update(): void {}
    public exit(): void {
        console.log('end Over State')
    }
}
export default OverState
