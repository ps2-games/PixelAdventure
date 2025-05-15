class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
    }

    addScene(name, sceneConfig) {
        this.scenes.set(name, sceneConfig);
    }

    switchScene(name) {
        if (!this.scenes.has(name)) {
            return;
        }
        this.currentScene = name;
        return this.scenes.get(name);
    }

    getCurrentScene() {
        return this.currentScene ? this.scenes.get(this.currentScene) : null;
    }
}

export default SceneManager;