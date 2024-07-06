import { Scene } from 'phaser'
import Utils from '../Utils'

class Point extends Phaser.GameObjects.Image {
    private targetPosition: Phaser.Math.Vector2
    private speed: number
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'dot')
        this.setScale(0.27)
        this.setDepth(5)
        this.setOrigin(0.5, 0.5)
        this.setTint(0xff8b00)
        this.scene.add.existing(this)
        this.targetPosition = new Phaser.Math.Vector2(0, 0)
        this.speed = 20
    }
    public setPointScale(factor: number) {
        factor = 0.27 * factor
        if (factor < 0.18) {
            factor = 0.18
        }
        this.setScale(factor)
    }
    public setTargetPosition(x: number, y: number): void {
        this.targetPosition.x = x
        this.targetPosition.y = y
    }
    public updatePositionByTime(deltaTime: number) {
        this.x = Utils.lerp(
            this.x,
            this.targetPosition.x,
            deltaTime * this.speed
        )
        this.y = Utils.lerp(
            this.y,
            this.targetPosition.y,
            deltaTime * this.speed
        )
    }
}
export default Point
