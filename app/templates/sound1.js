
// Test 36
// Sound & Map Save by Aaron Whyte
// CAVE2D.com

// BOT: Spacebar to pause. Testing map save (still buggy)


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

// static func
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


/* ---- js/matrix33.js ---- */


/**
 * @constructor
 */
function Matrix33() {
  // (0,0), (1,0), (2,0), (0,1), (1,0)...
  this.m = [];
  this.reset();
}

Matrix33.IDENTITY_ARRAY = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1];

Matrix33.tempArray = [
  0, 0, 0,
  0, 0, 0,
  0, 0, 0];

/**
 * Start as the the identity matrix.
 * @returns {Matrix33}
 */
Matrix33.prototype.reset = function() {
  return this.toIdentity();
};

Matrix33.pool = [];

Matrix33.alloc = function() {
  if (Matrix33.pool.length) {
    return Matrix33.pool.pop().reset();
  }
  return new Matrix33();
};

Matrix33.prototype.free = function() {
  Matrix33.pool.push(this);
};

Matrix33.prototype.toIdentity = function() {
  for (var i = 0; i < 9; i++) {
    this.m[i] = Matrix33.IDENTITY_ARRAY[i];
  }
  return this;
};

Matrix33.prototype.setColRowVal = function(col, row, val) {
  this.m[col + 3 * row] = val;
};

Matrix33.prototype.getColRowVal = function(col, row) {
  return this.m[col + 3 * row];
};

Matrix33.prototype.toTranslateXYOp = function(tx, ty) {
  this.toIdentity();
  this.setColRowVal(2, 0, tx);
  this.setColRowVal(2, 1, ty);
  return this;
};

Matrix33.prototype.toScaleXYOp = function(sx, sy) {
  this.toIdentity();
  this.setColRowVal(0, 0, sx);
  this.setColRowVal(1, 1, sy);
  return this;
};

/**
 * Right-handed rotation clockwise as you look from the origin to positive-Z.
 * @param {number} angle
 * @returns {Matrix33}
 */
Matrix33.prototype.toRotateOp = function(angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  this.toIdentity();
  this.setColRowVal(0, 0, cos);
  this.setColRowVal(1, 0, -sin);
  this.setColRowVal(0, 1, sin);
  this.setColRowVal(1, 1, cos);
  return this;
};
/**
 * Mutates this matrix by multiplying it by that one.
 * @param {Matrix33} that
 * @return {Matrix33} this, mutated
 */
Matrix33.prototype.multiply = function(that) {
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      var val = 0;
      for (var i = 0; i < 3; i++) {
        val += this.m[i + 3*y] * that.m[x + 3*i];
      }
      Matrix33.tempArray[x + 3*y] = val;
    }
  }
  for (var a = 0; a < 9; a++) {
    this.m[a] = Matrix33.tempArray[a];
  }
  return this;
};

Matrix33.prototype.set = function(that) {
  for (var i = 0; i < 9; i++) {
    this.m[i] = that.m[i];
  }
  return this;
};

Matrix33.prototype.equals = function(that, opt_slop) {
  var slop = opt_slop || 0;
  for (var i = 0; i < 9; i++) {
    if (Math.abs(this.m[i] - that.m[i]) > slop) return false;
  }
  return true;
};

Matrix33.prototype.determinant = function() {
  var m = this.m;
  return m[0] * m[4] * m[8] +
       m[1] * m[5] * m[6] +
       m[2] * m[3] * m[7] -
       m[2] * m[4] * m[6] -
       m[1] * m[3] * m[8] -
       m[0] * m[5] * m[7];
};

Matrix33.prototype.toString = function() {
  return JSON.stringify(this.m);
};

Matrix33.prototype.toJSON = function() {
  return this.m.concat();
};

Matrix33.fromJSON = function(json) {
  return (new Matrix33()).set(json);
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


/* ---- js/pose.js ---- */


/**
 * The kind of thing you need to map from model-space and world-space.
 * 4D is kind of overkill but lets not be stingy.
 * @constructor
 */
function Pose(opt_pos, opt_rotZ, opt_scale) {
  this.pos = new Vec4();
  this.rotZ = 0;
  this.scale = new Vec4();
  this.reset(opt_pos, opt_rotZ, opt_scale);
}

Pose.prototype.reset = function(opt_pos, opt_rotZ, opt_scale) {
  if (opt_pos) {
    this.pos.set(opt_pos);
  }
  opt_rotZ = opt_rotZ || 0;
  this.rotZ = opt_rotZ;
  if (opt_scale) {
    this.scale.set(opt_scale);
  }
  return this;
};

Pose.pool = [];

Pose.alloc = function(pos, rotZ, scale) {
  if (Pose.pool.length) {
    return Pose.pool.pop().reset(pos, rotZ, scale);
  }
  return new Pose(pos, rotZ, scale);
};

Pose.prototype.free = function() {
  Pose.pool.push(this);
};

Pose.SCHEMA = {
  0: "pos",
  1: "rotZ",
  2: "scale"
};

Pose.getJsoner = function() {
  if (!Pose.jsoner) {
    Pose.jsoner = new Jsoner(Pose.SCHEMA);
  }
  return Pose.jsoner;
};

Pose.prototype.toJSON = function() {
  return Pose.getJsoner().toJSON(this);
};

Pose.prototype.setFromJSON = function(json) {
  Pose.getJsoner().setFromJSON(json, this);
};

Pose.prototype.set = function(that) {
  this.pos.set(that.pos);
  this.rotZ = that.rotZ;
  this.scale.set(that.scale);
};

Pose.prototype.setToInterpolation = function(a, b, t) {
  this.pos.setToInterpolation(a.pos, b.pos, t);
  this.rotZ = a.rotZ * (1-t) + b.rotZ * t;
  this.scale.setToInterpolation(a.scale, b.scale, t);
}; 


/* ---- js/pubsub.js ---- */


/**
 * Allows a publisher to call multiple subscriber functions at once.
 * Subscribers can add and remove themselves.
 * @constructor
 */
PubSub = function() {
  this.subs = new ArraySet();
};

/**
 * Adds a subscriber function.
 * @param {Object} func
 */
PubSub.prototype.subscribe = function(func) {
  this.subs.put(func);
};

/**
 * Deletes a subscriber function.
 * @param {Object} func
 */
PubSub.prototype.unsubscribe = function(func) {
  this.subs.remove(func);
};

/**
 * Calls all the subscribers in the order in which they were added,
 * passing all arguments along.  Calls the functions in the global context.
 */
PubSub.prototype.publish = function(/* whatever */) {
  for (var i = 0, n = this.subs.vals.length; i < n; ++i) {
    this.subs.vals[i].apply(null, arguments);
  }
};

/**
 * Clears the subscriber list.
 */
PubSub.prototype.clear = function () {
  this.subs.clear();
};


/* ---- js/textloader.js ---- */


/**
 * @param {Array.<String>} paths
 * @constructor
 */
function TextLoader(paths) {
  this.paths = paths;
  this.texts = {};
}

/**
 * @param {Function} callback
 */
TextLoader.prototype.load = function(callback) {
  this.callback = callback;
  for (var i = 0; i < this.paths.length; i++) {
    this.loadTextNum(i);
  }
};

TextLoader.prototype.getTextByIndex = function(num) {
  return this.getTextByPath(this.paths[num]);
};

TextLoader.prototype.getTextByPath = function(path) {
  return this.texts[path];
};


/////////////
// PRIVATE //
/////////////

TextLoader.prototype.loadTextNum = function(num) {
  var path = this.paths[num];
  if (!this.texts[path]) {
    this.xhr(path, this.getOnTextLoadedFunc(num));
  }
};

TextLoader.prototype.getOnTextLoadedFunc = function(num) {
  var self = this;
  return function(text) {
    var path = self.paths[num];
    self.texts[path] = text;
    self.callback && self.callback(num);
  };
};

TextLoader.prototype.xhr = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = function() {
	// alert(this.response);
    callback(this.response);
  };
  xhr.send();
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


/* ---- js/strings.js ---- */


Strings = {};

Strings.REGEXP_ESCAPE_RE_ = /([\{\}\|\^\$\[\]\(\)\.\?\*\+\\\,\:\!])/g;

Strings.AMP_RE_ = /&/g;
Strings.LT_RE_ = /</g;
Strings.SQUOT_RE_ = /'/g;
Strings.DQUOT_RE_ = /"/g;
Strings.EOLN_RE_ = /\n/g;
Strings.TWOSPACE_RE_ = /  /g;

/**
 * Backslash-escapes regexp symbols.  Useful for creating regexps that match
 * literal strings.
 * @param {String} text
 * @return {String} a string for passing to the RegExp constructor
 */
Strings.textToRegExpStr = function(text) {
  return String(text).replace(Strings.REGEXP_ESCAPE_RE_, '\\$1');
};

/**
 * Converts text to HTML, including double-quotes, but not single-quotes.
 * @param {String} text
 * @param {Boolean=} opt_preserveSpaces  if true, nbsp's will replace every
 *     other space in a run of spaces, and br's will replace eolns.
 */
Strings.textToHtml = function(text, opt_preserveSpaces) {
  var html = String(text).
      replace(Strings.AMP_RE_, '&amp;').
      replace(Strings.LT_RE_, '&lt;').
      replace(Strings.DQUOT_RE_, '&quot;');
  if (opt_preserveSpaces) {
    html = html.
        replace(Strings.EOLN_RE_, '<br>').
        replace(Strings.TWOSPACE_RE_, '&nbsp; ');
  }
  return html;
};

/**
 * Converts text to a string that can go between single-quotes in a JS string
 * literal.
 * @param {String} text
 * @return {String} the JS literal, with single-quotes escaped.
 */
Strings.textToSingleQuoteJsLiteral = function(text) {
  return String(text).
      replace(Strings.SQUOT_RE_, '\\\'').
      replace(Strings.EOLN_RE_, '\\n');
};

Strings.replace = function(text, oldStr, newStr) {
  var re = new RegExp(Strings.textToRegExpStr(oldStr), 'g');
  // Ha-ha! Read about "$" here:
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
  var sub = newStr.replace(/\$/g, "$$$$"); // Replaces one dollar-sign with two.
  return text.replace(re, sub);
};

Strings.padLeft = function(strToPad, paddingChar, padToLength) {
  if (paddingChar.length != 1) {
    throw Error('Expected exactly one character, but got "' + paddingChar + '".');
  }
  if (!(strToPad instanceof String)) {
    strToPad = String(strToPad);
  }
  var padSize = padToLength - strToPad.length;
  if (padSize <= 0) {
    return strToPad;
  } else {
    return Strings.repeat(paddingChar, padSize) + strToPad;
  }
};

Strings.repeat = function(str, count) {
  var out = [];
  for (var i = 0; i < count; i++) {
    out.push(str);
  }
  return out.join('');
};

Strings.formatTimeString = function(date) {
  function padDateNum(num) {
    return Strings.padLeft(num, '0', 2);
  }
  return date.getFullYear() + '-' +
      padDateNum(date.getMonth() + 1) + '-' +
      padDateNum(date.getDate()) + ' ' +
      padDateNum(date.getHours()) + ':' +
      padDateNum(date.getMinutes()) + ':' +
      padDateNum(date.getSeconds()) + '.' +
      Strings.padLeft(date.getMilliseconds(), '0', 4);
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


/* ---- js/objset.js ---- */


/**
 * A small set, implemented with an object.
 * Has the same interface as ArraySet, for easy swapping out.
 * @constructor
 */
function ObjSet() {
  this.vals = {};
}

ObjSet.prototype.reset = function() {
  for (var key in this.vals) {
    delete this.vals[key];
  }
  return this;
};

Poolify(ObjSet);

ObjSet.prototype.put = function(v) {
  this.vals[v] = true;
  return this;
};

ObjSet.prototype.contains = function(v) {
  return !!this.vals[v];
};

ObjSet.prototype.remove = function(v) {
  delete this.vals[v];
  return this;
};

ObjSet.prototype.clear = function(v) {
  return this.reset();
};


ObjSet.prototype.isEmpty = function() {
  for (var key in this.vals) {
    return false;
  }
  return true;
};

ObjSet.prototype.getValues = function() {
  var retval = {};
  for (var key in this.vals) {
    retval[key] = this.vals[key];
  }
  return retval;
};

ObjSet.prototype.size = function() {
  var n = 0;
  for (var key in this.vals) {
    n++;
  }
  return n;
};


/* ---- js/map.js ---- */


/**
 * Map class, with arbitrary keys that won't collide with any system stuff.
 * @constructor
 */
Map = function() {
  this.m = {};
  this.length = 0;
};

Map.PREFIX = '=';

Map.prototype.set = function(k, v) {
  var objKey = Map.PREFIX + k;
  if (!this.m[objKey]) this.length++;
  this.m[objKey] = v;
  return this;
};

Map.prototype.get = function(k) {
  return this.m[Map.PREFIX + k];
};

Map.prototype.contains = function(k) {
  return this.get(k) !== undefined;
};

Map.prototype.remove = function(k) {
  var objKey = Map.PREFIX + k;
  if (this.m[objKey]) this.length--;
  delete this.m[objKey];
};

/**
 * @return {Array}
 */
Map.prototype.getKeys = function() {
  var keys = [];
  for (var pk in this.m) {
    keys.push(pk.substr(1));
  }
  return keys;
}; 


/* ---- js/circularqueue.js ---- */


/**
 * A circular buffer, backed by an array.
 * In this API, enqueuing adds to the head, and dequeing removes from the tail.
 * This might be backwards from what you're used to. But I wrote this when I was
 * thinking of a rotating log, so the "head" was the present, and the "tail" was the past,
 * ad you'd add the the head, and usually process the tail first. Sorry for any confusion.
 * 
 * @param {number} maxLen  Must be one or more.
 * @constructor
 */
function CircularQueue(maxLen) {
  if (maxLen < 1) {
    throw new Error('maxlen must be at least one, but it was ' + maxLen);
  }
  this.maxLen = maxLen;
  this.a = [];
  this.head = this.tail = -1;
}

/**
 * @return {boolean}
 */
CircularQueue.prototype.isEmpty = function() {
  return this.head == -1;
};

/**
 * @return {boolean}
 */
CircularQueue.prototype.isFull = function() {
  if (this.head == -1) return false;
  var nextHead = this.head + 1;
  if (nextHead >= this.maxLen) {
    nextHead = 0;
  }
  return nextHead == this.tail;
};

/**
 * Adds an item to the head of the queue.
 * If the queue is full, an item is dropped from the tail.
 * @param val  Any value, to be enqueued.
 * @return the object that fell off the tail, or null if nothing fell off
 */
CircularQueue.prototype.enqueue = function(val) {
  var whatFellOff = null;
  if (this.head == -1) {
    // was empty
    this.head = this.tail = 0;
  } else {
    this.head++;
    if (this.head >= this.maxLen) {
      this.head = 0;
    }
    if (this.head == this.tail) {
      whatFellOff = this.a[this.tail];
      // something falls off the tail
      this.tail++;
      if (this.tail >= this.maxLen) {
        this.tail = 0;
      }
    }
  }
  this.a[this.head] = val;
  return whatFellOff;
};


/**
 * @return Whatever was pulled off the tail of the queue, or null if the queue is empty.
 */
CircularQueue.prototype.dequeue = function() {
  if (this.tail == -1) {
    // empty
    return null;
  }
  var val = this.a[this.tail];
  if (this.tail == this.head) {
    // now it's empty
    this.head = this.tail = -1;
  } else {
    // move tail fwd
    this.tail++;
    if (this.tail >= this.maxLen) {
      this.tail = 0;
    }
  }
  return val;
};


/**
 * @return {number} number of elements in the queue, between 0 and maxLength
 */
CircularQueue.prototype.size = function() {
  if (this.tail == -1) {
    // empty
    return 0;
  }
  var size = 1 + this.head - this.tail;
  if (size <= 0) {
    size += this.maxLen;
  }
  return size;
};


/**
 * @param {number} index gets the nth index from the tail.  Does not dequeue.
 */
CircularQueue.prototype.getFromTail = function(index) {
  if (index < 0) {
    throw new Error("index " + index + " < 0");
  }
  if (index >= this.size()) {
    throw new Error("index " + index + " is greater than size " + this.size());
  }
  var i = index + this.tail;
  if (i >= this.maxLen) {
    // wrap around
    i -= this.maxLen;
  }
  return this.a[i];
};

/**
 * @param {number} index gets the nth index from the head.  Does not dequeue.
 */
CircularQueue.prototype.getFromHead = function(index) {
  if (index < 0) {
    throw new Error("index " + index + " < 0");
  }
  if (index >= this.size()) {
    throw new Error("index " + index + " is greater than size " + this.size());
  }
  var i = this.head - index;
  if (i < 0) {
    // wrap around
    i += this.maxLen;
  }
  return this.a[i];
};


/* ---- js/url.js ---- */


Url = {};

/**
 * Replaces the hash fragment with the string.  Does not encode.  Falsy values
 * are converted to empty-string.
 */
Url.setFragment = function(val) {
  // Just setting the location.hash to the val fails to encode newlines in
  // Safari, so we replace the whole URL.
  // Also, setting the hash to empty-string removes the '#', causing a reload,
  // so always add the #.
  var href = location.href;
  var hashIndex = href.indexOf("#");
  var nonHash = hashIndex < 0 ? href : href.substr(0, hashIndex);
  location.replace(nonHash + "#" + val);
};

/**
 * Gets the encoded URL fragment, not including the leading "#".  Does not
 * decode.  If there's no fragment, returns emptystring.
 */
Url.getFragment = function() {
  var hashIndex = window.location.href.indexOf("#");
  if (hashIndex == -1) return '';
  return window.location.href.substr(hashIndex + 1);
};

Url.encodeQuery = function(map) {
  var q = [];
  for (var key in map) {
    q.push(encodeURIComponent(key) + '=' +
        encodeURIComponent(map[key]));
  }
  return q.join('&');
};

Url.decodeQuery = function(queryString) {
  var map = {};
  var params = queryString.split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    var eqPos = param.indexOf('=');
    if (eqPos > 0) {
      var key = param.substring(0, eqPos);
      var val = param.substring(eqPos + 1);
    } else {
      key = param;
      val = '';
    }
    map[decodeURIComponent(key)] = decodeURIComponent(val);
  }
  return map;
};

Url.getQuery = function() {
  var s = window.location.search;
  if (!s) return '';
  return s.substr(1)
};

Url.URI_CHARS =             "!#$&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_abcdefghijklmnopqrstuvwxyz~";
Url.LEGAL_HASH_CHARS =      "!$&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
Url.URI_COMPONENT_CHARS =   "!'()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
// Firefox incorrectly percent-escapes single-quotes when you do window.location.href.
Url.TOTES_SAFE_HASH_CHARS = "!()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";

/**
 * Splits a percent-encoded UTF-8-encoded URL into strings representing
 * individual Unicode code points.
 * This method does not check to make sure that the input was properly
 * encoded in the first place, but it will throw exceptions if it cannot
 * decode the bits of a percent-encoded codepoint.
 * See http://en.wikipedia.org/wiki/UTF-8#Description.
 * @param url The encoded URL to tokenize
 * @return {Array} Array of strings where each element represents
 * one percent-encoded UTF-8 character.
 * So "a%20b" would become ["a", "%20", "b"],
 * and "c d" would still be["c", " ", "d"], because this function does not
 * make sure all chars that should have been encoded were actually encoded.
 */
Url.tokenizeEncodedUrl = function(url) {
  var tokens = [];
  for (var i = 0; i < url.length;) {
    var c = url.charAt(i);
    if (c != "%") {
      tokens.push(c);
      i++;
      continue;
    }
    var bits = parseInt(url.substr(i + 1, 2), 16);
    var len;
    if ((0x80 & bits) == 0) {
      // 0xxxxxxx, so the byte represents a char in the 0-127 range.
      len = 3;
    } else if ((0xE0 & bits) == 0xC0) {
      // 110xxxxx
      len = 6;
    } else if ((0xF0 & bits) == 0xE0) {
      // 1110xxxx
      len = 9;
    } else if ((0xF8 & bits) == 0xF0) {
      // 11110xxx
      len = 12;
    } else if ((0xFC & bits) == 0xF8) {
      // 111110xx
      len = 15;
    } else if ((0xFE & bits) == 0xFC) {
      // 1111110x
      len = 18;
    } else {
      throw Error("error decoding bits " + Number(bits).toString(2));
    }
    tokens.push(url.substr(i, len));
    i += len;
  }
  // check our work...
  if (url != tokens.join('')) {
    throw Error('original URL\n' + url +
        '\n!= joined tokens\n' + tokens.join(''));
  }
  return tokens;
};

/**
 * @param {String} c  A single character to encode.
 * @return {String} A percent-encoded string of the unicode codepoint number of the char,
 * even if it's in the ASCII range, 0-127.
 */
Url.percentEscapeCharacter = function(c) {
  if (c.length != 1) {
    throw Error('Expected exactly one character, but got "' + c + '".');
  }
  var num = c.charCodeAt(0);
  if (num < 128) {
    var hex = Number(num).toString(16).toUpperCase();
    return '%' + Strings.padLeft(hex, '0', 2);
  } else {
    // Anything above 127 will be escaped by encodeURI.
    var encoded = encodeURIComponent(c);
    if (encoded.charAt(0) != '%') {
      throw Error('expected char "' + c +
          '" to get percent-escaped by encodeURI, but it turned into "' + encoded + '"');
    }
    return encoded;
  }
};

Url.percentEncodeUnwhitelistedChars = function(str, whitelist) {
  var tokens = str.split('');
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (whitelist.indexOf(token) == -1) {
      tokens[i] = Url.percentEscapeCharacter(token);
    }
  }
  return tokens.join('');
}; 



/* ---- js/bits/base64.js ---- */


// taken from https://bitbucket.org/davidchambers/base64.js/src
// Adds text/base64 conversion "atob" and "btoa" to browsers that don't have it, i.e. IE.
;(function () {

  var
      object = window,
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  if (!object['btoa']) {
    object.btoa = function (input) {
      for (
        // initialize result and counter
          var block, charCode, idx = 0, map = chars, output = '';
        // if the next input index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
          input.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt(63 & block >> 8 - idx % 1 * 8)
          ) {
        charCode = input.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) throw Error('invalid charCode:' + charCode);
        block = block << 8 | charCode;
      }
      return output;
    };
  }

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  if (!object['atob']) {
      object.atob = function (input) {
        input = input.replace(/=+$/, '');
        if (input.length % 4 == 1) throw Error('invalid input length:' + input.length);
        for (
          // initialize result and counters
            var bc = 0, bs, buffer, idx = 0, output = '';
          // get next character
            buffer = input.charAt(idx++);
          // character found in table? initialize bit storage and add its ascii value;
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
              // and if not first of each 4 characters,
              // convert the first 8 bits to one ascii character
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
            ) {
          // try to find character in table (0-63, not found => -1)
          buffer = chars.indexOf(buffer);
        }
        return output;
      };
  }
}());


/* ---- js/bits/bitqueue.js ---- */


BitQueue = function() {
  // Array of strings that we append to when writing, and that we
  // consolidate into a single string when reading.
  this.queue = [];
  this.nextReadPos = 0;
  this.length = 0;
};

/**
 * @param num
 * @param bitCount
 */
BitQueue.prototype.enqueueNumber = function(num, bitCount) {
  // todo: trim the read part off the 0th element, and reset nextReadPos.
  var bitStr = Number(num).toString(2);
  if (bitStr.length > bitCount) {
    throw Error('number ' + num + ' has more bits than bitCount ' + bitCount);
  }
  this.queue.push(Strings.padLeft(bitStr, '0', bitCount));
  this.length += bitCount;
};

/**
 * @param bitCount  the number of bits to consume to read a number.
 * @return {Number}
 */
BitQueue.prototype.dequeueNumber = function(bitCount) {
  // Smush the queue into one string before reading.
  if (this.queue.length > 1) {
    this.queue[0] = this.queue.join('');
    this.queue.length = 1;
  }
  var queueStr = this.queue[0];
  var queueLen = queueStr.length - this.nextReadPos;
  if (bitCount > queueLen) {
    throw Error('bitCount ' + bitCount + ' > queueLen ' + queueLen);
  }
  var bitStr = queueStr.substr(this.nextReadPos, bitCount);
  var num = parseInt(bitStr, 2);
  this.nextReadPos += bitCount;
  this.length -= bitCount;
  return num;
};

/**
 * Writes an array of chars representihg bytes into the BitQueue.
 * This is the opposite of dequeueToBytesAndPadZerosRight().
 * @param bytes
 */
BitQueue.prototype.enqueueBytes = function(bytes) {
  for (var i = 0; i < bytes.length; i++) {
    this.enqueueNumber(bytes.charCodeAt(i), 8);
  }
};

/**
 * Serializes the BitQueue to an array of characters representing numbers from 0-255.
 * This is the opposite of enqueueBytes().
 * @returns {string}
 */
BitQueue.prototype.dequeueToBytesAndPadZerosRight = function() {
  var bytesArray = [];
  var tailLength = this.length % 8;
  if (tailLength) {
    this.enqueueNumber(0, 8 - tailLength);
  }
  while (this.length) {
    var num = this.dequeueNumber(8);
    bytesArray.push(String.fromCharCode(num));
  }
  return bytesArray.join('');
};



/* ---- js/bits/lempelziv.js ---- */



/**
 * @param alphabet A string made of all the legal characters in the input.
 * @constructor
 */
LempelZiv = function(alphabet) {
  this.alphabet = alphabet;
};

LempelZiv.STOPCODE = 0;


LempelZiv.prototype.contains = function(v) {
  for (var i = 0; i < this.vals.length; i++) {
    if (this.vals[i] == v) {
      return true;
    }
  }
  return false;
};

/**
 * @param {string} str  A string made up only of what's in the alphabet.
 * @return {Array} An array of integers.
 */
LempelZiv.prototype.encodeToIntegers = function(str) {
  if (str == '') {
    return [LempelZiv.STOPCODE];
  }
  var w = '';
  var result = [];
  var dict = this.createEncodingDictionary();
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var wc = w + c;
    if (dict.contains(wc)) {
      w = wc;
    } else {
      result.push(dict.get(w));
      dict.set(wc, dict.length + 1);
      w = String(c);
    }
  }

  // Output the last code.
  if (w !== "") {
    result.push(dict.get(w));
  }
  result.push(LempelZiv.STOPCODE);
  return result;
};

/**
 * @param {Array} ints  An array of integers.
 * @return {string} A string made up only of what's in the alphabet.
 */
LempelZiv.prototype.decodeFromIntegers = function(ints) {
  if (ints.length == 1 && ints[0] == LempelZiv.STOPCODE) {
    return '';
  }
  var entry = '';
  var dict = this.createDecodingDictionary();
  var w = dict.get(ints[0]);
  var result = w;

  for (var i = 1; i < ints.length; i++) {
    var k = ints[i];
    if (k == LempelZiv.STOPCODE) {
      break;
    }
    if (dict.contains(k)) {
      entry = dict.get(k);
    } else {
      if (k === dict.length + 1) {
        entry = w + w.charAt(0);
      } else {
        throw Error('could not decode integer ' + k);
      }
    }
    result += entry;

    // Add w+entry[0] to the dictionary.
    dict.set(dict.length + 1, w + entry.charAt(0));

    w = entry;
  }
  if (k != 0) {
    throw Error('k:' + k + ' but expected stop-code:' + LempelZiv.STOPCODE);
  }
  return result;
};

LempelZiv.prototype.encodeToBitQueue = function(str, opt_bitQueue) {
  var ints = this.encodeToIntegers(str);
  var bitQueue = opt_bitQueue || new BitQueue();
  var highestValuePossible = this.createEncodingDictionary().length + 1; // +1 for stopcode
  for (var i = 0; i < ints.length; i++) {
    var bitsNeeded = Number(highestValuePossible).toString(2).length;
    bitQueue.enqueueNumber(ints[i], bitsNeeded);
    highestValuePossible++;
  }
  return bitQueue;
};

LempelZiv.prototype.decodeFromBitQueue = function(bitQueue) {
  var highestValuePossible = this.createEncodingDictionary().length + 1; // +1 for stopcode
  var ints = [];
  var num = -1;
  while (num != LempelZiv.STOPCODE) {
    var bitsNeeded = Number(highestValuePossible).toString(2).length;
    num = bitQueue.dequeueNumber(bitsNeeded);
    ints.push(num);
    highestValuePossible++;
  }
  return this.decodeFromIntegers(ints);
};

/**
 * @param str The string to encode.
 * @return {String} of chars whose charCodes are from 0-255
 */
LempelZiv.prototype.encodeToBytes = function(str) {
//  // make sure the input only uses the legal alphabet
//  for (var i = 0; i < str.length; i++) {
//    if (this.alphabet.indexOf(str.charAt(i)) == -1) {
//      throw Error('char ' + str.charAt(i) + ' not in alphabet ' + this.alphabet);
//    }
//  }
  var q = this.encodeToBitQueue(str);
  return q.dequeueToBytesAndPadZerosRight();
};

/**
 * @param {String} bytes  String of chars whose charCodes are from 0-255
 * @return {String} the decoded string
 */
LempelZiv.prototype.decodeFromBytes = function(bytes) {
  var q = new BitQueue();
  q.enqueueBytes(bytes);
  return this.decodeFromBitQueue(q);
};

LempelZiv.prototype.createEncodingDictionary = function() {
  var dict = new Map();
  var nextKey = 1;
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(this.alphabet.charAt(i), nextKey++);
  }
  return dict;
};

LempelZiv.prototype.createDecodingDictionary = function() {
  var dict = new Map();
  var nextKey = 1;
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(nextKey++, this.alphabet.charAt(i));
  }
  return dict;
};


/* ---- js/bits/squisher.js ---- */


/**
 * String compressor that uses a configurable, optional static word list and Lempel-Ziv to losslessly compress
 * a string, finally encoding it in URL-friendly base64. Decompressor also included.
 *
 * @param staticWords An array of up to about 100 strings that will be compressed down
 * to single bytes.
 *
 * @constructor
 */
Squisher = function(staticWords) {
  this.staticWords = staticWords || [];
};

/**
 * Commands indicating how the rest of the data is encoded.
 * "bytes" always means a string where every character represents one byte.
 * @enum {string}
 */
Squisher.Encoding = {
  /** The rest is base64 encoded. */
  BASE64_BYTES: 'a',

  /** The rest is bytes representing an LZ-encoded bitstream. */
  LZ_BITSTREAM: 'z',

  /** The rest is static dictionary encoded bytes. */
  DICTIONARY: 'd',

  /** The rest is the original (percent-encoded to ASCII). */
  ORIGINAL: 'o'
};

/**
 * @param {String} original
 * @return {String} the squished string in base 64
 */
Squisher.prototype.squish = function(original) {
  var squished = Squisher.Encoding.ORIGINAL + this.encodeToAscii(original);

  var newSquished = Squisher.Encoding.DICTIONARY + this.compressWithStaticDictionary(squished);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  var lz = new LempelZiv(this.getAlphabet());
  newSquished = Squisher.Encoding.LZ_BITSTREAM + lz.encodeToBytes(squished);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  squished = Squisher.Encoding.BASE64_BYTES + btoa(squished);
  return squished;
};

Squisher.prototype.unsquish = function(str) {
  var command = str.charAt(0);
  str = str.substr(1);
  var next;
  if (command == Squisher.Encoding.BASE64_BYTES) {
    next = atob(str);
  } else if (command == Squisher.Encoding.LZ_BITSTREAM) {
    var lz = new LempelZiv(this.getAlphabet());
    next = lz.decodeFromBytes(str);
  } else if (command == Squisher.Encoding.DICTIONARY) {
    next = this.decompressWithStaticDictionary(str);
  } else if (command == Squisher.Encoding.ORIGINAL) {
    str = decodeURI(str);
    // Done!
    return str;
  } else {
    throw Error('unknown command ' + command + ' for str ' + str);
  }
  // The recursion is nice because we'll get debuggable stackframes if there's a problem.
  return this.unsquish(next);
};

Squisher.prototype.compressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = Strings.replace(str, word, byteChar);
  }
  return str;
};

Squisher.prototype.decompressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = Strings.replace(str, byteChar, word);
  }
  return str;
};

Squisher.prototype.getAlphabet = function() {
  if (!this.alphabet) {
    this.initAlphabetAndDictionary()
  }
  return this.alphabet;
};

Squisher.prototype.getDictionary = function() {
  if (!this.dictionary) {
    this.initAlphabetAndDictionary();
  }
  return this.dictionary;
};


/** all the non-control lower-ASCII chars, for starters */
Squisher.BASE_ALPHABET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

Squisher.prototype.encodeToAscii = function(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var charCode = str.charCodeAt(i);
    if (c == '%' || charCode < 32 || charCode > 126) {
      out[i] = Url.percentEscapeCharacter(c);
    } else {
      out[i] = c;
    }
  }
  return out.join('');
};

/**
 * All dictionary words get URI encoded, because the whole string gets URI encoded as step 1.
 */
Squisher.prototype.initAlphabetAndDictionary = function() {
  var builder = [];
  for (var i = 32; i <= 126; i++) {
    builder.push(String.fromCharCode(i));
  }
  this.alphabet = Squisher.BASE_ALPHABET;

  this.dictionary = [];
  var nextNum = 255;
  for (var i = 0; i < this.staticWords.length; i++) {
    // Find an unused byte.
    var byteChar = String.fromCharCode(nextNum);
    while (nextNum > 1 && this.alphabet.indexOf(byteChar) != -1) {
      byteChar = String.fromCharCode(nextNum);
      nextNum--;
    }
    if (nextNum <= 1) {
      // no more unused bytes
      return;
    }
    var word = this.staticWords[i];
    this.dictionary.push([byteChar, this.encodeToAscii(word)]);
    this.alphabet += byteChar;
    nextNum--;
  }
};


/* ---- js/bits/jsoner.js ---- */


/**
 * @param schema A mapping from field number to field name, like
 * {0: 'foo', 1: 'bar')
 * @constructor
 */
function Jsoner(schema) {
  this.schema = schema;
}

Jsoner.prototype.toJSON = function(that) {
  var json = [];
  for (var fieldNum in this.schema) {
    var fieldName = this.schema[fieldNum];
    var thatVal = that[fieldName];
    var jsonVal;
    if (thatVal.toJSON) {
      jsonVal = thatVal.toJSON();
    } else if (thatVal == Infinity) {
      // JSON spec doesn't include Infinity :-(
      jsonVal = "Infinity";
    } else if (thatVal == -Infinity) {
      jsonVal = "-Infinity";
    } else {
      jsonVal = thatVal;
    }
    json[fieldNum] = jsonVal;
  }
  return json;
};

Jsoner.prototype.setFromJSON = function(json, that) {
  for (var fieldNum in this.schema) {
    var fieldName = this.schema[fieldNum];
    var jsonVal = json[fieldNum];
    if (that[fieldName] && that[fieldName].setFromJSON) {
      that[fieldName].setFromJSON(jsonVal);
    } else if (typeof that[fieldName] == "number" && jsonVal == "Infinity") {
      that[fieldName] = Infinity;
    } else if (typeof that[fieldName] == "number" && jsonVal == "-Infinity") {
      that[fieldName] = -Infinity;
    } else {
      that[fieldName] = jsonVal;
    }
  }
};



/* ---- js/segment.js ---- */



/**
 * A line segment.
 * @param {Vec2d} p1
 * @param {Vec2d} p2
 * @constructor
 */
function Segment(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.lengthSquared = p1.distanceSquared(p2);
}

Segment.prototype.distanceToPointSquared = function(p3) {
  if (this.lengthSquared == 0) return this.p1.distanceSquared(p3);
  var x1 = this.p1.x;
  var y1 = this.p1.y;
  var x2 = this.p2.x;
  var y2 = this.p2.y;

  // u is 0 at p1 and 1 at p2.
  // Find the value of u where p3 is closest to the segment
  var u = ((p3.x - x1)*(x2 - x1) + (p3.y - y1)*(y2 - y1)) / this.lengthSquared;
  var retval;
  if (u < 0) {
    retval = p3.distanceSquared(this.p1);
  } else if (u > 1) {
    retval = p3.distanceSquared(this.p2);
  } else {
    var p = Vec2d.alloc();
    p.set(this.p2).subtract(this.p1).scale(u).add(this.p1);
    retval = p3.distanceSquared(p);
    p.free();
  }
  return retval;
};

Segment.prototype.distanceToPointSquaredXY = function(x, y) {
  var v = Vec2d.alloc(x, y);
  var dist = this.distanceToPointSquared(v);
  v.free();
  return dist;
};

Segment.prototype.getBoundingRect = function(rectOut) {
  if (!rectOut) rectOut = new Rect();
  return rectOut.setToCorners(this.p1, this.p2);
};


/* ---- js/terrain/bitgrid.js ---- */


/**
 * An very big grid of pixels, optimized for memory, speed, and serialization size.
 * It has over 67 million rows and columns, each holding a 32x32 subgrid of pixels.
 * Values are 0 and 1, defaulting to 0.
 * @constructor
 */
function BitGrid(pixelSize) {
  this.bitWorldSize = pixelSize;
  this.cellWorldSize = this.bitWorldSize * BitGrid.BITS;

  // A cell can be nonexistent (value 0), or have a value of 1, or an array of 32 32-bit integers forming a
  // 32x32 pixel subgrid.
  this.cells = {};

  // A map from touched cellIds to their old values, so callers can see which were modified.
  this.changedCells = {};
}

/**
 * Quadtree compression assumes that this is a power of 2.
 * JavaScript bitwise operations only work on the first 32 bits of a number.
 * So 32 is a good number.
 * @type {number}
 */
BitGrid.BITS = 32;

// It's got over 67 million columns.
BitGrid.COLUMNS = 0x4000000;

BitGrid.ROW_OF_ONES = (function() {
  var row = 0;
  for (var i = 0; i < BitGrid.BITS; i++) {
    row |= (1 << i);
  }
  return row;
})();

BitGrid.prototype.cellIdToIndexVec = function(cellId, out) {
  if (!out) out = new Vec2d();
  var cy = Math.floor(cellId / BitGrid.COLUMNS);
  var cx = cellId - cy * BitGrid.COLUMNS - BitGrid.COLUMNS / 2;
  out.setXY(cx, cy);
  return out;
};

BitGrid.prototype.flushChangedCellIds = function() {
  var changedIds = [];
  for (var id in this.changedCells) {
    if (this.changedCells[id] != this.cells[id]) {
      changedIds.push(id);
    }
  }
  this.changedCells = {};
  return changedIds;
};

BitGrid.prototype.getRectsOfColorForCellId = function(color, cellId) {
  var bx, by;
  var self = this;
  function createRect(bx0, by0, bx1, by1) {
    var wx0 = cx * self.cellWorldSize + (bx0 - 0.5) * self.bitWorldSize;
    var wy0 = cy * self.cellWorldSize + (by0 - 0.5) * self.bitWorldSize;
    var wx1 = cx * self.cellWorldSize + (bx1 + 0.5) * self.bitWorldSize;
    var wy1 = cy * self.cellWorldSize + (by1 + 0.5) * self.bitWorldSize;
    return new Rect(
        (wx0 + wx1)/2, (wy0 + wy1)/2, (wx1 - wx0)/2, (wy1 - wy0)/2);
  }

  var cy = Math.floor(cellId / BitGrid.COLUMNS);
  var cx = cellId - cy * BitGrid.COLUMNS - BitGrid.COLUMNS / 2;
  var rects = [];
  var cell = this.cells[cellId];
  if (this.cellEqualsColor(cell, color)) {
    rects.push(new Rect(
        (cx + 0.5) * this.cellWorldSize - this.bitWorldSize/2,
        (cy + 0.5) * this.cellWorldSize - this.bitWorldSize/2,
        this.cellWorldSize / 2,
        this.cellWorldSize / 2));
  } else if (Array.isArray(cell)) {

    var oldRects = {};
    for (by = 0; by < BitGrid.BITS; by++) {
      var newRects = {};
      var runStartX = -1;
      // Record newRects in this row.
      for (bx = 0; bx < BitGrid.BITS; bx++) {
        var bit = (cell[by] >> bx) & 1;
        if (bit == color) {
          // Color match.
          if (runStartX < 0) {
            // First bit on the row.
            runStartX = bx;
            newRects[runStartX] = {startY: by, endX: bx};
          } else {
            // Continue run
            newRects[runStartX].endX = bx;
          }
        } else {
          // Not a color match.
          runStartX = -1;
        }
      }
      var isLastRow = by == BitGrid.BITS - 1;
      for (bx = 0; bx < BitGrid.BITS; bx++) {
        var oldRect = oldRects[bx];
        var newRect = newRects[bx];
        // Harvest unmatched old ones.
        if (oldRect && newRect && oldRect.endX == newRect.endX) {
          // This is a merge, unless we're on the last row, in which case we harvest.
          if (isLastRow) {
            // last row harvest
            rects.push(createRect(bx, oldRect.startY, oldRect.endX, by));
          }
        } else {
          // old and new are not equal start/end (or maybe not existent)
          if (oldRect) {
            // harvest and delete
            rects.push(createRect(bx, oldRect.startY, oldRect.endX, by - 1));
            delete oldRects[bx];
          }
          if (newRect) {
            if (isLastRow) {
              // make rect on this row
              rects.push(createRect(bx, newRect.startY, newRect.endX, by));
            } else {
              // graduate
              oldRects[bx] = newRects[bx];
            }
          }
        }
      }
    }
  }
  return rects;
};

/**
 * @returns {Number} the grid cell X index that corresponds with world coord X.
 */
BitGrid.prototype.getCellIndexX = function(x) {
  return Math.floor(x / this.cellWorldSize);
};

/**
 * @return {Number} the grid cell Y index that corresponds with world coord Y.
 */
BitGrid.prototype.getCellIndexY = function(y) {
  return Math.floor(y / this.cellWorldSize);
};

BitGrid.prototype.getCellIdAtIndexXY = function(cx, cy) {
  return BitGrid.COLUMNS * cy + cx + BitGrid.COLUMNS/2;
};

BitGrid.prototype.getCellAtIndexXY = function(cx, cy) {
  return this.cells[this.getCellIdAtIndexXY(cx, cy)];
};

BitGrid.prototype.setCellAtIndexXY = function(cx, cy, cell) {
  this.cells[this.getCellIdAtIndexXY(cx, cy)] = cell;
};

BitGrid.prototype.deleteCellAtIndexXY = function(cx, cy) {
  delete this.cells[this.getCellIdAtIndexXY(cx, cy)];
};

BitGrid.prototype.cellEqualsColor = function(cell, color) {
  return !Array.isArray(cell) && ((color == 0 && !cell) || (color == 1 && cell === 1));
};

BitGrid.prototype.drawPill = function(seg, rad, color) {
  // bounding rect
  var rect = seg.getBoundingRect(this.rect).pad(rad);
  var cx0 = this.getCellIndexX(rect.getMinX());
  var cy0 = this.getCellIndexY(rect.getMinY());
  var cx1 = this.getCellIndexX(rect.getMaxX());
  var cy1 = this.getCellIndexY(rect.getMaxY());
  for (var cx = cx0; cx <= cx1; cx++) {
    for (var cy = cy0; cy <= cy1; cy++) {
      var cell = this.getCellAtIndexXY(cx, cy);
      if (!this.cellEqualsColor(cell, color)) {
        this.drawPillOnCellIndexXY(seg, rad, color, cx, cy);
      }
    }
  }
};

BitGrid.prototype.drawPillOnCellIndexXY = function(seg, rad, color, cx, cy) {
  var pixelCenter = Vec2d.alloc();
  var cell = this.getCellAtIndexXY(cx, cy);

  var cellId = this.getCellIdAtIndexXY(cx, cy);
  var clean = !(cellId in this.changedCells);

  var radSquared = rad * rad;
  var isArray = Array.isArray(cell);
  var startingColor = isArray ? 0.5 : (cell ? 1 : 0);
  var zeroRows = 0;
  var oneRows = 0;
  for (var by = 0; by < BitGrid.BITS; by++) {
    var oldRowVal = isArray ? cell[by] : (startingColor ? BitGrid.ROW_OF_ONES : 0);
    var newRowVal = oldRowVal;
    pixelCenter.y = cy * this.cellWorldSize + by * this.bitWorldSize;
    for (var bx = 0; bx < BitGrid.BITS; bx++) {
      pixelCenter.x = cx * this.cellWorldSize + bx * this.bitWorldSize;
      if (seg.distanceToPointSquared(pixelCenter) <= radSquared) {
        newRowVal = color
            ? (newRowVal | (1 << bx))
            : (newRowVal & (BitGrid.ROW_OF_ONES ^ (1 << bx)));
      }
    }
    if (newRowVal == 0) {
      zeroRows++;
    } else if (newRowVal == BitGrid.ROW_OF_ONES) {
      oneRows++;
    }

    if (newRowVal != oldRowVal) {
      // If it was clean to start with, then preserve the clean value in changedCells.
      if (clean) {
        this.changedCells[cellId] = Array.isArray(cell) ? cell.concat() : cell;
        clean = false;
      }
      // If it wasn't an array already, make it one now so we can adjust this row.
      if (!isArray) {
        cell = this.createCellArray(startingColor);
        this.setCellAtIndexXY(cx, cy, cell);
        isArray = true;
      }
      cell[by] = newRowVal;
    }
  }

  // Simplify the grid?
  if (zeroRows == BitGrid.BITS) {
    this.deleteCellAtIndexXY(cx, cy);
  } else if (oneRows == BitGrid.BITS) {
    this.setCellAtIndexXY(cx, cy, 1);
  }
  pixelCenter.free();
};

BitGrid.prototype.createCellArray = function(color) {
  var cell = new Array(BitGrid.BITS);
  var rowVal = color ? BitGrid.ROW_OF_ONES : 0;
  for (var i = 0; i < BitGrid.BITS; i++) {
    cell[i] = rowVal;
  }
  return cell;
};

BitGrid.SOLID = 1;
BitGrid.DETAILED = 0;

/**
 * The "cells" field is an object where
 * each key is a cellId in base 32,
 * and each value is a base64-encoded BitQueue quadtree representation of the cell.
 * @returns {{bitWorldSize: *, cells: {}}}
 */
BitGrid.prototype.toJSON = function() {
  function enqueueQuad(startX, startY, size) {
    var startColor = (cell[startY] & (1 << startX)) ? 1 : 0;
    if (size == 1) {
      bitQueue.enqueueNumber(startColor, 1);
      return;
    }
    for (var by = startY; by < startY + size; by++) {
      for (var bx = startX; bx < startX + size; bx++) {
        var pixel = (cell[by] & (1 << bx)) ? 1 : 0;
        if (pixel != startColor) {
          // non-uniform square. Lets get quadruple recursive!
          bitQueue.enqueueNumber(BitGrid.DETAILED, 1);
          var half = size/2;
          enqueueQuad(startX, startY, half);
          enqueueQuad(startX + half, startY, half);
          enqueueQuad(startX, startY + half, half);
          enqueueQuad(startX + half, startY + half, half);
          return;
        }
      }
    }
    // uniform square
    bitQueue.enqueueNumber(BitGrid.SOLID, 1);
    bitQueue.enqueueNumber(startColor, 1);
  }

  var json = {
    bitWorldSize: this.bitWorldSize,
    cells:{}
  };
  for (var cellId in this.cells) {
    var cell = this.cells[cellId];
    var bitQueue = new BitQueue();
    if (Array.isArray(cell)) {
      enqueueQuad(0, 0, BitGrid.BITS);
    } else {
      // Uniform cell
      bitQueue.enqueueNumber(BitGrid.SOLID, 1);
      bitQueue.enqueueNumber(cell, 1);
    }
    json.cells[Number(cellId).toString(32)] = btoa(bitQueue.dequeueToBytesAndPadZerosRight());
  }
  return json;
};

BitGrid.fromJSON = function(json) {
  function plot(x, y, c) {
    if (c) {
      cell[y] |= 1 << x;
    } else {
      cell[y] &= BitGrid.ROW_OF_ONES ^ (1 << x);
    }
  }

  function dequeueQuad(startX, startY, size) {
    var color;
    if (size == 1) {
      color = bitQueue.dequeueNumber(1);
      plot(startX, startY, color);
      return;
    }
    var kind = bitQueue.dequeueNumber(1);
    if (kind == BitGrid.SOLID) {
      color = bitQueue.dequeueNumber(1);
      for (var by = startY; by < startY + size; by++) {
        for (var bx = startX; bx < startX + size; bx++) {
          plot(bx, by, color);
        }
      }
    } else {
      // DETAILED
      var half = size/2;
      dequeueQuad(startX, startY, half);
      dequeueQuad(startX + half, startY, half);
      dequeueQuad(startX, startY + half, half);
      dequeueQuad(startX + half, startY + half, half);
    }
  }

  var bitGrid = new BitGrid(json.bitWorldSize);
  for (var cellId32 in json.cells) {
    var cellId = parseInt(cellId32, 32);
    var cellBytes = atob(json.cells[cellId32]);
    var bitQueue = new BitQueue();
    bitQueue.enqueueBytes(cellBytes);
    var cell = bitGrid.createCellArray(0);
    dequeueQuad(0, 0, 32);
    bitGrid.cells[cellId] = cell;

    // Mark this cell as dirty. Its old value was 0, the default full-empty value.
    bitGrid.changedCells[cellId] = 0;
  }
  return bitGrid;
};

// Old naive serializer/deserializer.
//BitGrid.prototype.toJSON = function() {
//  return {
//    bitWorldSize: this.bitWorldSize,
//    cells: this.cells
//  };
//};
//
//BitGrid.fromJSON = function(json) {
//  var bitGrid = new BitGrid(json.bitWorldSize);
//  bitGrid.cells = json.cells;
//  return bitGrid;
//};


// ----------------------- WEBGL ----------------------



/* ---- js/webgl/buttonmaker.js ---- */


/**
 * Adds clickable buttons to the world and the GL.
 * @param labelMaker
 * @param world
 * @param multiPointer
 * @param renderer
 * @constructor
 */
function ButtonMaker(labelMaker, world, multiPointer, renderer) {
  this.labelMaker = labelMaker;
  this.world = world;
  this.multiPointer = multiPointer;
  this.renderer = renderer;

  this.startMatrix = new Matrix44();
  this.nextCharMatrix = new Matrix44().toTranslateOpXYZ(3, 0, 0);
  this.letterColor = [1, 1, 1];
  this.blockColor = [0.5, 0.5, 0.5];
  this.padding = new Vec2d(0.5, 0.5);

  this.scale = 1;
}

/**
 * @param {Matrix44} m
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setStartMatrix = function(m) {
  this.startMatrix = m;
  return this;
};

/**
 * @param {Matrix44} m
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setNextCharMatrix = function(m) {
  this.nextCharMatrix = m;
  return this;
};

/**
 * @param {Array.<number>} c
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setLetterColor = function(c) {
  this.letterColor = c;
  return this;
};

/**
 * @param {Array.<number>} c
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setBlockColor = function(c) {
  this.blockColor = c;
  return this;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setPaddingXY = function(x, y) {
  this.padding.setXY(x, y);
  return this;
};

/**
 * @param {number} s
 * @returns {ButtonMaker}
 */
ButtonMaker.prototype.setScale = function(s) {
  this.scale = s;
  return this;
};

/**
 * Adds a button body and spirit to the world, and a button model to GL.
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {function} func or null for no callback
 * @return {number} The ID of the spirit added to the world.
 */
ButtonMaker.prototype.addButton = function(x, y, text, func) {
  var labelModel = this.labelMaker.createLabelModel(this.startMatrix, this.nextCharMatrix, text);
  labelModel.transformPositions(new Matrix44().toScaleOpXYZ(this.scale, this.scale, this.scale));
  var brect = labelModel.getBoundingRect();
  if (this.padding) {
    brect.padXY(this.padding.x, this.padding.y);
  }
  labelModel.transformPositions(new Matrix44().toTranslateOpXYZ(-brect.pos.x, -brect.pos.y, 0));
  for (var i = 0; i < labelModel.vertexes.length; i++) {
    labelModel.vertexes[i].setColorArray(this.letterColor);
  }

  if (this.blockColor) {
    var cuboid = RigidModel.createCube();
    cuboid.transformPositions(new Matrix44().toScaleOpXYZ(brect.rad.x, brect.rad.y, 1));
    cuboid.transformPositions(new Matrix44().toTranslateOpXYZ(0, 0, 1));
    for (var i = 0; i < cuboid.vertexes.length; i++) {
      cuboid.vertexes[i].setColorArray(this.blockColor);
    }
    labelModel.addRigidModel(cuboid);
    labelModel.transformPositions(new Matrix44().toTranslateOpXYZ(0, 0, -1));
  }
  var stamp = labelModel.createModelStamp(this.renderer.gl);

  var b = Body.alloc();
  b.shape = Body.Shape.RECT;
  var pos = new Vec2d(x, y);
  b.setPosAtTime(pos, this.world.now);
  b.rectRad.set(brect.rad);
  b.group = 0;
  b.mass = Infinity;
  b.pathDurationMax = Infinity;
  var spirit = new ButtonSpirit();
  spirit.bodyId = this.world.addBody(b);
  if (this.multiPointer) {
    // TODO: remove multipointer from buttons completely?
    spirit.setMultiPointer(this.multiPointer);
  }
  spirit.setModelStamp(stamp);
  spirit.setOnClick(func);
  return this.world.addSpirit(spirit);
};



/* ---- js/webgl/camera.js ---- */


function Camera(minDistFraction, maxDistFraction, viewDist) {
  this.cameraPos = new Vec2d();
  this.minDistFraction = minDistFraction;
  this.maxDistFraction = maxDistFraction;
  this.viewDist = viewDist;
}

Camera.prototype.follow = function(followPos) {
  var cameraDist = followPos.distance(this.cameraPos);
  var minCameraDist = this.viewDist * this.minDistFraction;
  var maxCameraDist = this.viewDist * this.maxDistFraction;

  // Move towards min dist
  if (cameraDist > minCameraDist) {
    var temp = Vec2d.alloc();
    temp.set(followPos)
        .subtract(this.cameraPos)
        .scaleToLength((cameraDist-minCameraDist) * 0.1)
        .add(this.cameraPos);
    this.cameraPos.set(temp);
    cameraDist = followPos.distance(this.cameraPos);

    // Clip to max dist
    if (cameraDist > maxCameraDist) {
      temp.set(followPos)
          .subtract(this.cameraPos)
          .scaleToLength(cameraDist - maxCameraDist)
          .add(this.cameraPos);
      this.cameraPos.set(temp);
    }
    temp.free();
  }
};

Camera.prototype.add = function(vec) {
  this.cameraPos.add(vec);
};

Camera.prototype.setXY = function(x, y) {
  this.cameraPos.setXY(x, y);
};

Camera.prototype.getX = function() {
  return this.cameraPos.x;
};

Camera.prototype.getY = function() {
  return this.cameraPos.y;
};

Camera.prototype.getViewDist = function() {
  return this.viewDist;
};

Camera.prototype.setViewDist = function(d) {
  this.viewDist = d;
  return this;
};



/* ---- js/webgl/splash.js ---- */



/**
 * @constructor
 */
function Splash(type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration) {
  this.type = 0;
  this.stamp = null;
  this.startPose = new Pose();
  this.endPose = new Pose();
  this.startPose2 = new Pose();
  this.endPose2 = new Pose();
  this.startColor = new Vec4();
  this.endColor = new Vec4();
  this.startTime = 0;
  this.duration = 0;
  this.reset(type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration);
}

Splash.prototype.reset = function(
    type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration) {
  this.type = type || -1;
  this.stamp = stamp || null;
  startPose ? this.startPose.set(startPose) : this.startPose.reset();
  endPose ? this.endPose.set(endPose) : this.endPose.reset();
  startPose2 ? this.startPose2.set(startPose2) : this.startPose2.reset();
  endPose2 ? this.endPose2.set(endPose2) : this.endPose2.reset();
  startColor ? this.startColor.set(startColor) : this.startColor.reset();
  endColor ? this.endColor.set(endColor) : this.endColor.reset();
  this.startTime = startTime || 0;
  this.duration = duration || 0;
  return this;
};

Splash.pool = [];

Splash.alloc = function(type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration) {
  if (Splash.pool.length) {
    return Splash.pool.pop().reset(type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration);
  }
  return new Splash(type, stamp, startPose, endPose, startPose2, endPose2, startColor, endColor, startTime, duration);
};

Splash.prototype.free = function() {
  Splash.pool.push(this);
};

Splash.SCHEMA = {
  0: "type",
  1: "startPose",
  2: "endPose",
  3: "startPose2",
  4: "endPose2",
  5: "startColor",
  6: "endColor",
  7: "startTime",
  8: "duration"
};

Splash.getJsoner = function() {
  if (!Splash.jsoner) {
    Splash.jsoner = new Jsoner(Splash.SCHEMA);
  }
  return Splash.jsoner;
};

Splash.prototype.toJSON = function() {
  return Splash.getJsoner().toJSON(this);
};

Splash.prototype.setFromJSON = function(json) {
  Splash.getJsoner().setFromJSON(json, this);
};

Splash.prototype.set = function(that) {
  this.type = that.type;
  this.stamp = that.stamp;
  this.startPose.set(that.startPose);
  this.endPose.set(that.endPose);
  this.startPose2.set(that.startPose2);
  this.endPose2.set(that.endPose2);
  this.startColor.set(that.startColor);
  this.endColor.set(that.endColor);
  this.startTime = that.startTime;
  this.duration = that.duration;
  return this;
};

Splash.prototype.isVisible = function(time) {
  return this.startTime <= time && time <= this.startTime + this.duration;
};

Splash.prototype.isExpired = function(time) {
  return this.startTime + this.duration < time;
};

Splash.tempPose = new Pose();

Splash.prototype.getModelMatrix = function(time, out) {
  Splash.tempPose.setToInterpolation(this.startPose, this.endPose, (time - this.startTime) / this.duration);
  return out.setToPose(Splash.tempPose);
};

Splash.prototype.getModelMatrix2 = function(time, out) {
  Splash.tempPose.setToInterpolation(this.startPose2, this.endPose2, (time - this.startTime) / this.duration);
  return out.setToPose(Splash.tempPose);
};

Splash.prototype.getColor = function(time, out) {
  return out.setToInterpolation(this.startColor, this.endColor, (time - this.startTime) / this.duration);
}; 



/* ---- js/webgl/splasher.js ---- */



/**
 * @constructor
 */
function Splasher() {
  this.splashes = [];
  this.matrix44 = new Matrix44();
  this.vec4 = new Vec4();
}

Splasher.prototype.addCopy = function(copyMe) {
  this.splashes.push(Splash.alloc().set(copyMe));
};

Splasher.prototype.draw = function(renderer, now) {
  for (var i = 0; i < this.splashes.length;) {
    var splash = this.splashes[i];
    if (splash.isExpired(now)) {
      // remove
      splash.free();
      this.splashes[i] = this.splashes[this.splashes.length - 1];
      this.splashes.pop();
    } else {
      if (splash.isVisible(now)) {
        renderer
            .setStamp(splash.stamp)
            .setColorVector(splash.getColor(now, this.vec4))
            .setModelMatrix(splash.getModelMatrix(now, this.matrix44))
            .setModelMatrix2(splash.getModelMatrix2(now, this.matrix44))
            .drawStamp();
      }
      i++;
    }
  }
};


/* ---- js/webgl/fanbufferbuilder.js ---- */


function FanBufferBuilder(gl) {
  this.gl = gl;
  this.pos = [];
  this.color = [];
  this.count = 0;
}

FanBufferBuilder.prototype.addCircle = function(pos, pz, rad, cornerCount, red, green, blue, alpha) {
  this.pos.push(pos.x, pos.y, pz);
  this.color.push(red, green, blue, alpha);
  for (var i = 0; i <= cornerCount; i++) {
    this.pos.push(
            pos.x + rad * Math.sin(2 * Math.PI * i / cornerCount),
            pos.y + rad * Math.cos(2 * Math.PI * i / cornerCount),
        pz);
    this.color.push(red, green, blue, 1);
  }
  this.count = cornerCount + 2;
};

FanBufferBuilder.prototype.getTriangleCount = function() {
  return this.count;
};

FanBufferBuilder.prototype.createPositionBuff = function() {
  return createStaticGlBuff(this.gl, this.pos);
};

FanBufferBuilder.prototype.createColorBuff = function() {
  return createStaticGlBuff(this.gl, this.color);
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


/* ---- js/webgl/labelmaker.js ---- */


/**
 * @constructor
 */
function LabelMaker(glyphs) {
  this.glyphs = glyphs;
}

LabelMaker.prototype.createLabelModel = function(startMatrix, nextCharMatrix, text) {
  this.glyphs.initModels();
  var labelModel = new RigidModel();
  var mutableGlyph = new RigidModel();
  var matrix = new Matrix44();
  matrix.set(startMatrix);
  for (var i = 0; i < text.length; i++) {
    var originalGlyph = this.glyphs.models[text.charAt(i)];
    if (originalGlyph) {
      mutableGlyph.clear().addRigidModel(originalGlyph);
      mutableGlyph.transformPositions(matrix);
      labelModel.addRigidModel(mutableGlyph);
    }
    matrix.multiply(nextCharMatrix);
  }
  return labelModel;
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


/* ---- js/webgl/printer.js ---- */


/**
 * @constructor
 */
function Printer(renderer, glyphs) {
  this.renderer = renderer;
  this.glyphs = glyphs;

  this.matrix = new Matrix44();
}

Printer.prototype.printLine = function(startMatrix, nextCharMatrix, text) {
  this.matrix.set(startMatrix);
  for (var i = 0; i < text.length; i++) {
    var glyph = this.glyphs[text.charAt(i)];
    if (glyph) {
      this.renderer.setStamp(glyph);
      this.renderer.setModelMatrix(this.matrix);
      this.renderer.drawStamp();
    }
    this.matrix.multiply(nextCharMatrix);
  }
};


/* ---- js/webgl/renderer.js ---- */


/**
 * The renderer has the viewport state,
 * manages uniforms and attributes,
 * and can draw a ModelStamp.
 * @param canvas
 * @param gl
 * @param program
 * @constructor
 */
function Renderer(canvas, gl, program) {
  this.canvas = canvas;
  this.gl = gl;
  this.program = program;
  this.initAttributesAndUniforms();
}

Renderer.prototype.initAttributesAndUniforms = function() {
  this.createVertexAttribute('aVertexPosition');
  this.createVertexAttribute('aVertexColor');
  this.createVertexAttribute('aVertexGroup');
  this.createUniform('uViewMatrix');
  this.createUniform('uModelMatrix');
  this.createUniform('uModelMatrix2');
  this.createUniform('uModelColor');
};

Renderer.prototype.createVertexAttribute = function(name) {
  this[name] = this.gl.getAttribLocation(this.program, name);
  this.gl.enableVertexAttribArray(this[name]);
};

Renderer.prototype.createUniform = function(name) {
  this[name] = this.gl.getUniformLocation(this.program, name);
};

/**
 * @return {Renderer}
 */
Renderer.prototype.resize = function() {
  if (this.canvas.width != this.canvas.clientWidth ||
      this.canvas.height != this.canvas.clientHeight) {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  return this;
};

/**
 * @return {Renderer}
 */
Renderer.prototype.clear = function() {
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  return this;
};

/**
 * @return {Renderer}
 */
Renderer.prototype.setBlendingEnabled = function(blend) {
  if (blend) {
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE)
  } else {
    this.gl.disable(this.gl.BLEND);
  }
  return this;
};

/**
 * @return {Renderer}
 */
Renderer.prototype.clearColor = function(r, g, b, a) {
  this.gl.clearColor(r, g, b, a);
  return this;
};

/**
 * @param {Matrix44} viewMatrix
 * @return {Renderer}
 */
Renderer.prototype.setViewMatrix = function(viewMatrix) {
  this.viewMatrix = viewMatrix;
  this.gl.uniformMatrix4fv(this.uViewMatrix, this.gl.FALSE, viewMatrix.m);
  return this;
};

/**
 * @return {Matrix44} A reference to the inner viewMatrix, which may change.
 */
Renderer.prototype.getViewMatrix = function() {
  return this.viewMatrix;
};

/**
 * Sets the shader's model matrix uniform.
 * @param {Matrix44} modelMatrix
 * @return {Renderer}
 */
Renderer.prototype.setModelMatrix = function(modelMatrix) {
  this.gl.uniformMatrix4fv(this.uModelMatrix, this.gl.FALSE, modelMatrix.m);
  return this;
};

/**
 * Sets the shader's second model matrix uniform.
 * @param {Matrix44} modelMatrix2
 * @return {Renderer}
 */
Renderer.prototype.setModelMatrix2 = function(modelMatrix2) {
  this.gl.uniformMatrix4fv(this.uModelMatrix2, this.gl.FALSE, modelMatrix2.m);
  return this;
};

/**
 * Sets the shader's color vector uniform.
 * @param {Vec4} colorVector
 * @return {Renderer}
 */
Renderer.prototype.setColorVector = function(colorVector) {
  this.gl.uniform4fv(this.uModelColor, colorVector.v);
  return this;
};

/**
 * Prepares for stamp() calls.
 * @param {ModelStamp} stamp
 * @return {Renderer}
 */
Renderer.prototype.setStamp = function(stamp) {
  this.modelStamp = stamp;
  stamp.prepareToDraw(this.gl, this.aVertexPosition, this.aVertexColor, this.aVertexGroup);
  return this;
};

/**
 * Draws the ModelStamp set by setStamp(), with the current
 * modelMatrix, colorVector, and view uniforms.
 * @return {Renderer}
 */
Renderer.prototype.drawStamp = function() {
  this.modelStamp.draw(this.gl);
  return this;
};


/* ---- js/webgl/rendererloader.js ---- */


/**
 * Asynchronously creates a Renderer by loading and compiling shaders.
 * @param canvas
 * @param {String} vertexShaderPath
 * @param {String} fragmentShaderPath
 * @constructor
 */
function RendererLoader(canvas, vertexShaderPath, fragmentShaderPath) {
  this.canvas = canvas;
  this.textLoader = new TextLoader([vertexShaderPath, fragmentShaderPath]);
  this.renderer = null;
}

/**
 * @param callback called with the renderer as a parameter, when the renderer is loaded
 */
RendererLoader.prototype.load = function(callback) {
  this.callback = callback;
  var self = this;
  this.textLoader.load(function() {
    self.invalidate();
  });
};

RendererLoader.prototype.invalidate = function() {
  var vsText = this.textLoader.getTextByIndex(0);
  var fsText = this.textLoader.getTextByIndex(1);
  if (!this.renderer && vsText && fsText) {
    var gl = getWebGlContext(this.canvas, {
      alpha: false,
      antialias: true
    });
    var vs = compileShader(gl, vsText, gl.VERTEX_SHADER);
    var fs = compileShader(gl, fsText, gl.FRAGMENT_SHADER);
    var program = createProgram(gl, vs, fs);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    this.renderer = new Renderer(this.canvas, gl, program);
    this.callback(this.renderer);
  }
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


/* ---- js/webgl/screen.js ---- */


/**
 * Abstract base class for an object that can listen for events, and draw to the canvas.
 * The details of canvas and renderer initilization and setting are up to the subclasses.
 * @constructor
 */
function Screen() {
}

/**
 * @param {boolean} listening Whether to listen for events or not.
 */
Screen.prototype.setScreenListening = function(listening) {
};

/**
 * Do physics and drawing, optionally lazily initializing first.
 * @param {number} visibility from 0 to 1
 */
Screen.prototype.drawScreen = function(visibility) {
};

/**
 * Unload resources that cannot garbage-collect themselves, like WebGL data.
 */
Screen.prototype.destroyScreen = function() {
};


/* ---- js/webgl/trianglebufferbuilder.js ---- */


function TriangleBufferBuilder(gl) {
  this.gl = gl;
  this.pos = [];
  this.color = [];
  this.count = 0;
}

TriangleBufferBuilder.prototype.addRect = function(pos, pz, rectRad, red, green, blue, alpha) {
  // Two triangles form a rect.
  this.pos.push(
      pos.x-rectRad.x, pos.y-rectRad.y, pz,
      pos.x-rectRad.x, pos.y+rectRad.y, pz,
      pos.x+rectRad.x, pos.y+rectRad.y, pz,

      pos.x+rectRad.x, pos.y+rectRad.y, pz,
      pos.x+rectRad.x, pos.y-rectRad.y, pz,
      pos.x-rectRad.x, pos.y-rectRad.y, pz);
  for (var i = 0; i < 6; i++) {
    this.color.push(red, green, blue, alpha);
  }
  this.count += 2;
};

TriangleBufferBuilder.prototype.getTriangleCount = function() {
  return this.count;
};

TriangleBufferBuilder.prototype.createPositionBuff = function() {
  return createStaticGlBuff(this.gl, this.pos);
};

TriangleBufferBuilder.prototype.createColorBuff = function() {
  return createStaticGlBuff(this.gl, this.color);
};


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



// --------------------- PHYSICS -----------------------




/* ---- js/physics/body.js ---- */


/**
 * This has all the information about a physical body that the collision detector needs,
 * and enough of an API for a Spirit to manipulate a body.
 *
 * @constructor
 */
function Body() {
  this.pathStartPos = new Vec2d();
  this.vel = new Vec2d();

  // The pathStartTime is guaranteed to get updated in this amount of time,
  // so do not add events for this path beyond pathStartTime + pathDurationMax.
  // Most spirits will accelerate their bodies at a fixed frequency, so this value
  // will not usually change during a body's lifetime unless its spirit changes.
  this.pathDurationMax = Infinity;

  this.rectRad = new Vec2d();

  this.freezePathStartPos = new Vec2d();
  this.freezeVel = new Vec2d();

  this.reset();
}

Body.Shape = {
  CIRCLE: 1,
  RECT: 2
};

Body.pool = [];

Body.alloc = function() {
  if (Body.pool.length) {
    return Body.pool.pop().reset();
  }
  return new Body();
};

Body.prototype.free = function() {
  Body.pool.push(this);
};

Body.prototype.reset = function() {
  this.id = 0;
  this.spiritId = 0;
  this.pathId = 0;

  // The time at which the body was at pathStartPos
  this.pathStartTime = 0;
  this.pathStartPos.reset();
  this.vel.reset();

  // The World's map of Body objects that need to have their paths validated.
  this.invalidBodyIds = null;

  this.shape = Body.Shape.CIRCLE;

  // circle radius
  this.rad = 1;

  // half-width and half-height, for rects
  this.rectRad.reset(1, 1);

  // This controls which other bodies and rayscans should be tested for collisions.
  this.hitGroup = 0;

  // data for the basic "bounce" collision response
  this.mass = 1;
  this.elasticity = 1;

  // cache for rayscan freeze-unfreeze
  this.freezePathStartPos.reset();
  this.freezeVel.reset();
  this.freezePathStartTime = 0;
  this.freezePathDurationMax = 0;

  return this;
};

Body.SCHEMA = {
  0: 'id',
  1: 'spiritId',
  2: 'pathStartTime',
  3: 'pathStartPos',
  4: 'vel',
  5: 'pathDurationMax',
  6: 'shape',
  7: 'rad',
  8: 'rectRad',
  9: 'hitGroup',
  10: 'mass',
  11: 'elasticity'
};

Body.getJsoner = function() {
  if (!Body.jsoner) {
    Body.jsoner = new Jsoner(Body.SCHEMA);
  }
  return Body.jsoner;
};

Body.prototype.toJSON = function() {
  return Body.getJsoner().toJSON(this);
};

Body.prototype.setFromJSON = function(json) {
  Body.getJsoner().setFromJSON(json, this);
};

/**
 * @param {number} t
 * @param {Vec2d} out
 * @returns {Vec2d}
 */
Body.prototype.getPosAtTime = function(t, out) {
  return out.set(this.vel).scale(t - this.pathStartTime).add(this.pathStartPos);
};

/**
 * @param {number} t
 * @param {=Rect} opt_out
 * @returns {Rect}
 */
Body.prototype.getBoundingRectAtTime = function(t, opt_out) {
  var out = opt_out || new Rect();
  this.getPosAtTime(t, out.pos);
  if (this.shape == Body.Shape.CIRCLE) {
    out.setRadXY(this.rad, this.rad);
  } else if (this.shape == Body.Shape.RECT) {
    out.setRad(this.rectRad);
  }
  return out;
};

/**
 * @returns {Number}
 */
Body.prototype.getArea = function() {
  if (this.shape == Body.Shape.CIRCLE) {
    return Math.PI * this.rad * this.rad;
  } else {
    return this.rectRad.x * this.rectRad.y;
  }
};

Body.prototype.invalidatePath = function() {
  if (this.invalidBodyIds && this.id) {
    this.invalidBodyIds[this.id] = true;
  }
};

/**
 * Shifts the path so it intersects the new position at the new time,
 * without changing the velocity. Teleportation, basically.
 * @param pos
 * @param t
 */
Body.prototype.setPosAtTime = function(pos, t) {
  this.invalidatePath();
  this.pathStartTime = t;
  this.pathStartPos.set(pos);
};

/**
 * Shifts the path so it intersects the new position at the new time,
 * without changing the velocity. Teleportation, basically.
 * @param x
 * @param y
 * @param t
 */
Body.prototype.setPosXYAtTime = function(x, y, t) {
  this.invalidatePath();
  this.pathStartTime = t;
  this.pathStartPos.setXY(x, y);
};

/**
 * Shifts the path so that it intersects the same position at time t that it used to,
 * but it arrives with a new velocity (and therefore is coming from and going to new places.)
 * @param vel
 * @param t
 */
Body.prototype.setVelAtTime = function(vel, t) {
  this.invalidatePath();
  this.moveToTime(t);
  this.vel.set(vel);
};

/**
 * Shifts the path so that it intersects the same position at time t that it used to,
 * but it arrives with a new velocity (and therefore is coming from and going to new places.)
 * @param x
 * @param y
 * @param t
 */
Body.prototype.setVelXYAtTime = function(x, y, t) {
  this.invalidatePath();
  this.moveToTime(t);
  this.vel.setXY(x, y);
};

/**
 * Without invalidating the path, this sets the pathStartTime to t, and adjusts the pathStartPos.
 * @param {number} t
 */
Body.prototype.moveToTime = function(t) {
  if (this.pathStartTime === t) return;
  var temp = this.getPosAtTime(t, Vec2d.alloc());
  this.pathStartPos.set(temp);
  this.pathStartTime = t;
  temp.free();
};

Body.prototype.getPathEndTime = function() {
  return this.pathStartTime + this.pathDurationMax;
};

/**
 * Freezes a body at a certain time, so it can be rayscanned.
 * @param time
 */
Body.prototype.freezeAtTime = function(time) {
  this.freezePathStartPos.set(this.pathStartPos);
  this.freezeVel.set(this.vel);
  this.freezePathStartTime = this.pathStartTime;
  this.freezePathDurationMax = this.pathDurationMax;

  // update pathStartTime and pathStartPos
  this.moveToTime(time);
  // stop in place
  this.vel.setXY(0, 0);
  // rayscans have a pathDurationMax of 1, so this doesn't need anything higher.
  this.pathDurationMax = 1;
};

Body.prototype.unfreeze = function() {
  this.pathStartPos.set(this.freezePathStartPos);
  this.vel.set(this.freezeVel);
  this.pathStartTime = this.freezePathStartTime;
  this.pathDurationMax = this.freezePathDurationMax;
};




/* ---- js/physics/cell.js ---- */


/**
 * A world grid cell, holding pathIds by hitGroup.
 * It is a compact array of groups, indexed by hitGroup number.
 * Each group is a set of pathIds.
 * @constructor
 */
function Cell(groupCount) {
  this.groups = [];
  this.reset(groupCount);
}

Cell.prototype.reset = function(groupCount) {
  for (var i = 0; i < groupCount; i++) {
    if (!this.groups[i]) {
      this.groups[i] = ArraySet.alloc();
    } else {
      this.groups[i].reset();
    }
  }
  while (this.groups.length > groupCount) {
    this.groups.pop().free();
  }
};

Poolify(Cell);

Cell.prototype.addPathIdToGroup = function(pathId, groupId) {
  this.groups[groupId].put(pathId);
};

Cell.prototype.removePathIdFromGroup = function(pathId, groupId) {
  this.groups[groupId].remove(pathId);
};

/**
 * Returns the internal ArraySet.
 * @param groupId
 * @returns {ArraySet}
 */
Cell.prototype.getPathIdsForGroup = function(groupId) {
  return this.groups[groupId];
};

Cell.prototype.isEmpty = function() {
  for (var i = 0; i < this.groups.length; i++) {
    if (!this.groups[i].isEmpty()) {
      return false;
    }
  }
  return true;
};


/* ---- js/physics/cellrange.js ---- */


/**
 * A rectangular range of cells in a grid.
 * @constructor
 */
function CellRange() {
  this.p0 = new Vec2d();
  this.p1 = new Vec2d();
  this.reset();
}

CellRange.prototype.reset = function() {
  this.p0.setXY(0, 0);
  this.p1.setXY(-1, -1);
};

/**
 * @param {CellRange} that
 */
CellRange.prototype.set = function(that) {
  this.p0.set(that.p0);
  this.p1.set(that.p1);
};

Poolify(CellRange);


/* ---- js/physics/hitdetector.js ---- */


/**
 * Creates WorldEvents for collisions between bodies.
 * @constructor
 */
function HitDetector() {
  this.xOverlap = [0, 0];
  this.yOverlap = [0, 0];
  this.overlap = [0, 0, null]; // start, end, axis if any
}

HitDetector.prototype.calcHit = function(now, b0, b1, eventOut) {
  if (b0.vel.equals(b1.vel)) {
    return null;
  }
  var hit = null;
  if (b0.shape == Body.Shape.RECT) {
    if (b1.shape == Body.Shape.RECT) {
      hit = this.calcHitRectRect(now, b0, b1, eventOut);
    } else {
      hit = this.calcHitRectCircle(now, b0, b1, eventOut);
    }
  } else if (b1.shape == Body.Shape.RECT) {
    hit = this.calcHitRectCircle(now, b1, b0, eventOut);
  } else {
    hit = this.calcHitCircleCircle(now, b0, b1, eventOut);
  }
  return hit;
};

/**
 * @param {number} now
 * @param {Body} b0 Rectangluar body
 * @param {Body} b1 Rectangluar body
 * @param {WorldEvent} eventOut Pre-allocated output param.
 * @returns {?WorldEvent} Event if hit, or null.
 */
HitDetector.prototype.calcHitCircleCircle = function(now, b0, b1, eventOut) {
  var p0 = b0.getPosAtTime(now, Vec2d.alloc());
  var p1 = b1.getPosAtTime(now, Vec2d.alloc());

  // For most of the computations, we shift times left so "now" is zero.
  var maxDuration = Math.min(b0.getPathEndTime(), b1.getPathEndTime()) - now;

  // Normalize as if b0 is holding still at 0, 0.
  var overlap = this.circleOriginOverlapTime(
      p1.x - p0.x,
      p1.y - p0.y,
      b1.vel.x - b0.vel.x,
      b1.vel.y - b0.vel.y,
      b0.rad + b1.rad);
  p0.free();
  p1.free();
  var e = null;
  if (overlap && 0 < overlap[0] && overlap[0] <= maxDuration) {
    e = eventOut;
    e.type = WorldEvent.TYPE_HIT;
    e.time = now + overlap[0];
    e.pathId0 = b0.pathId;
    e.pathId1 = b1.pathId;
    e.collisionVec.set(b1.getPosAtTime(e.time, p1)).subtract(b0.getPosAtTime(e.time, p0));
  }
  return e;
};

/**
 * @param {number} now
 * @param {Body} rect Rectangluar body
 * @param {Body} circ Circular body
 * @param {WorldEvent} eventOut Pre-allocated output param.
 * @returns {?WorldEvent} Event if hit, or null.
 */
HitDetector.prototype.calcHitRectCircle = function(now, rect, circ, eventOut) {
  var e = null;
  var posRect = rect.getPosAtTime(now, Vec2d.alloc());
  var posCirc = circ.getPosAtTime(now, Vec2d.alloc());
  var maxDuration = Math.min(rect.getPathEndTime(), circ.getPathEndTime()) - now;

  // bounding rect check
  var brectOverlap = this.rectOverlapTime(
      posRect, rect.vel, rect.rectRad.x, rect.rectRad.y,
      posCirc, circ.vel, circ.rad, circ.rad);
  // If the brects don't overlap, or *finish* before 0, or start after max, then there's no legal hit.
  if (!brectOverlap || brectOverlap[1] <= 0 || maxDuration < brectOverlap[0]) {
    posRect.free();
    posCirc.free();
    return null;
  }

  // Put the circle at 0, 0, holding still. x, y, dx, and dy are for the rect.
  // Tricky - re-use the allocated vecs. Free pos and vel before returning.
  var pos = posRect.subtract(posCirc);
  var vel = posCirc.set(rect.vel).subtract(circ.vel);
  var vSign = Vec2d.alloc().set(vel).sign();

  // Check leading edges. If a hit is found, return immediately,
  // because an edge hit is always earlier than a corner hit.
  // TODO more efficient special-purpose point vs aa-segment code.
  var edgePos = Vec2d.alloc();
  var edgeRad = Vec2d.alloc();
  var compassPos = Vec2d.alloc();
  for (var i = 0; i < 2 && !e; i++) {
    var axis = Vec2d.AXES[i];
    if (vSign[axis]) {
      edgePos.set(pos);
      edgePos[axis] += rect.rectRad[axis] * vSign[axis];
      edgeRad.set(rect.rectRad);
      edgeRad[axis] = 0;

      compassPos[axis] = -vSign[axis] * circ.rad;
      var edgeOverlapTime = this.rectOverlapTime(
          edgePos, vel, edgeRad.x, edgeRad.y,
          compassPos, Vec2d.ZERO, 0, 0);
      compassPos[axis] = 0;
      if (edgeOverlapTime && 0 < edgeOverlapTime[0] && edgeOverlapTime[0] <= maxDuration) {
        e = eventOut;
        e.type = WorldEvent.TYPE_HIT;
        e.time = now + edgeOverlapTime[0];
        e.pathId0 = rect.pathId;
        e.pathId1 = circ.pathId;
        e.collisionVec.setXY(0, 0)[axis] = 1; // I guess?
      }
    }
  }
  edgePos.free();
  edgeRad.free();
  compassPos.free();
  if (e) {
    // There was an edge hit.
    pos.free();
    vel.free();
    vSign.free();
    return e;
  }

  // Now find the earliest hit time, even if it's outside the legal range, because it will be
  // the actual shape-to-shape hit time. Save the range check for last.

  // Check rect's leading corners, as point-circles, against the circle at 0, 0.
  // The bounding rects hit, so the rect is definitely approaching the circle.
  var t = maxDuration + 1;
  var cornerPos = Vec2d.alloc();
  var hitCorner = Vec2d.alloc();
  var overlap;
  if (vSign.x && vSign.y) {
    // Diagonal motion. Check leading corner and two trailing corners.
    // A trailing corner might hit before a lead corner, so check them all.
    // TODO: Don't check a trailing corner if it starts in 1D overlap with circle.

    // lead corner
    cornerPos.set(rect.rectRad).multiply(vSign).add(pos);
    overlap = this.circleOriginOverlapTime(
        cornerPos.x, cornerPos.y, vel.x, vel.y, circ.rad);
    if (overlap) {
      t = overlap[0];
      hitCorner.set(cornerPos);
    }
    // corner above/below lead
    overlap = this.circleOriginOverlapTime(
        cornerPos.x, pos.y - vSign.y * rect.rectRad.y,
        vel.x, vel.y, circ.rad);
    if (overlap && overlap[0] < t) {
      t = overlap[0];
      hitCorner.setXY(cornerPos.x, pos.y - vSign.y * rect.rectRad.y);
    }
    // corner right/left of lead
    overlap = this.circleOriginOverlapTime(
        pos.x - vSign.x * rect.rectRad.x, cornerPos.y,
        vel.x, vel.y, circ.rad);
    if (overlap && overlap[0] < t) {
      t = overlap[0];
      hitCorner.setXY(pos.x - vSign.x * rect.rectRad.x, cornerPos.y);
    }
  } else {
    // Axis-aligned motion.
    // Check the two leading corners.
    // CornerPos starts in the middle of the lead edge,
    // then we shift it to the corners.
    var shift = Vec2d.alloc().set(vSign).rot90Right().multiply(rect.rectRad);
    var edgeCenter = Vec2d.alloc().set(rect.rectRad).multiply(vSign).add(pos);
    for (var i = 0; i < 2; i++) {
      cornerPos.set(edgeCenter).add(shift);
      overlap = this.circleOriginOverlapTime(
          cornerPos.x, cornerPos.y, vel.x, vel.y, circ.rad);
      if (overlap && overlap[0] < t) {
        t = overlap[0];
        hitCorner.set(cornerPos);
      }
      shift.scale(-1);
    }
    shift.free();
    edgeCenter.free();
  }
  if (0 < t && t <= maxDuration) {
    e = eventOut;
    e.type = WorldEvent.TYPE_HIT;
    e.time = now + t;
    e.pathId0 = rect.pathId;
    e.pathId1 = circ.pathId;

    // Slide the hit corner to the edge of the circle.
    e.collisionVec.set(vel).scale(t).add(hitCorner);
  }
  hitCorner.free();
  cornerPos.free();
  vSign.free();
  vel.free();
  pos.free();
  return e;
};

/**
 * @param {number} now
 * @param {Body} b0 Rectangluar body
 * @param {Body} b1 Rectangluar body
 * @param {WorldEvent} eventOut Pre-allocated output param.
 * @returns {?WorldEvent} Event if hit, or null.
 */
HitDetector.prototype.calcHitRectRect = function(now, b0, b1, eventOut) {
  var pos0 = b0.getPosAtTime(now, Vec2d.alloc());
  var pos1 = b1.getPosAtTime(now, Vec2d.alloc());

  // For most of the computations, we shift times left so "now" is zero.
  var maxDuration = Math.min(b0.getPathEndTime(), b1.getPathEndTime()) - now;
  var overlap = this.rectOverlapTime(
      pos0, b0.vel, b0.rectRad.x, b0.rectRad.y,
      pos1, b1.vel, b1.rectRad.x, b1.rectRad.y);

  pos0.free();
  pos1.free();
  var e = null;
  if (overlap && 0 < overlap[0] && overlap[0] <= maxDuration) {
    e = eventOut;
    e.type = WorldEvent.TYPE_HIT;
    e.time = now + overlap[0];
    e.pathId0 = b0.pathId;
    e.pathId1 = b1.pathId;
    e.collisionVec.setXY(0, 0)[overlap[2]] = 1;
  }
  return e;
};


/**
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} dy
 * @param {number} rad
 * @returns {?Array} null for no overlap, or a two element array [start time, end time]
 */
HitDetector.prototype.circleOriginOverlapTime = function(x, y, dx, dy, rad) {
  // quadratic equation
  var a = dx * dx + dy * dy; // not zero, because vels are not equal
  if (a == 0) return null;
  var b = 2 * (x * dx + y * dy);
  var c = x * x + y * y - rad * rad;
  var b2_4ac = b * b - 4 * a * c;
  if (b2_4ac < 0) return null;
  var sqrtb2_4ac = Math.sqrt(b2_4ac);

  var t = (-b + sqrtb2_4ac) / (2 * a);
  var t2 = (-b - sqrtb2_4ac) / (2 * a);
  this.overlap[0] = Math.min(t, t2);
  this.overlap[1] = Math.max(t, t2);
  return this.overlap;
};


/**
 * @param {Vec2d} pos0
 * @param {Vec2d} vel0
 * @param {number} rad0x
 * @param {number} rad0y
 * @param {Vec2d} pos1
 * @param {Vec2d} vel1
 * @param {number} rad1x
 * @param {number} rad1y
 * @returns {?Array} null for no overlap, or a two element array [start time, end time]
 */
HitDetector.prototype.rectOverlapTime = function(
    pos0, vel0, rad0x, rad0y,
    pos1, vel1, rad1x, rad1y) {
  var count;
  count = this.overlapTime1D(
      pos0.x, vel0.x, rad0x,
      pos1.x, vel1.x, rad1x,
      this.xOverlap);
  if (count == 0) return null;
  count = this.overlapTime1D(
      pos0.y, vel0.y, rad0y,
      pos1.y, vel1.y, rad1y,
      this.yOverlap);
  if (count == 0) return null;

  var overlapStart; // max of overlap starts
  if (this.xOverlap[0] < this.yOverlap[0]) {
    overlapStart = this.yOverlap[0];
    this.overlap[2] = Vec2d.Y;
  } else {
    overlapStart = this.xOverlap[0];
    this.overlap[2] = Vec2d.X;
  }
  var overlapEnd = Math.min(this.xOverlap[1], this.yOverlap[1]);
  if (overlapEnd < overlapStart) return null;
  this.overlap[0] = overlapStart;
  this.overlap[1] = overlapEnd;
  return this.overlap;
};

/**
 * One-dimensional overlap timespan.
 * @param p0 position
 * @param v0 velocity
 * @param r0 radius
 * @param p1 position
 * @param v1 velocity
 * @param r1 radius
 * @param out output array. Zero, one, or two time values may be returned.
 * @returns {number} number of collisions returned on the output array
 */
HitDetector.prototype.overlapTime1D = function(p0, v0, r0, p1, v1, r1, out) {
  var v = v1 - v0;
  var p = p1 - p0;
  var r = r0 + r1;
  if (!v) {
    // forever, or never?
    if (Math.abs(p) < r) {
      // forever
      out[0] = -Infinity;
      out[1] = Infinity;
      return 2;
    } else {
      // never
      return 0;
    }
  }
  out[0] = (-p - r) / v;
  out[1] = (-p + r) / v;
  if (out[0] > out[1]) {
    var tmp = out[0];
    out[0] = out[1];
    out[1] = tmp;
  }
  return 2;
};


/* ---- js/physics/hitresolver.js ---- */


/**
 * Accelerates colliding bodies.
 * @constructor
 */
function HitResolver() {
  this.defaultElasticity = 0.99;
}

/**
 * @param {number} time
 * @param {Vec2d} collisionVec
 * @param {Body} b0
 * @param {Body} b1
 */
HitResolver.prototype.resolveHit = function(time, collisionVec, b0, b1) {
  if (b0.mass == Infinity && b1.mass == Infinity) return;
  var pos0 = b0.getPosAtTime(time, Vec2d.alloc());
  var pos1 = b1.getPosAtTime(time, Vec2d.alloc());

  // Shift b0 to the origin, holding still.
  var vel = Vec2d.alloc().set(b1.vel).subtract(b0.vel);

  // Calculate accel needed for inelastic resolution.
  // Calc accel along the collision vector by enough to cancel velocity along that direction.
  var accel = Vec2d.alloc().set(vel).projectOnto(collisionVec);
  // Add onto that for elastic collision.
  accel.scale(-1 - this.defaultElasticity);
  if (accel.equals(Vec2d.ZERO)) {
    accel.free();
    pos0.free();
    pos1.free();
    return;
  }
//  if (accel.magnitudeSquared() < 0.1 * 0.1) {
//    accel.scaleToLength(0.1);
//  }

  // Use masses to decide which body gets accelerated by how much.
  if (b0.mass == Infinity) {
    b1.setVelAtTime(accel.add(b1.vel), time);
  } else if (b1.mass == Infinity) {
    b0.setVelAtTime(accel.scale(-1).add(b0.vel), time);
  } else {
    var work = Vec2d.alloc();
    var massTotal = b0.mass + b1.mass;

    var frac0 = b1.mass / massTotal;
    work.set(accel).scale(-frac0).add(b0.vel);
    b0.setVelAtTime(work, time);

    var frac1 = b0.mass / massTotal;
    work.set(accel).scale(frac1).add(b1.vel);
    b1.setVelAtTime(work, time);
    work.free();
  }
  accel.free();
  pos0.free();
  pos1.free();
};


/* ---- js/physics/overlapdetector.js ---- */


/**
 * This only has static methods, but the constructor gives it a namespace. Meh.
 * @constructor
 */
function OverlapDetector() {
}

OverlapDetector.isBodyOverlappingBodyAtTime = function(b0, b1, t) {
  var overlap;
  var p0 = b0.getPosAtTime(t, Vec2d.alloc());
  var p1 = b1.getPosAtTime(t, Vec2d.alloc());
  if (b0.shape == Body.Shape.CIRCLE && b1.shape == Body.Shape.CIRCLE) {
    overlap = OverlapDetector.isCircleOverlappingCircle(p0, b0.rad, p1, b1.rad);
  } else if (b0.shape == Body.Shape.RECT && b1.shape == Body.Shape.RECT) {
    overlap = OverlapDetector.isRectOverlappingRect(p0, b0.rectRad, p1, b1.rectRad);
  } else if (b0.shape == Body.Shape.RECT) {
    overlap = OverlapDetector.isRectOverlappingCircle(p0, b0.rectRad, p1, b1.rad);
  } else {
    overlap = OverlapDetector.isRectOverlappingCircle(p1, b1.rectRad, p0, b0.rad);
  }
  p0.free();
  p1.free();
  return overlap;
};

OverlapDetector.isCircleOverlappingCircle = function(v0, r0, v1, r1) {
  var r = r0 + r1;
  return v0.distanceSquared(v1) <= r * r;
};

OverlapDetector.isRectOverlappingRect = function(p0, rectRad0, p1, rectRad1) {
  var rx = rectRad0.x + rectRad1.x;
  var ry = rectRad0.y + rectRad1.y;
  var dx = Math.abs(p0.x - p1.x);
  var dy = Math.abs(p0.y - p1.y);
  return dx <= rx && dy <= ry;
};

OverlapDetector.isRectOverlappingCircle = function(rectPos, rectRad, circPos, radius) {
  var nearCorner = Vec2d.alloc(rectPos.x, rectPos.y).subtract(circPos).abs().subtract(rectRad);
  var overlap =
      // rect covers origin?
      (nearCorner.x <= 0 && nearCorner.y <= 0) ||
      // rect overlaps vertical axis of circle?
      (nearCorner.x <= 0 && nearCorner.y <= radius) ||
      // rect overlaps horizontal axis of circle?
      (nearCorner.y <= 0 && nearCorner.x <= radius) ||
      // rect corner inside circle?
      nearCorner.magnitudeSquared() <= radius * radius;
  nearCorner.free();
  return overlap;
};


/* ---- js/physics/scanrequest.js ---- */


/**
 * Rayscan Request.
 * A rayscan is like a body that travels from pos to pos+vel, instantly,
 * reporting back on the first thing it hits.
 * @constructor
 */
function ScanRequest() {
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.rectRad = new Vec2d();
  this.reset();
}

ScanRequest.prototype.reset = function() {
  this.hitGroup = -1;
  this.pos.reset();
  this.vel.reset();
  this.shape = Body.Shape.CIRCLE;
  this.rad = 1;
  this.rectRad.reset();
};

Poolify(ScanRequest);


/* ---- js/physics/scanresponse.js ---- */


/**
 * A ScanResponse holds the result of a World.rayscan.
 * @constructor
 */
function ScanResponse() {
  this.collisionVec = new Vec2d();
  this.reset();
}

ScanResponse.prototype.reset = function() {
  this.timeOffset = 0; // zero to one
  this.pathId = 0;
  this.collisionVec.reset();
};

Poolify(ScanResponse);


/* ---- js/physics/spirit.js ---- */


/**
 * Base class for an entity in the world that does stuff, like manipulating bodies.
 * @param id
 * @constructor
 */
function Spirit(id) {
  this.id = id;
}

/**
 * Every spirit has this called when that spirit enters the world, or when the world first starts up.
 * At this point, a spirit ought to set up an onTimeout, to get its event loop started.
 * @param {World} world
 */
Spirit.prototype.onStart = function(world) {
};

/**
 * Called when the Clock advances to the time of the Timeout.
 * @param {World} world
 * @param {Timeout} timeout  the timeout that the spirit sent to the world.
 */
Spirit.prototype.onTimeout = function(world, timeout) {
};

/**
 * When a Body is hit, the world informs its Spirit, if any.
 * @param {World} world
 * @param {Body} thisBody
 * @param {Body} thatBody
 * @param {WorldEvent} hit
 */
Spirit.prototype.onHit = function(world, thisBody, thatBody, hit) {
};

/**
 * Optional function called on every frame draw.
 * @param {World} world
 * @param {Renderer} renderer
 */
Spirit.prototype.onDraw = function(world, renderer) {
};


/* ---- js/physics/world.js ---- */


/**
 * Handles spirits and bodies.
 *
 * @param {=number} opt_cellSize The world-space size of each cell in the collision-detection grid.
 * If it's too small, time is wasted as things enter and exit cells. If it's too big,
 * we suffer from O(n^2) collision detection speed within each cell.
 * If falsey, this defaults to 15.
 *
 * @param {=number} opt_groupCount The number of collision groups in each cell.
 * If falsey, this defaults to 1.
 *
 * @param {=Array} opt_groupPairs An array of 2-element arrays, defining all the group pairs
 * that can collide with each other. The two IDs in a pair may be the same, to make
 * a group's members collide with each other.
 * If falsey, this defaults to one group, "0", which collides with itself.
 *
 * @constructor
 */
function World(opt_cellSize, opt_groupCount, opt_groupPairs) {
  this.cellSize = opt_cellSize || World.DEFAULT_CELL_SIZE;
  this.groupCount = opt_groupCount || 1;
  this.groupPairs = opt_groupPairs || [[0, 0]];
  this.groupHitsGroups = [];
  for (var i = 0; i < this.groupPairs.length; i++) {
    var pair = this.groupPairs[i];
    for (var a = 0; a < 2; a++) {
      var b = (a + 1) % 2;
      var list = this.groupHitsGroups[pair[a]];
      if (!list) {
        list = this.groupHitsGroups[pair[a]] = [];
      }
      if (list.indexOf(pair[b]) < 0) {
        list.push(pair[b]);
      }
    }
  }

  // spiritId to Spirit
  this.spirits = {};

  // bodyId to Body
  this.bodies = {};

  // pathId to Body. Obsolete pathIds might still point to their old Bodies, so check the body's pathId.
  this.paths = {};

  // bodyId to "true". Holds IDs of body objects that need to have their paths processed by the collider
  // before time can move forward. This includes newly-added bodies.
  // Bodies can be invalid for a time, so that they can be manipulated while time is standing still,
  // without having to recompute collisions every time.
  this.invalidBodyIds = {};

  this.nextId = 10;

  this.grid = {};

  this.queue = new SkipQueue(World.SKIP_QUEUE_BASE,
      SkipQueue.getRecommendedMaxLevel(100, World.SKIP_QUEUE_BASE));

  this.now = 1;

  this.hitDetector = new HitDetector();
  this.hitTimePadding = 0.01;

  // cache for rayscans and overlap scans.
  this.scannedBodyIds = new ObjSet();
}

World.SKIP_QUEUE_BASE = 2;

// 5% fudge factor when deciding what cells an object is in.
World.BRECT_FUDGE_FACTOR = 0.05;

World.GRID_HUGENESS = 10000;

/**
 * The width and height of grid cells.
 * The cell at index 0, 0 has its center at 0, 0.
 * The cell at index -1, 1 has its center at -CELL_SIZE, CELL_SIZE.
 */
World.DEFAULT_CELL_SIZE = 15;

World.prototype.cellCoord = function(worldCoord) {
  return Math.round(worldCoord / this.cellSize);
};

World.prototype.gridIndexForCellCoords = function(ix, iy) {
  return World.GRID_HUGENESS * ix + iy;
};

World.prototype.getCell = function(ix, iy) {
  return this.grid[this.gridIndexForCellCoords(ix, iy)];
};

World.prototype.setCell = function(cell, ix, iy) {
  this.grid[this.gridIndexForCellCoords(ix, iy)] = cell;
  return cell;
};

World.prototype.removeCell = function(ix, iy) {
  var index = this.gridIndexForCellCoords(ix, iy);
  var cell = this.grid[index];
  if (cell) {
    delete this.grid[index];
    cell.free();
  }
};

/**
 * @returns {number}
 */
World.prototype.newId = function() {
  return this.nextId++;
};

/**
 * Assigns an ID and adds the spirit.
 * @return {number} the new spirit ID.
 */
World.prototype.addSpirit = function(spirit) {
  spirit.id = this.newId();
  // If spirit loading gets more complicated, then call loadSpirit instead of inlining.
  this.spirits[spirit.id] = spirit;
  return spirit.id;
};

/**
 * Adds the spirit using the ID it already has.
 */
World.prototype.loadSpirit = function(spirit) {
  if (this.spirits[spirit.id]) throw Error("Spirit with id '" + spirit.id + "' already exists!");
  this.spirits[spirit.id] = spirit;
  this.nextId = Math.max(this.nextId, spirit.id + 1);
};

World.prototype.removeSpiritId = function(id) {
  var spirit = this.spirits[id];
  if (spirit) {
    delete this.spirits[id];
    if (spirit.free) {
      spirit.free();
    }
  }
};

/**
 * Assigns an ID and adds the body.
 * @returns {number} the new body ID
 */
World.prototype.addBody = function(body) {
  body.id = this.newId();
  this.loadBody(body);
  return body.id;
};

/**
 * Adds the body using the ID it already has.
 */
World.prototype.loadBody = function(body) {
  if (this.bodies[body.id]) throw Error("Body with id '" + body.id + "' already exists!");
  // Add it to the bodies index and to the invalid bodies index.
  // The next time the clock moves forward, the invalid body will be addressed.
  this.bodies[body.id] = body;
  this.nextId = Math.max(this.nextId, body.id + 1);

  // Hook the path invalidator into the body. A wee bit hacky.
  body.invalidBodyIds = this.invalidBodyIds;
  body.invalidatePath();
};

/**
 * Removes the body and frees the body from the class pool.
 * @param bodyId
 */
World.prototype.removeBodyId = function(bodyId) {
  var body = this.bodies[bodyId];
  if (body) {
    var rect = Rect.alloc();
    this.getPaddedBodyBoundingRect(body, this.now, rect);
    var range = CellRange.alloc();
    this.getCellRangeForRect(rect, range);
    this.removeBodyFromCellRange(body, range);
    range.free();
    rect.free();
    delete this.bodies[body.id];
    delete this.paths[body.pathId];
    delete this.invalidBodyIds[body.id];
    body.free();
  } else {
    console.log("couldn't find or remove bodyId " + bodyId);
  }
};

World.prototype.removeBodyFromCellRange = function(body, cellRange) {
  for (var iy = cellRange.p0.y; iy <= cellRange.p1.y; iy++) {
    for (var ix = cellRange.p0.x; ix <= cellRange.p1.x; ix++) {
      var cell = this.getCell(ix, iy);
      if (cell) {
        cell.removePathIdFromGroup(body.pathId, body.hitGroup);
        if (cell.isEmpty()) {
          this.removeCell(ix, iy);
        }
      }
    }
  }
};

World.prototype.getBody = function(bodyId) {
  this.validateBodies();
  return this.bodies[bodyId];
};

/**
 * Also purges obsolete pathIds from the index.
 * @param pathId
 * @returns {*}
 */
World.prototype.getBodyByPathId = function(pathId) {
  this.validateBodies();
  var body = this.paths[pathId];
  if (body && body.pathId != pathId) {
    delete this.paths[pathId];
    body = null;
  }
  if (body && !this.bodies[body.id]) {
    console.warn("getBodyByPathId is writing checks that bodies cannot cash. pathId", pathId, "body.id:", body.id);
  }
  return body;
};

World.prototype.validateBodies = function() {
  for (var bodyId in this.invalidBodyIds) {
    delete this.invalidBodyIds[bodyId];
    var body = this.bodies[bodyId];
    if (!body) continue;
    if (body.pathId) {
      delete this.paths[body.pathId];
    }

    // Update path
    body.moveToTime(this.now);
    body.pathId = this.newId();
    this.paths[body.pathId] = body;

    // Add initial set of events.
    this.addPathToGrid(body);
    this.addFirstGridEvent(body, WorldEvent.TYPE_GRID_ENTER, Vec2d.X);
    this.addFirstGridEvent(body, WorldEvent.TYPE_GRID_ENTER, Vec2d.Y);
    this.addFirstGridEvent(body, WorldEvent.TYPE_GRID_EXIT, Vec2d.X);
    this.addFirstGridEvent(body, WorldEvent.TYPE_GRID_EXIT, Vec2d.Y);
  }
};

World.prototype.getCellRangeForRect = function(rect, range) {
  range.p0.setXY(
      this.cellCoord(rect.pos.x - rect.rad.x),
      this.cellCoord(rect.pos.y - rect.rad.y));
  range.p1.setXY(
      this.cellCoord(rect.pos.x + rect.rad.x),
      this.cellCoord(rect.pos.y + rect.rad.y));
  return range;
};

World.prototype.addPathToGrid = function(body) {
  var brect = this.getPaddedBodyBoundingRect(body, this.now, Rect.alloc());
  var range = this.getCellRangeForRect(brect, CellRange.alloc());
  for (var iy = range.p0.y; iy <= range.p1.y; iy++) {
    for (var ix = range.p0.x; ix <= range.p1.x; ix++) {
      var cell = this.getCell(ix, iy);
      if (!cell) {
        cell = this.setCell(Cell.alloc(this.getGroupCount()), ix, iy);
      }
      this.addPathToCell(body, cell);
    }
  }
  range.free();
  brect.free();
};

World.prototype.getGroupCount = function() {
  return this.groupCount;
};

World.prototype.addPathToCell = function(body, cell) {
  var nextEvent = WorldEvent.alloc();
  var group = body.hitGroup;

  var hitGroups = this.groupHitsGroups[group];
  for (var gi = 0; gi < hitGroups.length; gi++) {
    var otherGroup = hitGroups[gi];
    var pathIdSet = cell.getPathIdsForGroup(otherGroup);
    var pathIdArray = pathIdSet.vals;
    for (var pi = 0; pi < pathIdArray.length;) {
      var pathId = pathIdArray[pi];
      var otherBody = this.paths[pathId];
      if (otherBody && otherBody.pathId == pathId) {
        var hitEvent = this.hitDetector.calcHit(this.now, body, otherBody, nextEvent);
        if (hitEvent && hitEvent.time < Infinity) {
          // Pad the collision time to prevent numerical-challenge interpenetration.
          hitEvent.time = Math.max(hitEvent.time - this.hitTimePadding, this.now);
          // Add the existing event and allocate the next one.
          this.queue.add(hitEvent);
          nextEvent = WorldEvent.alloc();
        }
        pi++;
      } else {
        pathIdSet.removeIndex(pi);
      }
    }
  }
  cell.addPathIdToGroup(body.pathId, group);
  nextEvent.free();
};

/**
 * Checks to see if the body's path will enter/exit a CellRange
 * before the path expires, and allocates and adds the event if so.
 * @param {Body} body
 * @param {String} eventType WorldEvent TYPE const.
 * @param {String} axis The axis along which the object travels (not the axis it crosses)
 * @param {WorldEvent} eventOut
 * @return {?WorldEvent} if there is an event, or null otherwise.
 */
World.prototype.getFirstGridEvent = function(body, eventType, axis, eventOut) {
  var v = body.vel;
  if (!v[axis]) return null;
  var perp = Vec2d.otherAxis(axis);

  // Calculate the leading/trailing point "p" on the moving bounding rect.
  var rect = body.getBoundingRectAtTime(this.now, Rect.alloc());
  var vSign = Vec2d.alloc().set(body.vel).sign();

  var p = Vec2d.alloc().set(rect.rad).multiply(vSign);
  if (eventType === WorldEvent.TYPE_GRID_EXIT) {
    p.scale(-1);
  }
  p.add(rect.pos);

  // c is the center of the cell that p is in.
  var c = Vec2d.alloc().set(p).roundToGrid(this.cellSize);

  // Calculate crossing times
  var e = null;
  var t = this.now + (c[axis] + 0.5 * vSign[axis] * this.cellSize - p[axis]) / v[axis];
  if (t < this.now) {
    console.error("oh crap, grid event time < now:", t, this.now);
  } else if (t <= body.getPathEndTime()) {
    e = eventOut;
    e.type = eventType;
    e.axis = axis;
    e.time = t;
    e.pathId = body.pathId;

    // Is the event about entering the next set of cells, or leaving the current one?
    e.cellRange.p0[axis] = e.cellRange.p1[axis] = this.cellCoord(c[axis]) +
        (eventType === WorldEvent.TYPE_GRID_ENTER ? vSign[axis] : 0);
    // The length of the crossing, in cells, depends on the position of the bounding rect at that time.
    this.getPaddedBodyBoundingRect(body, t, rect);
    e.cellRange.p0[perp] = this.cellCoord(rect.pos[perp] - rect.rad[perp]);
    e.cellRange.p1[perp] = this.cellCoord(rect.pos[perp] + rect.rad[perp]);
  }
  c.free();
  p.free();
  vSign.free();
  rect.free();
  return e;
};

/**
 * Checks to see if the body's path will enter/exit a CellRange
 * before the path expires, and allocates and adds the event if so.
 * @param {Body} body
 * @param {String} eventType WorldEvent TYPE const.
 * @param {String} axis The axis along which the object travels (not the axis it crosses)
 */
World.prototype.addFirstGridEvent = function(body, eventType, axis) {
  var event = WorldEvent.alloc();
  if (this.getFirstGridEvent(body, eventType, axis, event)) {
    this.queue.add(event);
  } else {
    event.free();
  }
};

/**
 * Checks to see if the body's path will enter/exit a CellRange
 * before the path expires, and allocates and adds the event if so.
 * @param {Body} body
 * @param {WorldEvent} prevEvent The grid event before this one.
 * @param {WorldEvent} eventOut
 * @return {?WorldEvent} if there is an event, or null otherwise.
 */
World.prototype.getSubsequentGridEvent = function(body, prevEvent, eventOut) {
  var axis = prevEvent.axis;
  var eventType = prevEvent.type;
  var v = body.vel;
  if (!v[axis]) return null;
  var perp = Vec2d.otherAxis(axis);

  var vSign = Vec2d.alloc().set(v).sign();
  var nextCellIndex = prevEvent.cellRange.p0[axis] + vSign[axis];
  // What time will the point reach that cell index?
  var rad = vSign[axis] * (body.shape == Body.Shape.CIRCLE ? body.rad : body.rectRad[axis]);
  var dest;
  if (eventType == WorldEvent.TYPE_GRID_ENTER) {
    dest = (nextCellIndex - 0.5 * vSign[axis]) * this.cellSize - rad;
  } else {
    dest = (nextCellIndex + 0.5 * vSign[axis]) * this.cellSize + rad;
  }
  var t = body.pathStartTime + (dest - body.pathStartPos[axis]) / v[axis];
  var e = null;
  if (t < this.now) {
    console.error("oh crap", t, this.now);
  } else if (t <= body.getPathEndTime()) {
    e = eventOut;
    e.type = eventType;
    e.axis = axis;
    e.time = t;
    e.pathId = body.pathId;

    // Is the event about entering the next set of cells, or leaving the current one?
    e.cellRange.p0[axis] = e.cellRange.p1[axis] = nextCellIndex;
    // The length of the crossing, in cells, depends on the position of the bounding rect at that time.
    var rect = Rect.alloc();
    this.getPaddedBodyBoundingRect(body, t, rect);
    e.cellRange.p0[perp] = this.cellCoord(rect.pos[perp] - rect.rad[perp]);
    e.cellRange.p1[perp] = this.cellCoord(rect.pos[perp] + rect.rad[perp]);
    rect.free();
  }
  vSign.free();
  return e;
};

World.prototype.addSubsequentGridEvent = function(body, prevEvent) {
  var event = WorldEvent.alloc();
  if (this.getSubsequentGridEvent(body, prevEvent, event)) {
    this.queue.add(event);
  } else {
    event.free();
  }
};

/**
 * Returns the next event in the queue, without dequeueing it.
 */
World.prototype.getNextEvent = function() {
  this.validateBodies();
  return this.queue.getFirst();
};

/**
 * Removes the next event from the queue, and advances the world time to the event time,
 * optionally doing some internal processing.
 */
World.prototype.processNextEvent = function() {
  this.validateBodies();
  var e = this.queue.removeFirst();
  this.now = e.time;

  if (e.type === WorldEvent.TYPE_GRID_ENTER) {
    var body = this.paths[e.pathId];
    if (body && body.pathId == e.pathId) {
      this.addSubsequentGridEvent(body, e);
      for (var iy = e.cellRange.p0.y; iy <= e.cellRange.p1.y; iy++) {
        for (var ix = e.cellRange.p0.x; ix <= e.cellRange.p1.x; ix++) {
          var cell = this.getCell(ix, iy);
          if (!cell) {
            cell = this.setCell(Cell.alloc(this.getGroupCount()), ix, iy);
          }
          this.addPathToCell(body, cell);
        }
      }
    }

  } else if (e.type === WorldEvent.TYPE_GRID_EXIT) {
    var body = this.paths[e.pathId];
    if (body && body.pathId == e.pathId) {
      this.addSubsequentGridEvent(body, e);
      this.removeBodyFromCellRange(body, e.cellRange);
    }

  } else if (e.type === WorldEvent.TYPE_HIT) {
    // Let the game handle it.

  } else if (e.type === WorldEvent.TYPE_TIMEOUT) {
    var spirit = this.spirits[e.spiritId];
    if (spirit) {
      spirit.onTimeout(this, e);
    }
  }
  e.free();
};

World.prototype.addTimeout = function(time, spiritId, val) {
  var e = WorldEvent.alloc();
  e.type = WorldEvent.TYPE_TIMEOUT;
  e.time = time;
  e.spiritId = spiritId;
  e.timeoutVal = val;
  this.queue.add(e);
};

/**
 * Adds the timeout to the event queue.
 */
World.prototype.loadTimeout = function(e) {
  this.addTimeout(e.time, e.spiritId, e.timeoutVal);
};

// TODO World.prototype.removeTimeout

/**
 * Performs an immediate rayscan. If there's a hit, this will return true,
 * and the response will be populated. Otherwise it will be untouched.
 * @param {ScanRequest} req Input param
 * @param {ScanResponse} resp Output param.
 * @return {boolean} true if there's a hit, false if not.
 */
World.prototype.rayscan = function(req, resp) {
  this.validateBodies();
  this.scannedBodyIds.reset();
  var foundHit = false;

  // Create a Body based on the ScanRequest.
  var b = Body.alloc();
  b.hitGroup = req.hitGroup;
  b.setPosAtTime(req.pos, this.now);
  b.vel.set(req.vel);
  b.shape = req.shape;
  b.rad = req.rad;
  b.rectRad.set(req.rectRad);
  b.pathDurationMax = 1;

  // allocs
  var rect = Rect.alloc();
  var range = CellRange.alloc();
  var hitEvent = WorldEvent.alloc();
  var xEvent = WorldEvent.alloc();
  var yEvent = WorldEvent.alloc();

  // The hitEvent will always be the earliest hit, because every time a hit is found,
  // the body's pathDurationMax is ratcheted down to the hit time. So only
  // earlier hits will be discovered afterwards.
  hitEvent.time = this.now + b.pathDurationMax + 1; // effective infinity

  // Examine the body's starting cells.
  b.getBoundingRectAtTime(this.now, rect);
  this.getCellRangeForRect(rect, range);
  if (this.getRayscanHit(b, range, hitEvent)) {
    foundHit = true;
  }

  // Calc the initial grid-enter events
  xEvent.time = yEvent.time = this.now + b.pathDurationMax + 1; // effective infinity

  this.getFirstGridEvent(b, WorldEvent.TYPE_GRID_ENTER, Vec2d.X, xEvent);
  this.getFirstGridEvent(b, WorldEvent.TYPE_GRID_ENTER, Vec2d.Y, yEvent);

  // Process the earliest grid-enter event and generate the next one,
  // until they're later than the max time.
  var maxTime = this.now + b.pathDurationMax;
  var eventOut = WorldEvent.alloc();
  var tmp;
  while (xEvent.time <  maxTime || yEvent.time < maxTime) {
    if (xEvent.time < yEvent.time) {
      if (this.getRayscanHit(b, xEvent.cellRange, hitEvent)) {
        foundHit = true;
      }
      if (this.getSubsequentGridEvent(b, xEvent, eventOut)) {
        tmp = xEvent;
        xEvent = eventOut;
        eventOut = tmp;
      } else {
        // Push event out of range.
        xEvent.time = maxTime + 1;
      }
    } else {
      if (this.getRayscanHit(b, yEvent.cellRange, hitEvent)) {
        foundHit = true;
      }
      if (this.getSubsequentGridEvent(b, yEvent, eventOut)) {
        tmp = yEvent;
        yEvent = eventOut;
        eventOut = tmp;
      } else {
        // Push event out of range.
        yEvent.time = maxTime + 1;
      }
    }
    // lower maxTime
    maxTime = this.now + b.pathDurationMax;
  }

  if (foundHit) {
    // The request body's pathId is 0, so take the non-zero one.
    resp.pathId = hitEvent.pathId0 || hitEvent.pathId1;
    resp.timeOffset = hitEvent.time - this.now;
    resp.collisionVec.set(hitEvent.collisionVec);
  }
  rect.free();
  range.free();
  hitEvent.free();
  xEvent.free();
  yEvent.free();
  return foundHit;
};

/**
 * Gets the earliest hit between a Body and all the bodies in a CellRange.
 * Side effect: The input body's pathDurationMax will shrink to the hit time.
 * @param {Body} body
 * @param {CellRange} range
 * @param {WorldEvent} eventOut
 * @returns {?WorldEvent} eventOut if there was a hit, or null otherwise.
 */
World.prototype.getRayscanHit = function(body, range, eventOut) {
  var retval = null;
  for (var iy = range.p0.y; iy <= range.p1.y; iy++) {
    for (var ix = range.p0.x; ix <= range.p1.x; ix++) {
      var cell = this.getCell(ix, iy);
      if (cell) {
        var hitGroups = this.groupHitsGroups[body.hitGroup];
        for (var gi = 0; gi < hitGroups.length; gi++) {
          var otherGroup = hitGroups[gi];
          var pathIdSet = cell.getPathIdsForGroup(otherGroup);
          var pathIdArray = pathIdSet.vals;
          for (var i = 0; i < pathIdArray.length;) {
            var pathId = pathIdArray[i];
            var otherBody = this.paths[pathId];
            if (otherBody && otherBody.pathId == pathId) {
              if (!this.scannedBodyIds.contains(otherBody.id)) {
                this.scannedBodyIds.put(otherBody.id);
                otherBody.freezeAtTime(this.now);
                if (this.hitDetector.calcHit(this.now, body, otherBody, eventOut)) {
                  retval = eventOut;
                  // Tighten the duration max. There's no point in looking for later hits, just earlier ones.
                  // (This is OK for rayscans, but never do it for other bodies.)
                  body.pathDurationMax = eventOut.time - this.now;
                }
                otherBody.unfreeze();
              }
              i++;
            } else {
              pathIdSet.removeIndex(i);
            }
          }
        }
      }
    }
  }
  return retval;
};

/**
 * Gets the instantaneous overlaps of a body with the objects in the world, at world.now.
 * Takes the body's hitGtoup into account, but not its path duration.
 * @param {Body} body  the query, as a Body.
 * @return {Array.<String>} body IDs
 */
World.prototype.getOverlaps = function(body) {
  var retval = [];
  this.validateBodies();
  this.scannedBodyIds.reset();
  var brect = this.getPaddedBodyBoundingRect(body, this.now, Rect.alloc());
  var range = this.getCellRangeForRect(brect, CellRange.alloc());
  for (var iy = range.p0.y; iy <= range.p1.y; iy++) {
    for (var ix = range.p0.x; ix <= range.p1.x; ix++) {
      var cell = this.getCell(ix, iy);
      if (cell) {
        var hitGroups = this.groupHitsGroups[body.hitGroup];
        for (var gi = 0; gi < hitGroups.length; gi++) {
          var otherGroup = hitGroups[gi];
          var pathIdSet = cell.getPathIdsForGroup(otherGroup);
          var pathIdArray = pathIdSet.vals;
          for (var pi = 0; pi < pathIdArray.length;) {
            var pathId = pathIdArray[pi];
            var otherBody = this.paths[pathId];
            if (otherBody && otherBody.pathId == pathId) {
              if (!this.scannedBodyIds.contains(otherBody.id)) {
                this.scannedBodyIds.put(otherBody.id);
                if (OverlapDetector.isBodyOverlappingBodyAtTime(body, otherBody, this.now)) {
                  retval.push(otherBody.id);
                }
              }
              pi++;
            } else {
              // opportunistically erase obsolete path from cell
              pathIdSet.removeIndex(pi);
            }
          }
        }
      }
    }
  }
  brect.free();
  range.free();
  return retval;
};

World.prototype.getPaddedBodyBoundingRect = function(body, time, rectOut) {
  return body.getBoundingRectAtTime(time, rectOut).pad(this.cellSize * World.BRECT_FUDGE_FACTOR)
}


/* ---- js/physics/worldevent.js ---- */


/**
 * A union of all the world event types and their fields, as a SkipList node.
 * @constructor
 */
function WorldEvent() {
  this.next = [];
  this.cellRange = new CellRange(0, 0, -1, -1);

  // This is a vector along which collision acceleration should be applied,
  // for default elastic collision resolution.
  this.collisionVec = new Vec2d();
  this.reset();
}

// Only for TYPE_TIMEOUT events so far.
WorldEvent.SCHEMA = {
  0: 'time',
  1: 'type',
  2: 'spiritId',
  3: 'timeoutVal'
};

WorldEvent.getJsoner = function() {
  if (!WorldEvent.jsoner) {
    WorldEvent.jsoner = new Jsoner(WorldEvent.SCHEMA);
  }
  return WorldEvent.jsoner;
};

WorldEvent.prototype.toJSON = function() {
  return WorldEvent.getJsoner().toJSON(this);
};

WorldEvent.prototype.setFromJSON = function(json) {
  WorldEvent.getJsoner().setFromJSON(json, this);
};

WorldEvent.TYPE_TIMEOUT = 'timeout';
WorldEvent.TYPE_GRID_ENTER = 'enter';
WorldEvent.TYPE_GRID_EXIT = 'exit';
WorldEvent.TYPE_HIT = 'hit';

WorldEvent.prototype.reset = function() {
  // SkipQueue node stuff
  this.time = 0;
  this.next.length = 0;

  // Which kind of event is it? One of the TYPE constants.
  this.type = 0;

  // timeout fields
  this.spiritId = 0;
  this.timeoutVal = null;

  // grid enter/exit cell range
  this.axis = null; // one of Vec2d.X or Vec2d.Y
  this.pathId = 0;
  this.cellRange.reset();

  // hit fields
  this.pathId0 = 0;
  this.pathId1 = 0;
  this.collisionVec.reset();
  // this.axis, if set, means there was a hit on a side of a rectangle. X means it was east or west, Y is N or S.

  return this;
};

WorldEvent.pool = [];

WorldEvent.alloc = function() {
  if (WorldEvent.pool.length) {
    return WorldEvent.pool.pop().reset();
  }
  return new WorldEvent();
};

WorldEvent.prototype.free = function() {
  WorldEvent.pool.push(this);
};

WorldEvent.prototype.toString = function() {
  var s = [];
  s.push('{time: ', this.time, ', type: ', this.type);
  if (this.type === WorldEvent.TYPE_TIMEOUT) {
    s.push(', spiritId: ', this.spiritId, ', timeoutVal: ', this.timeoutVal);
  } else if (this.type === WorldEvent.TYPE_GRID_ENTER || this.type === WorldEvent.TYPE_GRID_EXIT) {
    s.push(', pathId: ', this.pathId, ', axis: ' + this.axis, ', cellRange: ' + JSON.stringify(this.cellRange));
  } else if (this.type === WorldEvent.TYPE_HIT) {
    s.push(', pathId0: ', this.pathId0, ', pathId1: ', this.pathId1);
  }
  s.push('}');
  return s.join('');
};


// --------------------- SOUND -----------------------



/* ---- js/sound/soundfx.js ---- */


/**
 * Utils for producing sound effects positioned in 3D.
 * @param {=AudioContext} opt_audioContext
 * @constructor
 */
function SoundFx(opt_audioContext) {
  this.ctx = opt_audioContext || SoundFx.getAudioContext();
  if (this.ctx) {
    if (!(this.ctx.createGain || this.ctx.createGainNode) || !this.ctx.createOscillator) {
      this.ctx = null;
    }
  }
  if (this.ctx) {
    this.masterGain = this.createGain();
    this.masterGain.connect(this.ctx.destination);
  }
}

SoundFx.audioContext = null;

SoundFx.getAudioContext = function() {
  if (SoundFx.audioContext != null) {
    return SoundFx.audioContext;
  } else if (typeof AudioContext !== 'undefined') {
    SoundFx.audioContext = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    SoundFx.audioContext = new webkitAudioContext();
  }
  return SoundFx.audioContext;
};

SoundFx.prototype.createGain = function() {
  if (this.ctx.createGain) {
    return this.ctx.createGain();
  }
  if (this.ctx.createGainNode) {
    return this.ctx.createGainNode();
  }
  return null;
};

SoundFx.prototype.setListenerXYZ = function(x, y, z) {
  if (!this.ctx) return;
  this.ctx.listener.setPosition(x, y, z);
};

SoundFx.prototype.getMasterGain = function() {
  return this.masterGain;
};

/**
 * Make a simple one-shot sound.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} vol
 * @param {number} attack
 * @param {number} sustain
 * @param {number} decay
 * @param {number} freq1
 * @param {number} freq2
 * @param {String} type Wave type string (square, sine, etc)
 */
SoundFx.prototype.sound = function(x, y, z, vol, attack, sustain, decay, freq1, freq2, type, opt_delay) {
  if (!this.ctx) return;
  var delay = opt_delay || 0;
  var c = this.ctx;
  var t0 = c.currentTime + delay;
  var t1 = t0 + attack + sustain + decay;
  var gain = this.createGain();
  if (attack) {
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  }
  gain.gain.setValueAtTime(vol, t0 + attack);
  if (sustain) {
    gain.gain.setValueAtTime(vol, t0 + attack + sustain);
  }
  if (decay) {
    gain.gain.exponentialRampToValueAtTime(0.01, t0 + attack + sustain + decay);
  }

  var osc = c.createOscillator();
  osc.frequency.setValueAtTime(freq1, t0);
  osc.frequency.exponentialRampToValueAtTime(freq2, t0 + attack + sustain + decay);
  osc.type = type;
  if (osc.start) {
    osc.start(t0);
  } else if (osc.noteOn) {
    osc.noteOn(t0);
  }
  if (osc.stop) {
    osc.stop(t1);
  } else if (osc.noteOff) {
    osc.noteOff(t1);
  }

  var panner = c.createPanner();
  panner.setPosition(x, y, z);

  osc.connect(gain);
  gain.connect(panner);
  panner.connect(this.masterGain);
};

/**
 * Makes a sound with no attack, decay, or frequency changes.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} vol
 * @param {number} sustain
 * @param {number} freq
 * @param {String} opt_type Wave type string (square, sine, etc). Default is sine
 */
SoundFx.prototype.note = function(x, y, z, vol, sustain, freq, opt_type) {
  var type = opt_type || 'sine';
  this.sound(x, y, z, vol, 0, sustain, 0, freq, freq, type);
}

SoundFx.prototype.disconnect = function() {
  if (this.masterGain) {
    this.masterGain.gain = 0;
    this.masterGain.disconnect();
    this.masterGain = null;
  }
};



// ---------- TOUCH/TRIGGER/POINTER EVENTS -----------



/* ---- js/controls/pointerevent.js ---- */


/**
 * @constructor
 */
function PointerEvent() {
  this.pos = new Vec2d();
  this.reset();
}

/** touch start, and mouse down */
PointerEvent.TYPE_DOWN = 1;

/** touch move and mouse move */
PointerEvent.TYPE_MOVE = 2;

/** touch end+cancel+leave, and mouse up */
PointerEvent.TYPE_UP = 3;

PointerEvent.prototype.reset = function() {
  this.type = null;
  this.pointerId = null;
  this.time = 0;
  this.pos.reset();
  return this;
};

PointerEvent.pool = [];

PointerEvent.alloc = function() {
  if (PointerEvent.pool.length) {
    return PointerEvent.pool.pop().reset();
  }
  return new PointerEvent();
};

PointerEvent.prototype.free = function() {
  PointerEvent.pool.push(this);
};


/* ---- js/controls/multipointer.js ---- */


/**
 * Multiple pointer handler, blending mouse and touch on a canvas.
 * Each frame it provides before and after snapshots, and a
 * log of all the events in between.
 * If queueing is on, be sure to call clearEventQueue() after handling event data, and before waiting until the next
 * frame, because mouse and touch events only arrive when no other JS is running.
 * @param canvas
 * @param {Matrix44} viewMatrix
 * @param {boolean} queueing
 *
 * @constructor
 */
function MultiPointer(canvas, viewMatrix, queueing) {
  this.canvas = canvas;
  this.inverseViewMatrix = new Matrix44();
  this.setViewMatrix(viewMatrix);

  // Maps from IDs to Vec2d()s.
  this.eventCoords = {};
  this.oldPositions = {};
  this.positions = {};

  // Queue of PointerEvent objects. There are usually only a few per frame,
  // so 100 is grossly overkill, I hope.
  this.queue = queueing ? new CircularQueue(100) : null;

  this.mat44 = new Matrix44;
  this.vec4 = new Vec4();
  this.canvasToClip = new Matrix44();

  var self = this;

  this.touchStartListener = function(e) {
    self.onTouchStart(e);
  };
  this.touchMoveListener = function(e) {
    self.onTouchMove(e);
  };
  this.touchEndListener = function(e) {
    self.onTouchEnd(e);
  };
  this.mouseDownListener = function(e) {
    self.onMouseDown(e);
  };
  this.mouseMoveListener = function(e) {
    self.onMouseMove(e);
  };
  this.mouseUpListener = function(e) {
    self.onMouseUp(e);
  };

  this.domEventListeners = new ArraySet();

  this.listening = false;
}

MultiPointer.MOUSE_ID = 'mouse';

MultiPointer.prototype.startListening = function() {
  if (!this.listening) {
    document.body.addEventListener('mousedown', this.mouseDownListener);
    document.body.addEventListener('mousemove', this.mouseMoveListener);
    document.body.addEventListener('mouseup', this.mouseUpListener);
    document.body.addEventListener('touchstart', this.touchStartListener);
    document.body.addEventListener('touchmove', this.touchMoveListener);
    document.body.addEventListener('touchend', this.touchEndListener);
    document.body.addEventListener('touchcancel', this.touchEndListener);
    document.body.addEventListener('touchleave', this.touchEndListener);
    this.listening = true;
  }
  return this;
};

MultiPointer.prototype.stopListening = function() {
  if (this.listening) {
    document.body.removeEventListener('mousedown', this.mouseDownListener);
    document.body.removeEventListener('mousemove', this.mouseMoveListener);
    document.body.removeEventListener('mouseup', this.mouseUpListener);
    document.body.removeEventListener('touchstart', this.touchStartListener);
    document.body.removeEventListener('touchmove', this.touchMoveListener);
    document.body.removeEventListener('touchend', this.touchEndListener);
    document.body.removeEventListener('touchcancel', this.touchEndListener);
    document.body.removeEventListener('touchleave', this.touchEndListener);
    this.listening = false;
    this.clearEventQueue();
    for (var id in this.positions) {
      delete this.positions[id];
    }
    for (var id in this.oldPositions) {
      delete this.oldPositions[id];
    }
    for (var id in this.eventCoords) {
      delete this.eventCoords[id];
    }
  }
  return this;
};

/**
 * Adds a function that will be called as part of the read DOM event handler stack,
 * so it will be able to do things like toggle fullscreen or pointer events.
 * The function will be called with a PointerEvent, the same one that gets added to
 * the internal queue.
 * @param {Function} fn
 */
MultiPointer.prototype.addListener = function(fn) {
  this.domEventListeners.put(fn);
};

/**
 * @param {Function} fn
 */
MultiPointer.prototype.removeListener = function(fn) {
  this.domEventListeners.remove(fn);
};

MultiPointer.prototype.getQueueSize = function() {
  return this.queue ? this.queue.size() : 0;
};

/**
 * @param index Zero is the oldest event, and getQueueSize-1 is the newest.
 * @returns {PointerEvent}
 */
MultiPointer.prototype.getPointerEventFromTail = function(index) {
  return this.queue.getFromTail(index);
};

MultiPointer.prototype.setViewMatrix = function(viewMatrix) {
  viewMatrix.getInverse(this.inverseViewMatrix);
  if (!this.listening) return;

  // Effectively, every point has moved, so create a move event for them.
  for (var id in this.positions) {
    var e = PointerEvent.alloc();
    e.type = PointerEvent.TYPE_MOVE;
    e.pointerId = id;
    e.time = Date.now();
    e.pos.set(this.eventCoords[id]);
    this.transformCanvasToWorld(e.pos);
    this.enqueue(e);

    this.positions[id].set(e.pos);
  }
};

/**
 * Flips the old and new position snapshots, and clears the queue
 */
MultiPointer.prototype.clearEventQueue = function() {
  if (!this.queue) return;
  // Delete obsolete oldPos entries
  for (var id in this.oldPositions) {
    if (!(id in this.positions)) {
      this.oldPositions[id].free();
      delete this.oldPositions[id];
    }
  }
  for (id in this.positions) {
    if (!(id in this.oldPositions)) {
      this.oldPositions[id] = Vec2d.alloc();
    }
    this.oldPositions[id].set(this.positions[id]);
  }
  while (!this.queue.isEmpty()) {
    this.queue.dequeue();
  }
};

MultiPointer.prototype.isPointerLocked = function() {
  return document.pointerLockElement ||
         document.mozPointerLockElement ||
         document.webkitPointerLockElement;
};

MultiPointer.prototype.onMouseDown = function(e) {
  if (!this.isPointerLocked()) {
    this.down(MultiPointer.MOUSE_ID, e.clientX, e.clientY);
  }
};

MultiPointer.prototype.onMouseMove = function(e) {
  this.move(MultiPointer.MOUSE_ID, e.clientX, e.clientY);
};

MultiPointer.prototype.onMouseUp = function(e) {
  this.up(MultiPointer.MOUSE_ID, e.clientX, e.clientY);
};

MultiPointer.prototype.onTouchStart = function(e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    this.down(touch.identifier, touch.pageX, touch.pageY);
  }
};

MultiPointer.prototype.onTouchMove = function(e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    this.move(touch.identifier, touch.pageX, touch.pageY);
  }
};

MultiPointer.prototype.onTouchEnd = function(e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    this.up(touch.identifier, touch.pageX, touch.pageY);
  }
};

MultiPointer.prototype.down = function(id, x, y) {
  var e = PointerEvent.alloc();
  e.type = PointerEvent.TYPE_DOWN;
  e.pointerId = id;
  e.time = Date.now();
  e.pos.setXY(x, y);
  this.transformCanvasToWorld(e.pos);
  this.enqueue(e);

  if (!(id in this.positions)) {
    this.positions[id] = Vec2d.alloc();
  }
  this.positions[id].set(e.pos);

  if (!(id in this.eventCoords)) {
    this.eventCoords[id] = Vec2d.alloc();
  }
  this.eventCoords[id].setXY(x, y);
  this.callListeners(e);
};

MultiPointer.prototype.move = function(id, x, y) {
  if (id in this.positions) {
    var e = PointerEvent.alloc();
    e.type = PointerEvent.TYPE_MOVE;
    e.pointerId = id;
    e.time = Date.now();
    e.pos.setXY(x, y);
    this.transformCanvasToWorld(e.pos);
    this.enqueue(e);

    this.positions[id].set(e.pos);
    this.eventCoords[id].setXY(x, y);
    this.callListeners(e);
  }
};

MultiPointer.prototype.enqueue = function(e) {
  if (this.queue) {
    this.queue.enqueue(e);
  }
};

MultiPointer.prototype.up = function(id, x, y) {
  if (id in this.positions) {
    var e = PointerEvent.alloc();
    e.type = PointerEvent.TYPE_UP;
    e.pointerId = id;
    e.time = Date.now();
    e.pos.setXY(x, y);
    this.transformCanvasToWorld(e.pos);
    this.enqueue(e);

    this.positions[id].free();
    delete this.positions[id];

    this.eventCoords[id].free();
    delete this.eventCoords[id];
    this.callListeners(e);
  }
};

MultiPointer.prototype.callListeners = function(e) {
  var listeners = this.domEventListeners.vals;
  for (var i = 0; i < listeners.length; i++) {
    listeners[i](e);
  }
};

/**
 * Transforms a vec2d in place using this current matrix44
 * @param {Vec2d} vec2d
 * @returns {Vec2d}
 */
MultiPointer.prototype.transformCanvasToWorld = function(vec2d) {
  // canvas to clip
  this.canvasToClip.toScaleOpXYZ(2 / this.canvas.width, -2 / this.canvas.height, 1);
  this.canvasToClip.multiply(this.mat44.toTranslateOpXYZ(-this.canvas.width / 2, -this.canvas.height / 2, 0));
  this.vec4.setXYZ(vec2d.x, vec2d.y, 0).transform(this.canvasToClip);

  // clip to world
  this.vec4.transform(this.inverseViewMatrix);

  vec2d.setXY(this.vec4.v[0], this.vec4.v[1]);
  return vec2d;
};


/* ---- js/controls/key.js ---- */


/**
 * @param {string} name
 * @param {number} keyCode
 * @constructor
 */
function Key(name, keyCode) {
  this.name = name;
  this.keyCode = keyCode;
}

/**
 * Names of keys that don't always have a
 * readable single character representation.
 * @enum {string}
 */
Key.Name = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  BACKSPACE: 'backspace',
  DELETE: 'delete',
  SPACE: 'space',
  SEMICOLON: ';',
  BACKSLASH: '\\',
  ESC: 'esc'
};


/* ---- js/controls/keys.js ---- */


/**
 * Associates numeric keycodes with programmer-friendly names.
 * @constructor
 */
function Keys() {
  // Index the keys by both fields.
  this.byKeyCode = {};
  this.byName = {};
  this.initialized = false;
}

Keys.prototype.getKeyCodeForName = function(name) {
  if (!this.initialized) this.initKeys();
  var key = this.byName[name];
  return key ? key.keyCode : null;
};

Keys.prototype.getNameForKeyCode = function(keyCode) {
  if (!this.initialized) this.initKeys();
  var key = this.byKeyCode[keyCode];
  return key ? key.name : null;
};

/**
 *  Add all letters, numbers, and Key.Name values to byKeyCode and byName indexes.
 */
Keys.prototype.initKeys = function() {
  var self = this;

  function addKey(name, keyCode) {
    var key = new Key(name, keyCode);
    self.byName[name] = key;
    self.byKeyCode[keyCode] = key;
  }

  function addKeySequence(firstChar, firstKeyCode, lastChar) {
    var firstCharCode = firstChar.charCodeAt(0);
    var lastCharCode = lastChar.charCodeAt(0);
    if (firstCharCode > lastCharCode) throw Error(firstChar + ' > ' + lastChar);
    var keyCode = firstKeyCode;
    for (var charCode = firstCharCode; charCode <= lastCharCode; charCode++) {
      addKey(String.fromCharCode(charCode), keyCode);
      keyCode++;
    }
  }
  addKeySequence('a', 65, 'z');
  addKeySequence('0', 48, '9');

  addKey(Key.Name.LEFT, 37);
  addKey(Key.Name.UP, 38);
  addKey(Key.Name.RIGHT, 39);
  addKey(Key.Name.DOWN, 40);

  addKey(Key.Name.BACKSPACE, 8);
  addKey(Key.Name.DELETE, 46);
  addKey(Key.Name.SPACE, 32);

  addKey(Key.Name.SEMICOLON, 186);
  addKey(Key.Name.BACKSLASH, 220);

  addKey(Key.Name.ESC, 27);

  this.initialized = true;
};



/* ---- js/controls/trackball.js ---- */



/**
 * Control trackball base class
 * @constructor
 */
function Trackball() {
  this.val = new Vec2d();
  this.friction = 0.05;
  this.touched = false;
}

Trackball.prototype.setFriction = function(f) {
  this.friction = f;
  return this;
};

/**
 * @param {Vec2d} out
 * @return {Vec2d} out
 */
Trackball.prototype.getVal = function(out) {
  return out.set(this.val);
};

/**
 * Resets the delta between the old position and the new. Use in the event loop
 * after everyone's had a chance to read the trackball val, to prepare
 * to accumulate delta events before the next iteration.
 */
Trackball.prototype.reset = function() {console.log("reset unimplimented")};

Trackball.prototype.isTouched = function() {
  return this.touched;
};

Trackball.prototype.startListening = function() {console.log("startListening unimplimented")};
Trackball.prototype.stopListening = function() {console.log("stopListening unimplimented")};



/* ---- js/controls/touchdetector.js ---- */



/**
 * Detects that the user is using touch (vs keys/mouse), so we can decide to show touch UI, or not.
 * @constructor
 */
function TouchDetector() {
  this.listening = false;
  this.score = 0;

  var self = this;
  this.touchListener = function() {
    self.score = Math.min(5, self.score + 0.1);
  };
}

TouchDetector.prototype = new Trigger();
TouchDetector.prototype.constructor = TouchDetector;

TouchDetector.prototype.startListening = function() {
  document.body.addEventListener('touchstart', this.touchListener);
  document.body.addEventListener('touchmove', this.touchListener);
  document.body.addEventListener('touchend', this.touchListener);
  document.body.addEventListener('touchcancel', this.touchListener);
  return this;
};

TouchDetector.prototype.stopListening = function() {
  document.body.removeEventListener('touchstart', this.touchListener);
  document.body.removeEventListener('touchmove', this.touchListener);
  document.body.removeEventListener('touchend', this.touchListener);
  document.body.removeEventListener('touchcancel', this.touchListener);
  this.val = 0;
  return this;
};


TouchDetector.prototype.decrease = function() {
  this.score = Math.max(0, this.score - 0.01);
};

TouchDetector.prototype.getVal = function() {
  return Math.max(0, Math.min(1, this.score));
};


/* ---- js/controls/stick.js ---- */


/**
 * Control stick base class
 * @constructor
 */
function Stick() {
  this.val = new Vec2d();
}

/**
 * @param {Vec2d} out
 * @return {Vec2d} out
 */
Stick.prototype.getVal = function(out) {
  return out.set(this.val);
};

/**
 * If the stick value is greater than one, scale it down to one.
 * @return {Vec2d}
 */
Stick.prototype.clip = function() {
  return this.val.clipToMaxLength(1);
};


/* ---- js/controls/keystick.js ---- */


/**
 * A control stick based on a keyboard.
 * @constructor
 * @extends {Stick}
 */
function KeyStick() {
  Stick.call(this);
  this.codeToDir = {};
  this.codeToState = {};
  this.keys = new Keys();

  var self = this;
  this.downListener = function(e) {
    if (!e) e = window.event;
    if (self.codeToDir[e.keyCode]) {
      self.codeToState[e.keyCode] = true;
    }
  };
  this.upListener = function(e) {
    if (!e) e = window.event;
    if (self.codeToDir[e.keyCode]) {
      self.codeToState[e.keyCode] = false;
    }
  };
}

KeyStick.prototype = new Stick();
KeyStick.prototype.constructor = KeyStick;

KeyStick.UP = new Vec2d(0, 1);
KeyStick.RIGHT = new Vec2d(1, 0);
KeyStick.DOWN = new Vec2d(0, -1);
KeyStick.LEFT = new Vec2d(-1, 0);

KeyStick.prototype.setByKeyCode = function(keyCode, vec) {
  this.codeToDir[keyCode] = vec;
  return this;
};

KeyStick.prototype.setByName = function(name, vec) {
  var keyCode = this.keys.getKeyCodeForName(name);
  this.setByKeyCode(keyCode, vec);
  return this;
};

KeyStick.prototype.setUpRightDownLeftByName = function(up, right, down, left) {
  this.setByName(up, KeyStick.UP);
  this.setByName(right, KeyStick.RIGHT);
  this.setByName(down, KeyStick.DOWN);
  this.setByName(left, KeyStick.LEFT);
  return this;
};

KeyStick.prototype.startListening = function() {
  document.addEventListener('keydown', this.downListener);
  document.addEventListener('keyup', this.upListener);
  return this;
};

KeyStick.prototype.stopListening = function() {
  document.removeEventListener('keydown', this.downListener);
  document.removeEventListener('keyup', this.upListener);
  return this;
};

KeyStick.prototype.getVal = function(out) {
  this.val.reset();
  for (var code in this.codeToState) {
    if (this.codeToState[code]) {
      this.val.add(this.codeToDir[code]);
    }
  }
  this.clip();
  return out.set(this.val);
};

KeyStick.prototype.isAnyKeyPressed = function() {
  for (var code in this.codeToState) {
    if (this.codeToState[code]) {
      return true;;
    }
  }
  return false;
};


/* ---- js/controls/keytrackball.js ---- */


/**
 * A control trackball using up/down/left/right keys.
 * @constructor
 * @extends {Trackball}
 */
function KeyTrackball(keyStick) {
  Trackball.call(this);
  this.keyStick = keyStick;
  this.needsValChange = true;
  this.accel = 0.3;
  this.wasTouched = false;
}
KeyTrackball.prototype = new Trackball();
KeyTrackball.prototype.constructor = KeyTrackball;


KeyTrackball.prototype.setAccel = function(a) {
  this.accel = a;
  return this;
};

/**
 * @param {Vec2d} out
 * @return {Vec2d} out
 */
KeyTrackball.prototype.getVal = function(out) {
  if (!this.wasTouched) {
    this.val.reset();
  } else if (this.needsValChange) {
    this.needsValChange = false;
    this.keyStick.getVal(out);
    if (out.isZero() && this.isTouched()) {
      // Opposite keys are touched. Slam the brakes.
      this.val.scale(0.5);
    } else {
      this.val.scale(0.95).add(out.scale(this.accel));
    }
  }
  this.wasTouched = this.isTouched();
  return out.set(this.val);
};

KeyTrackball.prototype.reset = function() {
  if (!this.isTouched()) {
    this.val.scale(1 - this.friction);
  }
  this.needsValChange = true;
};

KeyTrackball.prototype.isTouched = function() {
  var touched = this.keyStick.isAnyKeyPressed();
  if (!touched) this.wasTouched = false;
  return touched;
};

KeyTrackball.prototype.startListening = function() {
  this.keyStick.startListening();
};

KeyTrackball.prototype.stopListening = function() {
  this.keyStick.stopListening();
};


/* ---- js/controls/mousetrackball.js ---- */


/**
 * A control trackball for a mouse or trackpad.
 * This is intended for use with pointerlock, but it does not handle pointer lock itself.
 * @constructor
 * @extends {Trackball}
 */
function MouseTrackball(opt_elem) {
  Trackball.call(this);

  this.elem = opt_elem || document.body;
  var self = this;
  this.listening = false;
  this.mouseMotion = new Vec2d();
  this.touched = false;
  this.speed = 0.05;
  this.mouseMoveListener = function(e) {
    self.onMouseMove(e);
  };
  this.mouseDownListener = function(e) {
    self.onMouseDown(e);
  };
}

MouseTrackball.prototype = new Trackball();
MouseTrackball.prototype.constructor = MouseTrackball;

MouseTrackball.prototype.startListening = function() {
  this.elem.addEventListener('mousemove', this.mouseMoveListener);
  this.elem.addEventListener('mousedown', this.mouseDownListener);
  this.listening = true;
  return this;
};

MouseTrackball.prototype.stopListening = function() {
  this.elem.removeEventListener('mousemove', this.mouseMoveListener);
  this.elem.removeEventListener('mousedown', this.mouseDownListener);
  this.listening = false;
  return this;
};

MouseTrackball.prototype.reset = function() {
  if (!this.touched) {
    this.val.scale(1 - this.friction);
  }
  this.mouseMotion.reset();
  this.touched = false;
};

MouseTrackball.prototype.onMouseMove = function(e) {
  var dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
  var dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
  this.mouseMotion.addXY(dx * this.speed, dy * this.speed);
  this.val.set(this.mouseMotion);
  this.touched = true;
};

MouseTrackball.prototype.onMouseDown = function(e) {
  this.val.reset();
  this.touched = true;
};


/* ---- js/controls/touchtrackball.js ---- */


/**
 * A control trackball using a touchscreen.
 * @constructor
 * @extends {Trackball}
 */
function TouchTrackball(opt_elem) {
  Trackball.call(this);
  this.elem = opt_elem || document.body;
  this.oldPagePos = new Vec2d();
  this.touched = false;

  this.pixelMultiplier = 0.2;

  this.dirtyVal = false;
  this.startZoneFn = function(x, y) {
    return true;
  };

  var self = this;

  // When this is null, we're not tracking a touch.
  this.touchId = null;

  this.touchStartListener = function(e) {
    self.onTouchStart(e);
  };
  this.touchMoveListener = function(e) {
    self.onTouchMove(e);
  };
  this.touchEndListener = function(e) {
    self.onTouchEnd(e);
  };
}

TouchTrackball.prototype = new Trackball();
TouchTrackball.prototype.constructor = TouchTrackball;

TouchTrackball.prototype.setStartZoneFunction = function(fn) {
  this.startZoneFn = fn;
  return this;
};

TouchTrackball.prototype.startListening = function() {
  this.elem.addEventListener('touchstart', this.touchStartListener);
  this.elem.addEventListener('touchmove', this.touchMoveListener);
  this.elem.addEventListener('touchend', this.touchEndListener);
  this.elem.addEventListener('touchcancel', this.touchEndListener);
  return this;
};

TouchTrackball.prototype.stopListening = function() {
  this.elem.removeEventListener('touchstart', this.touchStartListener);
  this.elem.removeEventListener('touchmove', this.touchMoveListener);
  this.elem.removeEventListener('touchend', this.touchEndListener);
  this.elem.removeEventListener('touchcancel', this.touchEndListener);
  this.touchId = null;
  return this;
};

TouchTrackball.prototype.onTouchStart = function(e) {
  if (this.touchId !== null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (this.startZoneFn(touch.pageX, touch.pageY)) {
      // Start tracking this one.
      this.touchId = touch.identifier;
      this.val.reset();
      this.oldPagePos.setXY(touch.pageX, touch.pageY);
      this.touched = true;
      break;
    }
  }
};

TouchTrackball.prototype.onTouchMove = function(e) {
  if (this.touchId === null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch.identifier == this.touchId) {
      // Keep tracking this one.
      if (this.dirtyVal) {
        this.val.reset();
        this.dirtyVal = false;
      }
      var velocity = Vec2d.alloc(touch.pageX - this.oldPagePos.x, touch.pageY - this.oldPagePos.y)
          .scale(this.pixelMultiplier);
      this.val.add(velocity);
      this.oldPagePos.setXY(touch.pageX, touch.pageY);
      break;
    }
  }
};

TouchTrackball.prototype.onTouchEnd = function(e) {
  if (this.touchId === null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch.identifier == this.touchId) {
      this.touchId = null;
      this.touched = false;
      break;
    }
  }
};

TouchTrackball.prototype.reset = function() {
  if (!this.touched) {
    this.val.scale(1 - this.friction);
  } else {
    if (this.dirtyVal) {
      // Touched, but there were no events in the last iteration.
      // Tap the brakes.
      this.val.scale(0.5);
    }
  }
  this.dirtyVal = true;
};


/* ---- js/controls/multitrackball.js ---- */


/**
 * A control trackball that combines other trackball inputs into one.
 * @constructor
 * @extends {Trackball}
 */
function MultiTrackball() {
  Trackball.call(this);
  this.trackballs = [];
  this.temp = new Vec2d();
}
MultiTrackball.prototype = new Trackball();
MultiTrackball.prototype.constructor = MultiTrackball;

MultiTrackball.prototype.addTrackball = function(t) {
  this.trackballs.push(t);
  return this;
};

MultiTrackball.prototype.startListening = function() {
  for (var i = 0; i < this.trackballs.length; i++) {
    this.trackballs[i].startListening();
  }
};

MultiTrackball.prototype.stopListening = function() {
  for (var i = 0; i < this.trackballs.length; i++) {
    this.trackballs[i].stopListening();
  }
};

MultiTrackball.prototype.setFriction = function(f) {
  for (var i = 0; i < this.trackballs.length; i++) {
    this.trackballs[i].setFriction(f);
  }
  return this;
};

MultiTrackball.prototype.getVal = function(out) {
  this.val.reset();
  for (var i = 0; i < this.trackballs.length; i++) {
    this.trackballs[i].getVal(this.temp);
    this.val.add(this.temp);
  }
  return out.set(this.val);
};

MultiTrackball.prototype.reset = function() {
  for (var i = 0; i < this.trackballs.length; i++) {
    this.trackballs[i].reset();
  }
};

MultiTrackball.prototype.isTouched = function() {
  for (var i = 0; i < this.trackballs.length; i++) {
    if (this.trackballs[i].isTouched()) return true;
  }
  return false;
};



/* ---- js/controls/trigger.js ---- */



/**
 * Control trigger base class
 * @constructor
 */
function Trigger() {
  this.val = false;
  this.downPubSub = new PubSub();
  this.upPubSub = new PubSub();
}

/**
 * @return {boolean}
 */
Trigger.prototype.getVal = function() {
  return this.val;
};

Trigger.prototype.startListening = function() {console.log("startListening unimplimented")};
Trigger.prototype.stopListening = function() {console.log("stopListening unimplimented")};


Trigger.prototype.addTriggerDownListener = function(fn) {
  this.downPubSub.subscribe(fn);
};

Trigger.prototype.removeTriggerDownListener = function(fn) {
  this.downPubSub.unsubscribe(fn);
};


Trigger.prototype.addTriggerUpListener = function(fn) {
  this.upPubSub.subscribe(fn);
};
Trigger.prototype.removeTriggerUpListener = function(fn) {
  this.upPubSub.unsubscribe(fn);
};


Trigger.prototype.publishTriggerDown = function(e) {
  this.downPubSub.publish(e);
};

Trigger.prototype.publishTriggerUp = function(e) {
  this.upPubSub.publish(e);
};



/* ---- js/controls/keytrigger.js ---- */



/**
 * A single control Trigger, using keyboard keys.
 * @constructor
 * @extends {Trigger}
 */
function KeyTrigger() {
  Trigger.call(this);

  this.keys = new Keys();
  this.triggerKeyCodes = {};
  this.codeToState = {};

  var self = this;
  this.downListener = function(e) {
    if (!e) e = window.event;
    if (self.triggerKeyCodes[e.keyCode]) {
      var oldVal = self.getVal();
      self.codeToState[e.keyCode] = true;
      if (!oldVal) self.publishTriggerDown(e);
    }
  };
  this.upListener = function(e) {
    if (!e) e = window.event;
    if (self.triggerKeyCodes[e.keyCode]) {
      var oldVal = self.getVal();
      self.codeToState[e.keyCode] = false;
      if (oldVal && !self.getVal()) self.publishTriggerUp(e);
    }
  };
}

KeyTrigger.prototype = new Trigger();
KeyTrigger.prototype.constructor = KeyTrigger;

KeyTrigger.prototype.addTriggerKeyByCode = function(keyCode) {
  this.triggerKeyCodes[keyCode] = true;
  return this;
};

KeyTrigger.prototype.addTriggerKeyByName = function(name) {
  var keyCode = this.keys.getKeyCodeForName(name);
  return this.addTriggerKeyByCode(keyCode);
};

KeyTrigger.prototype.startListening = function() {
  document.addEventListener('keydown', this.downListener);
  document.addEventListener('keyup', this.upListener);
  return this;
};

KeyTrigger.prototype.stopListening = function() {
  document.removeEventListener('keydown', this.downListener);
  document.removeEventListener('keyup', this.upListener);
  for (var code in this.codeToState) {
    this.codeToState[code] = false;
  }
  return this;
};

KeyTrigger.prototype.getVal = function() {
  for (var code in this.codeToState) {
    if (this.codeToState[code]) return true;
  }
};


/* ---- js/controls/mousebuttontrigger.js ---- */



/**
 * A single control Trigger, using the left mouse button.
 * @constructor
 * @extends {Trigger}
 */
function MouseButtonTrigger(elem) {
  Trigger.call(this);
  this.elem = elem || document;
  var self = this;
  this.downListener = function(e) {
    if (!e) e = window.event;
    if (MouseButtonTrigger.isLeftButton(e)) {
      self.val = true;
      self.publishTriggerDown(e);

      // For LayeredEventDistributor
      return false;
    }
  };
  this.upListener = function(e) {
    if (!e) e = window.event;
    if (MouseButtonTrigger.isLeftButton(e)) {
      self.val = false;
      self.publishTriggerUp(e);

      // For LayeredEventDistributor
      return false;
    }
  };
}

MouseButtonTrigger.prototype = new Trigger();
MouseButtonTrigger.prototype.constructor = MouseButtonTrigger;

MouseButtonTrigger.isLeftButton = function(e) {
  if (e.buttons) {
    return !!(e.buttons & 1);
  } else if ((typeof e.button) != 'undefined') {
    return e.button == 0;
  } else {
    return e.which == 1;
  }
};

MouseButtonTrigger.prototype.startListening = function() {
  this.elem.addEventListener('mousedown', this.downListener);
  this.elem.addEventListener('mouseup', this.upListener);
  return this;
};

MouseButtonTrigger.prototype.stopListening = function() {
  this.elem.removeEventListener('mousedown', this.downListener);
  this.elem.removeEventListener('mouseup', this.upListener);
  this.val = false;
  return this;
};

MouseButtonTrigger.prototype.getVal = function() {
  return this.val;
};


/* ---- js/controls/touchtrigger.js ---- */


/**
 * A control Trigger using a touchscreen.
 * @constructor
 * @extends {Trigger}
 */
function TouchTrigger(opt_elem) {
  Trigger.call(this);
  this.listening = false;
  this.elem = opt_elem || document.body;

  this.startZoneFn = function(x, y) {
    return true;
  };
  this.touchId = null;

  var self = this;
  this.touchStartListener = function(e) {
    return self.onTouchStart(e);
  };
  this.touchEndListener = function(e) {
    return self.onTouchEnd(e);
  };
}

TouchTrigger.prototype = new Trigger();
TouchTrigger.prototype.constructor = TouchTrigger;

/**
 * @param {function} fn  A function that takes screen coords (x, y) and returns true if the coords are
 * within the touch trigger start zone.
 * @returns {TouchTrigger}
 */
TouchTrigger.prototype.setStartZoneFunction = function(fn) {
  this.startZoneFn = fn;
  return this;
};

TouchTrigger.prototype.startListening = function() {
  this.elem.addEventListener('touchstart', this.touchStartListener);
  this.elem.addEventListener('touchend', this.touchEndListener);
  this.elem.addEventListener('touchcancel', this.touchEndListener);
  return this;
};

TouchTrigger.prototype.stopListening = function() {
  this.elem.removeEventListener('touchstart', this.touchStartListener);
  this.elem.removeEventListener('touchend', this.touchEndListener);
  this.elem.removeEventListener('touchcancel', this.touchEndListener);
  this.touchId = null;
  this.val = false;
  return this;
};

TouchTrigger.prototype.onTouchStart = function(e) {
  if (this.touchId !== null) return;
  e = e || window.event;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (this.startZoneFn(touch.pageX, touch.pageY)) {
      // Start tracking this one.
      this.touchId = touch.identifier;
      this.val = true;
      this.publishTriggerDown(e);

      // For LayeredEventDistributor
      return false;
    }
  }
};

TouchTrigger.prototype.onTouchEnd = function(e) {
  if (this.touchId === null) return;
  e = e || window.event;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch.identifier == this.touchId) {
      this.touchId = null;
      this.val = false;
      this.publishTriggerUp(e);

      // Never claim to have handled a touchEnd, because touch events contain multiple
      // touches, and if a trigger touch and a world touch end at the same time, then
      // the LayeredEventDistributor will refuse to tell the world touch about the end.
      return true;
    }
  }
};


/* ---- js/controls/touchtrigger.js ---- */


/**
 * A round control Trigger using a touchscreen.
 * Use setCanvas() and setXYR() to set it up, then just read its value.
 *
 * @deprecated Use TriggerWidget instead
 *
 * @constructor
 * @extends {TouchTrigger}
 */
function RoundTouchTrigger(canvas) {
  TouchTrigger.call(this, canvas);

  this.px = 0.5;
  this.py = 0.5;
  this.rx = 0.05;
  this.ry = 0.05;
  this.canvas = canvas;

  var self = this;
  this.setStartZoneFunction(function(x, y) {
    if (self.canvas == null) return false;
    return Vec2d.distance(x, y, self.getX(), self.getY()) <= self.getRad();
  });
}

RoundTouchTrigger.prototype = new TouchTrigger();
RoundTouchTrigger.prototype.constructor = RoundTouchTrigger;

/**
 * @param xFraction a fraction (0-1) of the canvas width
 * @param yFraction  a fraction (0-1) of the canvas height
 */
RoundTouchTrigger.prototype.setPosFractionXY = function(xFraction, yFraction) {
  this.px = xFraction;
  this.py = yFraction;
  return this;
};

/**
 * The radius of the button is the xFraction * canvas.width + yFraction * canvas.height
 * @param xFraction a fraction (0-1) of the canvas width
 * @param yFraction a fraction (0-1) of the canvas height
 */
RoundTouchTrigger.prototype.setRadCoefsXY = function(xFraction, yFraction) {
  this.rx = xFraction;
  this.ry = yFraction;
  return this;
};

RoundTouchTrigger.prototype.getX = function() {
  return this.px * this.canvas.width;
};

RoundTouchTrigger.prototype.getY = function() {
  return this.py * this.canvas.height;
};

RoundTouchTrigger.prototype.getRad = function() {
  return this.rx * this.canvas.width + this.ry * this.canvas.height;
};


/* ---- js/controls/multitrigger.js ---- */


/**
 * A control trigger that combines other trigger inputs into one.
 * @constructor
 * @extends {Trigger}
 */
function MultiTrigger() {
  Trigger.call(this);
  this.triggers = [];
  this.oldVal = false;

  var self = this;
  this.downListener = function(e) {
    if (!self.oldVal && self.getVal()) {
      self.publishTriggerDown(e);
      self.oldVal = true;
    }
  };
  this.upListener = function(e) {
    if (self.oldVal && !self.getVal()) {
      self.publishTriggerUp(e);
      self.oldVal = false;
    }
  };
}
MultiTrigger.prototype = new Trigger();
MultiTrigger.prototype.constructor = MultiTrigger;

MultiTrigger.prototype.addTrigger = function(t) {
  this.triggers.push(t);
  t.addTriggerDownListener(this.downListener);
  t.addTriggerUpListener(this.upListener);
  return this;
};

MultiTrigger.prototype.startListening = function() {
  for (var i = 0; i < this.triggers.length; i++) {
    this.triggers[i].startListening();
  }
};

MultiTrigger.prototype.stopListening = function() {
  for (var i = 0; i < this.triggers.length; i++) {
    this.triggers[i].stopListening();
  }
};

MultiTrigger.prototype.getVal = function() {
  for (var i = 0; i < this.triggers.length; i++) {
    if (this.triggers[i].getVal()) return true;
  }
  return false;
};

MultiTrigger.prototype.addTriggerDownListener = function(fn) {
  this.downPubSub.subscribe(fn);
};

MultiTrigger.prototype.removeTriggerDownListener = function(fn) {
  this.downPubSub.unsubscribe(fn);
};


MultiTrigger.prototype.addTriggerUpListener = function(fn) {
  this.upPubSub.subscribe(fn);
};
MultiTrigger.prototype.removeTriggerUpListener = function(fn) {
  this.upPubSub.unsubscribe(fn);
};


MultiTrigger.prototype.publishTriggerDown = function(e) {
  this.downPubSub.publish(e);
};

MultiTrigger.prototype.publishTriggerUp = function(e) {
  this.upPubSub.publish(e);
};



// ---------------------- Mix --------------------------



/* ---- js/ballspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function BallSpirit(playScreen) {
  Spirit.call(this);
  this.playScreen = playScreen;

  this.type = PlayScreen.SpiritType.BALL;
  this.id = -1;
  this.bodyId = -1;
  this.modelStamp = null;
  this.color = new Vec4();

  // temps
  this.vec2d = new Vec2d();
  this.vec4 = new Vec4();
  this.mat44 = new Matrix44();
  this.modelMatrix = new Matrix44();
}
BallSpirit.prototype = new Spirit();
BallSpirit.prototype.constructor = BallSpirit;

BallSpirit.SCHEMA = {
  0: "type",
  1: "id",
  2: "bodyId",
  3: "color"
};

BallSpirit.getJsoner = function() {
  if (!BallSpirit.jsoner) {
    BallSpirit.jsoner = new Jsoner(BallSpirit.SCHEMA);
  }
  return BallSpirit.jsoner;
};

BallSpirit.prototype.setModelStamp = function(modelStamp) {
  this.modelStamp = modelStamp;
};

BallSpirit.prototype.setColorRGB = function(r, g, b) {
  this.color.setXYZ(r, g, b);
};

BallSpirit.prototype.onDraw = function(world, renderer) {
  var body = this.getBody(world);
  var bodyPos = body.getPosAtTime(world.now, this.vec2d);
  renderer
      .setStamp(this.modelStamp)
      .setColorVector(this.color);
  // Render the smaller ones in front.
  // TODO: standardize Z
  this.modelMatrix.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(bodyPos.x, bodyPos.y, -1 + Math.max(0, body.rad / 100)))
      .multiply(this.mat44.toScaleOpXYZ(body.rad, body.rad, 1));

  renderer.setModelMatrix(this.modelMatrix);
  renderer.drawStamp();
};

BallSpirit.prototype.onTimeout = function(world, timeout) {
  world.removeBodyId(this.bodyId);
  world.removeSpiritId(this.id);
};

BallSpirit.prototype.getBody = function(world) {
  return world.bodies[this.bodyId];
};


BallSpirit.prototype.toJSON = function() {
  return BallSpirit.getJsoner().toJSON(this);
};

BallSpirit.prototype.setFromJSON = function(json) {
  BallSpirit.getJsoner().setFromJSON(json, this);
};


/* ---- js/soundspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function SoundSpirit(playScreen) {
  Spirit.call(this);
  this.playScreen = playScreen;
  this.bodyId = -1;
  this.id = -1;
  this.modelStamp = null;

  this.type = PlayScreen.SpiritType.SOUND;
  this.color = new Vec4();
  this.sounds = [];

  this.tempBodyPos = new Vec2d();
  this.vec2d = new Vec2d();
  this.vec4 = new Vec4();
  this.mat44 = new Matrix44();
  this.modelMatrix = new Matrix44();
  this.turn = 0;
  this.lastSoundTime = -Infinity;
  this.hard = false;
}
SoundSpirit.prototype = new Spirit();
SoundSpirit.prototype.constructor = SoundSpirit;

SoundSpirit.MEASURE_TIMEOUT = 120;

SoundSpirit.SOUND_MEASURE_TIME = 0;
SoundSpirit.SOUND_VOLUME = 1;
SoundSpirit.SOUND_ATTACK = 2;
SoundSpirit.SOUND_SUSTAIN = 3;
SoundSpirit.SOUND_DECAY = 4;
SoundSpirit.SOUND_FREQ1 = 5;
SoundSpirit.SOUND_FREQ2 = 6;
SoundSpirit.SOUND_TYPE = 7;

SoundSpirit.SCHEMA = {
  0: "type",
  1: "id",
  2: "bodyId",
  3: "color",
  4: "sounds",
  5: "hard"
};

SoundSpirit.getJsoner = function() {
  if (!SoundSpirit.jsoner) {
    SoundSpirit.jsoner = new Jsoner(SoundSpirit.SCHEMA);
  }
  return SoundSpirit.jsoner;
};

SoundSpirit.prototype.toJSON = function() {
  return SoundSpirit.getJsoner().toJSON(this);
};

SoundSpirit.prototype.setFromJSON = function(json) {
  SoundSpirit.getJsoner().setFromJSON(json, this);
};


SoundSpirit.prototype.setModelStamp = function(modelStamp) {
  this.modelStamp = modelStamp;
};

SoundSpirit.prototype.setColorRGB = function(r, g, b) {
  this.color.setXYZ(r, g, b);
};

SoundSpirit.prototype.setSounds = function(sounds) {
  this.sounds = sounds;
};

SoundSpirit.prototype.onTimeout = function(world, event) {
  var body = this.getBody(world);

  // Play a sound?
  var measureTime = event.timeoutVal;
  var bodyPos = body.getPosAtTime(world.now, this.vec2d);
  var makesSound = false;
  for (var i = 0; i < this.sounds.length; i++) {
    var s = this.sounds[i];
    if (s[SoundSpirit.SOUND_MEASURE_TIME] == measureTime) {
      makesSound = true;
      this.playScreen.sfx.sound(bodyPos.x, bodyPos.y, 0,
          s[SoundSpirit.SOUND_VOLUME],
          s[SoundSpirit.SOUND_ATTACK],
          s[SoundSpirit.SOUND_SUSTAIN],
          s[SoundSpirit.SOUND_DECAY],
          s[SoundSpirit.SOUND_FREQ1],
          s[SoundSpirit.SOUND_FREQ2],
          s[SoundSpirit.SOUND_TYPE]);
      this.lastSoundTime = world.now;
      var newVel = Vec2d.alloc()
          .set(body.vel).scale(0.9)
          .addXY(0.1 * (Math.random() - 0.5), 0.1 * (Math.random() - 0.5));
      body.setVelAtTime(newVel, world.now);
      newVel.free();
    }
  }
  if (makesSound) {
    this.vec4.set(this.color).scale1(2);
    this.playScreen.addNoteSplash(bodyPos.x, bodyPos.y, body.vel.x/3, body.vel.y/3,
        this.vec4.v[0], this.vec4.v[1], this.vec4.v[2],
        body.rad * (this.hard ? 1.7 : 0.7));
  }

  // TODO: be less dumb
  var addedTimes = {};
  if (event.timeoutVal === -1) {
    // This is the start of a measure. Plan the next measure of sounds.
    world.addTimeout(world.now + SoundSpirit.MEASURE_TIMEOUT, this.id, -1);
    addedTimes[0] = true;
    for (var i = 0; i < this.sounds.length; i++) {
      var s = this.sounds[i];
      var timeoutTime = world.now + SoundSpirit.MEASURE_TIMEOUT * s[SoundSpirit.SOUND_MEASURE_TIME];
      if (!addedTimes[timeoutTime]) {
        addedTimes[timeoutTime] = true;
        world.addTimeout(timeoutTime, this.id, s[SoundSpirit.SOUND_MEASURE_TIME]);
      }
    }
  }
};

SoundSpirit.prototype.onDraw = function(world, renderer) {
  var body = this.getBody(world);
  body.getPosAtTime(world.now, this.tempBodyPos);
  var colorScale = 1+1.5*Math.max(0, Math.min(1, 1 - 6*(world.now - this.lastSoundTime)/SoundSpirit.MEASURE_TIMEOUT));
  renderer
      .setStamp(this.modelStamp)
      .setColorVector(this.vec4.set(this.color).scale1(colorScale));
  this.modelMatrix.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(this.tempBodyPos.x, this.tempBodyPos.y, 0))
      .multiply(this.mat44.toScaleOpXYZ(body.rad, body.rad, 1));
  renderer.setModelMatrix(this.modelMatrix);
  renderer.drawStamp();
};

SoundSpirit.prototype.getBody = function(world) {
  return world.bodies[this.bodyId];
};


/* ---- js/wallspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function WallSpirit() {
  Spirit.call(this);
  this.bodyId = -1;
  this.id = -1;
  this.modelStamp = null;
  this.color = new Vec4(0, 0.7, 2);

  this.vec2d = new Vec2d();
  this.vec4 = new Vec4();
  this.mat44 = new Matrix44();
  this.modelMatrix = new Matrix44();
}
WallSpirit.prototype = new Spirit();
WallSpirit.prototype.constructor = WallSpirit;

WallSpirit.prototype.setModelStamp = function(modelStamp) {
  this.modelStamp = modelStamp;
};

WallSpirit.prototype.onDraw = function(world, renderer) {
  renderer
      .setStamp(this.modelStamp)
      .setColorVector(this.color);
  var b = world.bodies[this.bodyId];
  b.getPosAtTime(world.now, this.vec2d);
  this.modelMatrix.toTranslateOpXYZ(this.vec2d.x, this.vec2d.y, 0);
  this.modelMatrix.multiply(this.mat44.toScaleOpXYZ(b.rectRad.x, b.rectRad.y, 1));
  renderer.setModelMatrix(this.modelMatrix);
  renderer.drawStamp();
};


/* ---- js/buttonspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function ButtonSpirit() {
  Spirit.call(this);
  this.bodyId = -1;
  this.id = -1;
  this.modelStamp = null;

  this.color = new Vec4();
  this.lastSoundMs = 0;
  this.soundLength = 1;
  this.onClick = null;

  this.vec2d = new Vec2d();
  this.vec4 = new Vec4();
  this.mat44 = new Matrix44();
  this.modelMatrix = new Matrix44();
}
ButtonSpirit.prototype = new Spirit();
ButtonSpirit.prototype.constructor = ButtonSpirit;

ButtonSpirit.POINTER_RADIUS = 0.0;

ButtonSpirit.prototype.setModelStamp = function(modelStamp) {
  this.modelStamp = modelStamp;
};

/**
 * @param {function} func  A function of (e)
 */
ButtonSpirit.prototype.setOnClick = function(func) {
  this.onClick = func;
};

ButtonSpirit.prototype.onDraw = function(world, renderer) {
  var life = 0;
  if (Date.now() - this.lastSoundMs < this.soundLength) {
    life = 1 - (Date.now() - this.lastSoundMs) / this.soundLength;
    var t = Date.now() / 300;
    this.color.setXYZ(
            1 + life * Math.sin(t + 0),
            1 + life * Math.sin(t + 2*Math.PI/3),
            1 + life * Math.sin(t + 2*2*Math.PI/3));
  } else {
    this.color.setXYZ(1, 1, 1);
  }
  var body = this.getBody(world);
  var bodyPos = body.getPosAtTime(world.now, this.vec2d);
  this.modelMatrix.toTranslateOpXYZ(bodyPos.x, bodyPos.y, 0);
  renderer
      .setStamp(this.modelStamp)
      .setColorVector(this.color)
      .setModelMatrix(this.modelMatrix)
      .drawStamp();
  this.animating = !!life;
};

ButtonSpirit.prototype.getBody = function(world) {
  return world.bodies[this.bodyId];
};

ButtonSpirit.prototype.isOverlapping = function(world, pointerPos) {
  var body = this.getBody(world);
  var bodyPos = body.getPosAtTime(world.now, this.vec2d);
  return OverlapDetector.isRectOverlappingCircle(
      bodyPos, body.rectRad, pointerPos, ButtonSpirit.POINTER_RADIUS);
};


/* ---- js/basescreen.js ---- */


/**
 * @constructor
 * @extends {Screen}
 */
function BaseScreen(controller, canvas, renderer, glyphs, stamps, sound) {
  Screen.call(this);
  this.controller = controller;
  this.canvas = canvas;
  this.renderer = renderer;
  this.glyphs = glyphs;
  this.stamps = stamps;
  this.sfx = sound;

  this.viewMatrix = new Matrix44();
  this.vec2d = new Vec2d();
  this.vec4 = new Vec4();
  this.mat44 = new Matrix44();
  this.nextButtonNum = 0;
  this.worldBoundingRect = new Rect();

  this.lastPathRefreshTime = -Infinity;
  this.visibility = 0;
  this.listening = false;

  this.mouseDownFn = this.getMouseDownFn();
  this.touchStartFn = this.getTouchStartFn();
  this.resizeFn = this.getResizeFn();

  this.clipToWorldMatrix = new Matrix44();
  this.clipToWorldMatrixDirty = true;
  this.canvasToClipMatrix = new Matrix44();
  this.canvasToClipMatrixDirty = true;

  this.paused = false;
}
BaseScreen.prototype = new Screen();
BaseScreen.prototype.constructor = BaseScreen;

BaseScreen.MS_PER_FRAME = 1000 / 60;
BaseScreen.CLOCKS_PER_FRAME = 0.5;
BaseScreen.PATH_DURATION = 0xffff;

BaseScreen.prototype.onPointerDown = null;
BaseScreen.prototype.onPointerDown = null;

BaseScreen.prototype.getMouseDownFn = function() {
  var self = this;
  return function(e) {
    if (self.onPointerDown) {
      self.onPointerDown(e.pageX, e.pageY);
    }
  };
};

BaseScreen.prototype.getTouchStartFn = function() {
  var self = this;
  return function(e) {
    if (self.onPointerDown) {
      var touches = e.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        self.onPointerDown(touch.pageX, touch.pageY);
      }
    }
  };
};

BaseScreen.prototype.getResizeFn = function() {
  var self = this;
  return function() {
    self.controller.requestAnimation();
  }
};

BaseScreen.prototype.setScreenListening = function(listen) {
  if (listen == this.listening) return;
  if (listen) {
    this.canvas.addEventListener('mousedown', this.mouseDownFn);
    this.canvas.addEventListener('touchstart', this.touchStartFn);
    window.addEventListener('resize', this.resizeFn);
  } else {
    this.canvas.removeEventListener('mousedown', this.mouseDownFn);
    this.canvas.removeEventListener('touchstart', this.touchStartFn);
    window.removeEventListener('resize', this.resizeFn);
  }
  this.listening = listen;
};

BaseScreen.prototype.drawScreen = function(visibility) {
  this.visibility = visibility;
  this.lazyInit();
  this.updateViewMatrix();
  this.drawScene();
  this.canvasToClipMatrixDirty = true;
  this.clipToWorldMatrixDirty = true;
  if (this.visibility == 1) {
    this.clock();
  }
};

BaseScreen.prototype.getClipToWorldMatrix = function() {
  if (this.clipToWorldMatrixDirty) {
    this.viewMatrix.getInverse(this.clipToWorldMatrix);
    this.clipToWorldMatrixDirty = false;
  }
  return this.clipToWorldMatrix;
};

BaseScreen.prototype.getCanvasToClipMatrix = function() {
  if (this.canvasToClipMatrixDirty) {
    this.canvasToClipMatrix.toScaleOpXYZ(2 / this.canvas.width, -2 / this.canvas.height, 1);
    this.canvasToClipMatrix.multiply(this.mat4.toTranslateOpXYZ(-this.canvas.width / 2, -this.canvas.height / 2, 0));
    this.canvasToClipMatrixDirty = false;
  }
  return this.canvasToClipMatrix;
};

/**
 * Transforms a vec2d in place.
 * @param {Vec2d} vec2d
 * @returns {Vec2d}
 */
BaseScreen.prototype.transformCanvasToWorld = function(vec2d) {
  this.vec4
      .setXYZ(vec2d.x, vec2d.y, 0)
      .transform(this.getCanvasToClipMatrix())
      .transform(this.getClipToWorldMatrix());
  return vec2d.setXY(this.vec4.v[0], this.vec4.v[1]);
};

BaseScreen.prototype.drawScene = function() {
  var animationRequested = false;
  for (var id in this.world.spirits) {
    var spirit = this.world.spirits[id];
    spirit.onDraw(this.world, this.renderer);
    if (!animationRequested && spirit.animating) {
      this.controller.requestAnimation();
      animationRequested = true;
    }
  }
};

BaseScreen.prototype.destroyScreen = function() {
  // Unload button models? Need a nice utility for loading, remembering, and unloading models.
};

BaseScreen.prototype.clock = function() {
  if (this.paused) return;
  var endTimeMs = Date.now() + BaseScreen.MS_PER_FRAME;
  var endClock = this.world.now + BaseScreen.CLOCKS_PER_FRAME;

  if (this.handleInput) {
    this.handleInput();
  }

  if (this.lastPathRefreshTime + BaseScreen.PATH_DURATION <= endClock) {
    this.lastPathRefreshTime = this.world.now;
    for (var id in this.world.bodies) {
      var b = this.world.bodies[id];
      if (b && b.pathDurationMax > BaseScreen.PATH_DURATION && b.pathDurationMax != Infinity) {
        b.invalidatePath();
        b.moveToTime(this.world.now);
      }
    }
  }

  var e = this.world.getNextEvent();
  // Stop if there are no more events to process, or we've moved the game clock far enough ahead
  // to match the amount of wall-time elapsed since the last frame,
  // or (worst case) we're out of time for this frame.

  while (e && e.time <= endClock && Date.now() <= endTimeMs) {
    this.world.processNextEvent();
    if (e.type == WorldEvent.TYPE_HIT) {
      this.onHitEvent(e);
    }
    e = this.world.getNextEvent();
  }
  if (!e || e.time > endClock) {
    this.world.now = endClock;
  }
};

BaseScreen.prototype.onHitEvent = function(e) {};



/* ---- js/titlescreen.js ---- */


/**
 * @constructor
 * @extends {BaseScreen}
 */
function TitleScreen(controller, canvas, renderer, glyphs, stamps, sound) {
  BaseScreen.call(this, controller, canvas, renderer, glyphs, stamps, sound);
}
TitleScreen.prototype = new BaseScreen();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.lazyInit = function() {
  if (!this.world) {
    this.initWorld();
  }
};

TitleScreen.prototype.initWorld = function() {
  this.world = new World(World.DEFAULT_CELL_SIZE, 2, [[0, 0], [1, 1]]);
  this.resolver = new HitResolver();
  this.resolver.defaultElasticity = 0.9;
  var labelMaker = new LabelMaker(this.glyphs);
  var controller = this.controller;
  var sfx = this.sfx;
  var world = this.world;

  var spiritId;

  var buttonMaker = new ButtonMaker(labelMaker, this.world, null, this.renderer);
  buttonMaker
      .setNextCharMatrix(new Matrix44().toTranslateOpXYZ(3, 0, 0))
      .setPaddingXY(1.5, 0.5);

  // TITLE
  buttonMaker.setLetterColor([0.75*0.7, 0.25 * 0.7, 1*0.7]).setBlockColor(null).setScale(1);
  buttonMaker.addButton(0, 12, "TEST 34", null);
  buttonMaker.addButton(0, 5, "TERRAIN", null);
  buttonMaker.addButton(0, 0, "DRAGGING", null);
  buttonMaker.setScale(1);

  // PLAY
  buttonMaker.setLetterColor([0.75, 0.25, 1]).setBlockColor([0.75*0.5, 0.25*0.5, 1*0.5]);
  spiritId = buttonMaker.addButton(0, -8, "START", function(e) {
    var freq0 = 100;
    var freq1 = 5000;
    var delay = 0;
    var attack = 0.01;
    var sustain = 0.1;
    var decay = 0.04;
    sfx.sound(0, 0, 0, 0.5, attack, sustain, decay, freq0, freq1, 'square', delay);
    this.lastSoundMs = Date.now();
    this.soundLength = (attack + sustain + decay + delay) * 1000;
    controller.gotoScreen(Test36.SCREEN_PLAY);
    // controller.requestPointerLock();
  });
  this.playSpirit = this.world.spirits[spiritId];

  // FULL SCREEN
  buttonMaker.setScale(0.75);
  spiritId = buttonMaker.addButton(0, -8 -6, "FULL SCREEN", function(e) {
    var freq0 = 200;
    var freq1 = 2200;
    var delay = 0;
    var attack = 0.05;
    var sustain = 0.1;
    var decay = 0.2;
    sfx.sound(0, 0, 0, 0.5, attack, sustain, decay, freq0, freq1, 'square', delay);
    this.lastSoundMs = Date.now();
    this.soundLength = (attack + sustain + decay + delay) * 1000;
    controller.requestFullScreen();
  });
  this.fullScreenSpirit = world.spirits[spiritId];

  for (spiritId in this.world.spirits) {
    var s = this.world.spirits[spiritId];
    var b = this.world.bodies[s.bodyId];
    this.worldBoundingRect.coverRect(b.getBoundingRectAtTime(this.world.now));
  }
  this.worldBoundingRect.pad(1);
};

TitleScreen.prototype.onSpaceDown = function() {
  this.playSpirit.onClick();
};

TitleScreen.prototype.onPointerDown = function(pageX, pageY) {
  this.vec2d.setXY(pageX, pageY);
  this.transformCanvasToWorld(this.vec2d);
  if (this.playSpirit.isOverlapping(this.world, this.vec2d)) {
    this.playSpirit.onClick();
  }
  if (this.fullScreenSpirit.isOverlapping(this.world, this.vec2d)) {
    this.fullScreenSpirit.onClick();
  }
};

TitleScreen.prototype.updateViewMatrix = function() {
  var br = this.worldBoundingRect;
  this.viewMatrix.toIdentity();
  var ratio = Math.min(this.canvas.height, this.canvas.width) / Math.max(br.rad.x, br.rad.y);
  this.viewMatrix
      .multiply(this.mat4.toScaleOpXYZ(
              ratio / this.canvas.width,
              ratio / this.canvas.height,
              0.2));

  // scale
  var v = this.visibility;
  this.viewMatrix.multiply(this.mat4.toScaleOpXYZ(3 - v*2, v * v, 1));

  // center
  this.viewMatrix.multiply(this.mat4.toTranslateOpXYZ(
      -br.pos.x,
      -br.pos.y,
      0));

  this.renderer.setViewMatrix(this.viewMatrix);
};


/* ---- js/playscreen.js ---- */


/**
 * @constructor
 * @extends {BaseScreen}
 */
function PlayScreen(controller, canvas, renderer, glyphs, stamps, sfx) {
  BaseScreen.call(this, controller, canvas, renderer, glyphs, stamps, sfx);

  this.splasher      = new Splasher();
  this.splash        = new Splash();
  this.listeners     = new ArraySet();
  this.touchDetector = new TouchDetector();
  this.listeners.put(this.touchDetector);

  var self = this;

  // grip trigger
  this.gripTouchTrigger = new RoundTouchTrigger(canvas)
      .setPosFractionXY(0.07, 1 - 0.1).setRadCoefsXY(0.07, 0.07);
  this.gripTrigger = new MultiTrigger()
      .addTrigger((new KeyTrigger()).addTriggerKeyByName('z'))
      .addTrigger(new MouseButtonTrigger())
      .addTrigger(this.gripTouchTrigger);
  this.listeners.put(this.gripTrigger);

  // pause trigger and function
  this.pauseTouchTrigger = new RoundTouchTrigger(canvas)
      .setPosFractionXY(0.5, 0).setRadCoefsXY(0.07, 0.07);
  this.pauseTrigger = new MultiTrigger()
      .addTrigger((new KeyTrigger()).addTriggerKeyByName(Key.Name.SPACE))
      .addTrigger(this.pauseTouchTrigger);
  this.listeners.put(this.pauseTrigger);
  this.pauseDownFn = function() {
    self.paused = !self.paused;
    if (self.paused) {
      // pause
      // self.controller.exitPointerLock();
      // self.showPausedOverlay();
      self.updateSharableUrl();
    } else {
      // resume
      // self.controller.requestPointerLock();
	  // self.hidePausedOverlay();
      self.controller.requestAnimation();
      self.trackball.reset();
    }
  };

  this.fullScreenFn = function() {
    self.controller.requestFullScreen();
  };

  // trackball
  this.trackball = new MultiTrackball()
      .addTrackball(new MouseTrackball())
      .addTrackball(new TouchTrackball().setStartZoneFunction(function(x, y) {
        return !self.gripTouchTrigger.startZoneFn(x, y) && !self.pauseTouchTrigger.startZoneFn(x, y);
      }))
      .addTrackball(
      new KeyTrackball(
          new KeyStick().setUpRightDownLeftByName(Key.Name.DOWN, Key.Name.RIGHT, Key.Name.UP, Key.Name.LEFT))
          .setAccel(0.1)
  );
  this.trackball.setFriction(0.02);
  this.movement = new Vec2d();
  this.listeners.put(this.trackball);

  // for sound throttling
  this.hitsThisFrame = 0;

  this.world = null;
  this.tiles = null;

  this.camera = new Camera(0.2, 0.6, 45);

  this.cursorPos = new Vec2d();
  this.cursorVel = new Vec2d();
  this.cursorStamp = null; // it'll be a ring
  this.colorVector = new Vec4();
  this.cursorRad = this.camera.getViewDist() / 20;
  this.cursorMode = PlayScreen.CursorMode.FLOOR;
  this.cursorBody = this.createCursorBody();

  this.indicatedBodyId = null;
  this.indicatorChangeTime = 0;
  this.indicatorStamp = null; // it'll be a ring
  this.indicatorColorVector = new Vec4();

  this.gripPoint = null;
  this.gripAccelFraction = 0.3;
  this.gripFriction = 0.2;
  this.maxGripAccel = 10;

  this.modelMatrix = new Matrix44();
  this.modelMatrix2 = new Matrix44();
  this.hudViewMatrix = new Matrix44();

  this.bitSize = 0.5;
  this.bitGridMetersPerCell = PlayScreen.BIT_SIZE * BitGrid.BITS;
  this.levelModelMatrix = new Matrix44();
  this.levelColorVector = new Vec4(1, 1, 1);
}
PlayScreen.prototype = new BaseScreen();
PlayScreen.prototype.constructor = PlayScreen;

PlayScreen.BIT_SIZE = 0.5;
PlayScreen.WORLD_CELL_SIZE = PlayScreen.BIT_SIZE * BitGrid.BITS;

PlayScreen.Group = {
  EMPTY: 0,
  WALL: 1,
  ROCK: 2,
  CURSOR: 3
};

PlayScreen.Terrain = {
  WALL: 0,
  FLOOR: 1,
  MIXED: 2
};

PlayScreen.CursorMode = {
  WALL: 0,
  FLOOR: 1,
  OBJECT: 2
};

PlayScreen.SpiritType = {
  BALL: 1,
  SOUND: 2
};

PlayScreen.SplashType = {
  NOTE: 1
};

PlayScreen.prototype.updateSharableUrl = function() {
  var levelJson = this.toJSON();
  var squisher = new Squisher();
  var hashString = squisher.squish(JSON.stringify(levelJson));
  var hash = document.createElement('button');
  hash.id = 'hashstring';
  hash.style.color = '#A09060';
  hash.innerHTML = 'save map';
  // window.location.href.split("#")[0] + "#" + hashString;
  var div = document.createElement('div');
  div.id = 'urldiv';
  div.setAttribute('style', 'position: absolute; top: 3px; left: 250px; z-index: 1001; display: block');
  div.onmouseover = alert("pending: map save function"); // saveHash("#" + hashString);
  div.appendChild(hash);
  document.body.appendChild(div);
};

PlayScreen.prototype.onPointerDown = function(pageX, pageY) {
  if (!this.paused) {
    // this.controller.requestPointerLock();
  }
};

PlayScreen.prototype.setScreenListening = function(listen) {
  if (listen == this.listening) return;
  var self = this;
  var rb, i;
  BaseScreen.prototype.setScreenListening.call(this, listen);
  if (listen) {
    for (i = 0; i < this.listeners.vals.length; i++) {
      this.listeners.vals[i].startListening();
    }
    this.pauseTrigger.addTriggerDownListener(this.pauseDownFn);
	
	if (document.body.querySelector('#resumeButton')) {
		rb = document.querySelector('#resumeButton');
		rb.addEventListener('click', this.pauseDownFn);
		rb.addEventListener('touchend', this.pauseDownFn);
	}
  } else {
    for (i = 0; i < this.listeners.vals.length; i++) {
      this.listeners.vals[i].stopListening();
    }
    this.pauseTrigger.removeTriggerDownListener(this.pauseDownFn);
	
	if (document.body.querySelector('#resumeButton')) {
		rb = document.querySelector('#resumeButton');
		rb.removeEventListener('click', this.pauseDownFn);
		rb.removeEventListener('touchend', this.pauseDownFn);
	}
  }
  this.listening = listen;
};

PlayScreen.prototype.lazyInit = function() {
  if (!this.levelStamps) {
    this.initPermStamps();
  }
  if (!this.world) {
    this.initWorld();
  }
};

PlayScreen.prototype.initPermStamps = function() {
  this.levelStamps = [];

  this.cubeStamp = RigidModel.createCube().createModelStamp(this.renderer.gl);
  this.levelStamps.push(this.cubeStamp);

  var circleModel = RigidModel.createCircleMesh(5);
  this.circleStamp = circleModel.createModelStamp(this.renderer.gl);
  this.levelStamps.push(this.circleStamp);

  var model = RigidModel.createDoubleRing(32);
  this.cursorStamp = model.createModelStamp(this.renderer.gl);
  this.levelStamps.push(this.cursorStamp);

  model = RigidModel.createDoubleRing(64);
  this.indicatorStamp = model.createModelStamp(this.renderer.gl);
  this.levelStamps.push(this.indicatorStamp);

  model = RigidModel.createDoubleRing(6);
  this.soundStamp = model.createModelStamp(this.renderer.gl);
  this.levelStamps.push(this.soundStamp);
};

PlayScreen.prototype.initWorld = function() {
  this.lastPathRefreshTime = -Infinity;
  var groupCount = Object.keys(PlayScreen.Group).length;
  this.world = new World(PlayScreen.WORLD_CELL_SIZE, groupCount, [
    [PlayScreen.Group.EMPTY, PlayScreen.Group.EMPTY],
    [PlayScreen.Group.ROCK, PlayScreen.Group.WALL],
    [PlayScreen.Group.ROCK, PlayScreen.Group.ROCK],
    [PlayScreen.Group.CURSOR, PlayScreen.Group.WALL],
    [PlayScreen.Group.CURSOR, PlayScreen.Group.ROCK]
  ]);
  this.resolver = new HitResolver();
  this.resolver.defaultElasticity = 0.8;
  var frag = Url.getFragment();
  if (!frag || !this.maybeLoadWorldFromFragment(frag)) {
    this.createDefaultWorld();
  }
};

PlayScreen.prototype.toJSON = function() {
  var json = {
    terrain: this.bitGrid.toJSON(),
    now: this.world.now,
    bodies: [],
    spirits: [],
    timeouts: [],
    splashes: [],
    cursorPos: this.cursorPos.toJSON(),
    cameraPos: this.camera.cameraPos.toJSON()
  };
  // bodies
  for (var bodyId in this.world.bodies) {
    var body = this.world.bodies[bodyId];
    if (body.hitGroup != PlayScreen.Group.WALL) {
      json.bodies.push(body.toJSON());
    }
  }
  // spirits
  for (var spiritId in this.world.spirits) {
    var spirit = this.world.spirits[spiritId];
    json.spirits.push(spirit.toJSON());
  }
  // timeouts
  for (var e = this.world.queue.getFirst(); e; e = e.next[0]) {
    if (e.type === WorldEvent.TYPE_TIMEOUT) {
      var spirit = this.world.spirits[e.spiritId];
      if (spirit) {
        json.timeouts.push(e.toJSON());
      }
    }
  }
  // splashes
  var splashes = this.splasher.splashes;
  for (var i = 0; i < splashes.length; i++) {
    json.splashes.push(splashes[i].toJSON());
  }
  return json;
};

PlayScreen.prototype.maybeLoadWorldFromFragment = function(frag) {
  try {
    var squisher = new Squisher();
    var jsonStr = squisher.unsquish(frag);
    var jsonObj = JSON.parse(jsonStr);
  } catch (e) {
    console.error("maybeLoadWorldFromFragment error", e);
    return false;
  }
  if (jsonObj) {
    this.world.now = jsonObj.now;
    // bodies
    for (var i = 0; i < jsonObj.bodies.length; i++) {
      var bodyJson = jsonObj.bodies[i];
      var body = new Body();
      body.setFromJSON(bodyJson);
      this.world.loadBody(body);
    }
    // spirits
    for (var i = 0; i < jsonObj.spirits.length; i++) {
      var spiritJson = jsonObj.spirits[i];
      var spiritType = spiritJson[0];
      if (spiritType == PlayScreen.SpiritType.BALL) {
        var spirit = new BallSpirit(this);
        spirit.setModelStamp(this.circleStamp);
        spirit.setFromJSON(spiritJson);
        this.world.loadSpirit(spirit);
      } else if (spiritType == PlayScreen.SpiritType.SOUND) {
        var spirit = new SoundSpirit(this);
        spirit.setModelStamp(this.circleStamp);
        spirit.setFromJSON(spiritJson);
        this.world.loadSpirit(spirit);
      } else {
        console.error("Unknown spiritType " + spiritType + " in spirit JSON: " + spiritJson);
      }
    }
    // timeouts
    if (jsonObj.timeouts) {
      var e = new WorldEvent();
      for (var i = 0; i < jsonObj.timeouts.length; i++) {
        e.setFromJSON(jsonObj.timeouts[i]);
        this.world.loadTimeout(e);
      }
    }
    // splashes
    if (jsonObj.splashes) {
      var splash = new Splash();
      for (var i = 0; i < jsonObj.splashes.length; i++) {
        var splashJson = jsonObj.splashes[i];
        var splashType = splashJson[0];
        if (splashType == PlayScreen.SplashType.NOTE) {
          splash.setFromJSON(splashJson);
          splash.stamp = this.soundStamp;
          this.splasher.addCopy(splash);
        } else {
          console.error("Unknown splashType " + splashType + " in spirit JSON: " + splashJson);
        }
      }
    }
    // terrain
    this.bitGrid = BitGrid.fromJSON(jsonObj.terrain);
    this.tiles = {};
    this.flushTerrainChanges();

    // cursor and camera
    if (jsonObj.cursorPos) {
      this.cursorPos.set(Vec2d.fromJSON(jsonObj.cursorPos));
    }
    if (jsonObj.cameraPos) {
      this.camera.cameraPos.set(Vec2d.fromJSON(jsonObj.cameraPos));
    }
  }
  return true;
};

PlayScreen.prototype.createDefaultWorld = function() {
  for (var i = 0; i < 16; i++) {
    this.initSoundSpirit(new Vec2d(i/16 * 60 - 30, 2), 1.2, i/16, i);
    this.initSoundSpirit(new Vec2d(i/16 * 60 - 30, -2), 1.2, i/16, i);
  }
  this.initBoulder(new Vec2d(40, 0), 4);
  this.initBoulder(new Vec2d(-40, 0), 4);
  this.initWalls();
};

PlayScreen.prototype.initBoulder = function(pos, rad) {
  var density = 1;
  var b = Body.alloc();
  b.shape = Body.Shape.CIRCLE;
  b.setPosAtTime(pos, this.world.now);
  b.rad = rad;
  b.hitGroup = PlayScreen.Group.ROCK;
  b.mass = (Math.PI * 4/3) * b.rad * b.rad * b.rad * density;
  b.pathDurationMax = 0xFFFFFF; // a really big number, but NOT Infinity.
  var spirit = new BallSpirit();
  spirit.bodyId = this.world.addBody(b);
  spirit.setModelStamp(this.circleStamp);
  var spiritId = this.world.addSpirit(spirit);
  b.spiritId = spiritId;
  this.world.spirits[spiritId].setColorRGB(0.5, 0.5, 0.6);
  return spiritId;
};

PlayScreen.prototype.initSoundSpirit = function(pos, rad, measureFraction, sixteenth) {
  var density = 1;
  var b = Body.alloc();
  b.shape = Body.Shape.CIRCLE;
  b.setPosAtTime(pos, this.world.now);
  b.rad = rad;
  b.hitGroup = PlayScreen.Group.ROCK;
  b.mass = (Math.PI * 4/3) * b.rad * b.rad * b.rad * density;
  b.pathDurationMax = 0xFFFFFF; // a really big number, but NOT Infinity.
  var spirit = new SoundSpirit(this);
  spirit.bodyId = this.world.addBody(b);
  spirit.setModelStamp(this.circleStamp);

  var hard = !(sixteenth % 4) || sixteenth == 7 || sixteenth == 10;
  var low = sixteenth == 0 || sixteenth == 7 || sixteenth == 8 || sixteenth == 10;
  var high = sixteenth == 4 || sixteenth == 12;

  var maxPow = 2;
  var notes = 2 * maxPow;
  var rand = 2;
  var base = 7 + (low ? -1 : 0) + (high ? 1 : 0);
  var f = Math.pow(2, base + Math.floor(Math.random() * notes)/notes * maxPow);
  spirit.setSounds([
      [
        measureFraction,
        (hard ? 1.4 : 0.5),
        0, 0.2 + 0.1 * Math.random(), 0.5 + 0.1 * Math.random(),
        f + (Math.random() - 0.5) * rand, f,
        low || hard ? 'square' : 'sine'
      ],
      [
        measureFraction,
        hard ? 1.3 : 0.5,
        0.02*Math.random(), 0.3 + 0.1 * Math.random(), 0.5 + 0.1 * Math.random(),
        f*2 + (Math.random() - 0.5) * rand, f*2,
        'sine'
      ],
      [
        measureFraction,
        hard ? 1 : 0.5,
        0.02*Math.random(), 0.3 + 0.1 * Math.random(), 0.5 + 0.1 * Math.random(),
        f*3 + (Math.random() - 0.5) * rand, f*3,
        'triangle'
      ]
  ]);
  var spiritId = this.world.addSpirit(spirit);
  b.spiritId = spiritId;
  var r = Math.random() / 2;
  this.world.spirits[spiritId].setColorRGB(r, 0.5 - r, measureFraction);
  this.world.spirits[spiritId].hard = hard;
  this.world.addTimeout(this.world.now, spiritId, -1);

  return spiritId;
};

PlayScreen.prototype.createCursorBody = function() {
  var b = Body.alloc();
  b.shape = Body.Shape.CIRCLE;
  b.rad = this.cursorRad;
  b.hitGroup = PlayScreen.Group.CURSOR;
  return b;
};

PlayScreen.prototype.initWalls = function() {
  this.bitGrid = new BitGrid(this.bitSize);
  this.bitGrid.drawPill(new Segment(new Vec2d(-30, 0), new Vec2d(30, 0)), 15, 1);
  this.bitGrid.drawPill(new Segment(new Vec2d(-100, 0), new Vec2d(100, 0)), 2, 1);
  this.bitGrid.drawPill(new Segment(new Vec2d(-100, 0), new Vec2d(-100, 0)), 15, 1);
  this.bitGrid.drawPill(new Segment(new Vec2d(100, 0), new Vec2d(100, 0)), 15, 1);

  this.tiles = {};
  this.flushTerrainChanges();
};

PlayScreen.prototype.digTerrainAtPos = function(pos) {
  this.bitGrid.drawPill(new Segment(pos, pos), 15, 1);
  this.flushTerrainChanges();
};

PlayScreen.prototype.flushTerrainChanges = function() {
  var changedCellIds = this.bitGrid.flushChangedCellIds();
  for (var i = 0; i < changedCellIds.length; i++) {
    this.changeTerrain(changedCellIds[i]);
  }
};

/**
 * The cell at the cellId definitely changes, so unload it and reload it.
 * Make sure the four cardinal neighbors are also loaded.
 * @param cellId
 */
PlayScreen.prototype.changeTerrain = function(cellId) {
  var center = Vec2d.alloc();
  this.bitGrid.cellIdToIndexVec(cellId, center);
  this.loadCellXY(center.x - 1, center.y);
  this.loadCellXY(center.x + 1, center.y);
  this.loadCellXY(center.x, center.y - 1);
  this.loadCellXY(center.x, center.y + 1);
  this.unloadCellXY(center.x, center.y);
  this.loadCellXY(center.x, center.y);
  center.free();
};

PlayScreen.prototype.loadCellXY = function(cx, cy) {
  var cellId = this.bitGrid.getCellIdAtIndexXY(cx, cy);
  var tile = this.tiles[cellId];
  if (!tile) {
    this.tiles[cellId] = tile = {
      cellId: cellId,
      stamp: null,
      bodyIds: null
    };
  }
  if (!tile.bodyIds) {
    tile.bodyIds = [];
    // Create wall bodies and remember their IDs.
    var rects = this.bitGrid.getRectsOfColorForCellId(0, cellId);
    for (var r = 0; r < rects.length; r++) {
      var rect = rects[r];
      var body = this.createWallBody(rect);
      tile.bodyIds.push(this.world.addBody(body));
    }
  }
  // TODO don't repeat stamp for solid walls
  if (!tile.stamp) {
    if (!rects) rects = this.bitGrid.getRectsOfColorForCellId(0, cellId);
    tile.stamp = this.createTileStamp(rects);
  }
};

PlayScreen.prototype.unloadCellXY = function(cx, cy) {
  this.unloadCellId(this.bitGrid.getCellIdAtIndexXY(cx, cy));
};

PlayScreen.prototype.unloadCellId = function(cellId) {
  var tile = this.tiles[cellId];
  if (!tile) return;
  if (tile.stamp) {
    tile.stamp.dispose(this.renderer.gl);
    tile.stamp = null;
  }
  if (tile.bodyIds) {
    for (var i = 0; i < tile.bodyIds.length; i++) {
      var id = tile.bodyIds[i];
      this.world.removeBodyId(id);
    }
    tile.bodyIds = null;
  }
};

/**
 * Creates a body, but does not add it to the world.
 */
PlayScreen.prototype.createWallBody = function(rect) {
  var b = Body.alloc();
  b.shape = Body.Shape.RECT;
  b.setPosAtTime(rect.pos, this.world.now);
  b.rectRad.set(rect.rad);
  b.hitGroup = PlayScreen.Group.WALL;
  b.mass = Infinity;
  b.pathDurationMax = Infinity;
  return b;
};

PlayScreen.prototype.createTileStamp = function(rects) {
  var model = new RigidModel();
  for (var i = 0; i < rects.length; i++) {
    model.addRigidModel(this.createWallModel(rects[i]));
  }
  return model.createModelStamp(this.renderer.gl);
};

PlayScreen.prototype.createWallModel = function(rect) {
  var transformation, wallModel;
  transformation = new Matrix44()
      .toTranslateOpXYZ(rect.pos.x, rect.pos.y, 0)
      .multiply(new Matrix44().toScaleOpXYZ(rect.rad.x, rect.rad.y, 1));
  wallModel = RigidModel.createSquare().transformPositions(transformation);
  wallModel.setColorRGB(0.5, 0.5, 0.7);
//  wallModel.setColorRGB(Math.random()/2+0.3 , Math.random() * 0.5, Math.random()/2+0.5);
  return wallModel;
};

PlayScreen.prototype.handleInput = function() {
  if (!this.world) return;
  var triggered = this.gripTrigger.getVal();
  var oldCursorPos = Vec2d.alloc().set(this.cursorPos);
  var sensitivity = this.camera.getViewDist() * 0.02;
  if (this.trackball.isTouched()) {
    this.trackball.getVal(this.movement);
    var inertia = 0.75;
    var newVel = Vec2d.alloc().setXY(this.movement.x, -this.movement.y).scale(sensitivity);
    this.cursorVel.scale(inertia).add(newVel.scale(1 - inertia));
    newVel.free();
  }
  this.trackball.reset();
  this.cursorPos.add(this.cursorVel);
  // Increase friction at low speeds, to help make smaller movements.
  var slowness = Math.max(0, (1 - this.cursorVel.magnitude()/sensitivity));
  this.cursorVel.scale(0.95 - 0.2 * slowness);
  if (triggered) {
    this.doTriggerAction(oldCursorPos);
  } else {
    if (this.gripPoint) {
      this.gripPoint.free();
      this.gripPoint = null;
    }
    this.doCursorHoverScan();
  }
  oldCursorPos.free();
};

PlayScreen.prototype.doTriggerAction = function(oldCursorPos) {
  switch (this.cursorMode) {
    case PlayScreen.CursorMode.FLOOR:
      this.bitGrid.drawPill(new Segment(oldCursorPos, this.cursorPos), this.cursorRad, 1);
      this.flushTerrainChanges();
      break;
    case PlayScreen.CursorMode.WALL:
      this.bitGrid.drawPill(new Segment(oldCursorPos, this.cursorPos), this.cursorRad, 0);
      this.flushTerrainChanges();
      break;
    case PlayScreen.CursorMode.OBJECT:
      this.dragObject();
      break;
  }
};

PlayScreen.prototype.dragObject = function() {
  var body = this.world.bodies[this.indicatedBodyId];
  var bodyPos = this.getBodyPos(body);
  if (!this.gripPoint) {
    // Get a grip.
    this.gripPoint = Vec2d.alloc()
        .set(this.cursorPos)
        .subtract(bodyPos);
  }
  // Drag it! Drag it? Drag it!
  var newVel = Vec2d.alloc()
      .set(this.cursorPos)
      .subtract(bodyPos)
      .subtract(this.gripPoint)
      .scale(this.gripAccelFraction)
      .add(body.vel)
      .scale(1 - this.gripFriction);
  if (newVel.distance(body.vel) > this.maxGripAccel) {
    newVel.subtract(body.vel).clipToMaxLength(this.maxGripAccel).add(body.vel);
  }
  body.setVelAtTime(newVel, this.world.now);
  newVel.free();

  // Move the cursor closer to the grip point, too, for tactile-like feedback.
  var newCursorPos = Vec2d.alloc().set(bodyPos).add(this.gripPoint);
  var tugDist = 0;//this.camera.getViewDist()/5;
  if (newCursorPos.distance(this.cursorPos) > tugDist) {
    var cursorAccel = Vec2d.alloc()
        .set(newCursorPos)
        .subtract(this.cursorPos);
    cursorAccel.scaleToLength(cursorAccel.magnitude() - tugDist).scale(0.02);
    this.cursorVel.add(cursorAccel);
    cursorAccel.free();
  }
  newCursorPos.free();
};

PlayScreen.prototype.doCursorHoverScan = function() {
  this.cursorBody.setPosAtTime(this.cursorPos, this.world.now);
  var i, hitBody, overlapBodyIds;

  // center pinpoint check
  this.cursorBody.rad = 0;
  overlapBodyIds = this.world.getOverlaps(this.cursorBody);
  var lowestArea = Infinity;
  var smallestBody = null;
  var overWall = false;
  for (i = 0; i < overlapBodyIds.length; i++) {
    hitBody = this.world.bodies[overlapBodyIds[i]];
    if (hitBody) {
      if (hitBody.hitGroup == PlayScreen.Group.WALL) {
        overWall = true;
      } else if (hitBody.getArea() < lowestArea) {
        lowestArea = hitBody.getArea();
        smallestBody = hitBody;
      }
    }
  }
  if (smallestBody) {
    this.setIndicatedBodyId(smallestBody.id);
    this.cursorMode = PlayScreen.CursorMode.OBJECT;
  } else if (overWall) {
    this.setIndicatedBodyId(null);
    this.cursorMode = PlayScreen.CursorMode.WALL;
  } else {
    this.setIndicatedBodyId(null);
    this.cursorMode = PlayScreen.CursorMode.FLOOR;
  }
};

PlayScreen.prototype.setIndicatedBodyId = function(id) {
  if (id != this.indicatedBodyId) {
    this.indicatedBodyId = id;
    this.indicatorChangeTime = Date.now();
  }
};

PlayScreen.prototype.addNoteSplash = function(x, y, dx, dy, r, g, b, bodyRad) {
  var fullRad = bodyRad * 3;// * (1+Math.random()/2);
  var s = this.splash;
  s.reset(PlayScreen.SplashType.NOTE, this.soundStamp);

  s.startTime = this.world.now;
  s.duration = 30 + 2 * (Math.random() - 0.5);

  s.startPose.pos.setXYZ(x, y, 0);
  s.endPose.pos.setXYZ(x + dx * s.duration, y + dy * s.duration, 1);
  s.startPose.scale.setXYZ(fullRad/2, fullRad/2, 1);
  s.endPose.scale.setXYZ(fullRad, fullRad, 1);

  s.startPose2.pos.setXYZ(x, y, 0);
  s.endPose2.pos.setXYZ(x + dx * s.duration, y + dy * s.duration, 1);
  s.startPose2.scale.setXYZ(-fullRad/2, -fullRad/2, 1);
  s.endPose2.scale.setXYZ(fullRad, fullRad, 1);

  s.startPose.rotZ = s.startPose2.rotZ = Math.PI * 2 * Math.random();
  s.endPose.rotZ = s.endPose2.rotZ = s.startPose.rotZ + Math.PI * (Math.random() - 0.5);

  s.startColor.setXYZ(r, g, b);
  s.endColor.setXYZ(r, g, b);

  this.splasher.addCopy(s);
};

PlayScreen.prototype.onHitEvent = function(e) {
  var b0 = this.world.getBodyByPathId(e.pathId0);
  var b1 = this.world.getBodyByPathId(e.pathId1);
  if (b0 && b1) {
    this.resolver.resolveHit(e.time, e.collisionVec, b0, b1);
  }
};

PlayScreen.prototype.bodyIfInGroup = function(group, b0, b1) {
  if (b0 && b0.hitGroup == group) return b0;
  if (b1 && b1.hitGroup == group) return b1;
  return null;
};

PlayScreen.prototype.updateViewMatrix = function() {
  // scale
  this.viewMatrix.toIdentity();
  var pixelsPerMeter = 0.5 * (this.canvas.height + this.canvas.width) / this.camera.getViewDist();
  this.viewMatrix
      .multiply(this.mat44.toScaleOpXYZ(
              pixelsPerMeter / this.canvas.width,
              pixelsPerMeter / this.canvas.height,
          0.2));

  // center
  this.viewMatrix.multiply(this.mat44.toTranslateOpXYZ(
      -this.camera.getX(),
      -this.camera.getY(),
      0));
};

PlayScreen.prototype.drawScene = function() {
  this.camera.follow(this.cursorPos);

  this.renderer.setViewMatrix(this.viewMatrix);
  this.hitsThisFrame = 0;
  for (var id in this.world.spirits) {
    this.world.spirits[id].onDraw(this.world, this.renderer);
  }

  this.sfx.setListenerXYZ(this.camera.getX(), this.camera.getY(), 5);

  if (this.tiles) {
    this.renderer
        .setColorVector(this.levelColorVector)
        .setModelMatrix(this.levelModelMatrix);
    var cx = Math.round((this.camera.getX() - this.bitGrid.cellWorldSize/2) / (this.bitGrid.cellWorldSize));
    var cy = Math.round((this.camera.getY() - this.bitGrid.cellWorldSize/2) / (this.bitGrid.cellWorldSize));
    var pixelsPerMeter = 0.5 * (this.canvas.height + this.canvas.width) / this.camera.getViewDist();
    var pixelsPerCell = this.bitGridMetersPerCell * pixelsPerMeter;
    var cellsPerScreenX = this.canvas.width / pixelsPerCell;
    var cellsPerScreenY = this.canvas.height / pixelsPerCell;
    var rx = Math.ceil(cellsPerScreenX);
    var ry = Math.ceil(cellsPerScreenY);
    for (var dy = -ry; dy <= ry; dy++) {
      for (var dx = -rx; dx <= rx; dx++) {
        this.loadCellXY(cx + dx, cy + dy);
        var cellId = this.bitGrid.getCellIdAtIndexXY(cx + dx, cy + dy);
        var tile = this.tiles[cellId];
        if (tile && tile.stamp) {
          this.renderer
              .setStamp(tile.stamp)
              .drawStamp();
        }
      }
    }
  }
  this.splasher.draw(this.renderer, this.world.now);

  // Draw UI stuff that goes on top of the world
  this.renderer.setBlendingEnabled(true);

  // highlighted body indicator
  var indicatedBody = this.world.bodies[this.indicatedBodyId];
  if (indicatedBody) {
    var bodyPos = this.getBodyPos(indicatedBody);
    var indicatorRad = indicatedBody.rad + this.camera.getViewDist() * 0.02;
    this.renderer
        .setStamp(this.indicatorStamp)
        .setColorVector(this.getIndicatorColorVector());
    this.modelMatrix.toIdentity()
        .multiply(this.mat44.toTranslateOpXYZ(bodyPos.x, bodyPos.y, -0.99))
        .multiply(this.mat44.toScaleOpXYZ(indicatedBody.rad, indicatedBody.rad, 1));
    this.renderer.setModelMatrix(this.modelMatrix);
    this.modelMatrix2.toIdentity()
        .multiply(this.mat44.toTranslateOpXYZ(bodyPos.x, bodyPos.y, -0.99))
        .multiply(this.mat44.toScaleOpXYZ(indicatorRad, indicatorRad, 1));
    this.renderer.setModelMatrix2(this.modelMatrix2);
    this.renderer.drawStamp();
  }

  // cursor
  this.renderer
      .setStamp(this.cursorStamp)
      .setColorVector(this.getCursorColorVector());
  var outerCursorRad = indicatedBody ? this.cursorRad * 0.3 : this.cursorRad;
  var innerCursorRad = indicatedBody ? 0 : this.cursorRad * 0.3;
  this.modelMatrix.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(this.cursorPos.x, this.cursorPos.y, -0.99))
      .multiply(this.mat44.toScaleOpXYZ(outerCursorRad, outerCursorRad, 1));
  this.renderer.setModelMatrix(this.modelMatrix);
  this.modelMatrix2.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(this.cursorPos.x, this.cursorPos.y, -0.99))
      .multiply(this.mat44.toScaleOpXYZ(innerCursorRad, innerCursorRad, 1));
  this.renderer.setModelMatrix2(this.modelMatrix2);
  this.renderer.drawStamp();

  this.drawHud();
  this.renderer.setBlendingEnabled(false);

  if (this.restarting) {
    this.controller.restart();
    this.restarting = false;
  } else {
    // Animate whenever this thing draws.
    if (!this.paused) {
      this.controller.requestAnimation();
    }
  }
};

/**
 * Draw stuff on screen coords, with 0,0 at the top left and canvas.width, canvas.height at the bottom right.
 */
PlayScreen.prototype.drawHud = function() {
  this.touchDetector.decrease();

  // Set hud view matrix
  this.hudViewMatrix.toIdentity()
      .multiply(this.mat44.toScaleOpXYZ(
              2 / this.canvas.width,
              -2 / this.canvas.height,
          1))
      .multiply(this.mat44.toTranslateOpXYZ(-this.canvas.width/2, -this.canvas.height/2, 0));
  this.renderer.setViewMatrix(this.hudViewMatrix);

  // draw grip trigger
  this.renderer
      .setStamp(this.circleStamp)
      .setColorVector(this.getGripTriggerColorVector());
  var gripTriggerRad = this.gripTouchTrigger.getRad() * this.touchDetector.getVal();
  this.modelMatrix.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(this.gripTouchTrigger.getX(), this.gripTouchTrigger.getY(), -0.99))
      .multiply(this.mat44.toScaleOpXYZ(gripTriggerRad, gripTriggerRad, 1));
  this.renderer.setModelMatrix(this.modelMatrix);
  this.renderer.drawStamp();
  
  // draw pause trigger
  this.renderer
      .setStamp(this.circleStamp)
      .setColorVector(this.getPauseTriggerColorVector());
  var pauseTriggerRad = this.pauseTouchTrigger.getRad() * this.touchDetector.getVal() * 0.3;
  this.modelMatrix.toIdentity()
      .multiply(this.mat44.toTranslateOpXYZ(this.pauseTouchTrigger.getX(), this.pauseTouchTrigger.getY(), -0.99))
      .multiply(this.mat44.toScaleOpXYZ(pauseTriggerRad, pauseTriggerRad, 1));
  this.renderer.setModelMatrix(this.modelMatrix);
  this.renderer.drawStamp();
};

PlayScreen.prototype.getCursorColorVector = function() {
  var brightness = 0.5 + 0.5 * this.gripTrigger.getVal();
  switch(this.cursorMode) {
    case PlayScreen.CursorMode.FLOOR:
      this.colorVector.setRGBA(1, 0, 0, 0.8 * brightness);
      break;
    case PlayScreen.CursorMode.WALL:
      this.colorVector.setRGBA(0, 1, 0, 0.8 * brightness);
      break;
    case PlayScreen.CursorMode.OBJECT:
      this.colorVector.setRGBA(1, 1, 1, 0.5 * brightness);
      break;
  }
  return this.colorVector;
};

PlayScreen.prototype.getGripTriggerColorVector = function() {
  var touchiness = this.touchDetector.getVal();
  this.colorVector.setRGBA(1, 1, 1, this.gripTrigger.getVal() ? 0.2 : 0.1 * touchiness);
  return this.colorVector;
};

PlayScreen.prototype.getPauseTriggerColorVector = function() {
  var touchiness = this.touchDetector.getVal();
  this.colorVector.setRGBA(1, 1, 1, this.paused ? 0 : 0.1 * touchiness);
  return this.colorVector;
};

PlayScreen.prototype.getIndicatorColorVector = function() {
  var t = (Date.now() - this.indicatorChangeTime) / 200;
  var c = Math.cos(t)/5+0.5;
  this.indicatorColorVector.setRGBA(c, c, c, 0.5);
  return this.indicatorColorVector;
};

PlayScreen.prototype.unloadLevel = function() {
  if (this.tiles) {
    for (var cellId in this.tiles) {
      this.unloadCellId(cellId);
    }
    this.tiles = null;
  }
  if (this.world) {
    for (var spiritId in this.world.spirits) {
      var s = this.world.spirits[spiritId];
      var b = this.world.bodies[s.bodyId];
      this.world.removeBodyId(b.id);
      this.world.removeSpiritId(spiritId);
    }
    this.world = null;
  }
  this.cursorPos.reset();
  this.cursorVel.reset();
  this.camera.setXY(0, 0);
};

PlayScreen.prototype.getBodyPos = function(body) {
  return body.getPosAtTime(this.world.now, this.vec2d);
};

PlayScreen.prototype.showPausedOverlay = function() {
  // var kanvas = document.getElementById('canvas').getContext("2d");
  // document.getElementByID('urldiv').style.display = 'block';
  // document.body.appendChild(paused);
};

PlayScreen.prototype.hidePausedOverlay = function() {
  // document.getElementByID('urldiv').style.display = 'none';
  // document.body.removeChild(paused);
};


/* ---- js/pausescreen.js ---- */


/**
 * @constructor
 * @extends {BaseScreen}
 */
function PauseScreen(controller, canvas, renderer, glyphs, stamps, sound) {
  BaseScreen.call(this, controller, canvas, renderer, glyphs, stamps, sound);
}
PauseScreen.prototype = new BaseScreen();
PauseScreen.prototype.constructor = PauseScreen;

PauseScreen.prototype.lazyInit = function() {
  if (!this.world) {
    this.initWorld();
  }
};

PauseScreen.prototype.onSpaceDown = function() {
  this.resumeSpirit.onClick();
};

PauseScreen.prototype.onPointerDown = function(pageX, pageY) {
  this.vec2d.setXY(pageX, pageY);
  this.transformCanvasToWorld(this.vec2d);
  if (this.resumeSpirit.isOverlapping(this.world, this.vec2d)) {
    this.resumeSpirit.onClick();
  }
  if (this.fullScreenSpirit.isOverlapping(this.world, this.vec2d)) {
    this.fullScreenSpirit.onClick();
  }
  if (this.quitSpirit.isOverlapping(this.world, this.vec2d)) {
    this.quitSpirit.onClick();
  }
};

PauseScreen.prototype.initWorld = function() {
  this.world = new World(World.DEFAULT_CELL_SIZE, 2, [[0, 0], [1, 1]]);
  this.resolver = new HitResolver();
  this.resolver.defaultElasticity = 0.9;
  var labelMaker = new LabelMaker(this.glyphs);
  var controller = this.controller;
  var sfx = this.sfx;
  var world = this.world;

  var red = 0.75, green = 0.25, blue = 0.0;

  var buttonMaker = new ButtonMaker(labelMaker, this.world, null, this.renderer);
  buttonMaker
      .setNextCharMatrix(new Matrix44().toTranslateOpXYZ(3, 0, 0))
      .setPaddingXY(1.5, 0.5);

  buttonMaker.setLetterColor([red*0.7, green*0.7, blue*0.7]).setBlockColor(null);
  buttonMaker.addButton(0, 0, "PAUSED", null);

  var spiritId;

  // RESUME
  buttonMaker.setLetterColor([red, green, blue]).setBlockColor([red*0.5, green*0.5, blue*0.5]);
  spiritId = buttonMaker.addButton(0, -8, "RESUME", function(e) {
    var freq0 = 100;
    var freq1 = 5000;
    var delay = 0;
    var attack = 0.01;
    var sustain = 0.1;
    var decay = 0.04;
    sfx.sound(0, 0, 0, 0.5, attack, sustain, decay, freq0, freq1, 'square', delay);
    this.lastSoundMs = Date.now();
    this.soundLength = (attack + sustain + decay + delay) * 1000;
    controller.gotoScreen(Test36.SCREEN_PLAY);
    // controller.requestPointerLock();
  });
  this.resumeSpirit = this.world.spirits[spiritId];

  // FULL SCREEN
  buttonMaker.setScale(0.75);
  spiritId = buttonMaker.addButton(0, -8-6, "FULL SCREEN", function(e) {
    var freq0 = 200;
    var freq1 = 2200;
    var delay = 0;
    var attack = 0.05;
    var sustain = 0.1;
    var decay = 0.2;
    sfx.sound(0, 0, 0, 0.5, attack, sustain, decay, freq0, freq1, 'square', delay);
    this.lastSoundMs = Date.now();
    this.soundLength = (attack + sustain + decay + delay) * 1000;
    controller.requestFullScreen();
  });
  this.fullScreenSpirit = world.spirits[spiritId];

  // QUIT
  spiritId = buttonMaker.addButton(0, -8-6-5, "QUIT", function(e) {
    var freq0 = 200;
    var freq1 = 5;
    var delay = 0;
    var attack = 0;
    var sustain = 1;
    var decay = 0.1;
    sfx.sound(0, 0, 0, 0.5, attack, sustain, decay, freq0, freq1, 'square', delay);
    this.lastSoundMs = Date.now();
    this.soundLength = (attack + sustain + decay + delay) * 1000;
    controller.quit();
  });
  this.quitSpirit = world.spirits[spiritId];

  for (spiritId in this.world.spirits) {
    var s = this.world.spirits[spiritId];
    var b = this.world.bodies[s.bodyId];
    this.worldBoundingRect.coverRect(b.getBoundingRectAtTime(this.world.now));
  }
//  this.worldBoundingRect.coverXY(0, 5);
//  this.worldBoundingRect.coverXY(0, -27);
};

PauseScreen.prototype.updateViewMatrix = function() {
  var br = this.worldBoundingRect;
  this.viewMatrix.toIdentity();
  var ratio = Math.min(this.canvas.height, this.canvas.width) / Math.max(br.rad.x, br.rad.y);
  this.viewMatrix
      .multiply(this.mat4.toScaleOpXYZ(
              ratio / this.canvas.width,
              ratio / this.canvas.height,
          0.2));

  // scale
  var v = this.visibility;
  this.viewMatrix.multiply(this.mat4.toScaleOpXYZ(3 - v*2, v * v, 1));

  // center
  this.viewMatrix.multiply(this.mat4.toTranslateOpXYZ(
      -br.pos.x,
      -br.pos.y,
      0));

  this.renderer.setViewMatrix(this.viewMatrix);
};



// ----------------------- MAIN ------------------------



var canvas = document.createElement('canvas');
canvas.id = 'canvas';
resizeCanvas();

document.body.appendChild(canvas);

this.addEventListener("load", main);

// ------  main  -------

function resizeCanvas() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.width = w;
  canvas.height = h;
}

function main() {
  var test36 = new Test36();
}

function Test36() {
  this.canvas = canvas;
  new RendererLoader(this.canvas, './app/shaders/cave-vertex-shader.txt', './app/shaders/fragment-shader.txt').load(this.onRendererLoaded.bind(this));
  this.sfx = new SoundFx();
  this.sfx.setListenerXYZ(0, 0, 5);
  this.iosSoundUnlocked = false;
  this.animateFrameFn = this.animateFrame.bind(this);
  // on-event sound unlocker for iOS
  document.body.addEventListener('mouseup', this.unlockIosSound.bind(this));
  document.body.addEventListener('touchend', this.unlockIosSound.bind(this));
}

// Test36.SCREEN_TITLE = 'title';
Test36.SCREEN_PLAY = 'play';
// Test36.SCREEN_PAUSE = 'pause';

// Test36.SCREENS = [Test36.SCREEN_TITLE, Test36.SCREEN_PLAY, Test36.SCREEN_PAUSE];
Test36.SCREENS = [Test36.SCREEN_PLAY];

Test36.prototype.unlockIosSound = function() {
  if (!this.iosSoundUnlocked) {
    this.sfx.sound(0, 0, 0, 0.001, 0, 0, 0.001, 1, 1, 'sine');
    this.iosSoundUnlocked = true;
  }
};

Test36.prototype.onRendererLoaded = function(r) {
  this.renderer = r;
  this.initScreens();
  this.requestAnimation();
};

Test36.prototype.initScreens = function() {
  this.initStamps();
  this.screens = {};
  // this.screens[Test36.SCREEN_TITLE] = new TitleScreen(this, this.canvas, this.renderer, this.glyphs, this.stamps, this.sfx);
  this.screens[Test36.SCREEN_PLAY] = new PlayScreen(this, this.canvas, this.renderer, this.glyphs, this.stamps, this.sfx);
  // this.screens[Test36.SCREEN_PAUSE] = new PauseScreen(this, this.canvas, this.renderer, this.glyphs, this.stamps, this.sfx);

  this.visibility = {};
  for (var i = 0; i < Test36.SCREENS.length; i++) {
    var screen = Test36.SCREENS[i];
    this.visibility[screen] = screen == Test36.SCREEN_PLAY ? 1 : 0;
  }
  // this.frontScreenId = Test36.SCREEN_TITLE;
  this.frontScreenId = Test36.SCREEN_PLAY;
  this.animationRequested = false;
};

Test36.prototype.initStamps = function() {
  var glyphMaker = new GlyphMaker(0.4, 1.2);
  this.glyphs = new Glyphs(glyphMaker);
  var glyphStamps = this.glyphs.initStamps(this.renderer.gl);
  this.stamps = {};
  for (var key in glyphStamps) {
    this.stamps[key] = glyphStamps[key];
  }
};

/**
 * Manages changing screen visibility, and calls drawScreen() on visible screens.
 */
Test36.prototype.animateFrame = function() {
  this.animationRequested = false;
  this.renderer.resize().clear();
  for (var i = 0; i < Test36.SCREENS.length; i++) {
    var id = Test36.SCREENS[i];
    var oldVisibility = this.visibility[id];
    var seconds = 0.2;
    if (this.frontScreenId == id) {
      this.visibility[id] = Math.min(1, this.visibility[id] + 1 / (seconds * 60));
    } else {
      this.visibility[id] = Math.max(0, this.visibility[id] - 1 / (seconds * 60));
    }
    this.screens[id].setScreenListening(this.frontScreenId == id);
    if (this.visibility[id]) {
      this.screens[id].drawScreen(this.visibility[id]);
    }
    if (oldVisibility != this.visibility[id]) {
      this.requestAnimation();
    }
  }
};

Test36.prototype.gotoScreen = function(screenId) {
  this.frontScreenId = screenId;
  this.requestAnimation();
};

Test36.prototype.restart = function() {
  this.screens[Test36.SCREEN_PLAY].unloadLevel();
  this.requestAnimation();
};

Test36.prototype.requestFullScreen = function() {
  var elem = document.body;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
  this.requestAnimation();
};

Test36.prototype.requestPointerLock = function() {
  this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
  if (this.canvas.requestPointerLock) { this.canvas.requestPointerLock(); }
};

Test36.prototype.exitPointerLock = function() {
  document.exitPointerLock = document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
  if (document.exitPointerLock) {
    document.exitPointerLock();
  } else {
    console.log('exitPointerLock UNPOSSIBLE');
  }
};

Test36.prototype.requestAnimation = function() {
  if (!this.animationRequested) {
    this.animationRequested = true;
    requestAnimationFrame(this.animateFrameFn, this.canvas);
  }
};

// -------------------- END OF FILE ------------------------
