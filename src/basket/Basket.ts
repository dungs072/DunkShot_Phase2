import IContainerConstructor from '../types/container'

class Basket extends Phaser.GameObjects.Container {
    private prevNetY: number
    private prevNetScaleY: number
    private net: Phaser.GameObjects.Sprite

    private maxAngle: number

    constructor(params: IContainerConstructor) {
        super(params.scene, params.x, params.y)
        this.maxAngle = 45
        this.initChildren()
        this.initInput()

        this.scene.add.existing(this)
    }
    private initChildren() {
        this.net = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'net01')
            .setScale(0.3)
            .setDepth(2)
        const rim1 = new Phaser.GameObjects.Sprite(this.scene, 0, -25, 'rim01')
            .setScale(0.3)
            .setDepth(2)
        const rim2 = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            -40,
            'rim02'
        ).setScale(0.3)
        rim2.setDepth(0)
        this.add(this.net)
        this.add(rim1)
        this.add(rim2)
    }
    private initInput() {
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
    private handleDragStart(): void {
        this.prevNetY = this.net.y
        this.prevNetScaleY = this.net.scaleY
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
            }
        } else {
            if (this.net.scaleY > this.prevNetScaleY) {
                this.net.scaleY -= scaleFactor * 0.03
                this.net.y -= scaleFactor * 1.7
            }
        }
    }
    private handleDragEnd(): void {
        this.net.y = this.prevNetY
        this.net.scaleY = this.prevNetScaleY
    }
}
export default Basket
