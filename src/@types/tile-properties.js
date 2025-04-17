import TileTypes from "./tile-types";

const TileProperties = {
    [TileTypes.GROUND]: { collidable: true, walkable: true, isPlatform: false },
    [TileTypes.PLATFORM]: { collidable: true, walkable: true, isPlatform: true },
    [TileTypes.DECORATION]: { collidable: false, walkable: false, isPlatform: false }
};

export default TileProperties