import Basket from './Basket'
import Ball from '../player/Ball'
import EmptyColliderGameObject from './EmptyColliderGameObject'
import { Scene } from 'phaser'
import LevelManager from '../challenge/LevelManager'
import CONST from '../Const'
import ChallengeType from '../types/level/challenge'
import ChallengeManager from '../challenge/ChallengeManager'
class BasketManager {
    public static BasketCollided = new Phaser.Events.EventEmitter()
    private baskets: Basket[]
    private maxHeight: number
    private minHeight: number
    private screenWidth: number
    private screenHeight: number

    private prevHeight: number
    private isLeft: boolean
    private ball: Ball
    private preBasket: Basket | undefined
    private scene: Scene
    private challengeManager: ChallengeManager

    private explosionEffect: Phaser.GameObjects.Sprite
    private complicationText: Phaser.GameObjects.Text

    constructor(
        scene: Scene,
        screenWidth: number,
        screenHeight: number,
        challengeManager: ChallengeManager
    ) {
        this.scene = scene
        this.challengeManager = challengeManager
        this.maxHeight = 200
        this.minHeight = 150
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight

        this.baskets = []
        this.prevHeight = screenHeight
        this.isLeft = true

        this.explosionEffect = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            0,
            'ball'
        ).setScale(1.5)
        this.explosionEffect.setDepth(5)
        this.explosionEffect.setVisible(false)
        this.scene.add.existing(this.explosionEffect)
        this.complicationText = new Phaser.GameObjects.Text(
            this.scene,
            0,
            0,
            'Perfect',
            {
                fontFamily: 'Arial',
                color: '#676663',
                fontSize: 25,
                fontStyle: 'bold',
            }
        )
        this.complicationText.setDepth(5)
        this.complicationText.setVisible(false)
        // this.complicationText.setVisible(false)
        this.scene.add.existing(this.complicationText)
        this.initAnimations()
        this.setUpEvents()
    }
    private setUpEvents(): void {
        this.explosionEffect.on('animationcomplete-explosion', () => {
            this.toggleExplosionEffect(false)
        })
    }
    private initAnimations(): void {
        if (this.scene.anims.exists('explosion')) return
        this.scene.anims.create({
            key: 'explosion',
            frames: this.scene.anims.generateFrameNumbers('explosions', {
                start: 0,
                end: 11,
            }),
            frameRate: 20,
        })
    }
    public update(delta: number): void {
        for (let i = 0; i < this.baskets.length; i++) {
            if (!this.baskets[i].active) continue
            if (this.baskets[i] instanceof Basket) {
                this.baskets[i].update(delta)
                if (this.baskets[i].getCurrentBall() != undefined) continue
                const distance = Phaser.Math.Distance.Between(
                    this.ball.x,
                    this.ball.y,
                    this.baskets[i].x,
                    this.baskets[i].y
                )
                if (distance > 100) {
                    this.baskets[i].toggleAllColliders(true)
                }
                this.baskets[i].toggleCenterCollider(
                    this.ball.y < this.baskets[i].y
                )
            }
        }
    }

    public createBasketByLevel(): Basket {
        let basket
        const level = this.challengeManager
            .getCurrentLevelManager()
            ?.getCurrentLevel()
        if (!level) {
            return this.createBasket()
        }
        console.log(level)
        basket = this.getFreeBasket(
            level.getBasketPosX() * devicePixelRatio + CONST.WIDTH_SIZE / 2,
            level.getBasketPosY() * devicePixelRatio + CONST.HEIGHT_SIZE
        )
        console.log(basket.y)

        basket.disableInteractive()
        if (!basket.getHasCollider()) {
            this.setUpColliders(basket)
            basket.setHasCollider(true)
        }
        return basket
    }

    public createBasket(): Basket {
        let randomX = this.isLeft
            ? Phaser.Math.Between(150, this.screenWidth / 2)
            : Phaser.Math.Between(
                  this.screenWidth / 2 + 50,
                  this.screenWidth - 150
              )

        this.isLeft = !this.isLeft
        let randomY = 0

        if (this.preBasket) {
            randomY = Phaser.Math.Between(this.minHeight, this.maxHeight) * -1
            randomY += this.preBasket.y
            if (Math.abs(randomX - this.preBasket.x) < 50) {
                if (this.isLeft) {
                    randomX += 50
                } else {
                    randomX -= 50
                }
            }
        } else {
            randomY = this.screenHeight / 1.5
        }

        const basket = this.getFreeBasket(randomX, randomY)
        basket.disableInteractive()
        if (!basket.getHasCollider()) {
            this.setUpColliders(basket)
            basket.setHasCollider(true)
        }
        return basket
    }
    private setUpColliders(basket: Basket): void {
        this.scene.physics.add.collider(
            this.ball,
            basket.getColliders(),
            this.handleBallHitBasket,
            undefined
        )
    }
    private handleBallHitBasket = (
        ball: Ball,
        other: EmptyColliderGameObject
    ): void => {
        if (other.parentContainer) {
            const basket = other.parentContainer
            if (basket instanceof Basket) {
                basket.handleCollisionWithRim(other)
            }
        }
        if (!ball.body.allowGravity) return

        if (!other.getIsCenter()) {
            ball.playHitSound()
            return
        }
        if (!ball.parentContainer) {
            ball.playBoomSound()
        }

        const gameObj = other.parentContainer
        if (gameObj instanceof Basket) {
            if (gameObj.isPerfectThrow()) {
                this.triggerPerfectText(gameObj)
            }
            this.toggleExplosionEffect(true, gameObj.x, gameObj.y - 40)
            gameObj.addBall(ball, this.preBasket != gameObj)
            gameObj.setInteractive()

            if (this.preBasket && this.preBasket != gameObj) {
                this.preBasket.toggleBasket(false)
            }
            if (this.preBasket != gameObj) {
                BasketManager.BasketCollided.emit('basketcollided')
            }
            this.preBasket = gameObj
        }
        if (this.prevHeight > gameObj.y) {
            this.prevHeight = gameObj.y
            if (
                this.challengeManager.getCurrentChallengeType() ==
                ChallengeType.NONE
            ) {
                this.createBasket()
            } else {
                if (
                    this.challengeManager
                        .getCurrentLevelManager()
                        ?.getCurrentLevel()
                        .isFinishCurrentLevel()
                ) {
                    LevelManager.LevelFinished.emit('nextlevel')
                } else {
                    this.createBasketByLevel()
                }
            }
        }
    }
    public getFreeBasket(x: number, y: number): Basket {
        for (let i = 0; i < this.baskets.length; i++) {
            if (!this.baskets[i].active) {
                this.baskets[i].toggleBasket(true)
                this.baskets[i].setNewPosition(x, y)
                return this.baskets[i]
            }
        }
        //const basket = new MovableBasket(this.scene, x, y, true, 100, 100)
        const basket = new Basket(this.scene, x, y)
        this.baskets.push(basket)
        return basket
    }
    public toggleInteractive(state: boolean): void {
        this.baskets.forEach((basket) => {
            if (state) {
                basket.setInteractive()
            } else {
                basket.disableInteractive()
            }
        })
    }
    public reset(): void {
        this.prevHeight = this.screenHeight
        this.preBasket = undefined
        this.isLeft = true
        this.toggleBaskets(false)
    }
    private toggleBaskets(state: boolean): void {
        this.baskets.forEach((basket) => {
            basket.toggleBasket(state)
        })
    }
    public toggleExplosionEffect(state: boolean, x = 0, y = 0): void {
        this.explosionEffect.setVisible(state)
        this.explosionEffect.setPosition(x, y)
        if (state) {
            this.explosionEffect.play('explosion')
        }
    }
    private triggerPerfectText(basket: Basket): void {
        this.complicationText.setVisible(true)
        this.complicationText.setPosition(basket.x - 43, basket.y - 50)
        this.scene.tweens.add({
            targets: this.complicationText,
            y: {
                from: this.complicationText.y,
                to: this.complicationText.y - 50,
            },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power2',
            yoyo: true,
        })
    }

    public getBaskets(): Basket[] {
        return this.baskets
    }
    public setBall(ball: Ball): void {
        this.ball = ball
    }
}
export default BasketManager
