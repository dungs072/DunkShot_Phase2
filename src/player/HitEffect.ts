import { Scene } from 'phaser'

class HitEffect extends Phaser.GameObjects.Container {
    private centerHit: Phaser.GameObjects.Image
    // private upHit: Phaser.GameObjects.Image
    // private downHit: Phaser.GameObjects.Image
    private isRight = false
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.initImages()
        this.setScale(0.5)
    }
    private initImages(): void {
        this.centerHit = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'hitcenter'
        )
        //this.centerHit.scaleX = 0.5
        // this.upHit = new Phaser.GameObjects.Image(
        //     this.scene,
        //     0,
        //     -110,
        //     'hitupleft'
        // ).setScale(1)
        // this.downHit = new Phaser.GameObjects.Image(
        //     this.scene,
        //     0,
        //     125,
        //     'hitdownleft'
        // ).setScale(1)

        this.add(this.centerHit)
        // this.add(this.upHit)
        // this.add(this.downHit)
        this.scene.add.existing(this)
    }
    public triggerEffect(): void {
        this.setOrigins(1, 0.5)
        const targetScale = 0.15
        let targetX
        if (this.isRight) {
            targetX = this.x + 50
        } else {
            targetX = this.x - 50
        }

        this.scene.tweens.add({
            targets: this,
            scaleX: targetScale,
            scaleY: targetScale,
            x: targetX,
            alpha: 0.2,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.setVisible(false)
                this.setActive(false)
                this.scaleX = 0.5
                this.scaleY = 0.5
                this.alpha = 1
            },
        })
    }
    private setOrigins(x: number, y: number): void {
        this.centerHit.setOrigin(x, y)
        // this.upHit.setOrigin(x, y)
        // this.downHit.setOrigin(x, y)
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
