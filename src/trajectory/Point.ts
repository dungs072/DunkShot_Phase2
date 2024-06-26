import { Scene } from 'phaser'

class Point extends Phaser.GameObjects.Image {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'basketball')
        this.setScale(0.1, 0.1)
        this.setDepth(5)
        this.scene.add.existing(this)
    }
}
export default Point
