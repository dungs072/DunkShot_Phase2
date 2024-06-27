import { Scene } from 'phaser'

class MainGameUI extends Phaser.GameObjects.Container {
    private scoreText: Phaser.GameObjects.Text
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.setDepth(1)
        this.initUI()

        this.scene.add.existing(this)
        this.setScoreText(0)
    }
    private initUI(): void {
        this.scoreText = new Phaser.GameObjects.Text(
            this.scene,
            innerWidth / 4,
            innerHeight / 4,
            '999',
            {
                fontFamily: 'Arial',
                color: '#BBB6B5',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.scoreText)
    }
    public setScoreText(amount: number) {
        this.scoreText.text = amount.toString()
    }
}
export default MainGameUI
