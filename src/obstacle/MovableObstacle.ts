import { Scene } from 'phaser'
import Obstacle from './Obstacle'

class MovableObstacle extends Obstacle {
    private maxDistance: number
    private minDistance: number
    private startX: number
    private startY: number
    private speed: number
    private isReachOneSide: boolean
    constructor(
        scene: Scene,
        x: number,
        y: number,
        isVertical: boolean,
        maxDistance: number,
        minDistance: number
    ) {
        super(scene, x, y, isVertical)
        this.speed = 100
        this.maxDistance = maxDistance
        this.minDistance = minDistance
        this.startX = this.x
        this.startY = this.y
        this.isReachOneSide = false
    }
    public update(delta: number): void {
        if (this.isVertical) {
            if (this.y < this.startY - this.maxDistance) {
                this.isReachOneSide = false
            }
            if (this.y > this.startY + this.minDistance) {
                this.isReachOneSide = true
            }
            if (this.isReachOneSide) {
                this.y -= this.speed * delta
            } else {
                this.y += this.speed * delta
            }
        } else {
            if (this.x < this.startX - this.maxDistance) {
                this.isReachOneSide = false
            }
            if (this.x > this.startX + this.minDistance) {
                this.isReachOneSide = true
            }
            if (this.isReachOneSide) {
                this.x -= this.speed * delta
            } else {
                this.x += this.speed * delta
            }
        }
    }
    public setObstaclePosition(x: number, y: number): void {
        super.setObstaclePosition(x, y)
        this.startX = x
        this.startY = y
    }
}
export default MovableObstacle
