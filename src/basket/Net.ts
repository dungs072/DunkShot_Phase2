import { Scene } from 'phaser'

class Net extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body
    private prevY: number
    private prevX: number
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, '')
        this.initPhysic()
        this.setVisible(false)
        scene.add.existing(this)
        this.prevY = this.y
        this.prevX = this.x
    }
    private initPhysic(): void {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = false
        this.body.setImmovable(true)
        this.body.allowRotation = true
        this.body.rotation += 45
        this.angle = 45

        this.body.setSize(5, 75)
        this.refreshBody()
    }
    public setColliderSize(x: number, y: number) {
        this.body.setSize(x, y)
    }
    public decreaseYCollider(amount: number, amountX = 0) {
        this.y += amount
        this.x += amountX
        this.refreshBody()
    }
    public reset() {
        this.y = this.prevY
        this.x = this.prevX
    }
}
export default Net
