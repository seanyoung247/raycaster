/** @module tilemap2d */

/**
 * Stores individual tile information
 */
class Tile2D {
  /**
   * Creates a new tile
   *  @param {number} type - Surface type of this tile
   *  @param {boolean} passable - Can this tile be traversed?
   *  @param {boolean} opaque - Does this tile stop ray traversal?
   */
  constructor(type, blocking, opaque) {
    this._type = type;
    this._blocking = blocking;
    this._opaque = opaque;
  }
  /** Returns tile type */
  get type() {
    return this._type;
  }
  /** Sets tile type */
  set type(val) {
    this._type = val;
  }
  /** Returns tile passability */
  get blocking() {
    return this._blocking;
  }
  /** Sets tile passability */
  set blocking(val) {
    this._blocking = val;
  }
  /** Returns whether the tile is opaque to rays */
  get opaque() {
    return this._opaque;
  }
  /** Sets whether the tile is opaque to rays */
  set opaque(val) {
    this._opaque = val;
  }
}