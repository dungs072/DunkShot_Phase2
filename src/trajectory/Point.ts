import { Scene } from 'phaser'

class Point extends Phaser.GameObjects.Image {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'dot')
        this.setScale(0.27)
        this.setDepth(5)
        this.setOrigin(0.5, 0.5)
        this.setTint(0xff8b00)
        this.scene.add.existing(this)
    }
    public setPointScale(factor: number) {
        factor = 0.27 * factor
        if (factor < 0.18) {
            factor = 0.18
        }
        this.setScale(factor)
    }
}
export default Point
