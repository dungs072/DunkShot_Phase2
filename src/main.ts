import { Game, Types } from 'phaser'
import LoadingScene from './scenes/LoadingScene'
import MainGameScene from './scenes/MainGameScene'
import ChallengeSelectionScene from './scenes/ChallengeSelectionScene'
import CONST from './Const'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: CONST.WIDTH_SIZE,
    height: CONST.HEIGHT_SIZE,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false,
        },
    },
    scene: [LoadingScene, MainGameScene, ChallengeSelectionScene],
}
const game = new Game(config)
export default game
