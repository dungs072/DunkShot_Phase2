import { Scene } from 'phaser'
import CONST from '../const/const'

class LoadingScene extends Scene {
    constructor() {
        super({
            key: 'LoadingScene',
        })
    }
    init() {
        this.resize()
        window.addEventListener('resize', () => {
            this.resize()
        })
    }
    preload() {
        // this.load.image('loadingbg', 'assets/bgs/bg4.png')
        this.add
            .image(CONST.WIDTH_SIZE / 2, CONST.HEIGHT_SIZE / 2, 'prebg')
            .setOrigin(0.5, 0.5)
        this.add
            .image(CONST.WIDTH_SIZE / 2, CONST.HEIGHT_SIZE / 2, 'logo')
            .setOrigin(0.5, 0.5)
            .setScale(0.5)

        let loadingBarBg = this.add.graphics()
        loadingBarBg.fillStyle(0x222222, 1)
        loadingBarBg.fillRect(
            CONST.WIDTH_SIZE * 0.16,
            CONST.HEIGHT_SIZE / 1.4,
            320,
            50
        )

        let loadingBarFill = this.add.graphics()

        this.load.on('progress', (value: number) => {
            loadingBarFill.clear()
            loadingBarFill.fillStyle(0xffffff, 1)
            loadingBarFill.fillRect(
                CONST.WIDTH_SIZE * 0.15 + 10,
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
        this.load.image('dot', 'assets/balls/dot.png')

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

        this.load.image('closeButton', 'assets/ui/pause/closeButton.png')
        this.load.image('blueButton', 'assets/ui/buttons/blueButton.png')
        this.load.image('greyButton', 'assets/ui/buttons/greyButton.png')
        this.load.image('pausePanel', 'assets/ui/pause/pausePanel.png')

        this.load.image('orangePanel', 'assets/ui/panels/orangePanel.png')
        this.load.image('bluePanel', 'assets/ui/panels/bluePanel.png')
        this.load.image('pauseButton', 'assets/ui/buttons/pauseButton.png')

        // Animations
        this.load.spritesheet('explosions', 'assets/effects/explosion4.png', {
            frameWidth: 128,
            frameHeight: 80,
        })

        // json file

        this.load.json('timeChallenge', 'assets/data/time/timeChallenge.json')

        this.load.tilemapTiledJSON('level1', 'assets/data/time/level1.json')
        this.load.tilemapTiledJSON('level2', 'assets/data/time/level2.json')
        this.load.tilemapTiledJSON('level3', 'assets/data/time/level3.json')
        this.add
            .text(
                CONST.WIDTH_SIZE / 2 + 10,
                CONST.HEIGHT_SIZE / 1.25,
                'Loading...',
                {
                    fontSize: '20px',
                    color: '#000000',
                }
            )
            .setOrigin(0.5, 0.5)

        // effects
        this.load.image('hitcenter', 'assets/effects/hit/hitCenterLeft.png')
        this.load.image('hitdownleft', 'assets/effects/hit/hitDownLeft.png')
        this.load.image('hitupleft', 'assets/effects/hit/hitUpLeft.png')

        this.load.atlas(
            'flares',
            'assets/effects/flare/flares.png',
            'assets/effects/flare/flares.json'
        )

        // sounds
        this.load.audio('hit', 'assets/sounds/hit.mp3')
        this.load.audio('boom', 'assets/sounds/boom.mp3')
        this.load.audio('press', 'assets/sounds/press.mp3')
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

    create() {
        this.scene.launch('BackgroundScene')
        this.scene.launch('UIScene')
        this.scene.launch('MainGameScene')
        this.scene.bringToTop('UIScene')
    }
}
export default LoadingScene
