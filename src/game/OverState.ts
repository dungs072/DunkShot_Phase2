import { Scene } from 'phaser'
import OverGameUI from '../ui/OverGameUI'
import GameController from './GameController'
import IState from '../types/state'

class OverState implements IState {
    private overGameUI: OverGameUI
    private scene: Scene
    constructor(scene: Scene, game: GameController) {
        this.scene = scene
        this.overGameUI = new OverGameUI(this.scene, 0, 0)
        this.overGameUI.addHitPlayAgainListener(() => {
            this.overGameUI.toggleUI(false)
            //game.restartGame()
        })
    }
    public enter(game: GameController): void {
        console.log('start Over State')
        this.overGameUI.toggleUI(true)
        //this.overGameUI.setHighScoreText(game.getHighScore())
    }
    public update(game: GameController): void {}
    public exit(game: GameController): void {
        console.log('end Over State')
    }
}
export default OverState
