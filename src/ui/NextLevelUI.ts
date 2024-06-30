import { Scene } from 'phaser'
import CONST from '../Const'
import Button from './base/Button'

class NextLevelUI extends Phaser.GameObjects.Container {
    private dataText: Phaser.GameObjects.Text
    private background: Phaser.GameObjects.Image
    private nextButton: Button
    private backMainMenuButton: Button
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.setDepth(1)
        this.initUI()
        this.initButtons()
        this.scene.add.existing(this)
        this.setScoreText(0)
        this.setDepth(15)
        this.toggleUI(false, true)
    }
    private initUI(): void {
        this.background = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'challengePanel'
        ).setScale(1.2, 1.8)
        this.dataText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 4,
            '999',
            {
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.dataText)
        this.add(this.background)
    }
    private initButtons(): void {
        this.nextButton = new Button(
            this.scene,
            150,
            140,
            'buttonbg',
            () => {
                this.nextButton.emit('nextbutton')
            },
            'Next Level',
            400,
            100,
            {
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontSize: 50,
                fontStyle: 'bold',
            }
        ).setScale(0.5)
        this.add(this.nextButton)
        this.nextButton.setScrollFactor(0, 0)
        this.backMainMenuButton = new Button(
            this.scene,
            -150,
            140,
            'buttonbg',
            () => {},
            'Main Menu',
            400,
            100,
            {
                fontFamily: 'Arial',
                color: '#FFFFFF',
                fontSize: 50,
                fontStyle: 'bold',
            }
        ).setScale(0.5)
        this.backMainMenuButton.setScrollFactor(0, 0)
        this.add(this.backMainMenuButton)
    }
    public setScoreText(amount: number) {
        this.dataText.text = amount.toString()
    }
    public toggleUI(state: boolean, immediate = false): void {
        if (state) {
            this.setVisible(state)
            this.setActive(state)
            this.scene.tweens.add({
                targets: this,
                alpha: 1,
                scale: 1,
                duration: 500,
                ease: 'Power2',
            })
        } else {
            if (immediate) {
                this.setVisible(state)
            }
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.setVisible(state)
                    this.setActive(state)
                },
            })
        }
    }
    public addNextLevelListener(callBack: Function): void {
        this.nextButton.on('nextbutton', callBack)
    }
}
export default NextLevelUI
