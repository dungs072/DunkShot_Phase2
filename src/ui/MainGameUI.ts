import { Scene } from 'phaser'
import CONST from '../Const'
import Button from './base/Button'

class MainGameUI extends Phaser.GameObjects.Container {
    private dataGameText: Phaser.GameObjects.Text

    private conditionalText: Phaser.GameObjects.Text
    private challengeLevelText: Phaser.GameObjects.Text
    private numberHoopsText: Phaser.GameObjects.Text
    private topPanel: Phaser.GameObjects.Image
    private pauseButton: Button
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.setDepth(1)
        this.initUI()
        this.initButtons()

        this.scene.add.existing(this)
        this.setDataText('0')
    }
    private initUI(): void {
        this.dataGameText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 2.5,
            '999',
            {
                fontFamily: 'Arial',
                color: '#BBB6B5',
                fontSize: 100,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.dataGameText)

        this.topPanel = new Phaser.GameObjects.Image(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            35,
            'bluePanel'
        ).setOrigin(0.5)
        this.topPanel.setScale(1.4, 0.5)
        this.setScrollFactor(0, 0)
        this.add(this.topPanel)

        this.conditionalText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            35,
            'Condition',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 40,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.conditionalText)

        this.challengeLevelText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 4.5,
            35,
            'CHALLENGE 1',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 20,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.challengeLevelText)

        this.numberHoopsText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 1.2,
            35,
            '0/5 HOOPS',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 20,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.numberHoopsText)
    }
    private initButtons(): void {
        this.pauseButton = new Button(
            this.scene,
            50,
            35,
            'pauseButton',
            () => {
                this.pauseButton.emit('pause')
            },
            '',
            100,
            100
        )
        this.add(this.pauseButton)
    }
    public setDataText(text: string) {
        this.dataGameText.text = text
    }
    public setConditionText(text: string) {
        this.conditionalText.text = text
    }
    public setChallengeText(text: string) {
        this.challengeLevelText.text = text
    }
    public setMaxHoopsText(text: string) {
        this.numberHoopsText.text = text
    }
    public addHitPauseListener(callBack: Function): void {
        this.pauseButton.on('pause', callBack)
    }
    public toggleChallengePanel(state: boolean): void {
        this.conditionalText.setVisible(state)
        this.topPanel.setVisible(state)
        this.numberHoopsText.setVisible(state)
        this.challengeLevelText.setVisible(state)
        if (state) {
            this.pauseButton.getBackground().setTint(0xffffff)
        } else {
            this.pauseButton.getBackground().setTint(0x7c7c7c)
        }
    }
    public toggleUI(state: boolean): void {
        this.setVisible(state)
    }
}
export default MainGameUI
