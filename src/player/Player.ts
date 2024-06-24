import IImageConstructor from '../types/image'
class Player extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.Body

    // private drawer: Phaser.GameObjects.Graphics

    private horizontalBound: number

    //private forceAmount: number

    // public getBody(): Phaser.Physics.Arcade.Body{
    //     return this.body
    // }

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        //this.forceAmount = 100
        this.horizontalBound = 0.7
        this.initImage()
        this.initInput()
        this.initPhysic()

        this.scene.add.existing(this)
    }
    private initImage() {
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.setScale(0.5)
        //this.drawer = this.scene.add.graphics()
    }

    private initInput() {
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(100, 100, 100),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true,
        })
        this.scene.input.setDraggable(this)
        this.on('dragstart', this.handleDragStart, this)
        this.on('drag', this.handleDrag, this)
        this.on('dragend', this.handleDragEnd, this)
    }
    private initPhysic() {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = true
        this.body.setCircle(100)
        this.body.setCollideWorldBounds(true, this.horizontalBound, 0)
    }
    public update() {
        //this.debug()
    }
    private handleDragStart(pointer: Phaser.Input.Pointer): void {
        this.setPosition(pointer.x, pointer.y)
        this.body.allowGravity = false
    }
    private handleDrag(pointer: Phaser.Input.Pointer): void {
        this.setPosition(pointer.x, pointer.y)
        this.body.allowGravity = false
    }
    private handleDragEnd(): void {
        this.body.allowGravity = true
    }
    // private debug(): void {
    //     this.drawer.clear()
    //     this.drawer.fillStyle(0xe66a28, 1)
    //     this.drawer.lineStyle(2, 0xe4080a)
    //     this.drawer.strokeCircle(this.x, this.y, 50)
    //     this.drawer.setDepth(1)
    // }
}
export default Player
