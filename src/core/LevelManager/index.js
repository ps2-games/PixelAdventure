import Scene from "../Scene/index.js";

class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = new Map();
        this.currentLevel = null;
    }

    addLevel(name, levelConfig) {
        this.levels.set(name, levelConfig);
    }

    switchLevel(name) {
        if (!this.levels.has(name)) {
            return;
        }

        this.currentLevel = name;
        const levelConfig = this.levels.get(name);
        this.game.scene = new Scene(levelConfig);
        this.game.lastTime = Timer.getTime(this.game.timer);

        return this.game.scene;
    }

    getCurrentLevel() {
        return this.currentLevel ? this.levels.get(this.currentLevel) : null;
    }

    nextLevel() {
        const levelNames = Array.from(this.levels.keys());
        const currentIndex = levelNames.indexOf(this.currentLevel);

        if (currentIndex < levelNames.length - 1) {
            const nextLevelName = levelNames[currentIndex + 1];
            this.switchLevel(nextLevelName);
        } else {
            this.game.stop();
        }
    }
}

export default LevelManager;