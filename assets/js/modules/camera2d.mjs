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
