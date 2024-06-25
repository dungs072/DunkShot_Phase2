import IImageConstructor from '../types/image'
class Ball extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body

    private horizontalBound: number

    private forceAmount: number

    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame)
        this.forceAmount = 750
        this.horizontalBound = 0.7
        this.initImage()
        this.initInput()
        this.initPhysic()

        this.scene.add.existing(this)
    }
    private initImage() {
        this.setOrigin(0.5, 0.5)
        this.setDepth(6)
        this.setScale(0.25)
        //this.drawer = this.scene.add.graphics()
    }

    private initInput() {
        // this.setInteractive({
        //     hitArea: new Phaser.Geom.Circle(100, 100, 100),
        //     hitAreaCallback: Phaser.Geom.Circle.Contains,
        //     useHandCursor: true,
        // })
        // this.scene.input.setDraggable(this)
        // this.on('dragstart', this.handleDragStart, this)
        // this.on('drag', this.handleDrag, this)
        // this.on('dragend', this.handleDragEnd, this)
    }
    private initPhysic() {
        this.scene.physics.world.enable(this)
        this.body.allowGravity = true
        this.body.setCircle(100)
        this.body.setBounce(0.5)
        this.body.setFriction(0, 0)
    }
    public update() {}
    // private handleDragStart(pointer: Phaser.Input.Pointer): void {
    //     this.setPosition(pointer.x, pointer.y)
    //     this.body.allowGravity = false
    //     if (this.parentContainer) {
    //         this.parentContainer.remove(this)
    //     }
    // }
    // private handleDrag(pointer: Phaser.Input.Pointer): void {
    //     this.setPosition(pointer.x, pointer.y)
    //     this.body.allowGravity = false
    // }
    // private handleDragEnd(): void {
    //     this.body.allowGravity = true
    // }
    public toggleStickMode(state: boolean): void {
        this.body.allowGravity = !state
        this.body.immovable = state
        if (state) {
            this.body.setVelocity(0, 0)
        }
    }
    public getForceAmount(): number {
        return this.forceAmount
    }
    public setForceAmount(amount: number): void {
        this.forceAmount = amount
    }
    // private debug(): void {
    //     this.drawer.clear()
    //     this.drawer.fillStyle(0xe66a28, 1)
    //     this.drawer.lineStyle(2, 0xe4080a)
    //     this.drawer.strokeCircle(this.x, this.y, 50)
    //     this.drawer.setDepth(1)
    // }
}
export default Ball
