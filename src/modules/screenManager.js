import Transition from "../shared/transition.js";

export default class ScreenManager {
    constructor() {
        this.screens = new Map();
        this.currentScreen = null;
        this.nextScreen = null;
        this.transition = new Transition();

        this.isInitialized = false;
        this.isPaused = false;
        this.defaultScreen = null;

        this._enterPromise = null;
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
        const oldScreen = this.screens.get(screenId);
        if (oldScreen && typeof oldScreen.onExit === 'function') oldScreen.onExit();

        this.currentScreen = this.screens.get(screenId);
        this.nextScreen = null;

        this._enterPromise = Promise.resolve(this.currentScreen.onEnter());

        this._enterPromise.then(() => {
            this._enterPromise = null;
            if (callback) callback(screenId);
        });
    }

    update(deltaTime) {
        if (this.isPaused || this._enterPromise) return;

        this.transition.update();

        if (!this.transition.isInTransition() && this.currentScreen) {
            if (typeof this.currentScreen.update === 'function') {
                this.currentScreen.update(deltaTime);
            }
        }
    }

    render(deltaTime) {
        if (this._enterPromise) {
            this.transition.render();
            return;
        }

        if (this.transition.isInTransition()) {
            this.transition.render();
        } else if (this.currentScreen) {
            this.currentScreen.render(deltaTime);
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