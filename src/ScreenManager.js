import Transition from "./Transition.js";

export default class ScreenManager {
    constructor() {
        this.screens = new Map();
        this.currentScreen = null;
        this.nextScreen = null;
        this.transition = new Transition();

        this.isInitialized = false;
        this.isPaused = false;
        this.defaultScreen = null;
    }

    registerScreen(screenId, ScreenClass, isDefault = false) {
        const screenInstance = new ScreenClass();
        screenInstance.setScreenManager(this);

        this.screens.set(screenId, screenInstance);

        if (isDefault || !this.defaultScreen) {
            this.defaultScreen = screenId;
        }

        return this;
    }

    initialize() {
        if (this.defaultScreen && this.screens.has(this.defaultScreen)) {
            this.changeScreen(this.defaultScreen, false);
            this.isInitialized = true;
        }
        return this;
    }

    registerScreens(screensConfig) {
        screensConfig.forEach(({ id, class: ScreenClass, default: isDefault }, index) => {
            this.registerScreen(id, ScreenClass, isDefault || index === 0);
        });
        return this;
    }

    unregisterScreen(screenId) {
        if (this.screens.has(screenId)) {
            const screen = this.screens.get(screenId);

            if (typeof screen.cleanup === 'function') {
                screen.cleanup();
            }

            this.screens.delete(screenId);
        }
    }

    changeScreen(screenId, useTransition = true, callback = null) {
        if (!this.screens.has(screenId)) {
            console.error(`Tela '${screenId}' nÃ£o encontrada!`);
            return false;
        }

        const targetScreen = this.screens.get(screenId);

        if (!this.transition.isInTransition() && this.currentScreen !== targetScreen) {
            if (useTransition && this.currentScreen) {
                this.nextScreen = targetScreen;

                return this.transition.startTransition(
                    this.currentScreen,
                    targetScreen,
                    () => {
                        this._completeScreenChange(screenId, callback);
                    }
                );
            } else {
                this._completeScreenChange(screenId, callback);
                return true;
            }
        }

        return false;
    }

    _completeScreenChange(screenId, callback) {
        const oldScreen = this.currentScreen;
        const newScreen = this.screens.get(screenId);

        if (oldScreen && typeof oldScreen.onExit === 'function') {
            oldScreen.onExit();
        }

        this.currentScreen = newScreen;
        this.nextScreen = null;

        if (this.currentScreen && typeof this.currentScreen.onEnter === 'function') {
            this.currentScreen.onEnter();
        }

        if (callback && typeof callback === 'function') {
            callback(screenId);
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    getCurrentScreenId() {
        for (const [id, screen] of this.screens.entries()) {
            if (screen === this.currentScreen) {
                return id;
            }
        }
        return null;
    }

    update() {
        if (this.isPaused) return;

        this.transition.update();

        if (!this.transition.isInTransition() && this.currentScreen) {
            if (typeof this.currentScreen.update === 'function') {
                this.currentScreen.update();
            }
        }
    }

    render() {
        if (this.isPaused) return;

        if (this.transition.isInTransition()) {
            this.transition.render();
        } else if (this.currentScreen) {
            this.currentScreen.render();
        }
    }

    pause() {
        this.isPaused = true;

        if (this.currentScreen && typeof this.currentScreen.onPause === 'function') {
            this.currentScreen.onPause();
        }
    }

    resume() {
        this.isPaused = false;

        if (this.currentScreen && typeof this.currentScreen.onResume === 'function') {
            this.currentScreen.onResume();
        }
    }

    isTransitioning() {
        return this.transition.isInTransition();
    }

    setTransitionSpeed(speed) {
        this.transition.setTransitionSpeed(speed);
        return this;
    }

    getRegisteredScreens() {
        return Array.from(this.screens.keys());
    }

    hasScreen(screenId) {
        return this.screens.has(screenId);
    }

    forceStopTransition() {
        this.transition.cancelTransition();
    }

    cleanup() {
        this.transition.cancelTransition();

        for (const [_, screen] of this.screens.entries()) {
            if (typeof screen.cleanup === 'function') {
                screen.cleanup();
            }
        }

        this.screens.clear();
        this.currentScreen = null;
        this.nextScreen = null;
        this.isPaused = false;
    }
}