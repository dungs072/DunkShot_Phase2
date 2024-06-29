import { Scene } from 'phaser'
import Point from './Point'
import Basket from '../basket/Basket'
import CONST from '../Const'

class TrajectoryPath {
    private points: Point[]
    private scene: Scene
    private maxPoint: number
    private currentMaxPoint: number
    constructor(scene: Scene, maxPoint: number) {
        this.points = []
        this.scene = scene
        this.maxPoint = maxPoint
        this.currentMaxPoint = maxPoint
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
            this.togglePoints(true)
        })
    }
    private togglePoints(state: boolean): void {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].setVisible(state)
        }
    }
    private drawTrajectory(
        startPosition: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2,
        ratio: number
    ) {
        let newIndex = -1
        let normalVector = undefined
        let newStartPosition = undefined
        for (let i = 0; i < this.currentMaxPoint; i++) {
            const pos = this.calculatePointPosition(
                0.07 * ratio * i,
                startPosition,
                velocity
            )
            newStartPosition = pos
            if (pos.x < 0) {
                newIndex = i
                normalVector = new Phaser.Math.Vector2(1, 0)
                break
            } else if (pos.x > CONST.WIDTH_SIZE) {
                newIndex = i
                normalVector = new Phaser.Math.Vector2(-1, 0)
                break
            }
            this.points[i].setPosition(pos.x, pos.y)
            this.points[i].setVisible(true)
        }
        if (normalVector) {
            velocity.y += 400
            const newVelocity = this.getReflectionVelocity(
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
    private getReflectionVelocity(
        incomeVelocity: Phaser.Math.Vector2,
        normalVector: Phaser.Math.Vector2
    ): Phaser.Math.Vector2 | null {
        const dotValue = incomeVelocity.dot(normalVector)
        return new Phaser.Math.Vector2(
            incomeVelocity.x - 2 * normalVector.x * dotValue,
            incomeVelocity.y - 2 * normalVector.y * dotValue
        )
    }
    public setCurrentMaxPoint(amount: number): void {
        this.currentMaxPoint = amount > this.maxPoint ? this.maxPoint : amount
    }
}
export default TrajectoryPath
