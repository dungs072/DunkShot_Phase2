import { Scene } from 'phaser'
import CONST from '../const/const'

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
        this.setDepth(CONST.OBSTACLE.DEPTH)
    }
    private initPhysic(): void {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = false
        this.body.immovable = true
        this.body.setBounce(CONST.OBSTACLE.BOUNCE)
        if (this.isVertical) {
            this.body.setSize(this.displayWidth, this.displayHeight)
        } else {
            this.setAngle(CONST.OBSTACLE.VERTICALANGLE)
            this.body.setSize(this.displayHeight, this.displayWidth)
        }
    }
    public toggleObstacle(state: boolean): void {
        this.setVisible(state)
        this.setActive(state)
        this.body.enable = state
    }
    public setObstaclePosition(x: number, y: number): void {
        this.setPosition(x, y)
    }
    public getIsVertical(): boolean {
        return this.isVertical
    }
}
export default Obstacle
