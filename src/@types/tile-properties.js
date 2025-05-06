import TileTypes from "./tile-types.js";

const TileProperties = {
    [TileTypes.GROUND]: { collidable: true, walkable: true, isPlatform: false },
    [TileTypes.PLATFORM]: { collidable: true, walkable: true, isPlatform: true },
    [TileTypes.DECORATION]: { collidable: false, walkable: false, isPlatform: false },
    [TileTypes.WALL]: { collidable: true, walkable: false, isPlatform: false },
    [TileTypes.BACKGROUND]: { collidable: false, walkable: false, isPlatform: false },
};

export default TileProperties