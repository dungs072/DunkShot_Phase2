import { Scene } from 'phaser'

class MainMenuUI extends Phaser.GameObjects.Container {
    private titleGame: Phaser.GameObjects.Image
    private dragIt: Phaser.GameObjects.Image
    private stateMenu: boolean
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.initUI()
        this.setDepth(20)
        this.scene.add.existing(this)
        this.stateMenu = true
        this.scene.tweens.add({
            targets: this.dragIt,
            alpha: { from: 1, to: 0.5 },
            ease: 'Sine.InOut',
            duration: 500,
            repeat: -1,
            yoyo: true,
        })
    }
    private initUI(): void {
        this.titleGame = new Phaser.GameObjects.Image(
            this.scene,
            innerWidth / 4,
            innerHeight / 6,
            'dunkshot'
        ).setScale(0.25)
        this.dragIt = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            'finger'
        ).setScale(0.25)
        this.dragIt.rotation = 20 * (Math.PI / 180)
        this.add(this.titleGame)
        this.add(this.dragIt)
    }
    public setFingerPosition(x: number, y: number): void {
        this.dragIt.setPosition(x, y)
    }
    public toggleMenu(state: boolean): void {
        this.stateMenu = state
        if (!state) {
            // Fade out
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0 },
                duration: 500,
                ease: 'Linear',
            })
        } else {
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 0, to: 1 },
                duration: 500,
                ease: 'Linear',
            })
        }
    }
    public getStateMenu(): boolean {
        return this.stateMenu
    }
}
export default MainMenuUI
