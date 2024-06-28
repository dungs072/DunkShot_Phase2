import GameController from '../game/GameController'
interface IState {
    public enter(): void
    public update(delta: number): void
    public exit(): void
}
export default IState
