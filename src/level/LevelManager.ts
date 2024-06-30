import ILevel from '../types/level'
import ChallengeType from '../types/challenge'
import { Scene } from 'phaser'
import ILevelData from '../types/levelData'
class LevelManager {
    private levelData: ILevelData
    private scene: Scene
    private currentChallenge: ChallengeType

    constructor(scene: Scene, challengeType: ChallengeType) {
        this.scene = scene
        this.currentChallenge = challengeType

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

    public getAllLevels(): ILevel[] {
        return this.levelData.levels
    }
    public getCurrentChallenge(): ChallengeType {
        return this.currentChallenge
    }
}
export default LevelManager
