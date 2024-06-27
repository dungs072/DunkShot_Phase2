import { Scene } from 'phaser'

class LoadingScene extends Scene {
    constructor() {
        super({
            key: 'LoadingScene',
        })
    }
    preload() {
        this.load.image('bg', 'assets/bgs/bg4.png')
        this.load.image('bgbricks', 'assets/bgs/bgWithBricks.png')
        this.load.image('ball', 'assets/balls/babyface.png')
        this.load.image('basketball', 'assets/balls/basketball.png')
        this.load.image('rim01', 'assets/baskets/rim01.png')
        this.load.image('rim02', 'assets/baskets/rim02.png')
        this.load.image('net01', 'assets/baskets/net01.png')

        // UI
        this.load.image('dunkshot', 'assets/ui/menu/dunkShot.png')
        this.load.image('finger', 'assets/ui/menu/finger.png')

        this.load.image('playagain', 'assets/ui/over/playAgainButton.png')

        // Animations
        this.load.spritesheet('explosion', 'assets/effects/explosion4.png', {
            frameWidth: 128,
            frameHeight: 80,
        })
    }

    create() {
        this.scene.start('MainGameScene')
    }
}
export default LoadingScene
