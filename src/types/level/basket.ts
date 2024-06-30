import IObstacle from './obstacle'
import IVector2 from './vector2'

interface IBasket {
    position: IVector2
    obstacles: IObstacle[]
}
export default IBasket
