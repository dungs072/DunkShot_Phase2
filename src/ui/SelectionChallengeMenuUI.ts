import { Scene } from 'phaser'
import Button from './base/Button'
import CONST from '../Const'
import ChallengeType from '../types/level/challenge'

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
        this.scale = 0
        this.alpha = 0
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
                const data = { challengeType: ChallengeType.NONE }
                this.scene.scene.start('MainGameScene', data)
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
            () => {
                const data = { challengeType: ChallengeType.TIME }
                this.scene.scene.start('MainGameScene', data)
            },
            'Time',
            400,
            100
        ).setScale(0.5)

        this.scoreButton = new Button(
            this.scene,
            150,
            -35,
            'buttonbg',
            () => {
                const data = { challengeType: ChallengeType.SCORE }
                this.scene.scene.start('MainGameScene', data)
            },
            'Score',
            400,
            100
        ).setScale(0.5)

        this.bounceButton = new Button(
            this.scene,
            150,
            40,
            'buttonbg',
            () => {
                const data = { challengeType: ChallengeType.BOUNCE }
                this.scene.scene.start('MainGameScene', data)
            },
            'Bounce',
            400,
            100
        ).setScale(0.5)
        this.noAimButton = new Button(
            this.scene,
            150,
            115,
            'buttonbg',
            () => {
                const data = { challengeType: ChallengeType.NO_AIM }
                this.scene.scene.start('MainGameScene', data)
            },
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
}
export default SelectionChallengeMenuUI
