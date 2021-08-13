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
   * Detects if two bounding circles are currently in collision
   *  @param {Object} circle The circle to check
   *  @return {boolean} True if in collision otherwise false
   */
  collision(circle) {
    return (this.distanceTo(circle) < (this._radius + circle._radius));
  }

  intersection(x, y, rX, rY) {

  }

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
   * Checks if an object is colliding with this one
   *  @param {number} x The x coordinate of the center of the object
   *  @param {number} y The y coordinate of the center of the object
   *  @param {number} rX The offset between the object's center and x-axis sides
   *  @param {number} rY The offset between the object's center and y-axis sides
   */
  intersection(x, y, rX, rY) {
    const dX = x - this._x;
    const pX = (rX + this._rX) - Math.abs(dX);
    // If the object isn't overlapping on the x axis, it can't be intersecting this one
    if (pX <= 0) return null;

    const dY = y - this._y;
    const pY = (rY + this._rY) - Math.abs(dY);
    if (pY <= 0) return null;

    if (pX < pY) {
      // Closest to x axis - so x was the collision point
      const sX = Math.sign(dX);
      return {
        delta: {x: pX * sX, y: 0},
        normal: sX,
        pos: {x: this._x + (this._rX * sX), y: y}
      };
    } else {
      const sY = Math.sign(dY);
      return {
        delta: {x: 0, y: pY * sY},
        normal: sY,
        pos: {x: x, y: this._y + (this.rY * sY)}
      };
    }
  }

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
   *  @param {Object} box The BoundingBox to check for intersection
   *  @return {Object} An object describing any collision or null if no collision
   */
  boxIntersection(box) {
    return this.intersection(box._x, box._y, box._rX, box._rY);
  }

  /**
   * Performs an intersection test between this bounding box and a circular
   * collider.
   *  @param {Object} circle The circle that is colliding with this one
   *  @return {Object} An object describing any collision or null if no collision
   */
  circleIntersection(circle) {
    return this.intersection(circle.x, circle.y, circle.radius, circle.radius);
  }

  /**
   * Performs a collision test for a bounding box moving along a vector to detect
   * if the box will intersect at any point while moving along it's vector.
   * Returns a hit object describing the last good position before collision for
   * the object or null if no collision.
   *  @param {Object} box The box that is colliding with this one
   *  @param {Object} vector The Vector2D the box is moving along
   *  @return {Object} hit object describing the collision and last good position
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

  /**
   * Performs a swept intersection test between this bounding box and a circular
   * collider.
   *  @param {Object} circle
   *  @param {Object} vector
   *  @return {Object} hit object describing the collision and last good position
   */
  sweptCircleIntersection(circle, vector) {
    if (vector.x === 0 && vector.y === 0) {
      return this.circleIntersection(circle);
    }
    const hit = this.vectorIntersection(circle, vector, circle.radius, circle.radius);
    if (hit) {
      hit.delta.x += vector.x;
      hit.delta.y += vector.y;
    }
    return hit;
  }
}
