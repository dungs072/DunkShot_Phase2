import { Scene } from 'phaser'
import CONST from '../const/const'

class ScoreScene extends Scene {
    private scoreText: Phaser.GameObjects.Text
    constructor() {
        super({
            key: 'ScoreScene',
        })
    }
    create() {
        this.resize()
        window.addEventListener('resize', () => {
            this.resize()
        })
        this.scoreText = new Phaser.GameObjects.Text(
            this,
            CONST.WIDTH_SIZE * 0.5,
            CONST.HEIGHT_SIZE * 0.4,
            '0',
            {
                fontFamily: 'Arial',
                color: '#BBB6B5',
                fontSize: 100,
                fontStyle: 'bold',
            }
        ).setOrigin(0.5)
        this.add.existing(this.scoreText)
    }
    private resize(): void {
        const worldHeight = 846
        const worldWidth = (worldHeight / 846) * 475.875

        let width = window.innerWidth
        let height = window.innerHeight

        const ratio = 475.875 / 846
        if (width / ratio > window.innerHeight) {
            width = height * ratio
        } else {
            height = width / ratio
        }

        this.game.scale.resize(width, height)

        this.game.scene.getScenes().forEach((scene) => {
            scene.cameras.main.setZoom(width / worldWidth)
            scene.cameras.main.centerOn(worldWidth / 2, worldHeight / 2)
        })
        this.cameras.main.setZoom(width / worldWidth)
        this.cameras.main.centerOn(worldWidth / 2, worldHeight / 2)
    }
    public setScoreText(text: string): void {
        this.scoreText.text = text
    }
}
export default ScoreScene
