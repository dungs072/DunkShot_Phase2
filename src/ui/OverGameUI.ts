import { Scene } from 'phaser'

class OverGameUI extends Phaser.GameObjects.Container {
    private scoreText: Phaser.GameObjects.Text
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.initUI()
        this.setDepth(1)
        this.scene.add.existing(this)
        // this.stateMenu = true
        // this.scene.tweens.add({
        //     targets: this.dragIt,
        //     alpha: { from: 1, to: 0.5 },
        //     ease: 'Sine.InOut',
        //     duration: 500,
        //     repeat: -1,
        //     yoyo: true,
        // })
    }
    private initUI(): void {
        this.scoreText = new Phaser.GameObjects.Text(
            this.scene,
            innerWidth / 4,
            innerHeight / 6,
            '999',
            {
                fontFamily: 'Arial',
                color: '#645E5C',
                fontSize: 75,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.setScrollFactor(0, 0)
        this.add(this.scoreText)
    }
}
export default OverGameUI
