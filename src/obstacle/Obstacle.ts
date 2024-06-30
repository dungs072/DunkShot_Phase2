import { Scene } from 'phaser'

class Obstacle extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.Body
    protected isVertical: boolean
    constructor(scene: Scene, x: number, y: number, isVertical: boolean) {
        super(scene, x, y, 'obstacle')
        this.isVertical = isVertical
        this.initImage()
        this.initPhysic()
        this.scene.add.existing(this)
    }
    private initImage(): void {
        this.setOrigin(0.5, 0.5)
        this.setDepth(5)
    }
    private initPhysic(): void {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = false
        this.body.immovable = true
        if (this.isVertical) {
            this.body.setSize(this.displayWidth, this.displayHeight)
        } else {
            this.setAngle(90)
            this.body.setSize(this.displayHeight, this.displayWidth)
        }
    }
    public toggleObstacle(state: boolean): void {
        this.body.enable = state
        this.setVisible(state)
        this.setActive(state)
    }
}
export default Obstacle
