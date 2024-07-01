import { Scene } from 'phaser'
import CONST from '../Const'
import Button from './base/Button'

class MainGameUI extends Phaser.GameObjects.Container {
    private dataGameText: Phaser.GameObjects.Text
    private pauseButton: Button
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.setDepth(1)
        this.initUI()
        this.initButtons()

        this.scene.add.existing(this)
        this.setDataText(0)
    }
    private initUI(): void {
        this.dataGameText = new Phaser.GameObjects.Text(
            this.scene,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 4,
            '999',
            {
                fontFamily: 'Arial',
                color: '#BBB6B5',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.dataGameText)
    }
    private initButtons(): void {
        this.pauseButton = new Button(
            this.scene,
            50,
            50,
            'setting',
            () => {
                this.pauseButton.emit('pause')
            },
            '',
            100,
            100
        )
        this.add(this.pauseButton)
    }
    public setDataText(amount: number) {
        this.dataGameText.text = amount.toString()
    }
    public addHitPauseListener(callBack: Function): void {
        this.pauseButton.on('pause', callBack)
    }
}
export default MainGameUI
