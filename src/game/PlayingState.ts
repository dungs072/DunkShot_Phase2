import { Scene } from 'phaser'
import IState from '../types/state'
import GameController from './GameController'

class PlayingState implements IState {
    private game: GameController
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Playing state')
    }
    public update() {}
    public exit(): void {
        console.log('end Playing state')
    }
}
export default PlayingState
