import { Scene } from 'phaser'
import CONST from '../const/const'
import Button from './base/Button'

class MainGameUI extends Phaser.GameObjects.Container {
    //private dataGameText: Phaser.GameObjects.Text

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
        //this.setDataText('0')
    }
    private initUI(): void {
        // this.dataGameText = new Phaser.GameObjects.Text(
        //     this.scene,
        //     CONST.WIDTH_SIZE * 0.5,
        //     CONST.HEIGHT_SIZE * 0.4,
        //     '999',
        //     {
        //         fontFamily: 'Arial',
        //         color: '#BBB6B5',
        //         fontSize: 100,
        //         fontStyle: 'bold',
        //     }
        // ).setOrigin(0.5)
        // this.add(this.dataGameText)

        this.topPanel = new Phaser.GameObjects.Image(
            this.scene,
            CONST.WIDTH_SIZE * 0.2,
            CONST.HEIGHT_SIZE * 0.02,
            'bluePanel'
        ).setOrigin(0.5)
        this.topPanel.setScale(1.4, 0.5)
        this.add(this.topPanel)

        this.conditionalText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE * 0.5,
            CONST.HEIGHT_SIZE * 0.03,
            'Condition',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 30,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.add(this.conditionalText)

        this.challengeLevelText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE * 0.25,
            CONST.HEIGHT_SIZE * 0.03,
            'CHALLENGE 1',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 15,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.add(this.challengeLevelText)

        this.numberHoopsText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE * 0.85,
            CONST.HEIGHT_SIZE * 0.03,
            '0/5 HOOPS',
            {
                fontFamily: 'Arial',
                color: '#ffffff',
                fontSize: 15,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.add(this.numberHoopsText)
    }
    private initButtons(): void {
        this.pauseButton = new Button(
            this.scene,
            CONST.WIDTH_SIZE * 0.05,
            CONST.HEIGHT_SIZE * 0.03,
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
    // public setDataText(text: string) {
    //     this.dataGameText.text = text
    // }
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
