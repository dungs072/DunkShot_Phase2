class Utils {
    public static Lerp(
        startValue: number,
        endValue: number,
        t: number
    ): number {
        return startValue + (endValue - startValue) * t
    }
    public static getReflectionVelocity(
        incomeVelocity: Phaser.Math.Vector2,
        normalVector: Phaser.Math.Vector2
    ): Phaser.Math.Vector2 | null {
        const dotValue = incomeVelocity.dot(normalVector)
        return new Phaser.Math.Vector2(
            incomeVelocity.x - 2 * normalVector.x * dotValue,
            incomeVelocity.y - 2 * normalVector.y * dotValue
        )
    }
}
export default Utils
