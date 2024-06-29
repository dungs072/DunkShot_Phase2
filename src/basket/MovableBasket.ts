import { Scene } from 'phaser'
import Basket from './Basket'

class MovableBasket extends Basket {
    private maxDistance: number
    private minDistance: number
    private startX: number
    private startY: number
    private speed: number
    private isReachOneSide: boolean
    private isVertical: boolean
    constructor(
        scene: Scene,
        x: number,
        y: number,
        isVertical: boolean,
        maxDistance: number,
        minDistance: number
    ) {
        super(scene, x, y)
        this.speed = 100
        this.maxDistance = maxDistance
        this.minDistance = minDistance
        this.startX = this.x
        this.startY = this.y
        this.isReachOneSide = false
        this.isVertical = isVertical
    }
    public update(delta: number): void {
        super.update(delta)
        if (this.isVertical) {
            if (this.y < this.startY - this.maxDistance) {
                this.isReachOneSide = false
            }
            if (this.y > this.startY + this.minDistance) {
                this.isReachOneSide = true
            }
            if (this.isReachOneSide) {
                this.setBasketYPosition(-this.speed * delta)
            } else {
                this.setBasketYPosition(this.speed * delta)
            }
        } else {
            if (this.x < this.startX - this.maxDistance) {
                this.isReachOneSide = false
            }
            if (this.x > this.startX + this.minDistance) {
                this.isReachOneSide = true
            }
            if (this.isReachOneSide) {
                this.setBasketXPosition(-this.speed * delta)
            } else {
                this.setBasketXPosition(this.speed * delta)
            }
        }
    }
}
export default MovableBasket
