/**
 * @module camera
 *
 *  Defines a 2D raycasting camera and associated classes
 */
import { Point2D, Vector2D } from "./types2d.mjs";
import { Tile2D, TileMap2D } from "./tilemap2d.mjs";

/**
 * Models a ray propegating in 2D space
 */
class Ray2D {
  /**
   * Creates a new Ray2D
   *  @param {Object} origin - The 2D Point origin of the ray
   *  @param {Object} vector - The Propegation vector of the ray
   */
  constructor(origin, vector) {
    this._origin = new Point2D(origin.x, origin.y);
    this._vector = new Vector2D(origin.x, origin.y);
  }

   /** Gets the ray origin point */
  get origin() {
    return this._origin;
  }

  /** Gets the ray direction vector */
  get vector() {
    return this._vector;
  }

  /**
   * Traces the path of this ray through a 2D map, logging any collisions as
   * they occur and then returning these hits as an array of ray hit objects
   * sorted from last hit to first.
   *  @param {Object} map - 2D map to cast through
   *  @param {number} range - maximum number of steps
   *  @returns {Object} A hit descriptor object
   */
  cast(map, range) {
    const calcDistance = (pos, origin, step, vector) => (pos - origin + (1 - step) / 2) / vector;
    const calcOffset = (pos, origin, distance, vector) => (pos + (origin % 1)) + distance * vector;

    // Initial setup - Pulls values to local vars as object property reads can be slow
    const originX = this._origin.x;
    const originY = this._origin.y;

    const vectorX = this._vector.x;
    const vectorY = this._vector.y;

    const rayDeltaX = Math.abs(1 / vectorX);
    const rayDeltaY = Math.abs(1 / vectorY);

    let mapPosX = Math.floor(originX);
    let mapPosY = Math.floor(originY);

    let rayStepX = 0;
    let rayStepY = 0;

    let stepDistX = 0;
    let stepDistY = 0;

    if (vectorX < 0) { // Moving "right" in x.
      rayStepX = -1;
      stepDistX = (originX - mapPosX) * rayDeltaX;
    } else {                  // Moving "left" in x.
      rayStepX = 1;
      stepDistX = (mapPosX + 1.0 - originX) * rayDeltaX;
    }
    if (vectorY < 0) { // Moving "up" in y.
      rayStepY = -1;
      stepDistY = (originY - mapPosY) * rayDeltaY;
    } else {                  // Moving "down" in y.
      rayStepY = 1;
      stepDistY = (mapPosY + 1.0 - originY) * rayDeltaY;
    }

    // Casting
    for (let i = 0; i < range; i++) {
      if (stepDistX < stepDistY) {
        // X step closest to ray path
        stepDistX += rayDeltaX;
        mapPosX += rayStepX;
        // Has the ray hit a wall?
        let tile = map.getTile(mapPosX, mapPosY);
        if (tile.blocking) {
          let distance = calcDistance(mapPosX, originX, rayStepX, vectorX);
          let offset = calcOffset(mapPosY, originY, distance, vectorY);
          return {tile: tile, offset: offset, axis: 'x', distance: distance};
        }

      } else {
        // Y step closest to ray path
        stepDistY += rayDeltaY;
        mapPosY += rayStepY;

        // Has the ray hit a wall?
        let tile = map.getTile(mapPosX, mapPosY);
        if (tile.blocking) {
          let distance = calcDistance(mapPosY, originY, rayStepY, vectorY);
          let offset = calcOffset(mapPosX, originX, distance, vectorX);
          return {tile: tile, offset: offset, axis: 'y', distance: distance};
        }
      }
    }
    return -1;
  }
}

/**
 * Models a 2D raycasting camera.
 */
class RayCamera2D {
  /**
   * Creates a new RayCamera2D
   *  @param {Object} position The x,y coordinates of the camera origin
   *  @param {Object} direction The x,y vector of the camera direction vector
   *  @param {number} fov The Field of view, in radians, for the camera
   *  @param {number} range The maximum distance in world units the camera can see
   */
  constructor(position, direction, columns, fov = 1.57079632679, range = 15) {
    this._position = new Point2D(position.x, position.y);
    this._direction = new Vector2D(direction.x, direction.y);
    this._fov = fov;
    this._range = range;
    this._scene = new Array(columns);
  }

  /** Gets the FOV */
  get fov() {
    return this._fov;
  }
  /**
   * Sets the FOV
   *  @param {number} val The new FOV value in radians
   */
  set fov(val) {
    this._fov = val;
  }

  /** gets the current column count the camera is set for */
  get columns() {
    return this._scene;
  }

  /**
   * Sets the camera's column count
   *  @param {number} val The new column count
   */
  set columns(val) {
    this._scene.length = val;
  }

  /** Gets the camera position */
  get position() {
    return this._position;
  }

  /** Gets the camera direction */
  get direction() {
    return this._direction;
  }

  /** Returns the current scene descriptor */
  get scene() {
    return this._scene;
  }

  /**
   * Casts rays into the map for each column and returns a list of distances
   * describing the camera view.
   *  @param {Object} map The map to cast into
   */
  rayCast(map) {
    const halfFOV = this._fov / 2;
    const columns = this._scene.length;
    const dirX = this._direction.x;
    const dirY = this._direction.y;
    const ray = new Ray2D(this._position, this._direction);

    for (let column = 0; column < columns; column++) {
      // Calculate the ray vector
      let offset = (( (column << 1) / (columns - 1) ) - 1) * halfFOV;
      ray.vector.x = dirX - offset * dirY;
      ray.vector.y = dirY - offset * -dirX;
      // Cast the ray
      this._scene[column] = ray.cast(map, this._range);
    }
  }
}

export { Ray2D, RayCamera2D };
