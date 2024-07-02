import { Scene } from 'phaser'
import ChallengeType from '../types/level/challenge'
import LevelManager from './LevelManager'

class ChallengeManager {
    private challenges = new Map<ChallengeType, LevelManager>()
    private scene: Scene
    private currentChallengeType: ChallengeType
    constructor(scene: Scene) {
        this.scene = scene
        this.currentChallengeType = ChallengeType.NONE
        this.initChallengeData()
    }
    private initChallengeData(): void {
        const timeLevelManager = new LevelManager(
            this.scene,
            ChallengeType.TIME,
            3
        )
        const noAimLevelManager = new LevelManager(
            this.scene,
            ChallengeType.NO_AIM,
            3
        )
        this.challenges.set(ChallengeType.TIME, timeLevelManager)
        this.challenges.set(ChallengeType.NO_AIM, noAimLevelManager)
    }
    public getCurrentChallengeType(): ChallengeType {
        return this.currentChallengeType
    }
    public setChallengeType(challengeType: ChallengeType): void {
        this.currentChallengeType = challengeType
    }
    public gotoNextLevel(): void {
        this.challenges.get(this.currentChallengeType)?.gotoNextLevel()
    }
    public getCurrentLevelManager(): LevelManager | undefined {
        return this.challenges.get(this.currentChallengeType)
    }
    public resetCurrentLevel(): void {
        this.challenges.get(this.currentChallengeType)?.resetLevel()
    }
}
export default ChallengeManager
