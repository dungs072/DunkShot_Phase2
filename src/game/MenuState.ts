import { Scene } from 'phaser'
import MainMenuUI from '../ui/MainMenuUI'
import GameController from './GameController'

class MenuState implements IState {
    private menu: MainMenuUI
    private scene: Scene
    constructor(scene: Scene) {
        this.scene = scene
    }
    public enter(game: GameController): void {
        console.log('start Menu State')
        this.menu = new MainMenuUI(this.scene, 0, 0)
        //this.menu.setFingerPosition(this.x, this.y)
        //this.menu.setFingerPosition(this.ball.x - 100, this.ball.y + 200)
    }
    public update(game: GameController): void {}
    public exit(game: GameController): void {
        console.log('end Menu State')
    }
}
export default MenuState
