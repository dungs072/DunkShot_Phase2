import { Scene } from 'phaser'
import CONST from '../Const'

class LoadingScene extends Scene {
    constructor() {
        super({
            key: 'LoadingScene',
        })
    }
    preload() {
        // this.load.image('loadingbg', 'assets/bgs/bg4.png')
        // this.add.image(0, 0, 'loadingbg')

        let loadingBarBg = this.add.graphics()
        loadingBarBg.fillStyle(0x222222, 1)
        loadingBarBg.fillRect(
            CONST.WIDTH_SIZE / 3.6,
            CONST.HEIGHT_SIZE / 1.4,
            320,
            50
        )

        let loadingBarFill = this.add.graphics()

        this.load.on('progress', (value: number) => {
            loadingBarFill.clear()
            loadingBarFill.fillStyle(0xffffff, 1)
            loadingBarFill.fillRect(
                CONST.WIDTH_SIZE / 3.6 + 10,
                CONST.HEIGHT_SIZE / 1.4 + 10,
                300 * value,
                30
            )
        })

        // assets
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

        this.load.image('setting', 'assets/ui/setting.png')

        // Animations
        this.load.spritesheet('explosions', 'assets/effects/explosion4.png', {
            frameWidth: 128,
            frameHeight: 80,
        })

        // json file

        this.load.json('timeChallenge', 'assets/data/timeChallenge.json')

        this.add
            .text(
                CONST.WIDTH_SIZE / 2 + 10,
                CONST.HEIGHT_SIZE / 1.25,
                'Loading...',
                {
                    fontSize: '20px',
                    color: '#ffffff',
                }
            )
            .setOrigin(0.5, 0.5)

        // sounds
        this.load.audio('hit', 'assets/sounds/hit.mp3')
        this.load.audio('boom', 'assets/sounds/boom.mp3')
        this.load.audio('press', 'assets/sounds/press.mp3')
    }

    create() {
        this.scene.start('MainGameScene')
    }
}
export default LoadingScene
