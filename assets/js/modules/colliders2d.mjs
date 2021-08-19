
import { Point2D, Vector2D } from "./types2d.mjs";

Math.clamp = function(val, min, max) {
 return Math.max(min, Math.min(val, max));
}

/**
 * Defines a circular point in 2D space that can collide and detect collision
 */
export class CircleCollider extends Point2D {
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
   * Copies the values of another CircleCollider to this one
   *  @param {Object} circle - The CircleCollider to copy
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
   * Detects if two CircleColliders are currently in collision
   *  @param {Object} circle The circle to check
   *  @return {boolean} True if in collision otherwise false
   */
  collision(circle) {
    // If the square of distance is smaller than the square of radius, collision has occured.
    return (this.distanceTo2(circle) <
      ((this._radius + circle._radius) * (this._radius + circle._radius)));
  }

  /**
   * Checks if an object is colliding with this one
   *  @param {number} x The x coordinate of the center of the object
   *  @param {number} y The y coordinate of the center of the object
   *  @param {number} radius The offset between the object's center and sides
   *  @return {Object} A hit object describing the collision or null if no collision
   */
  intersection(x, y, radius) {
    // The vector between object centres
    const d = {x: this._x - x, y: this._y - y};
    const dist2 = (d.x * d.x) + (d.y * d.y); // Square of distance
    const cR = this._radius + radius;        // Combined radius
    const r2 = cR * cR;                      // Square of combined radius
    // If the square of distance is smaller than the square of radius, collision has occured.
    if (dist2 < r2) {
      /* d describes a vector between centre points. We can use that vector
         to place the point outside the circle by scaling it to be the same
         length as the combined circle radii */
      const dist = Math.sqrt(dist2);
      const offset = cR - dist;   // Offset distance from point to boundary
      // Normalised vector of collision direction
      const n = {x: d.x / dist, y: d.y / dist};
      // Displacement vector (vector between collision point and current position)
      const v = {x: n.x * offset, y: n.y * offset};
      // First boundary intersection point
      const p = {x: this._x - (n.x * this._radius), y: this._y - (n.y * this._radius)};

      return {
        delta: {x: -v.x, y: -v.y},  // Vector that will move object out of collision
        normal: {x: -n.x, y: -n.y}, // A vector pointing directly away from the collision
        pos: {x: p.x, y: p.y}       // The collision point
      };
    }
    return null;
  }

  /**
   * Checks whether the point is within the circle
   *  @param {Object} point - The Point2D cordinates to check
   *  @return {object} An object describing any collision or null if no collision
   */
  pointIntersection(point) {
    return this.intersection(point.x, point.y, 0);
  }
  /**
   * Performs an intersection test between this CircleCollider and another
   *  @param {Object} circle - The other CircleCollider to test against
   *  @return {Object} A hit object describing the collision or null if no collision
   */
  circleIntersection(circle) {
    return this.intersection(circle._x, circle._y, circle._radius);
  }
  /**
   * Performs an intersection test between this CircleCollider and an AABBCollider
   *  @param {Object} box - The AABBCollider to test against
   *  @return {Object} A hit object describing the collision or null if no collision
   */
  boxIntersection(box) {
    const r = {x: box.radiusX, y: box.radiusY};
    // Get the displacement vector between box and circle centres
    const d = {x: this._x - box.x, y: this._y - box.y};
    // Calculate the point on the box boundary closest to the circle
    const c = {
      x: Math.clamp(d.x, -r.x, r.x),
      y: Math.clamp(d.y, -r.y, r.y)
    };
    const cP = {x: box.x + c.x, y: box.y + c.y};
    if (cP.x === this._x && cP.y === this._y) {
      const b = {w: r.x * 2, h: r.y * 2};
      /* Edge condition: If the circle center point is inside the box cP
        is "stuck" to the circle center which prevents us from calculating where
        to "push" the box out of collision. Treating cP as a collision point
        allows us to push it to the boundary. */
      let hit = box.intersection(cP.x, cP.y, 1, 1);
      cP.x = hit.pos.x - b.w * hit.normal.x;
      cP.y = hit.pos.y - b.h * hit.normal.y;

      hit = this.intersection(cP.x, cP.y, 0);
      // In this case the collision boundary point needs to shift to the other side
      hit.delta.x += b.w * hit.normal.x;
      hit.delta.y += b.h * hit.normal.y;
      return hit;
    }
    // Do a collision test on the closest point
    return this.intersection(cP.x, cP.y, 0);
  }

  /**
   * Performs an intersection test between this CircleCollider and a vector
   *  @param {Object} origin - Point2D of the vector origin point
   *  @param {Object} vector - Vector2D of the vector
   *  @param {number} padding - How much to increase this circle's radius by
   */
  vectorIntersection(origin, vector, padding=0) {
    // Calculate unit vector of vector
    const vM = vector.magnitude;
    const vU = {x: vector.x / vM, y: vector.y / vM};
    // Calculate dot product of vector and circle/origin vector
    const t = vU.x * (this._x - origin.x) + vU.y * (this._y - origin.y);
    // Calculate the point on the infinite line following vector closest to circle centre point
    const e = {x: t * vU.x + origin.x, y: t * vU.y + origin.y};
    const eM2 = ((e.x - this._x) * (e.x - this._x)) + ((e.y - this._y) * (e.y - this._y));
    const r2 = (this._radius + padding) * (this._radius + padding);

    if (eM2 < r2) {
      // Distance to intersection point
      const dt = Math.sqrt(r2 - eM2);
      // Calculate Earliest boundary intersection
      const f = {x: (t-dt) * vU.x + origin.x, y: (t-dt) * vU.y + origin.y};
      // Ensure collision point is within vector
      const p2 = {x: (origin.x + vector.x)-this._x, y: (origin.y + vector.y)-this._y};
      if (p2.x*p2.x+p2.y*p2.y > r2) return null;
      // Calculate collision normal
      const n = {
        x: (f.x - this._x) / (this._radius + padding),
        y: (f.y - this._y) / (this._radius + padding)
      };

      return {
        delta: {x: f.x - origin.x, y: f.y - origin.y},
        normal: {x: n.x, y: n.y},
        pos: {x: f.x, y: f.y}
      }
    }
    return null;
  }

  /**
   * Performs an intersection test for a CircleCollider moving along a given
   * vector. Returns a hit object describing the first intersection that occurs
   * or null if no intersection.
   *  @param {Object} circle - The circle to test
   *  @param {Object} vector - The circle's movement vector
   *  @return {Object} The hit object describing the first intersection or null
   */
  sweptCircleIntersection(circle, vector) {
    const hit = this.vectorIntersection(circle, vector, circle._radius);
    if (hit) {
      // Calculate actual boundary intersection
      hit.pos.x -= hit.normal.x * circle._radius;
      hit.pos.y -= hit.normal.y * circle._radius;
    }
    return hit;
  }

  /**
   *
   */
  sweptBoxIntersection(box, vector) {}
}

/**
 * Defines a rectanglular region in 2D space that can collide and detect collision
 * Implements an Axis Aligned Bounding Box (AABB)
 *  @extends Point2D
 */
export class AABBCollider extends Point2D {
  /**
   * Creates a new AABBCollider
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
   * Copies the values of another AABBCollider to this one
   *  @param {Object} box - the AABBCollider to copy
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
   * Performs a simple collision check on another AABBCollider.
   *  @param {Object} box - The AABBCollider to check for intersection
   *  @return {boolean} true if colliding
   */
  collision(box) {}

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

    if (pX <= pY) {
      // Closest to x axis - so x was the collision point
      const sX = Math.sign(dX);
      return {
        delta: {x: pX * sX, y: 0},
        normal: {x: sX, y: 0},
        pos: {x: this._x + (this._rX * sX), y: y}
      };
    } else {
      const sY = Math.sign(dY);
      return {
        delta: {x: 0, y: pY * sY},
        normal: {x: 0, y: sY},
        pos: {x: x, y: this._y + (this._rY * sY)}
      };
    }
  }

  /**
   * Checks whether the point is within the box boundary
   *  @param {Object} point - The Point2D cordinates to check
   *  @return {object} An object describing any collision or null if no collision
   */
  pointIntersection(point) {
    return this.intersection(point.x, point.y, 0, 0);
  }

  /**
   * Performs a collision test that checks where the two boxes are overlapping
   * and indicates the closest point to move them out of collision.
   *  @param {Object} box The AABBCollider to check for intersection
   *  @return {Object} An object describing any collision or null if no collision
   */
  boxIntersection(box) {
    return this.intersection(box._x, box._y, box._rX, box._rY);
  }

  /**
   * Performs an intersection test between this AABBCollider and a circular
   * collider.
   *  @param {Object} circle The circle that is colliding with this one
   *  @return {Object} An object describing any collision or null if no collision
   */
  circleIntersection(circle) {
    // Treats the circle as a square. Ok for now but needs to be fixed
    return this.intersection(circle.x, circle.y, circle.radius, circle.radius);
  }

  /**
   * Checks if a vector intersects this bounding box anywhere along it's length
   *  @param {Object} origin Point2D describing the origin of the vector
   *  @param {Object} vector Vector2D describing the vector
   *  @param {number} pX X axis padding to add to AABBCollider dimensions
   *  @param {number} pY Y axis padding to add to AABBCollider dimensions
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
    const farTime = farTimeX < farTimeY ? farTimeX : farTimeY;
    if (nearTime >= 1 || farTime <= 0) {
      return null;
    }

    let hit = {time: Math.clamp(nearTime, 0, 1)};
    if (nearTimeX > nearTimeY) {
      hit.normal = {
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
   * Performs a collision test for a AABBCollider moving along a vector to detect
   * if the box will intersect at any point while moving along it's vector.
   * Returns a hit object describing the last good position before collision for
   * the object or null if no collision.
   *  @param {Object} box The box that is colliding with this one
   *  @param {Object} vector The Vector2D the box is moving along
   *  @return {Object} hit object describing the collision and last good position
   */
  sweptBoxIntersection(box, vector) {
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
      // If delta x and y are 0 box is already in intersection before moving
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
    // Treats the circle as a square. Needs improvement.
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
