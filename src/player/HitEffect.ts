import { Scene } from 'phaser'

class HitEffect extends Phaser.GameObjects.Container {
    private centerHit: Phaser.GameObjects.Image
    private upHit: Phaser.GameObjects.Image
    private downHit: Phaser.GameObjects.Image
    private isRight = false
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.initImages()
    }
    private initImages(): void {
        this.centerHit = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'hitcenter'
        )
        this.upHit = new Phaser.GameObjects.Image(this.scene, 0, 0, 'hitupleft')
        this.downHit = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'hitdownleft'
        )

        this.add(this.centerHit)
        this.add(this.upHit)
        this.add(this.downHit)
        this.scene.add.existing(this)
    }
    public triggerEffect(): void {
        this.setOrigins(1, 0.5)
        const targetScaleX = 0.5
        let targetX
        if (this.isRight) {
            targetX = this.x + 20
        } else {
            targetX = this.x - 20
        }

        this.scene.tweens.add({
            targets: this,
            scaleX: targetScaleX,
            x: targetX,
            alpha: 0.1,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                this.setVisible(false)
                this.setActive(false)
                this.scaleX = 1
                this.alpha = 1
            },
        })
    }
    private setOrigins(x: number, y: number): void {
        this.centerHit.setOrigin(x, y)
        this.upHit.setOrigin(x, y)
        this.downHit.setOrigin(x, y)
    }
    public rotateToRight(): void {
        this.setAngle(180)
        this.isRight = true
    }
    public rotateToLeft(): void {
        this.setAngle(0)
        this.isRight = false
    }
}
export default HitEffect
