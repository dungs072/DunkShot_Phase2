import Utils from '../Utils'
import CONST from '../const/const'
import IImageConstructor from '../types/image'
import HitEffect from './HitEffect'
class Ball extends Phaser.GameObjects.Container {
    declare body: Phaser.Physics.Arcade.Body

    private forceAmount: number
    private rotationSpeed: number
    private ballModel: Phaser.GameObjects.Image

    private initialVelocity: Phaser.Math.Vector2
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    private hitSound: Phaser.Sound.BaseSound
    private boomSound: Phaser.Sound.BaseSound

    private currentVelocityX: number
    private currentVelocityY: number

    private currentRotationSpeed: number

    private hitEffects: HitEffect[]

    public playHitSound(): void {
        this.hitSound.play()
    }
    public playBoomSound(): void {
        this.boomSound.play()
    }

    //private leftBounceEffect: Phaser.GameObjects.

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y)
        this.forceAmount = CONST.BALL.FORCEAMOUNT
        this.rotationSpeed = CONST.BALL.ROTATIONSPEED
        this.initImage(params.texture, params.frame)
        this.initPhysic()
        this.initEffects()
        this.initialVelocity = new Phaser.Math.Vector2(0, 0)
        this.scene.add.existing(this)
        this.hitSound = this.scene.sound.add('hit')
        this.boomSound = this.scene.sound.add('boom')
        this.hitEffects = []
        this.currentRotationSpeed = this.rotationSpeed
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

        this.setDepth(CONST.BALL.DEPTH)
        this.setScale(CONST.BALL.SCALE)
    }

    private initPhysic(): void {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = true
        this.body.setCircle(100, -100, -100)
        this.body.setBounce(0.75)
        this.body.setFriction(0)
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
                    this.spawnHitEffect(ball.x, ball.y, !left)

                    this.initialVelocity.y = Math.min(
                        this.initialVelocity.y + 400,
                        0
                    )
                    this.initialVelocity.x = Utils.Lerp(
                        this.initialVelocity.x,
                        0,
                        0.1
                    )
                    const reflectVelocity = Utils.getReflectionVelocity(
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
    private spawnHitEffect(x: number, y: number, isRight: boolean): void {
        for (let i = 0; i < this.hitEffects.length; i++) {
            if (!this.hitEffects[i].active) {
                this.hitEffects[i].setActive(true)
                this.hitEffects[i].setVisible(true)
                this.hitEffects[i].setPosition(isRight ? x - 20 : x + 20, y)
                if (isRight) {
                    this.hitEffects[i].rotateToRight()
                } else {
                    this.hitEffects[i].rotateToLeft()
                }
                this.hitEffects[i].triggerEffect()
                return
            }
        }
        const hitEffect = new HitEffect(
            this.scene,
            isRight ? x - 20 : x + 20,
            y
        )
        if (isRight) {
            hitEffect.rotateToRight()
        } else {
            hitEffect.rotateToLeft()
        }

        hitEffect.triggerEffect()
        this.hitEffects.push(hitEffect)
    }
    private initEffects(): void {
        this.emitter = this.scene.add.particles(0, 0, 'flares', {
            frame: 'white',
            color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
            colorEase: 'quad.out',
            lifespan: 400,
            angle: { min: -100, max: -80 },
            scale: { start: 0.7, end: 0, ease: 'sine.out' },
            speed: 100,
            advance: 2000,
            blendMode: 'ADD',
        })
        this.emitter.setDepth(10)
        this.emitter.startFollow(this)
    }
    public update(delta: number): void {
        if (!this.parentContainer) {
            this.ballModel.rotation += delta * this.currentRotationSpeed
        }
    }
    public toggleStickMode(state: boolean): void {
        this.body.allowGravity = !state
        this.body.immovable = state
        if (state) {
            this.body.setVelocity(0, 0)
            this.currentRotationSpeed = this.rotationSpeed
        }
    }
    public decreaseRotationSpeed(amount: number): void {
        this.currentRotationSpeed = Math.max(
            this.currentRotationSpeed - amount,
            0
        )
    }
    public toggleTrail(state: boolean): void {
        this.emitter.stop()
        // this.emitter.setVisible(state)
        if (state) {
            this.emitter.start()
        } else {
            this.emitter.stop()
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
    public setCurrentVelocityToInitialVelocity(): void {
        this.setInitialVelocity(this.body.velocity.x, this.body.velocity.y)
    }

    public toggleBall(state: boolean): void {
        this.body.enable = state
        this.setVisible(state)
        this.setActive(state)
        this.body.immovable = !state
        this.body.allowGravity = state
        this.emitter.setVisible(state)
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
