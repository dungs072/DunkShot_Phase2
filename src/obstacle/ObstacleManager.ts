import { Scene } from 'phaser'
import Obstacle from './Obstacle'
import Ball from '../player/Ball'
import MovableObstacle from './MovableObstacle'
import CONST from '../const'
import ChallengeManager from '../challenge/ChallengeManager'
import ChallengeType from '../types/level/challenge'
import BasketManager from '../basket/BasketManager'

class ObstacleManager {
    private obstacles: Obstacle[]
    private ball: Ball
    private scene: Scene
    private challengeManager: ChallengeManager
    private preObstacles: Obstacle[]

    constructor(scene: Scene, ball: Ball, challengeManager: ChallengeManager) {
        this.obstacles = []
        this.scene = scene
        this.ball = ball
        this.challengeManager = challengeManager
        this.preObstacles = []
        BasketManager.BasketCollided.on('basketcollided', () => {
            this.handleTurnOffObstacle()
        })
    }

    public createObstacleByLevel(): void {
        if (
            this.challengeManager.getCurrentChallengeType() ==
            ChallengeType.NONE
        )
            return

        const obstacleDatas = this.challengeManager
            .getCurrentLevelManager()
            ?.getCurrentLevel()
        if (!obstacleDatas) return

        const obstacles = obstacleDatas.getObstacles()
        const upBorder = this.scene.cameras.main.scrollY + CONST.HEIGHT_SIZE / 3
        const downBorder =
            this.scene.cameras.main.scrollY + CONST.HEIGHT_SIZE / 1.2
        obstacles.forEach((obstacleData) => {
            if (
                obstacleData.y <= downBorder &&
                obstacleData.y >= upBorder &&
                obstacleData.active
            ) {
                const isVertical = obstacleData.angle != 90
                const isMovable = obstacleData.width == 10
                this.spawnObstacle(
                    obstacleData.x,
                    obstacleData.y,
                    isVertical,
                    isMovable
                )
                obstacleData.setActive(false)
            }
        })
    }
    private handleTurnOffObstacle(): void {
        const posY = this.ball.parentContainer.parentContainer.y

        this.obstacles.forEach((obstacle) => {
            if (obstacle.active) {
                if (obstacle.y > posY) {
                    obstacle.toggleObstacle(false)
                }
            }
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
        return newObstacle
    }
    private setUpColliders(obstacle: Obstacle): void {
        this.scene.physics.add.collider(
            this.ball,
            obstacle,
            this.collideWithObstacle
        )
    }
    private collideWithObstacle = () => {
        this.ball.playHitSound()
        this.ball.setCurrentVelocityToInitialVelocity()
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
