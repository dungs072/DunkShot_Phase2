import { Scene } from 'phaser'
import Obstacle from './Obstacle'
import Ball from '../player/Ball'
import MovableObstacle from './MovableObstacle'

class ObstacleManager {
    private obstacles: Obstacle[]
    private ball: Ball
    private scene: Scene
    constructor(scene: Scene, ball: Ball) {
        this.obstacles = []
        this.scene = scene
        this.ball = ball
    }
    public createObstacle(x: number, y: number): Obstacle {
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

        const horizontalObstacle = new MovableObstacle(
            this.scene,
            x + 300,
            y,
            false,
            100,
            100
        )
        this.setUpColliders(horizontalObstacle)
        this.obstacles.push(horizontalObstacle)
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
}
export default ObstacleManager
