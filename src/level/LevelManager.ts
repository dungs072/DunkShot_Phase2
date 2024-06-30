import ILevel from '../types/level/level'
import ChallengeType from '../types/level/challenge'
import { Scene } from 'phaser'
import ILevelData from '../types/level/levelData'
import IObstacle from '../types/level/obstacle'
import IBasket from '../types/level/basket'
class LevelManager {
    public static LevelFinished = new Phaser.Events.EventEmitter()
    private levelData: ILevelData
    private scene: Scene
    private currentChallenge: ChallengeType
    private currentLevelIndex: number
    private currentBasketIndex: number

    constructor(scene: Scene, challengeType: ChallengeType) {
        this.scene = scene
        this.currentChallenge = challengeType
        this.currentLevelIndex = 0
        this.currentBasketIndex = 0
        this.fetchLevels()
    }

    private fetchLevels(): void {
        let str = 'timeChallenge'
        if (this.currentChallenge == ChallengeType.TIME) {
            str = 'timeChallenge'
        }
        this.levelData = this.scene.cache.json.get(str) as ILevelData
        console.log(this.levelData)
    }
    public getLevel(index: number): ILevel | undefined {
        return this.levelData.levels[index]
    }
    public getCurrentLevel(): ILevel {
        return this.levelData.levels[this.currentLevelIndex]
    }
    public getCurrentBasket(): IBasket {
        return this.levelData.levels[this.currentLevelIndex].baskets[
            this.currentBasketIndex++
        ]
    }
    public getCurrentObstacles(): IObstacle[] {
        if (this.currentChallenge == ChallengeType.NONE) {
            return []
        }
        return this.levelData.levels[this.currentLevelIndex].baskets[
            this.currentBasketIndex - 1
        ].obstacles
    }
    public resetCurrentLevel(): void {
        this.currentBasketIndex = 0
    }
    public gotoNextLevel(): void {
        this.currentBasketIndex = 0
        this.currentLevelIndex =
            (this.currentLevelIndex + 1) % this.levelData.levels.length
    }
    public isFinishCurrentLevel(): boolean {
        return (
            this.currentBasketIndex ==
            this.levelData.levels[this.currentLevelIndex].baskets.length
        )
    }

    public getAllLevels(): ILevel[] {
        return this.levelData.levels
    }
    public getCurrentChallenge(): ChallengeType {
        return this.currentChallenge
    }
    public getDataGame(): number {
        return Math.floor(
            parseInt(this.levelData.levels[this.currentLevelIndex].data)
        )
    }
}
export default LevelManager
