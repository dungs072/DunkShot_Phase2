import { Scene } from 'phaser'

class EmptyColliderGameObject extends Phaser.Physics.Arcade.Image {
    declare body: Phaser.Physics.Arcade.Body
    private isCenter: boolean
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, '')
        this.setVisible(false)
        this.scene.physics.world.enable(this)
        this.body.allowGravity = false
        this.body.setImmovable(true)
    }
    public setColliderSize(x: number, y: number): void {
        this.body.setSize(x, y)
    }
    public createCircleCollider(x: number, y: number, radius: number): void {
        this.body.setCircle(x, y, radius)
    }
    public setIsCenter(state: boolean): void {
        this.isCenter = state
    }
    public getIsCenter(): boolean {
        return this.isCenter
    }
    public toggleCollision(state: boolean): void {
        if (state) {
            this.scene.physics.world.enable(this)
        } else {
            this.scene.physics.world.disable(this)
        }
    }
}
export default EmptyColliderGameObject
