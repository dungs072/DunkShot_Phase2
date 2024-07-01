import { Scene } from 'phaser'

class Level {
    private basketTileObjs: Phaser.Types.Tilemaps.TiledObject[] | undefined
    private obstacleTileObjs: Phaser.Types.Tilemaps.TiledObject[] | undefined
    private scene: Scene
    private currentBasketIndex: number
    private maxBasketHeight: number
    private maxBasketWidth: number
    constructor(scene: Scene, levelName: string) {
        this.currentBasketIndex = 0
        this.scene = scene
        this.initTileMap(levelName)
    }
    private initTileMap(levelName: string): void {
        const map = this.scene.add.tilemap(levelName)

        this.basketTileObjs = map.getObjectLayer('BasketLayer')?.objects
        this.basketTileObjs?.reverse()
        this.obstacleTileObjs = map.getObjectLayer('ObstacleLayer')?.objects
        this.obstacleTileObjs?.reverse()
        if (this.basketTileObjs) {
            if (this.basketTileObjs.length > 0) {
                const value = this.basketTileObjs[0].y
                const value2 = this.basketTileObjs[0].x
                if (value) {
                    this.maxBasketHeight = value
                }
                if (value2) {
                    this.maxBasketWidth = value2
                }
            }
        }
    }
    public isFinishCurrentLevel(): boolean {
        return this.currentBasketIndex == this.basketTileObjs?.length
    }
    public getBasketPosX(): number {
        if (!this.basketTileObjs) return -1
        const temp = this.basketTileObjs
        const value = temp[this.currentBasketIndex].x
        if (!value) return -1
        return this.maxBasketWidth - value
    }
    public getBasketPosY(): number {
        if (!this.basketTileObjs) return -1
        const temp = this.basketTileObjs
        const value = temp[this.currentBasketIndex].y
        if (!value) return -1
        return this.maxBasketHeight - value
    }
    public getObstacles(): Phaser.Types.Tilemaps.TiledObject[] | undefined {
        return this.obstacleTileObjs
    }
    public gotoNextBasket(): void {
        this.currentBasketIndex++
    }
}
export default Level
