import { Scene } from 'phaser'
import CONST from '../const/const'
import MainGameUI from '../ui/MainGameUI'
import MainMenuUI from '../ui/MainMenuUI'
import NextLevelUI from '../ui/NextLevelUI'
import OverGameUI from '../ui/OverGameUI'
import PauseUI from '../ui/PauseUI'

class UIScene extends Scene {
    private menu: MainMenuUI
    private overGameUI: OverGameUI
    private gameUI: MainGameUI
    private nextLevelUI: NextLevelUI
    private pauseUI: PauseUI

    public getMenuUI(): MainMenuUI {
        return this.menu
    }
    public getOverUI(): OverGameUI {
        return this.overGameUI
    }
    public getGameUI(): MainGameUI {
        return this.gameUI
    }
    public getNextLevelUI(): NextLevelUI {
        return this.nextLevelUI
    }
    public getPauseUI(): PauseUI {
        return this.pauseUI
    }

    constructor() {
        super({
            key: 'UIScene',
        })
    }
    create() {
        this.menu = new MainMenuUI(this, 0, 0)
        this.gameUI = new MainGameUI(this, 0, 0)
        this.overGameUI = new OverGameUI(this, 0, 0)
        this.pauseUI = new PauseUI(this)
        this.nextLevelUI = new NextLevelUI(
            this,
            CONST.WIDTH_SIZE / 2,
            CONST.HEIGHT_SIZE / 2
        )
        this.gameUI.setVisible(false)
    }
}
export default UIScene
