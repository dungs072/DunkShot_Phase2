class Button extends Phaser.GameObjects.Container {
    private text: Phaser.GameObjects.Text
    private background: Phaser.GameObjects.Image
    private minScalePlayAgainButton: number
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        callback: Function,
        text: string = '',
        sizeX: number = 100,
        sizeY: number = 100,
        textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontSize: 45,
            fontStyle: 'bold',
        }
    ) {
        super(scene, x, y)
        this.minScalePlayAgainButton = 0.15
        this.background = new Phaser.GameObjects.Sprite(
            this.scene,
            0,
            0,
            texture
        ).setOrigin(0.5, 0.5)
        this.setSize(sizeX, sizeY)
        this.setInteractive({
            useHandCursor: true,
        })

        this.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this,
                scaleX: this.minScalePlayAgainButton,
                scaleY: this.minScalePlayAgainButton,
                duration: 50,
                ease: 'Sine.easeInOut',
                yoyo: true,
                onComplete: () => {
                    callback()
                },
            })
        })

        this.on('pointerup', () => {
            this.background.clearTint()
        })

        this.on('pointerout', () => {
            this.background.clearTint()
        })

        this.add(this.background)
        this.text = scene.add.text(0, 0, text, textStyle).setOrigin(0.5)
        this.add(this.text)
        scene.add.existing(this)
    }
    public setTextPosition(x: number, y: number): void {
        this.text.setPosition(x, y)
    }
}
export default Button
