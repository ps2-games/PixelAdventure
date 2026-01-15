class Gamepad {
    static #instance;
    static #zero = Object.freeze({ x: 0, y: 0 });
    static #deadIface = Object.freeze({
        pressed: () => false,
        justPressed: () => false,
        leftStick: () => Gamepad.#zero,
        rightStick: () => Gamepad.#zero,
        pressure: () => 0,
        rumble: () => { },
        isActive: () => false,
        getType: () => 0,
        getPort: () => -1
    });

    constructor() {
        if (Gamepad.#instance) return Gamepad.#instance;
        Gamepad.#instance = this;
        this.MAX_PLAYERS = 2;
        this.players = new Map();
        this.#init();
    }

    #init() {
        for (let p = 0; p < this.MAX_PLAYERS; p++) this.#attach(p);
    }

    #attach(p) {
        try {
            const type = Pads.getType(p);
            this.players.set(p, type ? {
                pad: Pads.get(p),
                port: p,
                type,
            } : null);
        } catch {
            this.players.set(p, null);
        }
    }

    update() {
        for (let p = 0; p < this.MAX_PLAYERS; p++) {
            const player = this.players.get(p);
            const type = Pads.getType(p);

            if (!player) {
                if (type) this.#attach(p);
                continue;
            }

            if (!type) {
                this.players.set(p, null);
                continue;
            }

            try {
                player.pad.update();
            } catch {
                this.players.set(p, null);
            }
        }
    }

    player(p) {
        if (p < 0 || p >= this.MAX_PLAYERS) return Gamepad.#deadIface;
        return this.#live(this.players.get(p), p);
    }

    #live(player, p) {
        if (!player) return Gamepad.#deadIface;

        const stick = (x, y) => this.#run(
            () => ({ x: x / 128.0, y: y / 128.0 }),
            Gamepad.#zero
        );

        return {
            pressed: b => this.#run(() => player.pad.pressed(b), false),
            justPressed: b => this.#run(() => player.pad.justPressed(b), false),
            leftStick: () => stick(player.pad.lx, player.pad.ly),
            rightStick: () => stick(player.pad.rx, player.pad.ry),
            pressure: b => this.#run(() => Pads.getPressure(p, b), 0),
            rumble: (big, small) => this.#run(() => Pads.rumble(p, big, small)),
            isActive: () => true,
            getType: () => player.type,
            getPort: () => p
        };
    }

    #run(fn, fallback) {
        try {
            return fn();
        } catch {
            return fallback;
        }
    }

    isPlayerActive(p) {
        return p >= 0 && p < this.MAX_PLAYERS && this.players.get(p) !== null;
    }

    getActivePlayersCount() {
        return [...this.players.values()].filter(Boolean).length;
    }

    getActivePorts() {
        return [...this.players.entries()].flatMap(([k, v]) => v ? [k] : []);
    }
}
export default new Gamepad();