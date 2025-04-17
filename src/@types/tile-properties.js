import TileTypes from "./tile-types";

const TileProperties = {
    [TileTypes.GROUND]: { collidable: true, walkable: true },
    [TileTypes.PLATFORM]: { collidable: true, walkable: true },
    [TileTypes.DECORATION]: { collidable: false, walkable: false }
};

export default TileProperties