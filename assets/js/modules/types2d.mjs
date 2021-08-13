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
  collision(circle) {
    return (this.distanceTo(circle) < (this._radius + circle._radius));
  }
  intersection(x, y, rX, rY) {}
  circleIntersection(circle) {}
  boxIntersection(box) {}
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
    const dX = point.x - this._x;
    const pX = this._rX - Math.abs(dX);
    if (pX <= 0) {
      return null;
    }

    const dY = point.y - this._y;
    const pY = this._rY - Math.abs(dY);
    if (pY <= 0) {
      return null;
    }

    if (pX < pY) {
      const sX = Math.sign(dX);
      return {
        delta: { x: pX * sX , y: 0 },
        normal: sX,
        pos: { x: this._x + (this._rX * sX) , y: point.y }
      }
    } else {
      const sY = Math.sign(dY);
      return {
        delta: { x: 0, y: pY * sY },
        normal: sY,
        pos: { x: point.x , y: this._y + (this._rX * sX) }
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
  vectorIntersection(origin, vector, pX=0, pY=0) {
    const scaleX = 1.0 / vector.x;
    const scaleY = 1.0 / vector.y;
    const signX = Math.sign(scaleX);
    const signY = Math.sign(scaleY);
    const nearTimeX = (this._x - signX * (this._rX + pX) - origin.x) * scaleX;
    const nearTimeY = (this._y - signY * (this._rY + pY) - origin.y) * scaleY;
    const farTimeX = (this._x + signX * (this._rX + pX) - origin.x) * scaleX;
    const farTimeY = (this._y + signY * (this._rY + pY) - origin.y) * scaleY;

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
      hit.normal ={
        x: -signX,
        y: 0
      };
    } else {
      hit.normal = {
        x: 0,
        y: -signY
      };
    }
    hit.delta = {
      x: (1.0 - hit.time) * -vector.x,
      y: (1.0 - hit.time) * -vector.y
    };
    hit.pos = {
      x: origin.x + vector.x * hit.time,
      y: origin.y + vector.y * hit.time
    };

    return hit;
  }

  /**
   * Performs a collision test that checks where the two boxes are overlapping
   * and indicates the closest point to move them out of collision.
   *  @param {Object} box - The BoundingBox to check for intersection
   *  @return {Object} An object describing any collision or null if no collision
   */
  intersection(box) {
    const dX = box._x - this._x;
    const pX = (box._rX + this._rX) - Math.abs(dX);
    if (pX <= 0) {
      return null;
    }

    const dY = box._y - this._y;
    const pY = (box._rY + this._rY) - Math.abs(dY);
    if (pY <= 0) {
      return null;
    }

    if (pX < pY) {
      const sX = Math.sign(dX);
      return {
        delta: { x: pX * sX , y: 0 },
        normal: sX,
        pos: { x: this._x + (this._rX * sX) , y: box._y }
      }
    } else {
      const sY = Math.sign(dY);
      return {
        delta: { x: 0, y: pY * sY },
        normal: sY,
        pos: { x: box._x , y: this._y + (this._rY * sY) }
      }
    }
  }

  /**
   * Performs a collision test for a bounding box moving along a vector
   *  @param {object} box
   */
  sweptIntersection(box, vector) {
    // If box isn't moving we can just do a static intersection
    if (vector.x === 0 && vector.y === 0) {
      return this.intersection(box);
    }
    // Sweeping a box is the same as sweeping a vector with the target dimensions
    // increased by the box's radius
    const hit = this.vectorIntersection(box, vector, box._rX, box._rY);
    if (hit) {
      hit.delta.x += vector.x;
      hit.delta.y += vector.y;
    }
    return hit;
  }
}
