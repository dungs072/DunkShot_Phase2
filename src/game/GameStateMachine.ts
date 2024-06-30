import IState from '../types/state'
import GameController from './GameController'
import MenuState from './states/MenuState'
import NextLevelState from './states/NextLevelState'
import OverState from './states/OverState'
import PlayingState from './states/PlayingState'
import RestartState from './states/RestartState'

class GameStateMachine {
    private currentState: IState

    private menuState: MenuState
    private playingState: PlayingState
    private overState: OverState
    private restartState: RestartState
    private nextLevelState: NextLevelState

    constructor(gameController: GameController) {
        this.menuState = new MenuState(gameController)
        this.playingState = new PlayingState(gameController)
        this.overState = new OverState(gameController)
        this.restartState = new RestartState(gameController)
        this.nextLevelState = new NextLevelState(gameController)
    }

    public initialize(startingState: IState) {
        this.currentState = startingState
        startingState.enter()
    }
    public transitionTo(nextState: IState) {
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
}
export default GameStateMachine
