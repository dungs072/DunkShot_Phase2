import GameController from '../game/GameController'
interface IState {
    public enter(): void
    public update(): void
    public exit(): void
}
export default IState
