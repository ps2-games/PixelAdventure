import Assets from "./assets.js";

// Assets
const ASSETS_PATH = {
    Backgrounds: './assets/images/background',
    Sheets: './assets/images/sheets',
    Fruits: './assets/images/sheets/fruits',
    Characters: './assets/images/sheets/characters',
    Sounds: './assets/sounds',
    SFX: './assets/sounds/sfx',
    TileSet: './assets/images/tileset',
    UI: './assets/images/ui',
    VFX: './assets/images/vfx',
    TRAPS: './assets/images/sheets/traps'
}

// Player
const PLAYERS_PORT = {
    PLAYER_ONE: 0,
    PLAYER_TWO: 1
}
const PLAYER_MOVEMENT = {
    DEFAULT_GRAVITY: 0.8,
    DEFAULT_JUMP_STRENGTH: -2,
    DEFAULT_JUMPS: 2,
    DEFAULT_SPEED: 18,
    WALL_SLIDE_SPEED: 2,
    MAX_Y_VELOCITY: 16
};
const PLAYER_ANIMATION = {
    IDLE: 'IDLE',
    RUN: 'RUN',
    JUMP: 'JUMP',
    FALL: 'FALL',
    DOUBLE_JUMP: 'DOUBLE_JUMP',
    WALL_JUMP: 'WALL_JUMP',
    HIT: "HIT",
};

// Fruits
const FRUIT_ANIMATION = {
    IDLE: 'IDLE',
    COLLECTED: 'COLLECTED'
}
const FRUITS = {
    APPLE: 'Apple',
    BANANAS: 'Bananas',
    CHERRIES: 'Cherries',
    KIWI: 'Kiwi',
    MELON: 'Melon',
    ORANGE: 'Orange',
    PINEAPPLE: 'Pineapple',
    STRAWBERRY: 'Strawberry'
}

// Traps
const TRAP_TYPES = {
    SPIKE: 'spike',
    SPIKE_HEAD: 'spike_head',
    BOX: 'box',
    SAW: 'saw'
};
const BOX_TRAP_ANIMATION = {
    IDLE: 'IDLE',
    HIT: 'HIT',
    BREAK: 'BREAK'
};
const SAW_TRAP_ANIMATIONS = {
    ON: 'ON',
};

//Tiles
const TILE_SIZE = 16;
const BACKGROUND_SIZE = 64;
const TILE_TYPES = {
    BACKGROUND: 'background',
    GROUND: 'ground',
    NON_COLLIDABLE: 'NON_COLLIDABLE',
    PLATFORM: 'platform',
    DECORATION: 'decoration',
    WALL: 'wall',
};
const TILE_PROPERTIES = {
    [TILE_TYPES.GROUND]: { collidable: true, walkable: true, isPlatform: false },
    [TILE_TYPES.NON_COLLIDABLE]: { collidable: false, walkable: false, isPlatform: false },
    [TILE_TYPES.PLATFORM]: { collidable: true, walkable: true, isPlatform: true },
    [TILE_TYPES.DECORATION]: { collidable: false, walkable: false, isPlatform: false },
    [TILE_TYPES.WALL]: { collidable: true, walkable: false, isPlatform: false },
    [TILE_TYPES.BACKGROUND]: { collidable: false, walkable: false, isPlatform: false },
};

//General Config
const SCREENS = {
    MENU: 'MENU',
    GAME: 'GAME'
}
const TARGET_FPS = 30;
const DELTA_TIME = Math.fround(1.0 / TARGET_FPS);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Screen.getMode();

// Audio
const PICKUP_FRUI_SFX = Assets.sound(`${ASSETS_PATH.SFX}/pickup_fruit.adp`)

export {
    ASSETS_PATH,
    SCREENS,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    TILE_SIZE,
    BACKGROUND_SIZE,
    TILE_PROPERTIES,
    TILE_TYPES,
    PLAYERS_PORT,
    TRAP_TYPES,
    DELTA_TIME,
    PLAYER_MOVEMENT,
    BOX_TRAP_ANIMATION,
    SAW_TRAP_ANIMATIONS,
    FRUIT_ANIMATION,
    PLAYER_ANIMATION,
    PICKUP_FRUI_SFX,
    FRUITS
}