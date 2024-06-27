import { Scene } from 'phaser'

class Button extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        texture: string,
        callback: Function
    ) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.setInteractive({ useHandCursor: true })

        this.on('pointerdown', () => {
            callback()
        })

        this.on('pointerup', () => {
            this.clearTint()
        })

        this.on('pointerout', () => {
            this.clearTint()
        })
    }
}
export default Button
