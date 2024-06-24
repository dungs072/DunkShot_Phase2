import IImageConstructor from '../types/image'

class Basket extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.StaticBody

    private rim: Phaser.GameObjects.Image
    private leftSide: Phaser.GameObjects.Graphics
    private rightSide: Phaser.GameObjects.Graphics
    // private drawer: Phaser.GameObjects.Graphics

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        this.initImage()
        this.initInput()
        this.initPhysic()

        this.scene.add.existing(this)
    }
    private initImage() {
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.setScale(0.55, 0.8)

        this.rim = this.scene.add.image(this.x, this.y, 'rim01')
        this.rim.setOrigin(0.5, 1.4)
        this.rim.setScale(0.5, 0.7)
        this.rim.setDepth(2)

        this.leftSide = new Phaser.GameObjects.Graphics(this.scene)
        this.rightSide = new Phaser.GameObjects.Graphics(this.scene)
    }
    private initInput() {
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(175, 125, 150),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true,
        })
        this.scene.input.setDraggable(this)
        this.on('dragstart', this.handleDragStart, this)
        this.on('drag', this.handleDrag, this)
        this.on('dragend', this.handleDragEnd, this)
    }
    private initPhysic() {
        this.scene.physics.add.staticGroup(this)
        this.scene.physics.add.staticGroup(this.leftSide)
        this.scene.physics.add.staticGroup(this.rightSide)
        this.body.y = this.y - 10
        this.body.setSize(100, 20)
    }
    private handleDragStart(pointer: Phaser.Input.Pointer): void {}
    private handleDrag(pointer: Phaser.Input.Pointer): void {}
    private handleDragEnd(): void {}
}
export default Basket
