import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'

class PauseUI extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private backMenuButton: Button
    private challengesButton: Button
    private resumeButton: Button
    // private noAimButton: Button

    constructor(scene: Scene) {
        super(scene, CONST.WIDTH_SIZE / 2, CONST.HEIGHT_SIZE / 2)

        this.initUI()
        this.setDepth(17)
        this.scene.add.existing(this)
        this.scale = 0
        this.alpha = 0
        this.setScrollFactor(0, 0)
    }
    private initUI(): void {
        const title = new Phaser.GameObjects.Text(
            this.scene,
            0,
            -200,
            'Pause Game',
            {
                fontFamily: 'Arial',
                color: '#FF911D',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)

        this.background = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'challengePanel'
        ).setScale(1.5)

        this.resumeButton = new Button(
            this.scene,
            150,
            -100,
            'buttonbg',
            () => {
                this.resumeButton.emit('resume')
            },
            'Resume',
            400,
            100
        ).setScale(0.5)

        this.backMenuButton = new Button(
            this.scene,
            150,
            100,
            'buttonbg',
            () => {
                this.backMenuButton.emit('backmenu')
            },
            'Back menu',
            400,
            100
        ).setScale(0.5)

        this.challengesButton = new Button(
            this.scene,
            150,
            0,
            'challenge',
            () => {
                this.handleChallengeButtonClick()
                this.challengesButton.emit('challenge')
            },
            '',
            500,
            200
        ).setScale(0.3)

        this.add(this.background)
        this.add(this.resumeButton)
        this.add(this.backMenuButton)
        this.add(this.challengesButton)

        // this.backMenuButton.setScrollFactor(0, 0)
        // this.resumeButton.setScrollFactor(0, 0)
        this.add(title)
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
    public addResumeListenerListener(callBack: Function): void {
        this.resumeButton.on('resume', callBack)
    }
    public addBackMenuListener(callBack: Function): void {
        this.backMenuButton.on('backmenu', callBack)
    }
    private handleChallengeButtonClick(): void {
        this.scene.scene.start('ChallengeSelectionScene')
    }
}
export default PauseUI
