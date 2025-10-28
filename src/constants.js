const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Screen.getMode();
const TILE_SIZE = 16;
const BACKGROUND_SIZE = 64;
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
const SCREENS = {
    MENU: 'MENU',
    GAME: 'GAME'
}
const PLAYERS_PORT = {
    PLAYER_ONE: 0,
    PLAYER_TWO: 1
}

const PLAYER_MOVEMENT = {
    DEFAULT_GRAVITY: 0.4,
    DEFAULT_JUMP_STRENGTH: -1,
    DEFAULT_JUMPS: 2,
    DEFAULT_SPEED: 16,
    WALL_SLIDE_SPEED: 1,
    MAX_Y_VELOCITY: 10
};

const TILE_TYPES = {
    BACKGROUND: 'background',
    GROUND: 'ground',
    NON_COLLIDABLE: 'NON_COLLIDABLE',
    PLATFORM: 'platform',
    DECORATION: 'decoration',
    WALL: 'wall',
};
const TRAP_TYPES = {
    SPIKE: 'spike',
    SPIKE_HEAD: 'spike_head',
    BOX: 'box',
    SAW: 'saw'
};
const TILE_PROPERTIES = {
    [TILE_TYPES.GROUND]: { collidable: true, walkable: true, isPlatform: false },
    [TILE_TYPES.NON_COLLIDABLE]: { collidable: false, walkable: false, isPlatform: false },
    [TILE_TYPES.PLATFORM]: { collidable: true, walkable: true, isPlatform: true },
    [TILE_TYPES.DECORATION]: { collidable: false, walkable: false, isPlatform: false },
    [TILE_TYPES.WALL]: { collidable: true, walkable: false, isPlatform: false },
    [TILE_TYPES.BACKGROUND]: { collidable: false, walkable: false, isPlatform: false },
};

const BUTTONS = {
    SELECT: 'SELECT',
    START: 'START',
    UP: 'UP',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    TRIANGLE: 'TRIANGLE',
    CIRCLE: 'CIRCLE',
    CROSS: 'CROSS',
    SQUARE: 'SQUARE',
    L1: 'L1',
    R1: 'R1',
    L2: 'L2',
    R2: 'R2',
    L3: 'L3',
    R3: 'R3'
};

const DELTA_TIME = 16.67 / 1000

export {
    ASSETS_PATH,
    SCREENS,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    TILE_SIZE,
    BACKGROUND_SIZE,
    BUTTONS,
    TILE_PROPERTIES,
    TILE_TYPES,
    PLAYERS_PORT,
    TRAP_TYPES,
    DELTA_TIME,
    PLAYER_MOVEMENT
}