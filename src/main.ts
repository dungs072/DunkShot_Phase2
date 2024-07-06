import { Game, Types } from 'phaser'
import LoadingScene from './scenes/LoadingScene'
import MainGameScene from './scenes/MainGameScene'
import ChallengeSelectionScene from './scenes/ChallengeSelectionScene'
import BoostScene from './scenes/BoostScene'
import UIScene from './scenes/UIScene'
import BackgroundScene from './scenes/BackgroundScene'
import ScoreScene from './scenes/ScoreScene'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 0,
    height: 0,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.NONE,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1800 },
            debug: true,
        },
    },
    scene: [
        BoostScene,
        LoadingScene,
        BackgroundScene,
        ScoreScene,
        UIScene,
        MainGameScene,
        ChallengeSelectionScene,
    ],
}
const game = new Game(config)
export default game
