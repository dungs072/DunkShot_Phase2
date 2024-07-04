import { Game, Types } from 'phaser'
import LoadingScene from './scenes/LoadingScene'
import MainGameScene from './scenes/MainGameScene'
import ChallengeSelectionScene from './scenes/ChallengeSelectionScene'
import CONST from './Const'
import BoostScene from './scenes/BoostScene'
import HandlerScene from './scenes/HandlerScene'

const MAX_SIZE_WIDTH_SCREEN = 1920
const MAX_SIZE_HEIGHT_SCREEN = 1080
const MIN_SIZE_WIDTH_SCREEN = 270
const MIN_SIZE_HEIGHT_SCREEN = 480
const SIZE_WIDTH_SCREEN = 540
const SIZE_HEIGHT_SCREEN = 960

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
        //mode: Phaser.Scale.RESIZE,
        // width: SIZE_WIDTH_SCREEN,
        // height: SIZE_HEIGHT_SCREEN,
        // min: {
        //     width: MIN_SIZE_WIDTH_SCREEN,
        //     height: MIN_SIZE_HEIGHT_SCREEN,
        // },
        // max: {
        //     width: MAX_SIZE_WIDTH_SCREEN,
        //     height: MAX_SIZE_HEIGHT_SCREEN,
        // },
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false,
        },
    },
    scene: [
        HandlerScene,
        BoostScene,
        LoadingScene,
        MainGameScene,
        ChallengeSelectionScene,
    ],
}
const game = new Game(config)
export default game
