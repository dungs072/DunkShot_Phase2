class HandlerScene extends Phaser.Scene {
    // Vars
    private sceneRunning: string | null = null

    constructor() {
        super('handler')
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFF')
        this.launchScene('BoostScene')
    }

    launchScene(scene: string, data?: any) {
        this.scene.start(scene, data)
        this.sceneRunning = scene
    }

    updateResize(scene: Phaser.Scene) {
        scene.scale.on('resize', this.resize, scene)

        const scaleWidth = scene.scale.gameSize.width
        const scaleHeight = scene.scale.gameSize.height

        ;(scene as any).parent = new Phaser.Structs.Size(
            scaleWidth,
            scaleHeight
        )
        ;(scene as any).sizer = new Phaser.Structs.Size(
            scene.scale.width,
            scene.scale.height,
            Phaser.Structs.Size.FIT,
            (scene as any).parent
        )

        ;(scene as any).parent.setSize(scaleWidth, scaleHeight)
        ;(scene as any).sizer.setSize(scaleWidth, scaleHeight)

        this.updateCamera(scene)
    }

    resize(gameSize: Phaser.Structs.Size) {
        if (!(this as any).sceneStopped) {
            const width = gameSize.width
            const height = gameSize.height

            ;(this as any).parent.setSize(width, height)
            ;(this as any).sizer.setSize(width, height)

            const camera = this.cameras.main
            const scaleX =
                (this as any).sizer.width / this.game.scale.baseSize.width
            const scaleY =
                (this as any).sizer.height / this.game.scale.baseSize.height

            camera.setZoom(Math.max(scaleX, scaleY))
            camera.centerOn(
                this.game.scale.baseSize.width / 2,
                this.game.scale.baseSize.height / 2
            )
        }
    }

    updateCamera(scene: Phaser.Scene) {
        const camera = scene.cameras.main
        const scaleX =
            (scene as any).sizer.width / this.game.scale.baseSize.width
        const scaleY =
            (scene as any).sizer.height / this.game.scale.baseSize.height

        camera.setZoom(Math.max(scaleX, scaleY))
        camera.centerOn(
            this.game.scale.baseSize.width / 2,
            this.game.scale.baseSize.height / 2
        )
    }
}
export default HandlerScene
