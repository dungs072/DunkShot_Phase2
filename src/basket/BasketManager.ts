import Basket from './Basket'
import Ball from '../player/Ball'
import EmptyColliderGameObject from './EmptyColliderGameObject'
import { Scene } from 'phaser'
class BasketManager {
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

    private explosionEffect: Phaser.GameObjects.Sprite

    constructor(scene: Scene, screenWidth: number, screenHeight: number) {
        this.scene = scene
        this.maxHeight = 250
        this.minHeight = 200
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
        this.initAnimations()
        this.setUpEvents()
    }
    private setUpEvents(): void {
        this.explosionEffect.on('animationcomplete-explosion', () => {
            this.toggleExplosionEffect(false)
        })
    }
    private initAnimations(): void {
        this.scene.anims.create({
            key: 'explosion',
            frames: this.scene.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 12,
            }),
            frameRate: 20,
        })
    }
    public update(deltaTime: number): void {
        this.baskets.forEach((basket) => {
            if (basket.active) {
                if (basket instanceof Basket) {
                    basket.update(deltaTime / 1000)
                    if (basket.getCurrentBall() == undefined) {
                        const distance = Phaser.Math.Distance.Between(
                            this.ball.x,
                            this.ball.y,
                            basket.x,
                            basket.y
                        )
                        if (distance > 100) {
                            basket.toggleAllColliders(true)
                        }
                        basket.toggleCenterCollider(this.ball.y < basket.y)
                    }
                }
            }
        })
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
            randomY = this.screenHeight - 175
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
        if (!other.getIsCenter()) {
            return
        }

        const gameObj = other.parentContainer
        if (gameObj instanceof Basket) {
            this.toggleExplosionEffect(true, gameObj.x, gameObj.y - 40)
            gameObj.addBall(ball)
            gameObj.setInteractive()

            if (this.preBasket && this.preBasket != gameObj) {
                this.preBasket.toggleBasket(false)
            }
            this.preBasket = gameObj
        }
        if (this.prevHeight > gameObj.y) {
            this.prevHeight = gameObj.y
            this.createBasket()
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

    public getBaskets(): Basket[] {
        return this.baskets
    }
    public setBall(ball: Ball): void {
        this.ball = ball
    }
}
export default BasketManager
