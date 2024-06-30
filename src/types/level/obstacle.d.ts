import IVector2 from './vector2'

interface IObstacle {
    position: IVector2
    isVertical: boolean
    isMovable: boolean
}
export default IObstacle
