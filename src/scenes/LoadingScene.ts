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

        // Obstacles
        this.load.image('obstacle', 'assets/obstacles/obstacle.png')
        // UI
        this.load.image('dunkshot', 'assets/ui/menu/dunkShot.png')
        this.load.image('finger', 'assets/ui/menu/finger.png')
        this.load.image('challenge', 'assets/ui/menu/challenge.png')
        this.load.image('ballchallenge', 'assets/ui/menu/ballChallenge.png')

        this.load.image('challengePanel', 'assets/ui/menu/challengePanel.png')
        this.load.image('buttonbg', 'assets/ui/menu/button.png')

        this.load.image('playagain', 'assets/ui/over/playAgainButton.png')

        // Animations
        this.load.spritesheet('explosion', 'assets/effects/explosion4.png', {
            frameWidth: 128,
            frameHeight: 80,
        })

        // json file

        this.load.json('timeChallenge', 'assets/data/timeChallenge.json')
    }

    create() {
        this.scene.start('MainGameScene')
    }
}
export default LoadingScene
