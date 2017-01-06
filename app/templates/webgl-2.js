// Webgl-2 (FIXING)

// Test 20
// WebGL Demo by Aaron Whyte
// CAVE2D.com

// ------------------------ MATH ---------------------

/* ---- js/math.js ---- */


if (!Math.sign) {
  // Mozilla's suggested polyfill.
  Math.sign = function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x))
      return x;
    return x > 0 ? 1 : -1
  }
}


/* ---- js/poolify.js ---- */


/**
 * Adds a static pool, plus alloc and free methods, to a constructor.
 *
 * That constructor's instances must implement "reset()" which clears
 * the instance in preparation for re-use, taking the same arguments
 * as the constructor.
 *
 * @param {Function} ctor A constructor.
 */
function Poolify(ctor) {
  ctor.pool = [];
  ctor.alloc = Poolify.alloc;
  ctor.free = Poolify.free;
  ctor.prototype.free = function() {
    ctor.free(this);
  };
}

Poolify.alloc = function() {
  var retval;
  if (this.pool.length) {
    retval = this.pool.pop();
    retval.reset.apply(retval, arguments);
  } else {
    retval = Object.create(this.prototype);
    this.apply(retval, arguments);
  }
  return retval;
};

Poolify.free = function(o) {
  this.pool.push(o);
};


/* ---- js/vec2d.js ---- */


/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @constructor
 */
function Vec2d(opt_x, opt_y) {
  this.reset(opt_x, opt_y);
}

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 */
Vec2d.prototype.reset = function(opt_x, opt_y) {
  this.x = opt_x || 0;
  this.y = opt_y || 0;
  return this;
};

Vec2d.pool = [];

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 */
Vec2d.alloc = function(opt_x, opt_y) {
  if (Vec2d.pool.length) {
    return Vec2d.pool.pop().reset(opt_x, opt_y);
  }
  return new Vec2d(opt_x, opt_y);
};

Vec2d.prototype.free = function() {
  Vec2d.pool.push(this);
};

Vec2d.X = 'x';
Vec2d.Y = 'y';

Vec2d.AXES = [Vec2d.X, Vec2d.Y];

Vec2d.ZERO = new Vec2d(0, 0);

Vec2d.otherAxis = function(axis) {
  return axis === Vec2d.X ? Vec2d.Y : Vec2d.X;
};

Vec2d.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  return this;
};

Vec2d.prototype.addXY = function(x, y) {
  this.x += x;
  this.y += y;
  return this;
};

Vec2d.prototype.subtract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

Vec2d.prototype.multiply = function(v) {
  this.x *= v.x;
  this.y *= v.y;
  return this;
};

Vec2d.prototype.roundToGrid = function(cellSize) {
  this.x = Math.round(this.x / cellSize);
  this.y = Math.round(this.y / cellSize);
  return this.scale(cellSize);
};

Vec2d.prototype.set = function(v) {
  this.x = v.x;
  this.y = v.y;
  return this;
};

Vec2d.prototype.setXY = function(xx, yy) {
  this.x = xx;
  this.y = yy;
  return this;
};

Vec2d.prototype.scale = function(s) {
  this.x *= s;
  this.y *= s;
  return this;
};

Vec2d.prototype.scaleXY = function(sx, sy) {
  this.x *= sx;
  this.y *= sy;
  return this;
};

Vec2d.prototype.abs = function() {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};

Vec2d.prototype.sign = function() {
  this.x = Math.sign(this.x);
  this.y = Math.sign(this.y);
  return this;
};

Vec2d.prototype.rot90Right = function() {
  var tmp = this.x;
  this.x = -this.y;
  this.y = tmp;
  return this;
};

Vec2d.prototype.rot = function(rads) {
  if (!rads) {
    // no rotation
    return this;
  }
  var sin = Math.sin(rads);
  var cos = Math.cos(rads);
  var nx = cos * this.x + sin * this.y;
  var ny = -sin * this.x + cos * this.y;
  this.x = nx;
  this.y = ny;
  return this;
};

Vec2d.prototype.dot = function(that) {
  return this.x * that.x + this.y * that.y;
};

Vec2d.dotXYXY = function(x0, y0, x1, y1) {
  return x0 * x1 + y0 * y1;
};

Vec2d.prototype.magnitudeSquared = function() {
  return this.x * this.x + this.y * this.y;
};

Vec2d.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2d.prototype.distanceSquared = function(that) {
  var dx = this.x - that.x;
  var dy = this.y - that.y;
  return dx * dx + dy * dy;
};

Vec2d.prototype.distance = function(that) {
  var dx = this.x - that.x;
  var dy = this.y - that.y;
  return Math.sqrt(dx * dx + dy * dy);
};

Vec2d.magnitude = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

/**
 * Scales to the desired length, or 0 if the vector is {0, 0}
 */
Vec2d.prototype.scaleToLength = function(length) {
  var m = this.magnitude();
  if (m) {
    this.scale(length / m);
  }
  return this;
};

/**
 * If the magnitude is over the max, this scales it down.
 */
Vec2d.prototype.clipToMaxLength = function(maxLength) {
  var m = this.magnitude();
  if (m > maxLength) {
    this.scale(maxLength / m);
  }
  return this;
};

Vec2d.prototype.slideByFraction = function(towardsPoint, fraction) {
  this.x = this.x * (1 - fraction) + towardsPoint.x * fraction;
  this.y = this.y * (1 - fraction) + towardsPoint.y * fraction;
};


Vec2d.prototype.equals = function(v) {
  return (this.x == v.x && this.y == v.y);
};

Vec2d.prototype.isZero = function() {
  return this.x == 0 && this.y == 0;
};

Vec2d.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};

Vec2d.dirs = [
  new Vec2d(0, -1),
  new Vec2d(1, -1),
  new Vec2d(1, 0),
  new Vec2d(1, 1),
  new Vec2d(0, 1),
  new Vec2d(-1, 1),
  new Vec2d(-1, 0),
  new Vec2d(-1, -1)
];

Vec2d.randDir = function() {
  var dir = Vec2d.dirs[Math.floor(Math.random()*8)];
  return new Vec2d(dir.x, dir.y);
};

Vec2d.alongRayDistance = function(startPoint, towardsPoint, distance) {
  return new Vec2d()
      .set(towardsPoint)
      .subtract(startPoint)
      .scaleToLength(distance)
      .add(startPoint);
};

Vec2d.alongRayFraction = function(startPoint, towardsPoint, fraction) {
  return new Vec2d()
      .set(towardsPoint)
      .subtract(startPoint)
      .scale(fraction)
      .add(startPoint);
};

Vec2d.midpoint = function(a, b) {
  return new Vec2d()
      .set(a)
      .add(b)
      .scale(0.5);
};

Vec2d.distance = function(x0, y0, x1, y1) {
  var dx = x0 - x1;
  var dy = y0 - y1;
  return Math.sqrt((dx * dx) + (dy * dy));
};

Vec2d.distanceSq = function(x0, y0, x1, y1) {
  var dx = x0 - x1;
  var dy = y0 - y1;
  return (dx * dx) + (dy * dy);
};

Vec2d.prototype.projectOnto = function(that) {
  var coef = this.dot(that) / that.dot(that);
  return this.set(that).scale(coef);
};

Vec2d.prototype.toJSON = function() {
  return [this.x, this.y];
};

Vec2d.prototype.setFromJSON = function(json) {
  this.x = json[0];
  this.y = json[1];
};

Vec2d.fromJSON = function(json) {
  return new Vec2d(json[0], json[1]);
};


/* ---- js/rect.js ---- */


/**
 * An axis-aligned rectangle with a center and an x and y radius (half height and half width)
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_rx
 * @param {=number} opt_ry
 * @constructor
 */
function Rect(opt_x, opt_y, opt_rx, opt_ry) {
  this.pos = new Vec2d();
  this.rad = new Vec2d();
  this.reset(opt_x, opt_y, opt_rx, opt_ry);
};

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_rx
 * @param {=number} opt_ry
 */
Rect.prototype.reset = function(opt_x, opt_y, opt_rx, opt_ry) {
  this.pos.setXY(opt_x || 0 , opt_y || 0);
  this.rad.setXY(opt_rx || 0, opt_ry || 0);
  return this;
};

Rect.pool = [];

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_rx
 * @param {=number} opt_ry
 */
Rect.alloc = function(opt_x, opt_y, opt_rx, opt_ry) {
  if (Rect.pool.length) {
    return Rect.pool.pop().reset(opt_x, opt_y, opt_rx, opt_ry);
  }
  return new Rect(opt_x, opt_y, opt_rx, opt_ry);
};

Rect.prototype.free = function() {
  Rect.pool.push(this);
};

Rect.free = function(obj) {
  obj.free();
};

Rect.prototype.set = function(r) {
  this.pos.set(r.pos);
  this.rad.set(r.rad);
  return this;
};

Rect.prototype.setToCorners = function(a, b) {
  this.pos.set(a).add(b).scale(0.5);
  this.rad.set(a).subtract(b).scale(0.5).abs();
  return this;
};

Rect.prototype.setPos = function(v) {
  this.pos.set(v);
  return this;
};

Rect.prototype.setRad = function(v) {
  this.rad.set(v);
  return this;
};

Rect.prototype.setPosXY = function(x, y) {
  this.pos.setXY(x, y);
  return this;
};

Rect.prototype.setRadXY = function(x, y) {
  this.rad.setXY(x, y);
  return this;
};

Rect.prototype.padXY = function(x, y) {
  this.rad.x += x;
  this.rad.y += y;
  return this;
};

Rect.prototype.pad = function(p) {
  this.rad.x += p;
  this.rad.y += p;
  return this;
};

Rect.prototype.coverRect = function(that) {
  var minX = Math.min(this.getMinX(), that.getMinX());
  var minY = Math.min(this.getMinY(), that.getMinY());
  var maxX = Math.max(this.getMaxX(), that.getMaxX());
  var maxY = Math.max(this.getMaxY(), that.getMaxY());
  this.pos.setXY((minX + maxX) / 2, (minY + maxY) / 2);
  this.rad.setXY(Math.abs(minX - maxX) / 2, Math.abs(minY - maxY) / 2);
  return this;
};

Rect.prototype.coverVec = function(v) {
  return this.coverXY(v.x, v.y);
};

Rect.prototype.coverXY = function(x, y) {
  var minX = Math.min(this.getMinX(), x);
  var minY = Math.min(this.getMinY(), y);
  var maxX = Math.max(this.getMaxX(), x);
  var maxY = Math.max(this.getMaxY(), y);
  this.pos.setXY((minX + maxX) / 2, (minY + maxY) / 2);
  this.rad.setXY(Math.abs(minX - maxX) / 2, Math.abs(minY - maxY) / 2);
  return this;
};

Rect.prototype.getMinX = function() {
  return this.pos.x - this.rad.x;
};

Rect.prototype.getMinY = function() {
  return this.pos.y - this.rad.y;
};

Rect.prototype.getMaxX = function() {
  return this.pos.x + this.rad.x;
};

Rect.prototype.getMaxY = function() {
  return this.pos.y + this.rad.y;
};

Rect.prototype.getWidth = function() {
  return this.rad.x * 2;
};

Rect.prototype.getHeight = function() {
  return this.rad.y * 2;
};

Rect.prototype.overlapsRectXYXY = function(x, y, rx, ry) {
  return Math.abs(this.pos.x - x) <= this.rad.x + rx &&
         Math.abs(this.pos.y - y) <= this.rad.y + ry;
};



/* ---- js/skipqueue.js ---- */



/**
 * A SkipQueue priority queue, ordered by time.
 * Nodes must have a "time" value, and a "next" array.
 * @constructor
 */
function SkipQueue(base, maxLevel) {
  this.base = base;
  this.maxLevel = maxLevel;
  this.levelUpOdds = 1 / this.base;

  this.level = this.maxLevel;
  this.next = [];
  this.size = 0;  
  this.prevs = [];
}

SkipQueue.getRecommendedMaxLevel = function(expectedLength, base) {
  return Math.ceil(Math.log(expectedLength) / Math.log(base));
};

SkipQueue.prototype.randomLevel = function() {
  var level = 0;
  var rand = Math.random();
  var bar = this.levelUpOdds;
  while (rand < bar && level < this.maxLevel) {
    level++;
    bar *= this.levelUpOdds;
  }
  return level;
};

/**
 * Add a node, in the right order.
 * @param {Object} addMe
 */
SkipQueue.prototype.add = function(addMe) {
  var prevs = this.prevs;
  addMe.level = this.randomLevel();
  
  // set up for traversal
  var node = this;

  var next;
  for (var level = this.maxLevel; level >= 0; --level) {
    // right
    next = node.next[level];
    while (next && next.time < addMe.time) {
      node = next;
      next = node.next[level];
    }
    prevs[level] = node;
  }
  // For the levels that this node blocks, do inserts.
  for (level = addMe.level; level >= 0; --level) {
    addMe.next[level] = prevs[level].next[level];
    prevs[level].next[level] = addMe;
  }
  this.size++;
};

/**
 * Returns the first node, or null if empty, and also removes it.
 */
SkipQueue.prototype.removeFirst = function() {
  var node = this.next[0];
  if (!node) return null;
  for (var level = node.level; level >= 0; --level) {
    this.next[level] = node.next[level];
  }
  this.size--;
  return node;
};

/**
 * Returns the first node without removing it.
 */
SkipQueue.prototype.getFirst = function() {
  return this.next[0];
};

SkipQueue.prototype.toString = function() {
  var node = this.next[0];
  var out = [];
  while (node != null) {
    out.push(node.toString());
    node = node.next[0];
  }
  return '[' + out.join(',\n') + ']';
};


/* ---- js/arrayset.js ---- */


/**
 * A small set, implemented with an array.
 * It has O(n) put, remove, and contains, but it has fast iteration.
 * Good for small sets that will get iterated over a lot.
 * Chrome can optimize this, because there are no for-each loops over arbitrary keys.
 * @constructor
 */
function ArraySet() {
  this.vals = [];
}

ArraySet.prototype.reset = function() {
  this.vals.length = 0;
  return this;
};

Poolify(ArraySet);

ArraySet.prototype.put = function(v) {
  for (var i = 0; i < this.vals.length; i++) {
    if (this.vals[i] == v) {
      return;
    }
  }
  this.vals.push(v);
  return this;
};

ArraySet.prototype.contains = function(v) {
  for (var i = 0; i < this.vals.length; i++) {
    if (this.vals[i] == v) {
      return true;
    }
  }
  return false;
};

ArraySet.prototype.remove = function(v) {
  for (var i = 0; i < this.vals.length; i++) {
    if (this.vals[i] == v) {
      this.vals[i] = this.vals[this.vals.length - 1];
      this.vals.pop();
    }
  }
  return this;
};

ArraySet.prototype.clear = function(v) {
  this.vals.length = 0;
  return this;
};


ArraySet.prototype.removeIndex = function(index) {
  this.vals[index] = this.vals[this.vals.length - 1];
  this.vals.pop();
  return this;
};

ArraySet.prototype.isEmpty = function() {
  return this.vals.length == 0;
};

ArraySet.prototype.getValues = function() {
  return this.vals.concat();
};

ArraySet.prototype.size = function() {
  return this.vals.length;
};


/* ---- js/vec4.js ---- */


/**
 * A 4D vector, for use as a 3D vector, plus a "w" value to help with
 * 3D matrix transformations.
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_z
 * @param {=number} opt_w
 * @constructor
 */
function Vec4(opt_x, opt_y, opt_z, opt_w) {
  this.v = [0, 0, 0, 1];
  this.reset(opt_x, opt_y, opt_z, opt_w);
}

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_z
 * @param {=number} opt_w
 */
Vec4.prototype.reset = function(opt_x, opt_y, opt_z, opt_w) {
  this.v[0] = opt_x || 0;
  this.v[1] = opt_y || 0;
  this.v[2] = opt_z || 0;
  this.v[3] = (typeof opt_w != 'undefined' ? opt_w : 1);
  return this;
};

Vec4.pool = [];

/**
 * @param {=number} opt_x
 * @param {=number} opt_y
 * @param {=number} opt_z
 * @param {=number} opt_w
 */
Vec4.alloc = function(opt_x, opt_y, opt_z, opt_w) {
  if (Vec4.pool.length) {
    return Vec4.pool.pop().reset(opt_x, opt_y, opt_z, opt_w);
  }
  return new Vec4(opt_x, opt_y, opt_z, opt_w);
};

Vec4.prototype.free = function() {
  Vec4.pool.push(this);
};

Vec4.ZERO = new Vec4();

Vec4.temp = new Vec4();

/**
 * Transforms this vector by multiplying it by the matrix.
 * @param {Matrix44} matrix
 * @returns {Vec4}
 */
Vec4.prototype.transform = function(matrix) {
  Vec4.temp.reset();
  // In this case we want even "w" to be 0. It will get a 1 if the math works out.
  Vec4.temp.v[3] = 0;
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      Vec4.temp.v[row] += this.v[col] * matrix.m[col + 4*row];
    }
  }
  return this.set(Vec4.temp);
};

Vec4.prototype.add = function(that) {
  for (var i = 0; i < 3; i++) {
    this.v[i] += that.v[i];
  }
  return this;
};

Vec4.prototype.addXYZ = function(x, y, z) {
  this.v[0] += x;
  this.v[1] += y;
  this.v[2] += z;
  return this;
};

Vec4.prototype.subtract = function(that) {
  for (var i = 0; i < 3; i++) {
    this.v[i] -= that.v[i];
  }
  return this;
};

Vec4.prototype.set = function(that) {
  for (var i = 0; i < 4; i++) {
    this.v[i] = that.v[i];
  }
  return this;
};

Vec4.prototype.setXYZ = function(x, y, z) {
  this.v[0] = x;
  this.v[1] = y;
  this.v[2] = z;
  return this;
};

Vec4.prototype.setRGBA = function(r, g, b, a) {
  this.v[0] = r;
  this.v[1] = g;
  this.v[2] = b;
  this.v[3] = a;
  return this;
};

Vec4.prototype.getX = Vec4.prototype.getR = function() {
  return this.v[0];
};

Vec4.prototype.getY = Vec4.prototype.getG = function() {
  return this.v[1];
};

Vec4.prototype.getZ = Vec4.prototype.getB = function() {
  return this.v[2];
};

Vec4.prototype.getW = Vec4.prototype.getA = function() {
  return this.v[2];
};

Vec4.prototype.scale1 = function(s) {
  for (var i = 0; i < 3; i++) {
    this.v[i] *= s;
  }
  return this;
};

Vec4.prototype.abs = function() {
  for (var i = 0; i < 3; i++) {
    this.v[i] = Math.abs(this.v[i]);
  }
  return this;
};

Vec4.prototype.sign = function() {
  for (var i = 0; i < 3; i++) {
    this.v[i] = Math.sign(this.v[i]);
  }
  return this;
};

Vec4.prototype.dot = function(that) {
  var dot = 0;
  for (var i = 0; i < 3; i++) {
    dot += this.v[i] * that.v[i];
  }
  return dot;
};

Vec4.prototype.magnitudeSquared = function() {
  return this.dot(this);
};

Vec4.prototype.magnitude = function() {
  return Math.sqrt(this.magnitudeSquared());
};

/**
 * Scales to the desired length, or 0 if the vector is {0, 0}
 */
Vec4.prototype.scaleToLength = function(length) {
  var m = this.magnitude();
  if (m) {
    this.scale1(length / m);
  }
  return this;
};

/**
 * If the magnitude is over the max, this scales it down.
 */
Vec4.prototype.clipToMaxLength = function(maxLength) {
  var m = this.magnitude();
  if (m > maxLength) {
    this.scale1(maxLength / m);
  }
  return this;
};

Vec4.prototype.setToInterpolation = function(a, b, t) {
  for (var i = 0; i < 4; i++) {
    this.v[i] = a.v[i] * (1-t) + b.v[i] * t;
  }
  return this;
};


Vec4.prototype.equals = function(that, opt_slop) {
  var slop = opt_slop || 0;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(this.v[i] - that.v[i]) > slop) return false;
  }
  return true;
};

Vec4.prototype.toString = function() {
  return '(' + this.v.join(', ') + ')';
};

Vec4.alongRayDistance = function(startPoint, towardsPoint, distance) {
  return new Vec4()
      .set(towardsPoint)
      .subtract(startPoint)
      .scaleToLength(distance)
      .add(startPoint);
};

Vec4.alongRayFraction = function(startPoint, towardsPoint, fraction) {
  return new Vec4()
      .set(towardsPoint)
      .subtract(startPoint)
      .scale(fraction)
      .add(startPoint);
};

Vec4.midpoint = function(a, b) {
  return new Vec4()
      .set(a)
      .add(b)
      .scale(0.5);
};

Vec4.prototype.projectOnto = function(that) {
  var coef = this.dot(that) / that.dot(that);
  return this.set(that).scale(coef);
};

Vec4.prototype.toJSON = function() {
  return [this.v[0], this.v[1], this.v[2], this.v[3]];
};

Vec4.prototype.setFromJSON = function(json) {
  for (var i = 0; i < 3; i++) {
    this.v[i] = json[i];
  }
};

Vec4.fromJSON = function(json) {
  return new Vec4(json[0], json[1], json[2], json[3]);
};


/* ---- js/matrix44.js ---- */


/**
 * @constructor
 */
function Matrix44() {
  // (0,0), (1,0), (2,0), (3,0), (0,1), (1,0)...
  this.m = [];
  this.reset();
}

Matrix44.IDENTITY_ARRAY = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1];

Matrix44.tempArray = [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0];

/**
 * Start as the the identity matrix.
 * @returns {Matrix44}
 */
Matrix44.prototype.reset = function() {
  return this.toIdentity();
};

Matrix44.pool = [];

Matrix44.alloc = function() {
  if (Matrix44.pool.length) {
    return Matrix44.pool.pop().reset();
  }
  return new Matrix44();
};

Matrix44.prototype.free = function() {
  Matrix44.pool.push(this);
};

Matrix44.prototype.toIdentity = function() {
  for (var i = 0; i < 16; i++) {
    this.m[i] = Matrix44.IDENTITY_ARRAY[i];
  }
  return this;
};

Matrix44.prototype.toTranslateOp = function(vec4) {
  this.toIdentity();
  for (var row = 0; row < 3; row++) {
    this.m[3 + 4 * row] = vec4.v[row];
  }
  return this;
};

Matrix44.prototype.toTranslateOpXYZ = function(x, y, z) {
  this.toIdentity();
  this.m[3] = x;
  this.m[7] = y;
  this.m[11] = z;
  return this;
};

Matrix44.prototype.toScaleOp = function(vec4) {
  this.toIdentity();
  for (var xy = 0; xy < 3; xy++) {
    this.m[5 * xy] = vec4.v[xy];
  }
  return this;
};

Matrix44.prototype.toScaleOpXYZ = function(x, y, z) {
  this.toIdentity();
  this.m[0] = x;
  this.m[5] = y;
  this.m[10] = z;
  return this;
};

/**
 * Right-handed rotation clockwise as you look from the origin to positive-X.
 * @param {number} angle
 * @returns {Matrix44}
 */
Matrix44.prototype.toRotateXOp = function(angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  this.toIdentity();
  this.setColRowVal(1, 1, cos);
  this.setColRowVal(2, 1, -sin);
  this.setColRowVal(1, 2, sin);
  this.setColRowVal(2, 2, cos);
  return this;
};

/**
 * Right-handed rotation clockwise as you look from the origin to positive-Y.
 * @param {number} angle
 * @returns {Matrix44}
 */
Matrix44.prototype.toRotateYOp = function(angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  this.toIdentity();
  this.setColRowVal(0, 0, cos);
  this.setColRowVal(2, 0, sin);
  this.setColRowVal(0, 2, -sin);
  this.setColRowVal(2, 2, cos);
  return this;
};

/**
 * Right-handed rotation clockwise as you look from the origin to positive-Z.
 * @param {number} angle
 * @returns {Matrix44}
 */
Matrix44.prototype.toRotateZOp = function(angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  this.toIdentity();
  this.setColRowVal(0, 0, cos);
  this.setColRowVal(1, 0, -sin);
  this.setColRowVal(0, 1, sin);
  this.setColRowVal(1, 1, cos);
  return this;
};

Matrix44.prototype.setColRowVal = function(col, row, val) {
  this.m[col + 4 * row] = val;
};

Matrix44.prototype.getColRowVal = function(col, row) {
  return this.m[col + 4 * row];
};

/**
 * Mutates this matrix by multiplying it by that one.
 * @param {Matrix44} that
 * @return {Matrix44} this, mutated
 */
Matrix44.prototype.multiply = function(that) {
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      var val = 0;
      for (var i = 0; i < 4; i++) {
        val += this.m[i + 4*y] * that.m[x + 4*i];
      }
      Matrix44.tempArray[x + 4*y] = val;
    }
  }
  for (var a = 0; a < 16; a++) {
    this.m[a] = Matrix44.tempArray[a];
  }
  return this;
};

Matrix44.prototype.set = function(that) {
  for (var i = 0; i < 16; i++) {
    this.m[i] = that.m[i];
  }
  return this;
};

Matrix44.prototype.setToPose = function(pose) {
  var temp = Matrix44.alloc();
  var retval =  this.toTranslateOp(pose.pos)
      .multiply(temp.toScaleOp(pose.scale))
      .multiply(temp.toRotateZOp(pose.rotZ));
  temp.free();
  return retval;
};

Matrix44.prototype.equals = function(that, opt_slop) {
  var slop = opt_slop || 0;
  for (var i = 0; i < 16; i++) {
    if (Math.abs(this.m[i] - that.m[i]) > slop) return false;
  }
  return true;
};

Matrix44.prototype.getInverse = function(out) {
  out = out || new Matrix44();
  // Calculate the matrix of cofactors, the adugate matrix.
  // Divide by the determinant as we go.
  var oneOverDet = 1/this.determinant();
  var cofactor = Matrix33.alloc();
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      // Transpose as we go, by swapping x and y coords.
      out.setColRowVal(y, x,
          oneOverDet *
          ((x % 2) ? -1 : 1) *
          ((y % 2) ? -1 : 1) *
          this.getCofactor(x, y, cofactor).determinant());
    }
  }
  cofactor.free();
  return out;
};

Matrix44.prototype.transpose = function() {
  for (var y = 0; y < 3; y++) {
    for (var x = y + 1; x < 4; x++) {
      var temp = this.getColRowVal(x, y);
      this.setColRowVal(x, y, this.getColRowVal(y, x));
      this.setColRowVal(y, x, temp);
    }
  }
  return this;
};

Matrix44.prototype.determinant = function() {
  var total = 0;
  var row = 0;
  var cofactor = Matrix33.alloc();
  for (var col = 0; col < 4; col++) {
    this.getCofactor(col, row, cofactor);
    total +=
        ((col % 2) ? -1 : 1) *
        this.getColRowVal(col, row) *
        cofactor.determinant();
  }
  cofactor.free();
  return total;
};

Matrix44.prototype.getCofactor = function(col, row, mat33) {
  mat33 = mat33 || new Matrix33();
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      mat33.setColRowVal(x, y, this.getColRowVal(x + (x < col ? 0 : 1), y + (y < row ? 0 : 1)));
    }
  }
  return mat33;
};

Matrix44.prototype.toString = function() {
  return JSON.stringify(this.m);
};

Matrix44.prototype.toJSON = function() {
  return this.m.concat();
};

Matrix44.fromJSON = function(json) {
  return (new Matrix44()).set(json);
};


// ----------------------- WEBGL ---------------------


/* ---- js/webgl/webglutil.js ---- */


/**
 * Gets a WebGL context from a canvas
 * @param canvas
 * @param paramObj
 * @return {WebGLRenderingContext}
 */
function getWebGlContext(canvas, paramObj) {
  if (paramObj) {
    return canvas.getContext('experimental-webgl', paramObj) || canvas.getContext('webgl', paramObj);
  } else {
    return canvas.getContext('experimental-webgl') || canvas.getContext('webgl');
  }
}

/**
 * Creates and compiles a shader.
 * @param {!WebGLRenderingContext} gl
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, gl.VERTEX_SHADER or
 *     gl.FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }
  return shader;
}

/**
 * Creates a program from 2 shaders.
 * @param {!WebGLRenderingContext} gl
 * @param {!WebGLShader} vertexShader
 * @param {!WebGLShader} fragmentShader
 * @return {!WebGLProgram}
 */
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw 'program filed to link:' + gl.getProgramInfoLog(program);
  }
  return program;
}

/**
 * @param {!WebGLRenderingContext} gl
 * @param values
 * @returns {WebGLBuffer}
 */
function createStaticGlBuff(gl, values) {
  var buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
  return buff;
}

// Make WebStorm 8 happy
if (!'WebGLRenderingContext' in window) {
  throw 'WebGLRenderingContext undefined!';
  (function(){
    var f = function(){};
    window.WebGLRenderingContext = {
      LINK_STATUS: 1,
      COMPILE_STATUS: 1,
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 1,
      DEPTH_TEST: 1,
      SRC_ALPHA: 1,
      BLEND: 1,
      LESS: 1,
      ONE: 1,
      TRUE: 1,
      FALSE: 1,
      COLOR_BUFFER_BIT: 1,
      DEPTH_BUFFER_BIT: 1,
      FLOAT: 1,
      UNSIGNED_SHORT: 1,
      TRIANGLES: 1,
      TRIANGLE_STRIP: 1,
      TRIANGLE_FAN: 1,
      STATIC_DRAW: 1,
      DYNAMIC_DRAW: 1,
      STREAM_DRAW: 1,
      ARRAY_BUFFER: 1,
      ELEMENT_ARRAY_BUFFER: 1,
      WebGLBuffer: {}
    };
    window.WebGLShader = f;
    window.WebGLProgram = f;
  })();
}


/* ---- js/webgl/vertex.js ---- */


/**
 * @constructor
 */
function Vertex() {
  this.position = new Vec4();
  this.color = new Vec4();
  this.group = 0;
}

Vertex.prototype.setPositionXYZ = function(x, y, z) {
  this.position.setXYZ(x, y, z);
  return this;
};

Vertex.prototype.setPositionArray = function(xyz) {
  this.setPositionXYZ(xyz[0], xyz[1], xyz[2]);
  return this;
};

Vertex.prototype.setColorRGB = function(r, g, b) {
  this.color.setXYZ(r, g, b);
  return this;
};

Vertex.prototype.setColorArray = function(rgb) {
  this.setColorRGB(rgb[0], rgb[1], rgb[2]);
  return this;
};

Vertex.prototype.setGroup = function(g) {
  this.group = g;
  return this;
};

/**
 * @returns {Vertex} a deep copy of this vertex
 */
Vertex.prototype.copy = function() {
  var copy = new Vertex();
  copy.position.set(this.position);
  copy.color.set(this.color);
  copy.group = this.group;
  return copy;
};

/**
 * @param {Matrix44} matrix
 * @return {Vertex} this
 */
Vertex.prototype.transformPosition = function(matrix) {
  this.position.transform(matrix);
  return this;
};

/**
 * @param {Matrix44} matrix
 * @return {Vertex} this
 */
Vertex.prototype.transformColor = function(matrix) {
  this.color.transform(matrix);
  return this;
};


/* ---- js/webgl/modelstamp.js ---- */


/**
 * Holds the GL values needed to prepare GL to render a model.
 * Use a RigidModel to create a ModelStamp.
 * @param glType probably gl.TRIANGLES
 * @param posBuff GL vertex position buffer, with four floats per position
 * @param colorBuff GL vertex color buffer, with four floats per position
 * @param groupBuff vertex group number buffer, with one float per position
 * @param indexBuff pointer to the element index buffer
 * @param indexCount the total number of index values. Ten triangles would be thirty.
 * @constructor
 */
function ModelStamp(glType, posBuff, colorBuff, groupBuff, indexBuff, indexCount) {
  this.glType = glType;
  this.posBuff = posBuff;
  this.colorBuff = colorBuff;
  this.groupBuff = groupBuff;
  this.indexBuff = indexBuff;
  this.indexCount = indexCount;
}


ModelStamp.prototype.prepareToDraw = function(gl, aVertexPosition, aVertexColor, aVertexGroup) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuff);
  gl.vertexAttribPointer(aVertexPosition, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);

  if (typeof aVertexGroup != 'undefined') {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.groupBuff);
    gl.vertexAttribPointer(aVertexGroup, 1, gl.FLOAT, false, 0, 0);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuff);
};

ModelStamp.prototype.draw = function(gl) {
  gl.drawElements(this.glType, this.indexCount, gl.UNSIGNED_SHORT, 0);
};

ModelStamp.prototype.dispose = function(gl) {
  gl.deleteBuffer(this.posBuff);
  gl.deleteBuffer(this.colorBuff);
  gl.deleteBuffer(this.groupBuff);
  gl.deleteBuffer(this.indexBuff);
  this.glType = null;
  this.posBuff = null;
  this.colorBuff = null;
  this.groupBuff = null;
  this.indexBuff = null;
  this.indexCount = null;
};


/* ---- js/webgl/rigidmodel.js ---- */


/**
 * A way to create, combine, and manipulate a 3D model in JS.
 * This is not optimized for repeated real-time use. It's meant to
 * be used during setup.
 * Generates static ModelStamp objects, which are meant to be used at runtime.
 * @constructor
 */
function RigidModel() {
  this.vertexes = [];
  this.triangles = [];
}

RigidModel.prototype.clear = function() {
  this.vertexes.length = 0;
  this.triangles.length = 0;
  return this;
};

/**
 * @param {Vertex} vertex
 * @return {number} the new vertex's index
 */
RigidModel.prototype.addVertex = function(vertex) {
  this.vertexes.push(vertex);
  return this.vertexes.length - 1;
};

/**
 * Add the indexes of existing vertexes so the counter-clockwise face is showing.
 * @param {number} vertIndex0
 * @param {number} vertIndex1
 * @param {number} vertIndex2
 * @return {number} the new triangle's index
 */
RigidModel.prototype.addTriangle = function(vertIndex0, vertIndex1, vertIndex2) {
  this.triangles.push([vertIndex0, vertIndex1, vertIndex2]);
  return this.triangles.length - 1;
};

/**
 * Adds a deep copy of a model "that" to this model.
 * @param {RigidModel} that
 * @return {RigidModel} this
 */
RigidModel.prototype.addRigidModel = function(that) {
  // Map that's vertex indexes to their new indexes in this.
  var i, vertexMap = {};
  for (i = 0; i < that.vertexes.length; i++) {
    vertexMap[i] = this.addVertex(that.vertexes[i].copy());
  }
  for (i = 0; i < that.triangles.length; i++) {
    var thatTri = that.triangles[i];
    this.addTriangle(
        vertexMap[thatTri[0]],
        vertexMap[thatTri[1]],
        vertexMap[thatTri[2]]);
  }
  return this;
};

/**
 * @return {Rect} the bounding rect, or null if there are no vertexes
 */
RigidModel.prototype.getBoundingRect = function() {
  if (!this.vertexes.length) {
    return null;
  }
  var vert = this.vertexes[0];
  var rect = new Rect(vert.position.v[0], vert.position.v[1], 0, 0);
  for (var i = 1; i < this.vertexes.length; i++) {
    vert = this.vertexes[i];
    rect.coverXY(vert.position.v[0], vert.position.v[1]);
  }
  return rect;
};

/**
 * Mutates all the vertex positions in this model.
 * @param {Matrix44} matrix
 * @return {RigidModel} this
 */
RigidModel.prototype.transformPositions = function(matrix) {
  for (var i = 0; i < this.vertexes.length; i++) {
    this.vertexes[i].transformPosition(matrix);
  }
  return this;
};

/**
 * Sets all the vertex colors in this model.
 * @return {RigidModel} this
 */
RigidModel.prototype.setColorRGB = function(r, g, b) {
  for (var i = 0; i < this.vertexes.length; i++) {
    this.vertexes[i].setColorRGB(r, g, b);
  }
  return this;
};

/**
 * Mutates the vertexes by moving each towards or away from a centerpoint,
 * so they're all the same radius from it.
 * @param {Vec4} center
 * @param {number} radius
 * @return {RigidModel} this
 */
RigidModel.prototype.sphereize = function(center, radius) {
  for (var i = 0; i < this.vertexes.length; i++) {
    var p = this.vertexes[i].position;
    p.subtract(center).scaleToLength(radius).add(center);
  }
  return this;
};

/**
 * Creates a new RigidModel just like this one, but replaces all triangles with
 * four co-planer triangles covering the same area, creating a new vertex in the
 * middle of each edge. Color values for the new vertexes are the average of the
 * original two points along the edge.
 */
RigidModel.prototype.createQuadrupleTriangleModel = function() {
  var m = new RigidModel();
  function childName(index0, index1) {
    return (index0 < index1) ? index0 + "_" + index1 : index1 + "_" + index0;
  }
  // Each key is a name of a vertex - either the original parent vert index,
  // or a name created by joining two parent IDs.
  // Each value is a new model vertex index.
  var namedVerts = {};
  for (var ti = 0; ti < this.triangles.length; ti++) {
    var oldTri = this.triangles[ti];
    // copy original verts, as needed
    for (var i = 0; i < 3; i++) {
      var vi = oldTri[i];
      // map old vertex index to new one
      if (!(vi in namedVerts)) {
        namedVerts[vi] = m.addVertex(this.vertexes[vi].copy());
      }
    }
    // create children in the middle of edges, as needed
    for (var i = 0; i < 3; i++) {
      var parent0Index = oldTri[i];
      var parent1Index = oldTri[(i + 1) % 3];
      var name = childName(parent0Index, parent1Index);
      if (!(name in namedVerts)) {
        var parent0 = this.vertexes[parent0Index];
        var parent1 = this.vertexes[parent1Index];
        var newVert = parent0.copy();
        newVert.position.add(parent1.position).scale1(0.5);
        // I'm assuming alpha is always 1, so if that changes, change this to average alpha, too.
        newVert.color.add(parent1.color).scale1(0.5);
        namedVerts[name] = m.addVertex(newVert);
      }
    }
    // manually add triangles using the new vertexes
    var a = namedVerts[oldTri[0]];
    var b = namedVerts[oldTri[1]];
    var c = namedVerts[oldTri[2]];
    var ab = namedVerts[childName(oldTri[0], oldTri[1])];
    var bc = namedVerts[childName(oldTri[1], oldTri[2])];
    var ac = namedVerts[childName(oldTri[0], oldTri[2])];
    m.addTriangle(a, ab, ac);
    m.addTriangle(ab, b, bc);
    m.addTriangle(ac, bc, c);
    m.addTriangle(ab, bc, ac);
  }
  return m;
};

/**
 * Adds immutable snapshot data to GL and returns a handle to it.
 * @param gl
 * @returns {ModelStamp}
 */
RigidModel.prototype.createModelStamp = function(gl) {
  var i, positionArray = [], colorArray = [], groupArray = [];
  for (i = 0; i < this.vertexes.length; i++) {
    var vertex = this.vertexes[i];
    for (var d = 0; d < 4; d++) {
      positionArray.push(vertex.position.v[d]);
      colorArray.push(vertex.color.v[d]);
    }
    groupArray.push(vertex.group || 0);
  }
  var posBuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW);

  var colorBuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

  var groupBuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, groupBuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groupArray), gl.STATIC_DRAW);

  var elementsArray = [];
  for (i = 0; i < this.triangles.length; i++) {
    var triangle = this.triangles[i];
    for (var v = 0; v < 3; v++) {
      elementsArray.push(triangle[v]);
    }
  }
  var elementBuff = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuff);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementsArray), gl.STATIC_DRAW);

  return new ModelStamp(gl.TRIANGLES,
      posBuff,
      colorBuff,
      groupBuff,
      elementBuff, elementsArray.length
  );
};

/**
 * Creates a unit-square, with points at 1 and -1 along each dimension X and Y, with Z=0,
 * so edge-length is 2 and area is 4.
 * @returns {RigidModel}
 */
RigidModel.createSquare = function() {
  var m = new RigidModel();
  var v = [];
  for (var y = -1; y <= 1; y+= 2) {
    for (var x = -1; x <= 1; x+= 2) {
      v.push(m.addVertex(new Vertex().setPositionXYZ(x, y, 0).setColorRGB(1, 1, 1)));
    }
  }
  function face(nw, ne, sw, se) {
    m.addTriangle(v[nw], v[sw], v[ne]);
    m.addTriangle(v[se], v[ne], v[sw]);
  }
  // 2   3
  //
  // 0   1
  face(2, 3, 0, 1);
  return m;
};

/**
 * Creates an equalateral triangle, with one point on the positive Y axis and two with negative Y and varying X,
 * sized so it covers a unit circle. The highest Y is 2 and the lowest is -1.
 * @returns {RigidModel}
 */
RigidModel.createTriangle = function() {
  var m = new RigidModel();
  var top = new Vertex().setPositionXYZ(0, 2, 0).setColorRGB(1, 1, 1);
  var right = top.copy().transformPosition(new Matrix44().toRotateZOp(2*Math.PI/3));
  var left = top.copy().transformPosition(new Matrix44().toRotateZOp(-2*Math.PI/3));
  var topIndex = m.addVertex(top);
  var leftIndex = m.addVertex(left);
  var rightIndex = m.addVertex(right);
  m.addTriangle(topIndex, leftIndex, rightIndex);
  return m;
};

/**
 * Creates a unit-circle model made of a mesh of mostly equilateral triangles, except for those with vertexes which
 * have been pulled towards the center to prevent them from protruding outside the circle.
 * @param depth The number of createQuadrupleTriangleModel() calls to make on the starting triangle, resulting
 * in something like depth^4 triangles.
 * @returns {RigidModel}
 */

RigidModel.createCircleMesh = function(depth) {
  var model = RigidModel.createTriangle();
  for (var i = 0; i < depth; i++) {
    model = model.createQuadrupleTriangleModel();
  }
  // Remove triangles outside circle.
  var outsiders = [];
  var circleRadius = 1;
  for (var t = 0; t < model.triangles.length;) {
    var tri = model.triangles[t];
    outsiders.length = 0;
    for (var v = 0; v < 3; v++) {
      var vert = model.vertexes[tri[v]];
      if (vert.position.magnitude() > circleRadius) {
        outsiders.push(vert);
      }
    }
    if (outsiders.length == 3) {
      // All verts are outside the circle. Remove the triangle.
      model.triangles[t] = model.triangles[model.triangles.length - 1];
      model.triangles.pop();
    } else {
      // Reposition outside verts to be on the circle's edge.
      for (var o = 0; o < outsiders.length; o++) {
        outsiders[o].position.scaleToLength(circleRadius);
      }
      t++;
    }
  }
  return model;
};

RigidModel.createRingMesh = function(depth, innerRadius) {
  var model = RigidModel.createCircleMesh(depth);

  // Remove triangles inside inner circle.
  var insiders = [];
  for (var t = 0; t < model.triangles.length;) {
    var tri = model.triangles[t];
    insiders.length = 0;
    for (var v = 0; v < 3; v++) {
      var vert = model.vertexes[tri[v]];
      if (vert.position.magnitude() <= innerRadius) {
        insiders.push(vert);
      }
    }
    if (insiders.length == 3) {
      // All verts are inside ring. Remove the triangle.
      model.triangles[t] = model.triangles[model.triangles.length - 1];
      model.triangles.pop();
    } else {
      // Reposition inside verts to be on the circle's edge.
      for (var i = 0; i < insiders.length; i++) {
        insiders[i].position.scaleToLength(innerRadius);
      }
      t++;
    }
  }
  return model;
};

/**
 * Creates a model for a white unit circle on the XY plane, where there are two vertexes at each position,
 * one in group 0 and one in group 1. Group 0 and Group 1 are opposite ends of this dimensionless tube.
 * @param corners
 * @returns {RigidModel}
 */
RigidModel.createDoubleRing = function(corners) {
  var m = new RigidModel(), v = [], i;
  for (i = 0; i < corners; i++) {
    var a = 2 * Math.PI * i / corners;
    v.push(m.addVertex(new Vertex().setPositionXYZ(Math.sin(a), Math.cos(a), 0).setColorRGB(1, 1, 1).setGroup(0)));
    v.push(m.addVertex(new Vertex().setPositionXYZ(Math.sin(a), Math.cos(a), 0).setColorRGB(1, 1, 1).setGroup(1)));
  }
  function face(nw, ne, sw, se) {
    m.addTriangle(v[nw], v[sw], v[ne]);
    m.addTriangle(v[se], v[ne], v[sw]);
  }
  for (i = 0; i < v.length; i += 2) {
    // 0 2
    // 1 3
    face(i, (i + 2) % v.length, i + 1, (i + 3) % v.length);
  }

  return m;
};

/**
 * Creates a unit-cube, with points at 1 and -1 along each dimension,
 * so edge-length is 2 and volume is 8.
 * @returns {RigidModel}
 */
RigidModel.createCube = function() {
  var m = new RigidModel();
  var v = [];
  for (var z = -1; z <= 1; z+= 2) {
    for (var y = -1; y <= 1; y+= 2) {
      for (var x = -1; x <= 1; x+= 2) {
        v.push(m.addVertex(new Vertex().setPositionXYZ(x, y, z).setColorRGB(1, 1, 1)));
      }
    }
  }
  function face(nw, ne, sw, se) {
    m.addTriangle(v[nw], v[sw], v[ne]);
    m.addTriangle(v[se], v[ne], v[sw]);
  }
  // 2   3
  //  6   7
  //
  // 0   1
  //  4   5
  face(4, 5, 0, 1); // bottom
  face(2, 3, 6, 7); // top
  face(6, 7, 4, 5); // front
  face(3, 2, 1, 0); // back
  face(2, 6, 0, 4); // left
  face(7, 3, 5, 1); // right
  return m;
};

/**
 * Creates a four-faced triangular pyramid, with one edge parallel to the Y axis,
 * and one edge parallel to the X axis. Edges have a length of 2.
 * @returns {RigidModel}
 */
RigidModel.createTetrahedron = function() {
  var m = new RigidModel();
  var dz = Math.sqrt(2) / 2;
  var a = m.addVertex(new Vertex().setPositionXYZ(0, 1, -dz).setColorRGB(1, 1, 1));
  var b = m.addVertex(new Vertex().setPositionXYZ(0, -1, -dz).setColorRGB(1, 1, 1));
  var c = m.addVertex(new Vertex().setPositionXYZ(1, 0, dz).setColorRGB(1, 1, 1));
  var d = m.addVertex(new Vertex().setPositionXYZ(-1, 0, dz).setColorRGB(1, 1, 1));
  m.addTriangle(a, d, c);
  m.addTriangle(a, b, d);
  m.addTriangle(a, c, b);
  m.addTriangle(b, c, d);
  return m;
};

/**
 * Creates an eight-faced shape with a vertex at 1 and -1 on every axis.
 * @returns {RigidModel}
 */
RigidModel.createOctahedron = function() {
  var m = new RigidModel();
  function v(x, y, z) {
    return m.addVertex(new Vertex().setPositionXYZ(x, y, z).setColorRGB(1, 1, 1));
  }
  var a = v(1, 0, 0);
  var b = v(-1, 0, 0);
  var c = v(0, 1, 0);
  var d = v(0, -1, 0);
  var e = v(0, 0, 1);
  var f = v(0, 0, -1);
  m.addTriangle(c, e, a);
  m.addTriangle(c, a, f);
  m.addTriangle(c, f, b);
  m.addTriangle(c, b, e);
  m.addTriangle(d, e, b);
  m.addTriangle(d, a, e);
  m.addTriangle(d, f, a);
  m.addTriangle(d, b, f);
  return m;
};


/* ---- js/webgl/glyphmaker.js ---- */


/**
 * Helps build glyph (printable character) RigidModel objects.
 * @param lineWidth
 * @param glyphDepth
 * @constructor
 */
function GlyphMaker(lineWidth, glyphDepth) {
  this.lineWidth = lineWidth;
  this.glyphDepth = glyphDepth;

  this.rigidModel = new RigidModel();
  this.mat = new Matrix44();
  this.vec = new Vec4();
}

GlyphMaker.prototype.clear = function() {
  this.rigidModel.clear();
};

GlyphMaker.prototype.addStick = function(x0, y0, x1, y1) {
  var len = Vec2d.distance(x0, y0, x1, y1) + this.lineWidth;
  var fat = this.lineWidth/2;
  var cuboid = RigidModel.createCube();

  // scale to the final size
  cuboid.transformPositions(this.mat.toScaleOp(this.vec.setXYZ(len/2, fat, this.glyphDepth/2)));

  // translate so x0, y0 is at the origin
  cuboid.transformPositions(this.mat.toTranslateOp(this.vec.setXYZ(len/2 - fat, 0, 0)));

  // rotate to final angle
  cuboid.transformPositions(this.mat.toRotateZOp(Math.atan2(y1 - y0, x1 - x0)));

  // move to final position
  cuboid.transformPositions(this.mat.toTranslateOp(this.vec.setXYZ(x0, y0, 0)));

  this.rigidModel.addRigidModel(cuboid);
};

GlyphMaker.prototype.addToRigidModel = function(target) {
  target.addRigidModel(this.rigidModel);
  return target;
};


/* ---- js/webgl/glyphs.js ---- */


/**
 * A collection of printable characters, as ModelStamp objects in the "stamps" map.
 * @param glyphMaker
 * @constructor
 */
function Glyphs(glyphMaker) {
  this.glyphMaker = glyphMaker;
  this.models = null;
  this.stamps = null;
}

Glyphs.prototype.initModels = function() {
  this.models = {};
  var r = this.glyphMaker.lineWidth / 2;
  var h = 1.5;
  var w = 1;
  var self = this;
  function g() {
    self.glyphMaker.clear();
    for (var i = 1; i < arguments.length; i+=4) {
      self.glyphMaker.addStick(arguments[i], arguments[i + 1], arguments[i + 2], arguments[i + 3]);
    }
    self.models[arguments[0]] = self.glyphMaker.addToRigidModel(new RigidModel());
  }
  g('A',
      -w, -h,  -r/5, h,
      w, -h,  r/5, h,
      -w/2, -h * 0.33, w/2, -h * 0.33);
  g('B',
      -w, h, -w, -h,
      -w, h, w * 0.33, h,
      w * 0.33, h, w * 0.33, 0,
      -w, 0, w, 0,
      w, 0, w, -h,
      w, -h, -w, -h);
  g('C',
      -w + r, h, w/2, h,
      -w, h - r, -w, -h + r,
      -w + r, -h, w - r, -h);
  g('D',
      -w, h - r, -w, -h,
      -w, -h, w, -h,
      w, -h, w, 0,
      w - r/2, r, -w, h);
  g('E',
      w * 0.5, h, -w, h,
      -w, h, -w, -h,
      -w, -h, w, -h,
      -w, 0, w * 0.5, 0);
  g('F',
      w, h, -w, h,
      -w, h, -w, -h,
      -w, 0, w * 0.33, 0);
  g('G',
      w * 0.5, h, -w, h,
      -w, h, -w, -h,
      -w, -h, w, -h,
      w, -h, w, 0,
      w * 0.2, 0, w * 1.2, 0);
  g('H',
      -w, h, -w, -h,
      w, h, w, -h,
      w, 0, -w, 0);
  g('I',
      0, h, 0, -h,
      -w, h, w, h,
      -w, -h, w, -h);
  g('J',
      -w, -h * 0.33, -w, -h,
      -w, -h, w, -h,
      w, -h, w, h);
  g('K',
      -w, h, -w, -h,
      -w * (1 - r), -h * 0.2, w * 0.6, h * 0.6,
      -w * 0.2, 0, w, -h);
  g('L',
      -w, h, -w, -h,
      -w, -h, w, -h);
  g('M',
      -w, -h, -w, h,
      -w + r*0.6, h - r/2, -r*0.2, h * 0.33,
      -r*0.2, h * 0.33, w - r*0.6, h - r/2,
      w, h, w, -h);
  g('N',
      -w, -h, -w, h,
      -w + r/2, h - r/2, w - r/2, -h + r/2,
      w, -h, w, h);
  g('O',
      -w, h - r, -w, -h + r,
      -w + r, h, w - r, h,
      w, h - r, w, -h + r,
      -w + r, -h, w - r, -h);
  g('P',
      -w, h, -w, -h,
      -w, h, w, h,
      w, h, w, 0,
      w, 0, -w, 0);
  g('Q',
      -w, h - r, -w, -h + r,
      -w + r, h, w - r, h,
      w, h - r, w, -h + r,
      -w + r, -h, w - r, -h,
      w * 0.4, -h * 0.4, w * 1.4, -h);
  g('R',
      -w, h, -w, -h,
      -w, h, w, h,
      w, h, w, 0,
      w, 0, -w, 0,
      0, -r, w, -h);
  g('S',
      w, h, -w/2 + r, h,
      -w/2, h - r/2, -w, h/2,
      -w, h/2, w, -h/2,
      w, -h/2, w/2, -h + r/2,
      w/2 - r, -h, -w, -h);
  g('T',
      w, h, -w, h,
      0, h, 0, -h);
  g('U',
      -w, h, -w, -h + r,
      w, h, w, -h + r,
      -w + r, -h, w - r, -h);
  g('V',
      -w, h,  -r/5, -h,
      w, h,  r/5, -h);
  g('W',
      -w, h, -w, -h,
      -w + r*0.6, -h + r/3, -r*0.2, -h * 0.5,
      -r*0.2, -h * 0.5, w - r*0.6, -h + r/3,
      w, -h, w, h);
  g('X',
      -w, h, w, -h,
      w, h, -w, -h);
  g('Y',
      -w, h, -r/2, 0,
      w, h, r/2, 0,
      0, 0, 0, -h);
  g('Z',
      -w, h, w, h,
      w, h - r/2, -w, -h + r/2,
      -w, -h, w, -h);

  g('0',
      -w, h, -w, -h,
      -w, h, w, h,
      w, h, w, -h,
      -w, -h, w, -h,
      w - r, h - r, -w + r, -h + r);
  g('1',
      -w, h, 0 - r, h,
      0, h, 0, -h,
      -w, -h, w, -h);
  g('2',
      -w * 2/3, h, w, h,
      w, h, w, 0,
      w, 0, -w, 0,
      -w, 0, -w, -h,
      -w, -h, w, -h);
  g('3',
      -w, h, w, h,
      w, h, w, -h,
      -w, -h, w, -h,
          -w/2, 0, w, 0);
  g('4',
      -w, h * 2/3, -w, 0,
      -w, 0, w, 0,
      w, h, w, -h);
  g('5',
      -w, h, w, h,
      -w, h, -w, 0,
      w, 0, -w, 0,
      w, 0, w, -h,
      -w, -h, w, -h);
  g('6',
      w * 2/3, h, -w, h,
      -w, h, -w, -h,
      -w, -h, w, -h,
      w, -h, w, 0,
      w, 0, -w, 0);
  g('7',
      -w, h, w, h,
      w, h - r, 0, -h);
  g('8',
      w, h, -w, h,
      -w, h, -w, -h,
      -w, -h, w, -h,
      w, -h, w, h,
      w, 0, -w, 0);
  g('9',
      w, 0, -w, 0,
      -w, 0, -w, h,
      -w, h, w, h,
      w, h, w, -h);

  g(' ');
  g('.',
      0, -h, 0, -h);
  g(',',
      0, -h, -w/3, -h * 4/3);
  g('\'',
      0, h, 0, h * 4/3);
  g('"',
      r*2, h, r*2, h * 4/3,
      -r*2, h, -r*2, h * 4/3);
  g('?',
      0, -h, 0, -h,
      0, -h/3, 0, 0,
      0, 0, w, 0,
      w, 0, w, h,
      w, h, -w, h,
      -w, h, -w, h * 2/3);
  g('!',
      0, -h, 0, -h,
      0, -h/3, 0, h);
  g(':',
      0, -h, 0, -h,
      0, h/3, 0, h/3);
  g(';',
      0, -h, -w/3, -h * 4/3,
      0, h/3, 0, h/3);
  g('-',
      -w, 0, w, 0);
  g('+',
      -w, 0, w, 0,
      0, -w, 0, w);
};

Glyphs.prototype.initStamps = function(gl) {
  if (this.stamps) return;

  if (!this.models) {
    this.initModels();
  }
  this.stamps = {};
  for (var key in this.models) {
    this.stamps[key] = this.models[key].createModelStamp(gl);
  }
  return this.stamps;
};


// ------------------------ MAIN ----------------------


var canvas = document.createElement('canvas');
canvas.id = 'canvas';
resizeCanvas();
document.body.appendChild(canvas);
addEventListener("load", main);

var vertexShader;
var fragmentShader;

var gl;
var program;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

var uViewMatrix;
var uModelMatrix;
var uModelColor;
var uType;
var uTime;
var aVertexPosition;
var aVertexColor;
var vec4 = new Vec4();
var mat4 = new Matrix44();
var viewMatrix = new Matrix44();
var modelMatrix = new Matrix44();
var modelColor = new Vec4();
var array3 = [0, 0, 0];
var bodyPos = new Vec2d();
var IDENTITY_VEC4 = [1, 1, 1, 1];
var ZOOM = 5;

	
function resizeCanvas() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.width = w;
	canvas.height = h;
}

function main() {
  canvas = this.canvas;
  gl = getWebGlContext(canvas, { alpha: false, antialias: true });

  loadText('./app/shaders/glyph-vertex-shader.txt', function(text) {
    vertexShader = compileShader(gl, text, gl.VERTEX_SHADER);
    maybeCreateProgram();
  });

  loadText('./app/shaders/fragment-shader.txt', function(text) {
    fragmentShader = compileShader(gl, text, gl.FRAGMENT_SHADER);
    maybeCreateProgram();
  });
  
  // new RendererLoader(this.canvas, './app/shaders/demo-vertex-shader.txt', './app/shaders/demo-fragment-shader.txt').load(this.onRendererLoaded.bind(this));
  
}

function onRendererLoaded(r) { initBuffers(); this.renderer = r; this.loop(); }
function loop() { maybeResize(canvas, gl); drawScene(); requestAnimationFrame(loop, canvas); }

function setMatrixUniforms() {
	gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
}

// ------------------------ WEBGL ---------------------

function loadText(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'text';
  xhr.onload = function() {
    callback(this.response);
  };
  xhr.send();
}

function maybeCreateProgram() {
  if (!vertexShader || !fragmentShader) return;

  program = createProgram(gl, vertexShader, fragmentShader);
  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.useProgram(program);

  onProgramCreated();
}

function onProgramCreated() {
  // Cache all the shader uniforms.
  uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
  uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  uModelColor = gl.getUniformLocation(program, 'uModelColor');
  uType = gl.getUniformLocation(program, 'uType');
  uTime = gl.getUniformLocation(program, 'uTime');

  // Cache and enable the vertex position and color attributes.
  aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  gl.enableVertexAttribArray(aVertexPosition);
  aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
  gl.enableVertexAttribArray(aVertexColor);

  initStamps();
  loop();
}

var glyphs;
function initStamps() {
  var lineWidth = 0.6;
  glyphs = new Glyphs(new GlyphMaker(lineWidth, lineWidth));
  glyphs.initStamps(gl);
}

function maybeResize(canvas, gl) {
  if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // view
  var edge = Math.min(canvas.width, canvas.height);
  vec4.setXYZ(edge / (ZOOM * canvas.width), edge / (ZOOM * canvas.height), 1);
  viewMatrix.toScaleOp(vec4);
  gl.uniformMatrix4fv(uViewMatrix, gl.FALSE, viewMatrix.m);

  var i = 0;
  var r = 8;
  for (var letter in glyphs.stamps) {
    var stamp = glyphs.stamps[letter];
    stamp.prepareToDraw(gl, aVertexPosition, aVertexColor);

    var x = ((i % r) - r/2);
    var y = (r/3 - Math.floor(i / r)) * 1.5;
    var t = Date.now();
    modelMatrix.toIdentity();
    mat4.toTranslateOp(vec4.setXYZ(x, y, 0));
    modelMatrix.multiply(mat4);
    mat4.toRotateXOp(Math.sin((t + 1000 * i) / 800) / 2);
    modelMatrix.multiply(mat4);
    mat4.toRotateYOp(Math.sin((t + 1000 * i) / 1200) / 2);
    modelMatrix.multiply(mat4);
    mat4.toScaleOp(vec4.setXYZ(0.3, 0.3, 0.3));
    modelMatrix.multiply(mat4);

    gl.uniformMatrix4fv(uModelMatrix, gl.FALSE, modelMatrix.m);
    gl.uniform4fv(uModelColor, IDENTITY_VEC4);

    stamp.draw(gl);
    i++;
  }
}

// -------------------- END OF FILE ---------------------
