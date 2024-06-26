import IImageConstructor from '../types/image'
class Ball extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body

    private forceAmount: number

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        this.forceAmount = 7000
        this.initImage()
        this.initPhysic()

        this.scene.add.existing(this)
    }
    private initImage() {
        this.setOrigin(0.5, 0.5)
        this.setDepth(12)
        this.setScale(0.25)
    }

    private initPhysic() {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = true
        this.body.setCircle(100)
        this.body.setBounce(0.5)
        this.body.setFriction(0, 0)
        this.body.setAllowDrag(false)
        this.body.setCollideWorldBounds(true, 1, 1, true)
    }
    public toggleStickMode(state: boolean): void {
        this.body.allowGravity = !state
        this.body.immovable = state
        if (state) {
            this.body.setVelocity(0, 0)
        }
    }
    public getForceAmount(): number {
        return this.forceAmount
    }
    public setForceAmount(amount: number): void {
        this.forceAmount = amount
    }
}
export default Ball
