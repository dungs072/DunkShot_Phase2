import IState from '../types/state'
import GameController from './GameController'
import MenuState from './states/MenuState'
import NextLevelState from './states/NextLevelState'
import OverState from './states/OverState'
import PauseState from './states/PauseState'
import PlayingState from './states/PlayingState'
import ResetState from './states/ResetState'
import RestartState from './states/RestartState'
import ResumeState from './states/ResumeState'

class GameStateMachine {
    private currentState: IState
    private preState: IState

    private menuState: MenuState
    private playingState: PlayingState
    private overState: OverState
    private restartState: RestartState
    private nextLevelState: NextLevelState
    private pauseState: PauseState
    private resumeState: ResumeState
    private resetState: ResetState

    constructor(gameController: GameController) {
        this.menuState = new MenuState(gameController)
        this.playingState = new PlayingState(gameController)
        this.overState = new OverState(gameController)
        this.restartState = new RestartState(gameController)
        this.nextLevelState = new NextLevelState(gameController)
        this.pauseState = new PauseState(gameController)
        this.resumeState = new ResumeState(gameController)
        this.resetState = new ResetState(gameController)
    }

    public initialize(startingState: IState) {
        this.currentState = startingState
        startingState.enter()
    }
    public transitionTo(nextState: IState) {
        this.preState = this.currentState
        this.currentState.exit()
        this.currentState = nextState
        nextState.enter()
    }
    public update(delta: number): void {
        if (this.currentState) {
            this.currentState.update(delta)
        }
    }
    public getCurrentState(): IState {
        return this.currentState
    }
    public getPreState(): IState {
        return this.preState
    }
    public getMenuState(): MenuState {
        return this.menuState
    }
    public getPlayingState(): PlayingState {
        return this.playingState
    }
    public getOverState(): OverState {
        return this.overState
    }
    public getRestartState(): RestartState {
        return this.restartState
    }
    public getNextLevelState(): NextLevelState {
        return this.nextLevelState
    }
    public getPauseState(): PauseState {
        return this.pauseState
    }
    public getResumeState(): ResumeState {
        return this.resumeState
    }
    public getResetState(): ResetState {
        return this.resetState
    }
}
export default GameStateMachine
