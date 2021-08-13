/**
 * @module types2d
 *
 *  Defines types for working in 2D space
 *
 */
Math.clamp = function(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/**
 * Models a point in 2D space
 */
export class Point2D {
  /**
   * Creates a point
   *  @param {number} x - The x axis coordinate of the point
   *  @param {number} y - The y axis coordinate of the point
   */
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  /**
   * Creates a copy of this point
   */
  clone() {
    return new Point2D(this._x, this._y);
  }
  /**
   * Copies the values of another point to this one
   *  @param {Object} point - The point to copy to this one
   */
  copy(point) {
    this._x = point._x;
    this._y = point._y;
  }
  /**
   * Gets the x coordinate of this point
   *  @return {number} The x axis coordinate
   */
  get x() { return this._x; }
  /**
   * Sets the x coordinate of this point
   *  @param {number} val - The new value for the x axis coordinate
   */
  set x(val) { this._x = val; }
  /**
   * Gets the x coordinate of this point
   *  @return {number} The y axis coordinate
   */
  get y() { return this._y; }
  /**
   * Sets the y coordinate of this point
   *  @param {number} val - The new value for the y axis coordinate
   */
  set y(val) { this._y = val; }
  /**
   * Calculates the distance between two points
   *  @param {Object} point - The point to measure distance to
   *  @return {number} The distance between this point and the one passed
   */
  distanceTo(point) {
    const x = point._x - this._x;
    const y = point._y - this._y;
    return Math.sqrt( (x * x) + (y * y) );
  }
  /**
   * Calculates the square of the distance between two points
   *  @param {Object} point - The point to measure distance to
   *  @return {number} The square of distance between this point and the one passed
   */
   distanceTo2(point) {
     const x = point._x - this._x;
     const y = point._y - this._y;
     return (x * x) + (y * y);
   }
}

/**
 * Models a 2D vector
 *  @extends Point2D
 */
export class Vector2D extends Point2D {
  /**
   * Creates a Vector
   *  @param {number} x - The x axis scalar of the vector
   *  @param {number} y - The y axis scalar of the vector
   */
  constructor(x, y) {
    super(x, y);
  }
  clone() {
    return new Vector2D(this._x, this._y);
  }
  /**
   * Normaizes this vector. A normalized vector is one with a magnitude of 1.
   */
  normalize() {
    const mag = this.magnitude;
    this._x /= mag;
    this._y /= mag;
  }
  /**
   * Gets the euclidean distance (length) of this vector
   *  @return {number} The magintude of this vector
   */
  get magnitude() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }
  /**
   * Rescales this vector to a new magnitude
   *  @param {number} val - the new magnitude of the vector
   */
  set magnitude(val) {
    // First reset the length of the vector to 1
    this.normalize();
    //Then multiply it by it's new magnitude
    this._x *= val;
    this._y *= val;
  }
  /**
   * Converts this vector to angular vector notation
   *  @return {number} the angle of this vector in radians
   */
  get radians() {
    return Math.atan2(this._y, this._x);
  }
  /**
   * Converts this vector from angular vector notation
   *  @param {number} val - The new angular value
   */
  set radians(val) {
    this._x = Math.cos(val);
    this._y = Math.sin(val);
  }
  /**
   * Rotates this vector by another vector in a given direction
   *  @param {number} x - The x scalar of the vector to rotate by
   *  @param {number} y - The y scalar of the vector to rotate by
   *  @param {number} direction - -1 to rotate clockwise, 1 to rotate anti-clockwise
   */
  rotate(x, y, direction = -1) {
    const tX = this._x * x + (this._y * -direction) * y;
    const tY = (this._x * y + (this._y * direction) * x) * direction;
    this._x = tX;
    this._y = tY;
  }
  // Addative rotation
  /**
   * Rotates this vector clockwise by an angle in radians
   *  @param {number} radians - The angle to rotate by in radians
   */
  rotateByRadians(radians) {
    this.rotate(
      Math.cos(radians),
      Math.sin(radians), 1
    );
  }
  /**
   * Rotates this vector clockwise by another vector
   *  @param {number} vector - The vector to rotate by
   */
  rotateByVector(vector) {
    this.rotate(vector._x, vector._y, 1);
  }
  // Subtractive Rotation
  /**
   * Rotates this vector anti-clockwise by an angle in radians
   *  @param {number} radians - The angle to rotate by in radians
   */
  unrotateByRadians(radians) {
    this.rotate(
      Math.cos(radians),
      Math.sin(radians), -1
    );
  }
  /**
   * Rotates this vector anti-clockwise by another vector
   *  @param {number} vector - The vector to rotate by
   */
  unrotateByVector(vector) {
    this.rotate(vector._x, vector._y, -1);
  }
}
