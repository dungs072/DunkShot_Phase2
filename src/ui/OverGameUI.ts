import { Scene } from 'phaser'
import Button from './base/Button'

class OverGameUI extends Phaser.GameObjects.Container {
    private playAgainButton: Button
    private bestScoreTitleText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.Text
    private minScalePlayAgainButton: number
    private maxScalePlayAgainButton: number
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.minScalePlayAgainButton = 0.15
        this.maxScalePlayAgainButton = 0.2
        this.initUI()
        this.setDepth(15)
        this.scene.add.existing(this)
        this.toggleUI(false)
    }
    private initUI(): void {
        this.highScoreText = new Phaser.GameObjects.Text(
            this.scene,
            innerWidth / 4,
            innerHeight / 7.5,
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
            innerWidth / 4,
            innerHeight / 15,
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
            innerWidth / 4,
            innerHeight / 1.2,
            'playagain',
            () => {
                this.handleHitPlayAgainButton()
            }
        ).setScale(this.maxScalePlayAgainButton)

        this.add(this.playAgainButton)
        this.add(this.highScoreText)
        this.add(this.bestScoreTitleText)
        this.playAgainButton.setScrollFactor(0, 0)
        this.setScrollFactor(0, 0)
    }
    private handleHitPlayAgainButton(): void {
        this.scene.tweens.add({
            targets: this.playAgainButton,
            scaleX: this.minScalePlayAgainButton,
            scaleY: this.minScalePlayAgainButton,
            duration: 50,
            ease: 'Sine.easeInOut',
            yoyo: true,
            onComplete: () => {
                this.playAgainButton.emit('playagain')
            },
        })
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
