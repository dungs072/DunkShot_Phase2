import { Scene } from 'phaser'
class BoostScene extends Scene {
    constructor() {
        super({
            key: 'BoostScene',
        })
    }
    init() {}
    preload() {
        // initialize background
        this.load.image('prebg', 'assets/bgs/bg2.png')
        this.load.image('logo', 'assets/logo1.png')
    }
    create() {
        this.scene.start('LoadingScene')
    }
}
export default BoostScene
