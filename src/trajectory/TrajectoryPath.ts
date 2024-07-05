import { Scene } from 'phaser'
import Point from './Point'
import Basket from '../basket/Basket'
import CONST from '../const/const'
import Utils from '../Utils'

class TrajectoryPath {
    private points: Point[]
    private scene: Scene
    private maxPoint: number
    private currentMaxPoint: number
    private forceDown: boolean
    constructor(scene: Scene, maxPoint: number, forceDown = false) {
        this.points = []
        this.scene = scene
        this.maxPoint = maxPoint
        this.currentMaxPoint = maxPoint
        this.forceDown = forceDown
        for (let i = 0; i < maxPoint; i++) {
            const point = new Point(scene, 0, 0)
            this.points.push(point)
        }
        this.togglePoints(false)
        Basket.eventEmitter.on(
            'dragging',
            (
                x: number,
                y: number,
                velocityX: number,
                velocityY: number,
                ratio: number
            ) => {
                if (this.forceDown) return
                this.drawTrajectory(
                    new Phaser.Math.Vector2(x, y),
                    new Phaser.Math.Vector2(velocityX, velocityY),
                    ratio
                )
            }
        )
        Basket.eventEmitter.on('turnofftrajectory', () => {
            this.togglePoints(false)
        })
        Basket.eventEmitter.on('turnontrajectory', () => {
            if (this.forceDown) return
            this.togglePoints(true)
        })
    }
    public togglePoints(state: boolean): void {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].setVisible(state)
        }
    }
    public setForceDown(state: boolean): void {
        this.forceDown = state
    }
    private drawTrajectory(
        startPosition: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2,
        ratio: number
    ) {
        let newIndex = -1
        let normalVector = undefined
        let newStartPosition = new Phaser.Math.Vector2(0, 0)
        let decreaseCount = this.currentMaxPoint
        for (let i = 0; i < this.currentMaxPoint; i++) {
            const pos = this.calculatePointPosition(
                0.07 * ratio * (i + 1),
                startPosition,
                velocity
            )

            if (pos.x - this.points[i].displayWidth < 0) {
                newStartPosition.x = 0
                newStartPosition.y = pos.y
                newIndex = i
                normalVector = new Phaser.Math.Vector2(1, 0)
                break
            } else if (pos.x + this.points[i].displayWidth > CONST.WIDTH_SIZE) {
                newStartPosition.x = CONST.WIDTH_SIZE
                newStartPosition.y = pos.y
                newIndex = i
                normalVector = new Phaser.Math.Vector2(-1, 0)
                break
            }
            this.points[i].setPosition(pos.x, pos.y)
            this.points[i].setPointScale(decreaseCount / this.currentMaxPoint)
            this.points[i].setVisible(true)
            decreaseCount--
        }
        if (normalVector) {
            velocity.y = Math.min(velocity.y + 400, 0)
            velocity.x = Utils.Lerp(velocity.x, 0, 0.1)
            const newVelocity = Utils.getReflectionVelocity(
                velocity,
                normalVector
            )
            if (newVelocity && newStartPosition) {
                let j = 0

                for (let i = newIndex; i < this.currentMaxPoint; i++) {
                    const pos = this.calculatePointPosition(
                        0.07 * ratio * j,
                        newStartPosition,
                        newVelocity
                    )
                    this.points[i].setPosition(pos.x, pos.y)
                    this.points[i].setVisible(true)
                    j++
                    this.points[i].setPointScale(
                        decreaseCount / this.currentMaxPoint
                    )
                    decreaseCount--
                }
            }
        }

        for (let i = this.currentMaxPoint; i < this.maxPoint; i++) {
            this.points[i].setVisible(false)
        }
    }

    private calculatePointPosition(
        time: number,
        startPosition: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2
    ): Phaser.Math.Vector2 {
        const currentPosition = new Phaser.Math.Vector2(
            startPosition.x +
                velocity.x * time +
                0.5 * this.scene.physics.world.gravity.x * (time * time),
            startPosition.y +
                velocity.y * time +
                0.5 * this.scene.physics.world.gravity.y * (time * time)
        )
        return currentPosition
    }
    public setCurrentMaxPoint(amount: number): void {
        this.currentMaxPoint = amount > this.maxPoint ? this.maxPoint : amount
    }
}
export default TrajectoryPath
