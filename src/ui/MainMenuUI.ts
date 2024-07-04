import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'
import UIScene from '../scenes/UIScene'

class MainMenuUI extends Phaser.GameObjects.Container {
    private titleGame: Phaser.GameObjects.Image
    private challengesButton: Button
    private dragIt: Phaser.GameObjects.Image

    private isButtonsClick: boolean

    private stateMenu: boolean
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.initUI()
        this.setDepth(20)
        this.scene.add.existing(this)
        this.stateMenu = true
        this.scene.tweens.add({
            targets: this.dragIt,
            alpha: { from: 1, to: 0.5 },
            ease: 'Sine.InOut',
            duration: 500,
            repeat: -1,
            yoyo: true,
        })
    }
    private initUI(): void {
        this.titleGame = new Phaser.GameObjects.Image(
            this.scene,
            CONST.WIDTH_SIZE * 0.53,
            CONST.HEIGHT_SIZE / 3,
            'dunkshot'
        ).setScale(0.3)

        this.challengesButton = new Button(
            this.scene,
            CONST.WIDTH_SIZE * 0.8,
            CONST.HEIGHT_SIZE * 0.8,
            'challenge',
            () => {
                this.handleChallengeButtonClick()
                this.challengesButton.emit('challenge')
            },
            '',
            500,
            200
        ).setScale(0.2)

        this.challengesButton.on('pointerout', () => {
            this.handleButtonsOut()
        })
        this.challengesButton.on('pointerover', () => {
            this.handleButtonIn()
        })

        this.dragIt = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'finger'
        ).setScale(0.3)
        this.dragIt.rotation = 20 * (Math.PI / 180)
        this.add(this.titleGame)
        this.add(this.dragIt)
        this.add(this.challengesButton)
    }

    public setFingerPosition(x: number, y: number): void {
        this.dragIt.setPosition(
            x - CONST.WIDTH_SIZE / 14,
            y + CONST.HEIGHT_SIZE / 12
        )
    }
    public toggleMenu(state: boolean): void {
        this.stateMenu = state
        if (!state) {
            // Fade out
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0 },
                duration: 500,
                ease: 'Linear',
            })
        } else {
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 0, to: 1 },
                duration: 500,
                ease: 'Linear',
            })
        }
    }
    public getStateMenu(): boolean {
        return this.stateMenu
    }
    public getIsButtonClick(): boolean {
        return this.isButtonsClick
    }
    private handleChallengeButtonClick(): void {
        this.isButtonsClick = true
        const uiScene = this.scene.scene.get('UIScene') as UIScene
        uiScene.getMenuUI().toggleMenu(false)
        this.scene.scene.launch('ChallengeSelectionScene')
    }
    private handleButtonsOut(): void {
        this.isButtonsClick = false
    }
    private handleButtonIn(): void {
        this.isButtonsClick = true
    }
    public addHitChallengeButton(callBack: Function): void {
        this.challengesButton.on('challenge', callBack)
    }
}
export default MainMenuUI
