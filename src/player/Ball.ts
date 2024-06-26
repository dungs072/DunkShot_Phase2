import IImageConstructor from '../types/image'
class Ball extends Phaser.GameObjects.Container {
    declare body: Phaser.Physics.Arcade.Body

    private forceAmount: number
    private rotationSpeed: number
    private ballModel: Phaser.GameObjects.Image

    private initialVelocity: Phaser.Math.Vector2

    private lineEffect: Phaser.GameObjects.Line

    private hitSound: Phaser.Sound.BaseSound
    private boomSound: Phaser.Sound.BaseSound

    private currentVelocityX: number
    private currentVelocityY: number

    public playHitSound(): void {
        this.hitSound.play()
    }
    public playBoomSound(): void {
        this.boomSound.play()
    }

    //private leftBounceEffect: Phaser.GameObjects.

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y)
        this.forceAmount = 1400
        this.rotationSpeed = 15
        this.initImage(params.texture, params.frame)
        this.initPhysic()
        this.initEffects()
        this.initialVelocity = new Phaser.Math.Vector2(0, 0)
        this.moveDown(this.lineEffect)
        this.scene.add.existing(this)
        this.hitSound = this.scene.sound.add('hit')
        this.boomSound = this.scene.sound.add('boom')
    }

    private initImage(texture: string, frame: string | number | undefined) {
        this.ballModel = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            0,
            texture,
            frame
        )

        this.ballModel.setOrigin(0.5, 0.5)
        this.add(this.ballModel)

        this.setDepth(12)
        this.setScale(0.3)
    }

    private initPhysic(): void {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = true
        this.body.setCircle(100, -100, -100)
        this.body.setBounce(0.75)
        this.body.setFriction(0, 0)
        this.body.setAllowDrag(false)
        this.body.setCollideWorldBounds(true, 0, 0, true)
        this.body.setMass(100)
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
                    ball.playHitSound()
                    let normalVector = undefined
                    if (left) {
                        normalVector = new Phaser.Math.Vector2(1, 0)
                    } else {
                        normalVector = new Phaser.Math.Vector2(-1, 0)
                    }
                    this.initialVelocity.y += 400
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
    private initEffects(): void {
        this.lineEffect = new Phaser.GameObjects.Line(
            this.scene,
            50,
            50,
            100,
            100,
            400,
            400,
            0xf4c05a
        )
        this.lineEffect.setAlpha(0.5)
        this.lineEffect.setLineWidth(200, 50)
        this.lineEffect.setVisible(false)

        this.add(this.lineEffect)
    }
    public update(delta: number): void {
        // this.reverseVelocity.x = this.body.velocity.x * -1
        // this.reverseVelocity.y = this.body.velocity.y * -1
        // this.lineEffect.setTo(
        //     100,
        //     100,
        //     this.reverseVelocity.x,
        //     this.reverseVelocity.y
        // )
        if (!this.parentContainer) {
            this.ballModel.rotation += delta * this.rotationSpeed
        }
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
    public toggleBall(state: boolean): void {
        this.body.enable = state
        this.setVisible(state)
        this.setActive(state)
        this.body.immovable = !state
        this.body.allowGravity = state
    }
    public toggleLineEffect(state: boolean): void {
        this.lineEffect.setVisible(state)
    }
    public resetBall(): void {
        if (this.parentContainer) {
            this.parentContainer.removeAll()
        }
        this.toggleBall(true)
        this.body.setVelocity(0, 0)
    }
    public pauseBall(state: boolean): void {
        if (state) {
            this.currentVelocityX = this.body.velocity.x
            this.currentVelocityY = this.body.velocity.y
            this.body.setVelocity(0, 0)
        } else {
            this.body.setVelocity(this.currentVelocityX, this.currentVelocityY)
        }
        if (!this.parentContainer) {
            this.body.immovable = state
            this.body.allowGravity = !state
        }
    }
}
export default Ball
