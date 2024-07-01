import { Scene } from 'phaser'
import CONST from '../Const'

class Level {
    private basketTileObjs: Phaser.GameObjects.Sprite[]
    private obstacleTileObjs: Phaser.GameObjects.Sprite[]
    private scene: Scene
    private currentBasketIndex: number
    constructor(scene: Scene, levelName: string) {
        this.currentBasketIndex = 0
        this.scene = scene
        this.initTileMap(levelName)
    }
    private initTileMap(levelName: string): void {
        const map = this.scene.add.tilemap(levelName)

        const baskets = map.createFromObjects('BasketLayer', {
            name: 'basket',
            classType: Phaser.GameObjects.Sprite,
        })
        const movableBaskets = map.createFromObjects('BasketLayer', {
            name: 'movableBasket',
            classType: Phaser.GameObjects.Sprite,
        }) as Phaser.GameObjects.Sprite[]
        this.basketTileObjs = baskets as Phaser.GameObjects.Sprite[]

        const obstacles = map.createFromObjects('ObstacleLayer', {
            name: 'obstacle',
            classType: Phaser.GameObjects.Sprite,
        })
        const movableObstacles = map.createFromObjects('ObstacleLayer', {
            name: 'movableObstacle',
            classType: Phaser.GameObjects.Sprite,
        }) as Phaser.GameObjects.Sprite[]
        this.obstacleTileObjs = obstacles as Phaser.GameObjects.Sprite[]
        movableObstacles.forEach((a) => {
            a.width = 10
            this.obstacleTileObjs.push(a)
        })
        movableBaskets.forEach((a) => {
            a.width = 10
            this.basketTileObjs.push(a)
        })
        this.basketTileObjs.sort((a, b) => a.y - b.y)

        this.obstacleTileObjs.sort((a, b) => a.y - b.y)
        this.basketTileObjs.forEach((basket) => {
            basket.setVisible(false)
            console.log(basket.x, basket.y)
        })

        this.obstacleTileObjs.forEach((obstacle) => {
            obstacle.y = CONST.HEIGHT_SIZE - obstacle.y * devicePixelRatio
            obstacle.x = obstacle.x * devicePixelRatio - CONST.WIDTH_SIZE / 6.5
            obstacle.setVisible(false)
        })
    }
    public isFinishCurrentLevel(): boolean {
        return this.currentBasketIndex == this.basketTileObjs?.length
    }
    public getBasketPosX(): number {
        let value =
            this.basketTileObjs[this.currentBasketIndex].x * devicePixelRatio
        value -= CONST.WIDTH_SIZE / 6.5

        return value
    }
    public getBasketPosY(): number {
        let value =
            this.basketTileObjs[this.currentBasketIndex].y * devicePixelRatio
        value = CONST.HEIGHT_SIZE - value
        return value
    }
    public getIsMovable(): boolean {
        return this.basketTileObjs[this.currentBasketIndex].width == 10
    }
    public getIsVertical(): boolean {
        return this.basketTileObjs[this.currentBasketIndex].angle != 90
    }
    public getObstacles(): Phaser.GameObjects.Sprite[] {
        return this.obstacleTileObjs
    }
    public gotoNextBasket(): void {
        this.currentBasketIndex++
    }
    public resetLevel(): void {
        this.obstacleTileObjs.forEach((obstacle) => {
            obstacle.setActive(true)
        })
        this.currentBasketIndex = 0
    }
}
export default Level
