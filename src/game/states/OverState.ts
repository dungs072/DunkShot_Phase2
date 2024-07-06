import GameController from '../GameController'
import IState from '../../types/state'
import ScoreScene from '../../scenes/ScoreScene'

class OverState implements IState {
    private game: GameController
    private scoreScene: ScoreScene
    constructor(game: GameController) {
        this.game = game
    }
    public enter(): void {
        console.log('start Over State')
        this.game.getBall().toggleBall(false)
        this.game.getOverUI().toggleUI(true)
        this.game.getGameUI().toggleUI(true)
        this.game.currentTime = 0
        this.game.countHoop = 0
        this.scoreScene = this.game
            .getScene()
            .scene.get('ScoreScene') as ScoreScene
        this.game
            .getOverUI()
            .setHighScoreText(this.game.getScoreCalculator().getHighScore())
    }
    public update(delta: number): void {
        this.scoreScene.setScoreText(
            this.game.getScoreCalculator().getCurrentScore().toString()
        )
    }
    public exit(): void {
        console.log('end Over State')
        this.game.getOverUI().toggleUI(false)
        this.game.getGameUI().toggleUI(false)
    }
}
export default OverState
