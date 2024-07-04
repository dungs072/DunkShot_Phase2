import { Scene } from 'phaser'
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
            145,
            0,
            'Finish Level',
            {
                fontFamily: 'Arial',
                color: '#FF9420',
                fontSize: 25,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.add(this.background)
        this.add(this.dataText)
    }
    private initButtons(): void {
        this.nextButton = new Button(
            this.scene,
            130,
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
        this.backMainMenuButton = new Button(
            this.scene,
            -130,
            140,
            'buttonbg',
            () => {
                this.backMainMenuButton.emit('backmenubutton')
            },
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
    public addBackMenuListener(callBack: Function): void {
        this.backMainMenuButton.on('backmenubutton', callBack)
    }
}
export default NextLevelUI
