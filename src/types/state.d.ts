import GameController from '../game/GameController'
interface IState {
    public enter(game: GameController): void
    public update(game: GameController): void
    public exit(game: GameController): void
}
export default IState
