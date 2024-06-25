import Ball from '../player/Ball'
import IContainerConstructor from '../types/container'
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

    private currentBall: Ball

    private maxAngle: number
    private currentAngle: number
    private line: Phaser.Geom.Line
    private graphics: Phaser.GameObjects.Graphics

    public getColliders(): Phaser.GameObjects.Group {
        return this.groupColliders
    }

    constructor(params: IContainerConstructor) {
        super(params.scene, params.x, params.y)
        this.maxAngle = 180
        this.groupColliders = new Phaser.GameObjects.Group(this.scene)
        this.groupColliders.runChildUpdate = true
        this.initChildren()
        this.initInput()
        this.setDepth(5)
        this.scene.add.existing(this)
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
        this.bringToTop(this.net)
        this.bringToTop(rim1)

        // this.scene.add.existing(this.net)
        // this.scene.add.existing(rim1)
        // this.scene.add.existing(rim2)
        this.add(this.net)
        this.add(rim1)
        //this.add(rim2)

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

    public updateRimPosition(): void {
        this.rim2.rotation += 0.01
        this.rotation += 0.01

        console.log(this.rotation)
    }
    public addBall(ball: Ball): void {
        this.centerContainer.add(ball)
        ball.setPosition(0, 0)
        ball.toggleStickMode(true)
        this.currentBall = ball
        this.centerContainer.sendToBack(this.currentBall)
        this.toggleAllColliders(false)
    }
    public removeBalls(): void {
        this.centerContainer.removeAll()
    }

    private handleDragStart(): void {
        this.prevNetY = this.net.y
        this.prevNetScaleY = this.net.scaleY
        this.prevCenterColliderY = this.centerCollider.y
        this.prevCenterContainerY = this.centerContainer.y
    }
    private handleDrag(pointer: Phaser.Input.Pointer): void {
        // // handle rotation
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
        this.currentAngle = angle
    }
    public bounceNet(
        maxScale: number,
        scaleFactor: number,
        maxHeight: number
    ): void {
        if (this.y < maxHeight) {
            if (this.net.scaleY < maxScale) {
                this.net.scaleY += scaleFactor * 0.03
                this.net.y += scaleFactor * 1.7
                this.centerCollider.y += scaleFactor * 1.7
                this.centerContainer.y += scaleFactor * 3.2
            }
        } else {
            if (this.net.scaleY > this.prevNetScaleY) {
                this.net.scaleY -= scaleFactor * 0.03
                this.net.y -= scaleFactor * 1.7
                this.centerCollider.y -= scaleFactor * 1.7
                this.centerContainer.y -= scaleFactor * 3.2
            }
        }
    }
    private handleDragEnd(): void {
        this.net.y = this.prevNetY
        this.net.scaleY = this.prevNetScaleY
        this.centerCollider.y = this.prevCenterColliderY
        this.centerContainer.y = this.prevCenterContainerY

        this.centerContainer.removeAll()
        if (this.currentBall) {
            this.currentBall.setPosition(
                this.x + this.centerContainer.x,
                this.y + this.centerContainer.y
            )

            this.currentBall.toggleStickMode(false)
            // const directionX = Math.tan(this.angle) * 1000
            // console.log(directionX)
            // this.currentBall.body.setVelocity(directionX, -500)
            //console.log(this.currentAngle)
            this.scene.physics.velocityFromRotation(
                this.currentAngle + (-90 * Math.PI) / 180,
                600,
                this.currentBall.body.velocity
            )
        }
        //console.log(this.angle)
    }
    private toggleAllColliders(state: boolean): void {
        for (
            let i = 0;
            i < this.groupColliders.children.getArray().length;
            i++
        ) {
            const collider = this.groupColliders.children.getArray()[i]
            if (collider instanceof EmptyColliderGameObject) {
                collider.toggleCollision(state)
            }
        }
    }
}
export default Basket
