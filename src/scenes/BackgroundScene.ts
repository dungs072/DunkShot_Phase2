import { Scene } from 'phaser'
import CONST from '../const/const'

class BackgroundScene extends Scene {
    constructor() {
        super({
            key: 'BackgroundScene',
        })
    }
    create() {
        this.add.image(0, 0, 'bg').setOrigin(0)
        const bricks = this.add.image(0, 0, 'bgbricks').setOrigin(0)
        bricks.setDisplaySize(CONST.WIDTH_SIZE, CONST.HEIGHT_SIZE)
    }
}
export default BackgroundScene
