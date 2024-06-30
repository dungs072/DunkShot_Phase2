import { Scene } from 'phaser'
import Obstacle from './Obstacle'
import Ball from '../player/Ball'
import MovableObstacle from './MovableObstacle'
import LevelManager from '../level/LevelManager'
import CONST from '../Const'

class ObstacleManager {
    private obstacles: Obstacle[]
    private ball: Ball
    private scene: Scene
    private levelManager: LevelManager
    constructor(scene: Scene, ball: Ball, levelManager: LevelManager) {
        this.obstacles = []
        this.scene = scene
        this.ball = ball
        this.levelManager = levelManager
    }

    public createObstacleByLevel(): void {
        const obstacleDatas = this.levelManager.getCurrentObstacles()
        console.log(obstacleDatas)
        if (!obstacleDatas) return
        obstacleDatas.forEach((obstacleData) => {
            this.spawnObstacle(
                obstacleData.position.posX * devicePixelRatio +
                    CONST.WIDTH_SIZE / 2,
                obstacleData.position.posY * devicePixelRatio +
                    this.scene.cameras.main.scrollY
            )
        })
    }

    public spawnObstacle(x: number, y: number): Obstacle {
        for (let i = 0; i < this.obstacles.length; i++) {
            if (!this.obstacles[i].active) {
                this.obstacles[i].setPosition(x, y)
                this.obstacles[i].toggleObstacle(true)
                return this.obstacles[i]
            }
        }
        const obstacle = new MovableObstacle(this.scene, x, y, true, 100, 100)
        this.setUpColliders(obstacle)
        this.obstacles.push(obstacle)
        // const horizontalObstacle = new MovableObstacle(
        //     this.scene,
        //     x + 300,
        //     y,
        //     false,
        //     100,
        //     100
        // )
        // this.setUpColliders(horizontalObstacle)
        // this.obstacles.push(horizontalObstacle)
        return obstacle
    }
    private setUpColliders(obstacle: Obstacle): void {
        this.scene.physics.add.collider(this.ball, obstacle)
    }

    public getObstalces(): Obstacle[] {
        return this.obstacles
    }
    public update(delta: number): void {
        this.obstacles.forEach((obstacle) => {
            obstacle.update(delta)
        })
    }

    public reset(): void {
        this.toggleObstacles(false)
    }
    private toggleObstacles(state: boolean): void {
        this.obstacles.forEach((obstacle) => {
            obstacle.toggleObstacle(state)
        })
    }
}
export default ObstacleManager
