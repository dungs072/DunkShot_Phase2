import { Scene } from 'phaser'
import CONST from '../Const'

class MainGameUI extends Phaser.GameObjects.Container {
    private dataGameText: Phaser.GameObjects.Text

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.setDepth(1)
        this.initUI()

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
    public setDataText(amount: number) {
        this.dataGameText.text = amount.toString()
    }
}
export default MainGameUI
