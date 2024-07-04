import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'

class PauseUI extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private backMenuButton: Button
    private restartButton: Button
    private resumeButton: Button
    // private noAimButton: Button

    constructor(scene: Scene) {
        super(scene, CONST.WIDTH_SIZE / 2, CONST.HEIGHT_SIZE / 2)

        this.initUI()
        this.setDepth(17)
        this.scene.add.existing(this)
        this.scale = 0
        this.alpha = 0
    }
    private initUI(): void {
        const title = new Phaser.GameObjects.Text(
            this.scene,
            0,
            -CONST.HEIGHT_SIZE * 0.2,
            'PAUSED',
            {
                fontFamily: 'Arial',
                color: '#85837F',
                fontSize: 50,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)

        this.background = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'pausePanel'
        ).setScale(0.7)

        this.resumeButton = new Button(
            this.scene,
            CONST.WIDTH_SIZE * 0.4,
            -CONST.HEIGHT_SIZE * 0.25,
            'closeButton',
            () => {
                this.resumeButton.emit('resume')
            },
            '',
            400,
            100
        ).setScale(1)
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontSize: 30,
            fontStyle: 'bold',
        }
        this.backMenuButton = new Button(
            this.scene,
            0,
            100,
            'greyButton',
            () => {
                this.backMenuButton.emit('backmenu')
            },
            'GIVE UP',
            400,
            100,
            textStyle
        ).setScale(1)

        this.restartButton = new Button(
            this.scene,
            0,
            -50,
            'blueButton',
            () => {
                this.restartButton.emit('restartGame')
            },
            'RESTART',
            500,
            200,
            textStyle
        ).setScale(1)

        this.add(this.background)
        this.add(this.resumeButton)
        this.add(this.backMenuButton)
        this.add(this.restartButton)

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
    public addRestartListener(callBack: Function): void {
        this.restartButton.on('restartGame', callBack)
    }
}
export default PauseUI
