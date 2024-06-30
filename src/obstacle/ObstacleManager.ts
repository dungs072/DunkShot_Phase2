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
    private preObstacles: Obstacle[]
    private hitSound: Phaser.Sound.BaseSound
    constructor(scene: Scene, ball: Ball, levelManager: LevelManager) {
        this.obstacles = []
        this.scene = scene
        this.ball = ball
        this.levelManager = levelManager
        this.preObstacles = []
        this.hitSound = this.scene.sound.add('hit')
    }

    public createObstacleByLevel(): void {
        const obstacleDatas = this.levelManager.getCurrentObstacles()
        if (!obstacleDatas) return
        if (this.preObstacles.length > 0) {
            this.preObstacles.forEach((obstacle) => {
                if (obstacle) {
                    obstacle.toggleObstacle(false)
                }
            })
        }
        this.preObstacles.splice(0, this.preObstacles.length)
        obstacleDatas.forEach((obstacleData) => {
            const obstacle = this.spawnObstacle(
                obstacleData.position.posX * devicePixelRatio +
                    CONST.WIDTH_SIZE / 2,
                obstacleData.position.posY * devicePixelRatio +
                    this.scene.cameras.main.scrollY,
                obstacleData.isVertical,
                obstacleData.isMovable
            )
            this.preObstacles.push(obstacle)
        })
    }

    public spawnObstacle(
        x: number,
        y: number,
        isVertical: boolean,
        isMovable: boolean
    ): Obstacle {
        for (let i = 0; i < this.obstacles.length; i++) {
            const obstacle = this.obstacles[i]
            if (!obstacle.active && obstacle.getIsVertical() == isVertical) {
                if (obstacle instanceof MovableObstacle) {
                    if (isMovable) {
                        obstacle.setObstaclePosition(x, y)
                        obstacle.toggleObstacle(true)
                        return obstacle
                    }
                } else {
                    if (!isMovable) {
                        obstacle.setObstaclePosition(x, y)
                        obstacle.toggleObstacle(true)
                        return obstacle
                    }
                }
            }
        }
        let newObstacle
        if (isMovable) {
            newObstacle = new MovableObstacle(
                this.scene,
                x,
                y,
                isVertical,
                100,
                100
            )
        } else {
            newObstacle = new Obstacle(this.scene, x, y, isVertical)
        }
        this.setUpColliders(newObstacle)
        this.obstacles.push(newObstacle)
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
        return newObstacle
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

        this.preObstacles.splice(0, this.preObstacles.length)
    }
    public clear(): void {
        this.obstacles.splice(0, this.obstacles.length)
        this.preObstacles.splice(0, this.preObstacles.length)
    }
    private toggleObstacles(state: boolean): void {
        this.obstacles.forEach((obstacle) => {
            obstacle.toggleObstacle(state)
        })
    }
}
export default ObstacleManager
