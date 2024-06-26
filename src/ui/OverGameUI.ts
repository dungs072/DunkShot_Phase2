import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'

class OverGameUI extends Phaser.GameObjects.Container {
    private playAgainButton: Button
    private bestScoreTitleText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.Text

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)

        this.initUI()
        this.setDepth(15)
        this.scene.add.existing(this)
        this.toggleUI(false)
    }
    private initUI(): void {
        this.highScoreText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 7.5,
            '999',
            {
                fontFamily: 'Arial',
                color: '#FF9300',
                fontSize: 50,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)

        this.bestScoreTitleText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 15,
            'BEST SCORE',
            {
                fontFamily: 'Arial',
                color: '#FF9300',
                fontSize: 30,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)

        this.playAgainButton = new Button(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 1.2,
            'playagain',
            () => {
                this.playAgainButton.emit('playagain')
            },
            '',
            400,
            400
        ).setScale(0.35)

        this.add(this.playAgainButton)
        this.add(this.highScoreText)
        this.add(this.bestScoreTitleText)
        this.setScrollFactor(0, 0)
    }
    public toggleUI(state: boolean): void {
        this.setVisible(state)
        this.setActive(state)
    }
    public addHitPlayAgainListener(callBack: Function): void {
        this.playAgainButton.on('playagain', callBack)
    }
    public setHighScoreText(amount: number) {
        this.highScoreText.text = amount.toString()
    }
}
export default OverGameUI
