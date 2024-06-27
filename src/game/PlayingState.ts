import { Scene } from 'phaser'
import IState from '../types/state'
import GameController from './GameController'

class PlayingState implements IState {
    private scene: Scene
    constructor(scene: Scene) {
        this.scene = scene
    }
    public enter(game: GameController): void {
        console.log('start Playing state')
    }
    public update(game: GameController): void {}
    public exit(game: GameController): void {
        console.log('end Playing state')
    }
}
export default PlayingState
