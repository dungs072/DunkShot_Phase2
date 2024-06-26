import { Scene } from 'phaser'
import Ball from '../player/Ball'
import EmptyColliderGameObject from './EmptyColliderGameObject'

class Basket extends Phaser.GameObjects.Container {
    public static eventEmitter = new Phaser.Events.EventEmitter()

    private prevNetY: number
    private prevNetScaleY: number
    private prevCenterColliderY: number
    private prevCenterContainerY: number
    private net: Phaser.GameObjects.Sprite
    private rim2: Phaser.GameObjects.Sprite

    private topLeftCollider: EmptyColliderGameObject
    private topRightCollider: EmptyColliderGameObject
    protected centerCollider: EmptyColliderGameObject
    private netCollider: EmptyColliderGameObject

    private groupColliders: Phaser.GameObjects.Group
    private centerContainer: Phaser.GameObjects.Container

    private currentBall: Ball | undefined

    private maxScaleTargetY: number
    private minScaleTargetY: number
    private canBack: boolean
    private canDrag: boolean
    private hasCollider: boolean

    private maxPoint: number
    private colliderPoints: Map<EmptyColliderGameObject, number>

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
        this.colliderPoints = new Map<EmptyColliderGameObject, number>()
        this.groupColliders = new Phaser.GameObjects.Group(this.scene)
        this.groupColliders.runChildUpdate = true
        this.initChildren()
        this.initInput()
        this.initPhysic()
        this.setUpPoint()
        this.setDepth(14)
        this.scene.add.existing(this)
        this.canDrag = false
    }
    private setUpPoint() {
        this.maxPoint = 2
        this.colliderPoints.set(this.topLeftCollider, 1)
        this.colliderPoints.set(this.topRightCollider, 1)
    }
    private initChildren() {
        this.net = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            0,
            'net01'
        ).setScale(0.4)
        this.net.setOrigin(0.5, 0.5)
        const rim1 = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            -30,
            'rim01'
        ).setScale(0.4)
        rim1.setOrigin(0.5, 0.5)
        this.rim2 = new Phaser.GameObjects.Sprite(
            this.scene,
            this.x,
            this.y,
            'rim02'
        ).setScale(0.4)
        this.rim2.setDepth(2)
        this.rim2.setSize(375, 325)
        this.rim2.setOrigin(0.5, 0.5)

        this.add(this.net)
        this.add(rim1)

        this.topLeftCollider = new EmptyColliderGameObject(this.scene, 70, -40)
        //this.topLeftCollider.createCircleCollider(10, 10, 30)
        this.topLeftCollider.setSize(15, 15)
        this.topLeftCollider.setOrigin(0.5, 0.5)

        this.topRightCollider = new EmptyColliderGameObject(
            this.scene,
            -70,
            -40
        )
        this.topRightCollider.setSize(15, 15)

        this.centerCollider = new EmptyColliderGameObject(
            this.scene,
            0,
            10
        ).setOrigin(0.5, 0.5)
        this.centerCollider.setColliderSize(50, 20)
        this.centerCollider.setIsCenter(true)

        this.netCollider = new EmptyColliderGameObject(this.scene, 0, 0)
        this.netCollider.setColliderSize(60, 40)

        this.add(this.topLeftCollider)
        this.add(this.topRightCollider)
        this.add(this.centerCollider)
        this.add(this.netCollider)

        this.groupColliders.add(this.topLeftCollider)
        this.groupColliders.add(this.topRightCollider)
        this.groupColliders.add(this.centerCollider)
        this.groupColliders.add(this.netCollider)

        this.centerContainer = new Phaser.GameObjects.Container(
            this.scene,
            0,
            -10
        )
        this.add(this.centerContainer)
        this.sendToBack(this.centerContainer)
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

    private initPhysic(): void {
        this.scene.physics.add.staticGroup()
    }
    public handleCollisionWithRim(collider: EmptyColliderGameObject): void {
        if (collider == this.topLeftCollider) {
            if (this.topLeftCollider) {
                this.colliderPoints.set(this.topLeftCollider, 0)
            }
        } else if (collider == this.topRightCollider) {
            if (this.topRightCollider) {
                this.colliderPoints.set(this.topRightCollider, 0)
            }
        }
    }

    public update(deltaTime: number): void {
        this.rim2.rotation = this.rotation
        if (this.canBack) {
            this.decreaseNetSize(0.1, 15)
            this.minScaleTargetY = this.maxScaleTargetY
            if (this.net.scaleY <= this.prevNetScaleY) {
                this.canBack = false
                this.minScaleTargetY = this.prevNetScaleY
            }
        } else if (this.minScaleTargetY < this.maxScaleTargetY) {
            this.increaseNetSize(this.maxScaleTargetY, 0.1, 15)
            if (this.net.scaleY >= this.maxScaleTargetY) {
                this.maxScaleTargetY -= deltaTime * 6
                this.canBack = true
            }
        }
    }
    public addBall(ball: Ball, canAddScore = true): void {
        this.centerContainer.add(ball)
        ball.setPosition(0, 0)
        ball.toggleStickMode(true)
        this.currentBall = ball
        this.currentBall.toggleLineEffect(false)
        this.centerContainer.sendToBack(this.currentBall)
        this.toggleAllColliders(false)
        this.toggleCenterCollider(false)
        this.maxScaleTargetY = 0.6
        this.minScaleTargetY = this.prevNetScaleY
        this.canDrag = true
        if (canAddScore) {
            let count = this.getPointAmount()
            if (count) {
                if (count <= 0) {
                    count = 1
                }

                Basket.eventEmitter.emit('balladded', count)
            }
        }
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
        const worldPointer = this.scene.cameras.main.getWorldPoint(
            pointer.x,
            pointer.y
        )

        let angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            worldPointer.x,
            worldPointer.y
        )
        angle += (Math.PI / 180) * 270
        this.rotation = angle

        // handle stretch
        let scaleFactor = pointer.getDistance() / 100
        const distance = Phaser.Math.Distance.Between(
            worldPointer.x,
            worldPointer.y,
            this.x,
            this.y
        )

        this.bounceNet(0.6, scaleFactor, distance)

        this.triggerDragEvent()
    }
    private triggerDragEvent() {
        if (this.currentBall) {
            let proportion =
                (this.net.scaleY - this.prevNetScaleY) /
                (0.6 - this.prevNetScaleY)
            if (proportion > 1) proportion = 1
            if (proportion < 0) proportion = 0

            let forceAmount = this.currentBall.getForceAmount() * proportion

            this.scene.physics.velocityFromRotation(
                this.rotation + (-90 * Math.PI) / 180,
                forceAmount,
                this.currentBall.body.velocity
            )
            this.currentBall.setInitialVelocity(
                this.currentBall.body.velocity.x,
                this.currentBall.body.velocity.y
            )

            Basket.eventEmitter.emit(
                'dragging',
                this.currentBall.parentContainer.parentContainer.x,
                this.currentBall.parentContainer.parentContainer.y,
                this.currentBall.body.velocity.x,
                this.currentBall.body.velocity.y,
                proportion
            )
            this.currentBall.body.setVelocity(0, 0)
        }
    }
    private bounceNet(
        maxScale: number,
        scaleFactor: number,
        currentDistance: number,
        speed = 1
    ): void {
        if (currentDistance >= 50) {
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
        this.turnOffTrajectoryPath()
        if (this.net.scaleY <= this.prevNetScaleY) {
            this.resetNet()
            return
        } else {
            if (this.currentBall) {
                let proportion =
                    (this.net.scaleY - this.prevNetScaleY) /
                    (0.6 - this.prevNetScaleY)
                if (proportion > 1) proportion = 1
                if (proportion < 0) proportion = 0
                let forceAmount = this.currentBall.getForceAmount() * proportion
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
                //this.currentBall.toggleLineEffect(true)
                this.currentBall = undefined
                this.canDrag = false
            }
            this.resetNet()
        }
        this.centerContainer.removeAll()
    }
    private turnOffTrajectoryPath(): void {
        Basket.eventEmitter.emit('turnofftrajectory')
    }

    private resetNet(): void {
        this.net.y = this.prevNetY
        this.net.scaleY = this.prevNetScaleY
        this.centerCollider.y = this.prevCenterColliderY
        this.centerContainer.y = this.prevCenterContainerY
        this.setUpPoint()
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
        this.netCollider.toggleCollision(!state)
    }
    public toggleBasket(state: boolean): void {
        this.x = 1000
        this.toggleAllColliders(state)
        this.toggleCenterCollider(state)
        this.rim2.setVisible(state)
        this.rim2.setActive(state)
        this.rotation = 0
        this.setVisible(state)
        this.setActive(state)
        this.centerContainer.removeAll()
        this.net.setScale(0.4)
        this.net.setPosition(0, 0)
        this.centerContainer.setPosition(0, -10)
        this.centerCollider.setPosition(0, 10)
        this.canBack = false
    }
    public setNewPosition(x: number, y: number): void {
        this.setPosition(x, y)
        this.rim2.setPosition(x, y)
        this.prevNetScaleY = this.net.scaleY
        this.minScaleTargetY = this.maxScaleTargetY = 0
        this.canBack = false
    }
    public isPerfectThrow(): boolean {
        const count = this.getPointAmount()

        return count == this.maxPoint
    }
    private getPointAmount(): number | undefined {
        let count = this.colliderPoints.get(this.topLeftCollider)
        const temp = this.colliderPoints.get(this.topRightCollider)
        if (count) {
            if (temp) {
                count += temp
            }
        }
        return count
    }
    protected setBasketXPosition(x: number): void {
        this.x += x
        this.rim2.x += x
    }
    protected setBasketYPosition(y: number): void {
        this.y += y
        this.rim2.y += y
    }
}
export default Basket
