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

/**
 * Defines a circular point in 2D space that can collide and detect collision
 */
export class BoundingCircle extends Point2D {
  /**
   * Creates a new bounding circle
   *  @param {number} x - The x position of the centre of the circle
   *  @param {number} y - The y position of the centre of the circle
   *  @param {number} radius - Radius of the circle
   */
  constructor(x, y, radius) {
    super(x, y);
    this._radius = radius;
  }
  /**
   * Copies the values of another BoundingCircle to this one
   *  @param {Object} circle - The BoundingCircle to copy
   */
  copy(circle) {
    this._x = circle._x;
    this._y = circle._y;
    this._radius = circle._radius;
  }
  /**
   * Get the radius value
   *  @return {number} The radius value
   */
  get radius() { return this._radius; }
  /**
   * Set the radius of the box
   *  @param {number} val - the new circle radius
   */
  set radius(val) { this._radius = val; }

  /**
   * Detects if collision has occured between two bounding circles
   */
  collides(circle) {
    return (this.distanceTo(circle) < (this._radius + circle._radius));
  }

  /** NOT YET IMPLEMENTED */
  intersects(circle) {return null;}
}

/**
 * Defines a rectanglular region in 2D space that can collide and detect collision
 * Implements an Axis Aligned Bounding Box (AABB)
 *  @extends Point2D
 */
export class BoundingBox extends Point2D {
  /**
   * Creates a new bounding box
   *  @param {number} x - The x position of the center of the box
   *  @param {number} y - The y position of the center of the box
   *  @param {number} rX - Distance from center to x sides
   *  @param {number} rY - Distance from center to y sides
   */
  constructor(x, y, rX, rY) {
    super(x, y);
    this._rX = rX;
    this._rY = rY;
  }
  /**
   * Copies the values of another BoundingBox to this one
   *  @param {Object} box - the BoundingBox to copy
   */
  copy(box) {
    this._x = box._x;
    this._y = box._y;
    this._rX = box._rX;
    this._rY = box._rY;
  }

  get radiusX() { return this._rX; }
  set radiusX(val) { this._rX = val; }
  get radiusY() { return this._rY; }
  set radiusY(val) { this._rY = val; }

  /**
   * Checks whether the point is within the box boundary
   *  @param {Object} point - The Point2D cordinates to check
   *  @return {object} An object describing any collision or null if no collision
   */
  pointIntersection(point) {
    const dX = point.x - this.x;
    const pX = this.rX - Math.abs(dX);
    if (pX <= 0) {
      return null;
    }

    const dY = point.y - this.y;
    const pY = this.rY - Math.abs(dY);
    if (pY <= 0) {
      return null;
    }

    if (pX < pY) {
      const sX = Math.sign(dX);
      return {
        delta: { x: pX * sX , y: 0 },
        normal: sX,
        pos: { x: this.x + (this.rX * sX) , y: point.y };
      }
    } else {
      const sY = Math.sign(dY);
      return {
        delta: { x: 0, y: pY * sY },
        normal: sY,
        pos: { x: point.x , y: this.y + (this.rX * sX) };
      }
    }
  }

  /**
   * Checks if a vector intersects this bounding box anywhere along it's length
   *  @param {Object} origin Point2D describing the origin of the vector
   *  @param {Object} vector Vector2D describing the vector
   *  @param {number} pX X axis padding to add to bounding box dimensions
   *  @param {number} pY Y axis padding to add to bounding box dimensions
   */
  vectorIntersection(origin, vector, pX, pY) {
    const scaleX = 1.0 / vector.x;
    const scaleY = 1.0 / vector.y;
    const signX = Math.sign(scaleX);
    const signY = Math.sign(scaleY);
    const nearTimeX = (this.x - signX * (this.rX + pX) - origin.x) * scaleX;
    const nearTimeY = (this.y - signY * (this.rY + pY) - origin.y) * scaleY;
    const farTimeX = (this.x + signX * (this.rX + pX) - origin.x) * scaleX;
    const farTimeY = (this.y + signY * (this.rY + pY) - origin.y) * scaleY;

    if (nearTimeX > farTimeY || nearTimeY > farTimeX) {
      return null;
    }

    const nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY;
    const farTime = farTimeX > farTimeY ? farTimeX : farTimeY;

    if (nearTime >= 1 || farTime <= 0) {
      return null;
    }

    let hit = {time: Math.clamp(nearTime, 0, 1)};
    if (nearTimeX > nearTimeY) {
      hit.normal.x = -signX;
      hit.normal.y = 0;
    } else {
      hit.normal.x = 0;
      hit.normal.y = -signY;
    }
    hit.delta.x = (1.0 - hit.time) * -vector.x;
    hit.delta.y = (1.0 - hit.time) * -vector.y;
    hit.pos.x = origin.x + vector.x * hit.time;
    hit.pos.y = origin.y + vector.y * hit.time;

    return hit;
  }

  /**
   * Performs a comprehensive collision test that checks where the two boxes are
   * overlapping and indicates the closest point to move them out of collision.
   *  @param {Object} box - The BoundingBox to check for intersection
   *  @return {Object} a dictionary with side: axis of intersection and
   *                     pos: closest point of non-intersection
   */
  intersects(box) {
    // Find the amount of intersection for the left and right sides
    const x1 = (box._x + box._w) - this._x;
    const x2 = (this._x + this._w) - box._x;
    let x = 0, xPos = 0;
    // Find the closest side
    if (x1 < x2) {
      x = x1;
      xPos = this._x - (box._w + 1);
    } else {
      x = x2;
      xPos = this._x + this._w + 1;
    }
    // If x is negative there's no collision in x which means
    // the boxes aren't intersecting
    if (x < 0) return null;

    // Find the amount of intersection for the top and bottom sides
    const y1 = (box._y + box._h) - this._y;
    const y2 = (this._y + this._h) - box._y;
    let y = 0, yPos = 0;
    if (y1 < y2) {
      y = y1;
      yPos = this._y - (box._h + 1);
    } else {
      y = y2;
      yPos = this._y + this._h + 1;
    }
    if (y < 0) return null;

    // Find the closest axis
    if (x < y) {
      // x collision
      return {side: 'x', pos: xPos};
    } else {
      return {side: 'y', pos: yPos};
    }
  }

  /**
   * Checks the entire boundingBox passed is inside this one.
   *  @param {Object} box - The box to check
   *  @return {boolean} True/False whether the box passed is contained within this one
   */
  contains(box) {
    if (this._x < box._x && this._y < box._y &&
        this._x + this._w > box._x + box._w &&
        this._y + this._h > box._y + box._h) {
      return true;
    }
    return false;
  }
}

export { Point2D, Vector2D, BoundingCircle, BoundingBox };
