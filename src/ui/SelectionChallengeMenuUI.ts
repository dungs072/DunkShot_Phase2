import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'

class SelectionChallengeMenuUI extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private timeButton: Button
    private scoreButton: Button
    private bounceButton: Button
    private noAimButton: Button

    constructor(scene: Scene) {
        super(scene, CONST.WIDTH_SIZE / 2, CONST.HEIGHT_SIZE / 2)

        this.initUI()
        this.scene.add.existing(this)
    }
    private initUI(): void {
        const title = new Phaser.GameObjects.Text(
            this.scene,
            0,
            -200,
            'Challenges',
            {
                fontFamily: 'Arial',
                color: '#FF911D',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        const backMenu = new Button(
            this.scene,
            0,
            200,
            'ballchallenge',
            () => {
                this.scene.scene.start('MainGameScene')
            },
            'Back game',
            400,
            100
        ).setScale(0.5)
        backMenu.setTextPosition(25, 0)

        this.background = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'challengePanel'
        ).setScale(1.5)

        this.timeButton = new Button(
            this.scene,
            150,
            -110,
            'buttonbg',
            () => {},
            'Time',
            400,
            100
        ).setScale(0.5)

        this.scoreButton = new Button(
            this.scene,
            150,
            -35,
            'buttonbg',
            () => {},
            'Score',
            400,
            100
        ).setScale(0.5)

        this.bounceButton = new Button(
            this.scene,
            150,
            40,
            'buttonbg',
            () => {},
            'Bounce',
            400,
            100
        ).setScale(0.5)
        this.noAimButton = new Button(
            this.scene,
            150,
            115,
            'buttonbg',
            () => {},
            'No aim',
            400,
            100
        ).setScale(0.5)

        this.add(this.background)
        this.add(this.timeButton)
        this.add(this.scoreButton)
        this.add(this.bounceButton)
        this.add(this.noAimButton)
        this.add(backMenu)
        this.add(title)
    }
}
export default SelectionChallengeMenuUI
