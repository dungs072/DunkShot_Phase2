import GameController from '../GameController'
import IState from '../../types/state'
import ScoreScene from '../../scenes/ScoreScene'

class OverState implements IState {
    private game: GameController
    private scoreScene: ScoreScene
    constructor(game: GameController) {
        this.game = game
        this.scoreScene = this.game
            .getScene()
            .scene.get('ScoreScene') as ScoreScene
    }
    public enter(): void {
        console.log('start Over State')
        this.game.getBall().toggleBall(false)
        this.game.getBasketManager().toggleInteractive(false)
        this.game.getOverUI().toggleUI(true)
        this.game.getGameUI().toggleUI(true)
        this.game.currentTime = 0
        this.game.countHoop = 0
        this.game
            .getOverUI()
            .setHighScoreText(this.game.getScoreCalculator().getHighScore())
        this.game.getScene().scene.launch('ScoreScene')
    }
    public update(delta: number): void {
        this.scoreScene.setScoreText(
            this.game.getScoreCalculator().getCurrentScore().toString()
        )
    }
    public exit(): void {
        console.log('end Over State')
        if (
            this.game.getScene().scene.isActive('ScoreScene') ||
            !this.game.getScene().scene.isSleeping('ScoreScene')
        ) {
            this.game.getScene().scene.sleep('ScoreScene')
        }
        this.game.getOverUI().toggleUI(false)
        this.game.getGameUI().toggleUI(false)
    }
}
export default OverState
