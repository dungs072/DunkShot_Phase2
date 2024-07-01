import ChallengeType from '../types/level/challenge'
import { Scene } from 'phaser'
import Level from './Level'
import ILevelData from '../types/level/levelData'
class LevelManager {
    public static LevelFinished = new Phaser.Events.EventEmitter()
    private scene: Scene
    // private levelData: ILevelData

    private currentChallenge: ChallengeType
    private currentLevelIndex: number
    private levelData: ILevelData
    // private currentBasketIndex: number

    private levels: Level[]

    constructor(scene: Scene, challengeType: ChallengeType, numberLevel = 1) {
        this.scene = scene
        this.currentChallenge = challengeType
        this.currentLevelIndex = 2
        // this.currentBasketIndex = 0
        this.levels = []
        this.initLevels(numberLevel)
        this.fetchLevels()
    }
    private initLevels(numberLevel: number): void {
        for (let i = 1; i <= numberLevel; i++) {
            const level = new Level(this.scene, 'level' + i.toString())
            this.levels.push(level)
        }
    }
    public getCurrentLevel(): Level {
        return this.levels[this.currentLevelIndex]
    }
    public getCurrentChallenge(): ChallengeType {
        return this.currentChallenge
    }
    public getCurrentLevelData(): number {
        return this.levelData.levels[this.currentLevelIndex].data
    }
    public gotoNextLevel(): void {
        this.currentLevelIndex =
            (this.currentLevelIndex + 1) % this.levels.length
    }
    public resetLevel(): void {
        this.levels[this.currentLevelIndex].resetLevel()
    }

    private fetchLevels(): void {
        let str = 'timeChallenge'
        if (this.currentChallenge == ChallengeType.TIME) {
            str = 'timeChallenge'
        }
        this.levelData = this.scene.cache.json.get(str) as ILevelData
    }
}
export default LevelManager
