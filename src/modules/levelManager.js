import BaseLevel from "./BaseLevel.js";

export default class LevelManager {
    constructor() {
        this.levels = new Map();
        this.levelOrder = [];
        this.currentLevelId = null;
        this.currentScene = null;
        this.isPaused = false;
        this.defaultLevel = null;
    }

    registerLevel(levelId, SceneClassOrConfig, isDefault = false) {
        let sceneInstance;

        if (typeof SceneClassOrConfig === 'function') {
            sceneInstance = new SceneClassOrConfig();
        } else {
            sceneInstance = new BaseLevel(SceneClassOrConfig);
        }

        sceneInstance.setLevelManager(this);
        this.levels.set(levelId, sceneInstance);
        this.levelOrder.push(levelId);

        if (isDefault || !this.defaultLevel) {
            this.defaultLevel = levelId;
        }

        return this;
    }

    registerLevels(levelsConfig) {
        levelsConfig.forEach(({ id, scene, default: isDefault }, index) => {
            this.registerLevel(id, scene, isDefault || index === 0);
        });
        return this;
    }

    initialize() {
        if (this.defaultLevel && this.levels.has(this.defaultLevel)) {
            this.switchLevel(this.defaultLevel);
        }
        return this;
    }

    switchLevel(levelId, callback = null) {
        if (!this.levels.has(levelId)) {
            return false;
        }

        const oldScene = this.currentScene;
        const newScene = this.levels.get(levelId);

        if (oldScene && typeof oldScene.onExit === 'function') {
            oldScene.onExit();
        }

        this.currentLevelId = levelId;
        this.currentScene = newScene;

        if (!newScene.isInitialized) {
            newScene.init();
        }

        if (newScene && typeof newScene.onEnter === 'function') {
            newScene.onEnter();
        }

        if (callback && typeof callback === 'function') {
            callback(levelId, newScene);
        }

        return newScene;
    }

    getCurrentLevel() {
        return this.currentScene;
    }

    getCurrentLevelId() {
        return this.currentLevelId;
    }

    getCurrentLevelConfig() {
        return this.currentScene ? this.currentScene.config : null;
    }

    nextLevel(callback = null) {
        const currentIndex = this.levelOrder.indexOf(this.currentLevelId);

        if (currentIndex < this.levelOrder.length - 1) {
            const nextLevelId = this.levelOrder[currentIndex + 1];
            return this.switchLevel(nextLevelId, callback);
        } else {
            if (callback) callback(null, null);
            return null;
        }
    }

    previousLevel(callback = null) {
        const currentIndex = this.levelOrder.indexOf(this.currentLevelId);

        if (currentIndex > 0) {
            const prevLevelId = this.levelOrder[currentIndex - 1];
            return this.switchLevel(prevLevelId, callback);
        }
        return null;
    }

    restartLevel() {
        if (this.currentLevelId) {
            const levelId = this.currentLevelId;
            const sceneConfig = this.currentScene.config;

            const newScene = new BaseLevel(sceneConfig);
            newScene.setLevelManager(this);
            newScene.init();

            this.levels.set(levelId, newScene);
            return this.switchLevel(levelId);
        }
        return null;
    }

    hasLevel(levelId) {
        return this.levels.has(levelId);
    }

    getRegisteredLevels() {
        return [...this.levelOrder];
    }

    getTotalLevels() {
        return this.levelOrder.length;
    }

    getCurrentLevelIndex() {
        return this.levelOrder.indexOf(this.currentLevelId);
    }

    pause() {
        this.isPaused = true;
        if (this.currentScene && typeof this.currentScene.onPause === 'function') {
            this.currentScene.onPause();
        }
    }

    resume() {
        this.isPaused = false;
        if (this.currentScene && typeof this.currentScene.onResume === 'function') {
            this.currentScene.onResume();
        }
    }

    unregisterLevel(levelId) {
        if (this.levels.has(levelId)) {
            const scene = this.levels.get(levelId);

            if (typeof scene.cleanup === 'function') {
                scene.cleanup();
            }

            this.levels.delete(levelId);
            const index = this.levelOrder.indexOf(levelId);
            if (index > -1) {
                this.levelOrder.splice(index, 1);
            }
        }
    }

    cleanup() {
        for (const [_, scene] of this.levels.entries()) {
            if (typeof scene.cleanup === 'function') {
                scene.cleanup();
            }
        }

        this.levels.clear();
        this.levelOrder = [];
        this.currentScene = null;
        this.currentLevelId = null;
        this.isPaused = false;
    }
}