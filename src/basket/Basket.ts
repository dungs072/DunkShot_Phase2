import IImageConstructor from '../types/image'
import Net from './Net'

class Basket extends Phaser.GameObjects.Sprite {
    private rim: Phaser.GameObjects.Image
    private leftNet: Net
    private rightNet: Net
    private centerNet: Net
    private nets: Phaser.GameObjects.Group
    private prevY: number

    public getNets(): Phaser.GameObjects.Group {
        return this.nets
    }

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        this.initImage()
        this.initInput()

        this.scene.add.existing(this)
    }
    private initImage() {
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.setScale(0.55, 0.8)

        this.rim = this.scene.add.image(this.x, this.y - 50, 'rim01')
        this.rim.setOrigin(0.5, 0.5)
        this.rim.setScale(0.5, 0.7)
        this.rim.setDepth(2)

        this.nets = this.scene.add.group({
            active: true,
            maxSize: 3,
            runChildUpdate: true,
        })
        this.leftNet = new Net(this.scene, this.x - 65, this.y)
        this.rightNet = new Net(this.scene, this.x + 65, this.y)
        this.centerNet = new Net(this.scene, this.x, this.y + 50)
        this.centerNet.setColliderSize(75, 20)
        this.nets.add(this.leftNet)
        this.nets.add(this.rightNet)
        this.nets.add(this.centerNet)
    }
    private initInput() {
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(175, 125, 100),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true,
        })
        this.scene.input.setDraggable(this)
        this.on('dragstart', this.handleDragStart, this)
        this.on('drag', this.handleDrag, this)
        this.on('dragend', this.handleDragEnd, this)
    }
    private handleDragStart(): void {
        this.prevY = this.y
    }
    private handleDrag(pointer: Phaser.Input.Pointer): void {
        // // handle rotation
        // const angle = Phaser.Math.Angle.Between(
        //     this.x,
        //     this.y,
        //     pointer.x,
        //     pointer.y
        // )

        // this.rotation = angle
        // const newX = this.x + 5 * Math.cos(angle)
        // const newY = this.y + 5 * Math.sin(angle)
        // this.rim.setPosition(newX, newY)
        // this.rim.rotation = angle
        //this.rim.setPosition()

        // handle stretch
        let scaleFactor = pointer.getDistance() / 100
        if (pointer.y < this.prevY) {
            scaleFactor *= -1
            if (this.scaleY > 0.8) {
                this.setScale(this.scaleX, this.scaleY + scaleFactor * 0.02)

                if (this.y > this.prevY) {
                    console.log(scaleFactor)
                    this.y += scaleFactor * 1

                    this.centerNet.decreaseYCollider(scaleFactor * 2)
                    this.leftNet.decreaseYCollider(scaleFactor * 2, -0.1)
                    this.rightNet.decreaseYCollider(scaleFactor * 2, 0.1)
                }
            }
        } else {
            if (this.scaleY >= 0.7 && this.scaleY < 1.2) {
                this.setScale(this.scaleX, this.scaleY + scaleFactor * 0.01)

                if (this.y < this.prevY + 30) {
                    this.y += scaleFactor - 0.3
                    this.centerNet.decreaseYCollider(scaleFactor)
                    this.leftNet.decreaseYCollider(scaleFactor, 0.1)
                    this.rightNet.decreaseYCollider(scaleFactor, -0.1)
                }
            }
        }
    }
    private handleDragEnd(): void {
        if (this.y > this.prevY) {
        }
        this.setScale(this.scaleX, 0.7)
        this.y = this.prevY
        this.centerNet.reset()
        this.leftNet.reset()
        this.rightNet.reset()
        // this.rim.setPosition(this.x, this.y - 50)
        // this.rotation = 0
        // this.rim.rotation = 0
    }
}
export default Basket
