import { Scene } from 'phaser'
import Ball from '../player/Ball'
import EmptyColliderGameObject from './EmptyColliderGameObject'

class Basket extends Phaser.GameObjects.Container {
    private prevNetY: number
    private prevNetScaleY: number
    private prevCenterColliderY: number
    private prevCenterContainerY: number
    private net: Phaser.GameObjects.Sprite
    private rim2: Phaser.GameObjects.Sprite

    private topLeftCollider: EmptyColliderGameObject
    private topRightCollider: EmptyColliderGameObject
    private centerCollider: EmptyColliderGameObject

    private groupColliders: Phaser.GameObjects.Group
    private centerContainer: Phaser.GameObjects.Container

    private currentBall: Ball | undefined

    private maxAngle: number
    private maxScaleTargetY: number
    private minScaleTargetY: number
    private canBack: boolean
    private canDrag: boolean
    private hasCollider: boolean

    // private line: Phaser.Geom.Line
    // private graphics: Phaser.GameObjects.Graphics

    public getColliders(): Phaser.GameObjects.Group {
        return this.groupColliders
    }
    public getHasCollider(): boolean {
        return this.hasCollider
    }
    public getCurrentBall(): Ball | undefined {
        return this.currentBall
    }
    public setHasCollider(state: boolean): void {
        this.hasCollider = state
    }

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.maxAngle = 45
        this.groupColliders = new Phaser.GameObjects.Group(this.scene)
        this.groupColliders.runChildUpdate = true
        this.initChildren()
        this.initInput()
        this.setDepth(5)
        this.scene.add.existing(this)
        this.canDrag = false
    }
    private initChildren() {
        this.net = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            0,
            'net01'
        ).setScale(0.3)
        const rim1 = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            -25,
            'rim01'
        ).setScale(0.3)
        this.rim2 = new Phaser.GameObjects.Sprite(
            this.scene,
            this.x,
            this.y,
            'rim02'
        ).setScale(0.3)
        this.rim2.setSize(375, 325)
        this.rim2.setOrigin(0.5, 0.5)

        this.add(this.net)
        this.add(rim1)

        this.topLeftCollider = new EmptyColliderGameObject(this.scene, 45, -50)
        this.topLeftCollider.createCircleCollider(10, 10, 30)

        this.topRightCollider = new EmptyColliderGameObject(
            this.scene,
            -50,
            -50
        )
        this.topRightCollider.createCircleCollider(10, 10, 30)

        this.centerCollider = new EmptyColliderGameObject(this.scene, 0, 25)
        this.centerCollider.setColliderSize(50, 10)
        this.centerCollider.setIsCenter(true)

        this.add(this.topLeftCollider)
        this.add(this.topRightCollider)
        this.add(this.centerCollider)

        this.groupColliders.add(this.topLeftCollider)
        this.groupColliders.add(this.topRightCollider)
        this.groupColliders.add(this.centerCollider)

        this.centerContainer = new Phaser.GameObjects.Container(
            this.scene,
            0,
            -10
        )
        this.add(this.centerContainer)
        this.sendToBack(this.centerContainer)
        //this.sendToBack(rim2)
        // this.line = new Phaser.Geom.Line()
        // this.graphics = new Phaser.GameObjects.Graphics(this.scene)
        this.scene.add.existing(this.rim2)

        this.prevNetScaleY = this.net.scaleY
        this.minScaleTargetY = this.maxScaleTargetY = 0
        this.canBack = false
    }
    private initInput(): void {
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(0, 0, 100),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true,
        })
        this.scene.input.setDraggable(this)
        this.on('dragstart', this.handleDragStart, this)
        this.on('drag', this.handleDrag, this)
        this.on('dragend', this.handleDragEnd, this)
    }

    public update(deltaTime: number): void {
        this.rim2.rotation = this.rotation
        //console.log(this.currentTime)
        if (this.canBack) {
            this.decreaseNetSize(0.1, 7)
            this.minScaleTargetY = this.maxScaleTargetY
            if (this.net.scaleY <= this.prevNetScaleY) {
                this.canBack = false
                this.minScaleTargetY = this.prevNetScaleY
            }
        } else if (this.minScaleTargetY < this.maxScaleTargetY) {
            this.increaseNetSize(this.maxScaleTargetY, 0.1, 7)
            if (this.net.scaleY >= this.maxScaleTargetY) {
                this.maxScaleTargetY -= deltaTime * 6
                this.canBack = true
            }
        }
    }
    public addBall(ball: Ball): void {
        this.centerContainer.add(ball)
        ball.setPosition(0, 0)
        ball.toggleStickMode(true)
        this.currentBall = ball
        this.centerContainer.sendToBack(this.currentBall)
        this.toggleAllColliders(false)
        this.toggleCenterCollider(false)
        this.maxScaleTargetY = 0.45
        this.minScaleTargetY = this.prevNetScaleY
        this.canDrag = true
    }
    public removeBalls(): void {
        this.centerContainer.removeAll()
    }

    private handleDragStart(): void {
        if (!this.canDrag) {
            return
        }
        this.prevNetY = this.net.y
        this.prevNetScaleY = this.net.scaleY
        this.prevCenterColliderY = this.centerCollider.y
        this.prevCenterContainerY = this.centerContainer.y
    }
    private handleDrag(pointer: Phaser.Input.Pointer): void {
        if (!this.canDrag) {
            return
        }
        // handle rotation
        const angle =
            Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y) -
            90 * (Math.PI / 180)
        const maxRad = this.maxAngle * (Math.PI / 180)
        if (angle > -maxRad && angle <= maxRad) {
            this.rotation = angle
        }

        // handle stretch
        let scaleFactor = pointer.getDistance() / 100
        this.bounceNet(0.6, scaleFactor, pointer.y)
    }
    private bounceNet(
        maxScale: number,
        scaleFactor: number,
        maxHeight: number,
        speed = 1
    ): void {
        if (this.y < maxHeight) {
            this.increaseNetSize(maxScale, scaleFactor, speed)
        } else {
            this.decreaseNetSize(scaleFactor, speed)
        }
    }
    private decreaseNetSize(scaleFactor: number, speed: number) {
        if (this.net.scaleY > this.prevNetScaleY) {
            this.net.scaleY -= scaleFactor * 0.03 * speed
            this.net.y -= scaleFactor * 1.7 * speed
            this.centerCollider.y -= scaleFactor * 1.7 * speed
            this.centerContainer.y -= scaleFactor * 3.2 * speed
        }
    }

    private increaseNetSize(
        maxScale: number,
        scaleFactor: number,
        speed: number
    ) {
        if (this.net.scaleY < maxScale) {
            this.net.scaleY += scaleFactor * 0.03 * speed
            this.net.y += scaleFactor * 1.7 * speed
            this.centerCollider.y += scaleFactor * 1.7 * speed
            this.centerContainer.y += scaleFactor * 3.2 * speed
        }
    }

    private handleDragEnd(): void {
        if (!this.canDrag) {
            return
        }

        if (this.net.scaleY <= this.prevNetScaleY) {
            this.resetNet()
            this.rotation = 0
            return
        } else {
            this.resetNet()
        }
        if (this.currentBall) {
            let forceAmount =
                this.currentBall.getForceAmount() * (this.net.scaleY * 10)
            forceAmount = forceAmount > 700 ? 700 : forceAmount
            this.currentBall.setPosition(
                this.x + this.centerContainer.x,
                this.y + this.centerContainer.y
            )

            this.currentBall.toggleStickMode(false)
            this.scene.physics.velocityFromRotation(
                this.rotation + (-90 * Math.PI) / 180,
                forceAmount,
                this.currentBall.body.velocity
            )
            this.currentBall = undefined
            this.canDrag = false
        }
        this.rotation = 0
        this.centerContainer.removeAll()
    }
    private resetNet() {
        this.net.y = this.prevNetY
        this.net.scaleY = this.prevNetScaleY
        this.centerCollider.y = this.prevCenterColliderY
        this.centerContainer.y = this.prevCenterContainerY
    }

    public toggleAllColliders(state: boolean): void {
        if (!this.active) {
            return
        }
        for (
            let i = 0;
            i < this.groupColliders.children.getArray().length;
            i++
        ) {
            const collider = this.groupColliders.children.getArray()[i]
            if (collider instanceof EmptyColliderGameObject) {
                if (collider == this.centerCollider) {
                    continue
                }
                collider.toggleCollision(state)
            }
        }
    }
    public toggleCenterCollider(state: boolean): void {
        this.centerCollider.toggleCollision(state)
    }
    public toggleBasket(state: boolean): void {
        this.toggleAllColliders(state)
        this.rim2.setVisible(state)
        this.rim2.setActive(state)
        this.rotation = 0
        this.setActive(state)
        this.setVisible(state)
    }
    public setNewPosition(x: number, y: number): void {
        this.setPosition(x, y)
        this.rim2.setPosition(x, y)
    }
}
export default Basket
