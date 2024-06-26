import IImageConstructor from '../types/image'
class Ball extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body

    private forceAmount: number

    private initialVelocity: Phaser.Math.Vector2

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        this.forceAmount = 7000
        this.initImage()
        this.initPhysic()
        this.initialVelocity = new Phaser.Math.Vector2(0, 0)
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
        this.body.setCollideWorldBounds(true, 0, 0, true)
        this.scene.physics.world.on(
            'worldbounds',
            (
                body: Phaser.Physics.Arcade.Body,
                up: boolean,
                down: boolean,
                left: boolean,
                right: boolean
            ) => {
                const ball = body.gameObject
                if (ball instanceof Ball) {
                    let normalVector = undefined
                    if (left) {
                        normalVector = new Phaser.Math.Vector2(1, 0)
                    } else {
                        normalVector = new Phaser.Math.Vector2(-1, 0)
                    }
                    this.initialVelocity.y += 200
                    const reflectVelocity = this.getReflectionVelocity(
                        this.initialVelocity,
                        normalVector
                    )
                    if (reflectVelocity) {
                        this.body.setVelocity(
                            reflectVelocity.x,
                            reflectVelocity.y
                        )
                        this.initialVelocity.x = reflectVelocity.x
                        this.initialVelocity.y = reflectVelocity.y
                    }
                }
            }
        )
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
    public setInitialVelocity(x: number, y: number): void {
        this.initialVelocity.x = x
        this.initialVelocity.y = y
    }
    public getReflectionVelocity(
        incomeVelocity: Phaser.Math.Vector2,
        normalVector: Phaser.Math.Vector2
    ): Phaser.Math.Vector2 | null {
        const dotValue = incomeVelocity.dot(normalVector)
        return new Phaser.Math.Vector2(
            incomeVelocity.x - 2 * normalVector.x * dotValue,
            incomeVelocity.y - 2 * normalVector.y * dotValue
        )
    }
}
export default Ball
