// Webgl-3 (FIXING)

// Test 15
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

// ----------------------- CONTROLS ---------------------



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


/* ---- js/controls/touchstick.js ---- */


/**
 * A control stick based on touch events.
 * @constructor
 * @extends {Stick}
 */
function TouchStick() {
  Stick.call(this);

  this.radius = 30;
  this.startZoneFn = function(x, y) {
    return true;
  };

  var self = this;

  this.center = new Vec2d();
  this.tip = new Vec2d();

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
TouchStick.prototype = new Stick();
TouchStick.prototype.constructor = TouchStick;

TouchStick.prototype.setStartZoneFunction = function(fn) {
  this.startZoneFn = fn;
  return this;
};

TouchStick.prototype.setRadius = function(r) {
  this.radius = r;
  return this;
};

TouchStick.prototype.startListening = function() {
  document.body.addEventListener('touchstart', this.touchStartListener);
  document.body.addEventListener('touchmove', this.touchMoveListener);
  document.body.addEventListener('touchend', this.touchEndListener);
  document.body.addEventListener('touchcancel', this.touchEndListener);
  return this;

};

TouchStick.prototype.stopListening = function() {
  document.body.removeEventListener('touchstart', this.touchStartListener);
  document.body.removeEventListener('touchmove', this.touchMoveListener);
  document.body.removeEventListener('touchend', this.touchEndListener);
  document.body.removeEventListener('touchcancel', this.touchEndListener);
  return this;
};

TouchStick.prototype.getVal = function(out) {
  this.val.set(this.tip).subtract(this.center).scale(1 / this.radius).scaleXY(1, -1);
  this.clip();
  return out.set(this.val);
};

TouchStick.prototype.onTouchStart = function(e) {
  if (this.touchId !== null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (this.startZoneFn(touch.pageX, touch.pageY)) {
      // Start tracking this one.
      this.touchId = touch.identifier;
      this.center.setXY(touch.pageX, touch.pageY);
      this.tip.setXY(touch.pageX, touch.pageY);
      break;
    }
  }
};

TouchStick.prototype.onTouchMove = function(e) {
  if (this.touchId === null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch.identifier == this.touchId) {
      // Keep tracking this one.
      this.tip.setXY(touch.pageX, touch.pageY);
      var dist = this.tip.distance(this.center);
      var max = this.radius;
      if (dist > max) {
        this.center.slideByFraction(this.tip, (dist - max) / dist);
      }
      break;
    }
  }
};

TouchStick.prototype.onTouchEnd = function(e) {
  if (this.touchId === null) return;
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    if (touch.identifier == this.touchId) {
      this.touchId = null;
      this.center.setXY(touch.pageX, touch.pageY);
      this.tip.setXY(touch.pageX, touch.pageY);
      break;
    }
  }
};


/* ---- js/controls/multistick.js ---- */


/**
 * A control stick that adds other sticks together, clipping the result.
 * @constructor
 * @extends {Stick}
 */
function MultiStick() {
  Stick.call(this);
  this.sticks = [];
  this.temp = new Vec2d();
}
MultiStick.prototype = new Stick();
MultiStick.prototype.constructor = MultiStick;

MultiStick.prototype.addStick = function(s) {
  this.sticks.push(s);
  return this;
};

MultiStick.prototype.getVal = function(out) {
  this.val.reset();
  for (var i = 0; i < this.sticks.length; i++) {
    this.sticks[i].getVal(this.temp);
    this.val.add(this.temp);
  }
  this.clip();
  return out.set(this.val);
};


/* ---- js/controls/pointerlockstick.js ---- */


/**
 * A control stick based the Pointer Lock API, using a mouse or trackpad.
 * @constructor
 * @extends {Stick}
 */
function PointerLockStick() {
  Stick.call(this);
  this.radius = 30;
  var self = this;
  this.tip = new Vec2d();
  this.locked = false;
  this.listening = false;

  this.canvas = null;

  this.lockChangeListener = function(e) {
    self.onLockChange(e);
  };
  this.lockErrorListener = function(e) {
    self.onLockError(e);
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
  this.clickListener = function(e) {
    self.onClick(e);
  };
}

PointerLockStick.prototype = new Stick();
PointerLockStick.prototype.constructor = PointerLockStick;

PointerLockStick.BROWSER_PREFIXES = ['', 'moz', 'webkit'];

PointerLockStick.prototype.setRadius = function(r) {
  this.radius = r;
  return this;
};

PointerLockStick.prototype.setCanvas = function(canvas) {
  this.canvas = canvas;
  return this;
};

PointerLockStick.prototype.startListening = function() {
  for (var i = 0; i < PointerLockStick.BROWSER_PREFIXES.length; i++) {
    var prefix = PointerLockStick.BROWSER_PREFIXES[i];
    document.addEventListener('on' + prefix + 'pointerlockchange', this.lockChangeListener, false);
    document.addEventListener(prefix + 'pointerlockerror', this.lockErrorListener, false);
  }
  document.body.addEventListener('mousedown', this.mouseDownListener);
  document.body.addEventListener('mousemove', this.mouseMoveListener);
  document.body.addEventListener('mouseup', this.mouseUpListener);
  this.canvas.addEventListener('click', this.clickListener);
  this.listening = true;
  return this;
};

PointerLockStick.prototype.stopListening = function() {
  for (var i = 0; i < PointerLockStick.BROWSER_PREFIXES.length; i++) {
    var prefix = PointerLockStick.BROWSER_PREFIXES[i];
    document.removeEventListener('on' + prefix + 'pointerlockchange', this.lockChangeListener, false);
    document.removeEventListener(prefix + 'pointerlockerror', this.lockErrorListener, false);
  }
  document.body.removeEventListener('mousedown', this.mouseDownListener);
  document.body.removeEventListener('mousemove', this.mouseMoveListener);
  document.body.removeEventListener('mouseup', this.mouseUpListener);
  this.canvas.removeEventListener('click', this.clickListener);
  this.listening = false;
  return this;
};

PointerLockStick.prototype.getVal = function(out) {
  if (this.mouseDown) {
    this.val.set(this.tip).scale(1 / this.radius).scaleXY(1, -1);
    this.clip();
    return out.set(this.val);
  } else {
    return out.reset();
  }
};

PointerLockStick.prototype.requestLock = function() {
  this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
      this.canvas.mozRequestPointerLock ||
      this.canvas.webkitRequestPointerLock;
  if (this.canvas.requestPointerLock) {
    this.canvas.requestPointerLock();
  }
};

PointerLockStick.prototype.exitPointerLock = function() {
  document.exitPointerLock = document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
  if (document.exitPointerLock) {
    document.exitPointerLock();
  }
};

PointerLockStick.prototype.onLockChange = function(e) {
  this.locked =
      document.pointerLockElement === this.canvas ||
      document.mozPointerLockElement === this.canvas ||
      document.webkitPointerLockElement === this.canvas;
};

PointerLockStick.prototype.onLockError = function(e) {
  console.warn('PointerLockStick.onLockError: ' + e);
};

PointerLockStick.prototype.onMouseDown = function(e) {
  this.mouseDown = true;
};

PointerLockStick.prototype.onMouseMove = function(e) {
  var dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
  var dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
  this.tip.addXY(dx, dy).clipToMaxLength(this.radius);
};

PointerLockStick.prototype.onMouseUp = function(e) {
  this.mouseDown = false;
};

PointerLockStick.prototype.onClick = function(e) {
  // At least on Chrome, you have to click the canvas to request pointerlock.
  // If you try to request it in any other execution thread, you'll get an error.
  this.requestLock();
};


/* ---- js/playerspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function PlayerSpirit() {
  Spirit.call(this);
  this.bodyId = -1;
  this.id = -1;
  this.vec = Vec2d.alloc();
  this.accel = Vec2d.alloc();
  this.aim = Vec2d.alloc();
  this.moveStick = null;
  this.aimStick = null;
  this.lastFire = 0;

  this.accelFactor = 0.2;
  this.friction = 0.1;
  this.shotSpeed = 20;
  this.shotInterval = 2;
}
PlayerSpirit.prototype = new Spirit();
PlayerSpirit.prototype.constructor = PlayerSpirit;

PlayerSpirit.TIMEOUT = 0.25;

PlayerSpirit.prototype.onTimeout = function(world, timeout) {
  var b = world.bodies[this.bodyId];

  if (b) {
    // move
    this.accel.reset();
    if (this.moveStick) {
      this.moveStick.getVal(this.accel);
      this.accel.scale(b.rad * this.accelFactor);
    }
    this.vec.set(b.vel).scale(1 - this.friction).add(this.accel);
    b.setVelAtTime(this.vec, world.now);

    // fire
    if (this.aimStick && this.lastFire + this.shotInterval <= world.now) {
      this.aimStick.getVal(this.aim);
      if (!this.aim.isZero()) {
        this.lastFire = world.now;
        this.aim.scaleToLength(this.shotSpeed).add(b.vel);
        var bulletBody = Body.alloc();
        bulletBody.shape = Body.Shape.CIRCLE;
        bulletBody.rad = b.rad * 0.75;
        bulletBody.mass = bulletBody.rad * bulletBody.rad * Math.PI;
        bulletBody.pathDurationMax = BulletSpirit.TIMEOUT;
        bulletBody.setPosAtTime(b.getPosAtTime(world.now, this.vec), world.now);
        bulletBody.setVelAtTime(this.aim, world.now);
        var bulletId = world.addBody(bulletBody);
        var bulletSpirit = BulletSpirit.alloc();
        bulletSpirit.bodyId = bulletId;
        world.addSpirit(bulletSpirit);

        bulletBody.spiritId = bulletSpirit.id;
        world.addTimeout(world.now + BulletSpirit.TIMEOUT, bulletSpirit.id);
      }
    }
  }

  world.addTimeout(world.now + PlayerSpirit.TIMEOUT, this.id, null);
};

PlayerSpirit.prototype.onHit = function(world, thisBody, thatBody, hit) {
};

PlayerSpirit.prototype.setMoveStick = function(stick) {
  this.moveStick = stick;
};

PlayerSpirit.prototype.setAimStick = function(stick) {
  this.aimStick = stick;
};


/* ---- js/rayspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function RaySpirit() {
  Spirit.call(this);
  this.bodyId = -1;
  this.id = -1;
  this.vec = Vec2d.alloc();
  this.accel = Vec2d.alloc();
  this.attackVec = Vec2d.alloc();
  this.hitPos = [];
  this.mode = RaySpirit.MODE_ATTACK;
}
RaySpirit.prototype = new Spirit();
RaySpirit.prototype.constructor = RaySpirit;

RaySpirit.MODE_ATTACK = 1;
RaySpirit.MODE_RETURN = 2;

RaySpirit.TIMEOUT = 0.5;

RaySpirit.ROAM_DIST = 150;
RaySpirit.RAY_COUNT = 10;
RaySpirit.RAY_LENGTH = 100;
RaySpirit.RAY_RADUIS = 2;

RaySpirit.prototype.onTimeout = function(world, timeout) {
  var pos;
  while(pos = this.hitPos.pop()) {
    pos.free();
  }

  var b = world.bodies[this.bodyId];
  if (b && b.mass != Infinity) {
    this.vec.set(b.vel);
    var speed = this.vec.magnitude();

    if (speed < 0.01) {
      this.vec.scale(2);
      this.vec.rot(Math.random() - 0.5);
    } else {
      this.vec.scale(0.8);
    }
    b.setVelAtTime(this.vec, world.now);

    var req = ScanRequest.alloc();
    req.hitGroup = 0;
    req.shape = Body.Shape.CIRCLE;
    req.rad = RaySpirit.RAY_RADUIS;
    b.getPosAtTime(world.now, req.pos);
    var resp = ScanResponse.alloc();

    // return to base?
    if (req.pos.magnitude() > RaySpirit.ROAM_DIST) {
      this.mode = RaySpirit.MODE_RETURN;
    }

    // gravity
    this.accel.set(req.pos).scaleToLength(this.mode == RaySpirit.MODE_RETURN ? -1 : -0.1);

    this.attackVec.reset();
    speed = b.vel.magnitude();
    var closest = 2;
    for (var i = 0; i < RaySpirit.RAY_COUNT; i++) {
      var a = 0.8 * Math.PI * (i / RaySpirit.RAY_COUNT - 0.5);
      req.vel.set(b.vel).scaleToLength(RaySpirit.RAY_LENGTH).rot(a);
      if (world.rayscan(req, resp)) {
        this.hitPos.push(Vec2d.alloc().set(req.vel).scale(resp.timeOffset).add(req.pos));
        var other = world.getBodyByPathId(resp.pathId);
        if (other) {
          if (other.mass == Infinity) {
            // there's a wall
            this.mode = RaySpirit.MODE_ATTACK;
            var dist = resp.timeOffset * RaySpirit.RAY_LENGTH - b.rad;
            if (dist < speed * RaySpirit.TIMEOUT * 20) {
              this.vec.set(req.vel).scaleToLength(1 - resp.timeOffset + 0.1)
                  .scale(-0.4);
              this.accel.add(this.vec);
            }

          } else if (this.mode == RaySpirit.MODE_ATTACK) {
            // enemy found
            if (resp.timeOffset < closest) {
              closest = resp.timeOffset;
              this.attackVec.set(req.vel);
            }
          }
        }
      } else if (this.mode == RaySpirit.MODE_ATTACK) {
        // The way is clear
        this.vec.set(req.vel).scaleToLength(0.1);
        this.accel.add(this.vec);
      }
    }
    if (closest <= 1) {
      this.accel.add(this.attackVec.scaleToLength(1.2));
    }

    this.vec.set(b.vel).add(this.accel);
    b.setVelAtTime(this.vec, world.now);
  }

  world.addTimeout(timeout.time + RaySpirit.TIMEOUT, this.id, null);
};

RaySpirit.prototype.onHit = function(world, thisBody, thatBody, hit) {
//  if(thatBody.mass != Infinity) {
//    thisBody.setVelAtTime(this.vec.set(thisBody.vel).scale(1.1), hit.time);
//  }
};


/* ---- js/testspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function TestSpirit() {
  Spirit.call(this);
  this.id = -1;
  this.bodyId = -1;
  this.vec = Vec2d.alloc();
}

TestSpirit.TIMEOUT = 2;

TestSpirit.prototype = new Spirit();
TestSpirit.prototype.constructor = TestSpirit;

TestSpirit.prototype.onTimeout = function(world, timeout) {
  var b = world.bodies[this.bodyId];
  this.vec.set(b.vel).rot(0.6 * (Math.random() - 0.5));
  this.vec.scale(Math.random() + 0.44);
  if (this.vec.magnitudeSquared() < 2) {
    b.getPosAtTime(world.now, this.vec).scaleToLength(-Math.random() * 5 - 1);
  }
  b.setVelAtTime(this.vec, world.now);
  b.invalidatePath();
  world.addTimeout(world.now + TestSpirit.TIMEOUT, this.id, null);
};

TestSpirit.prototype.onHit = function(world, thisBody, thatBody, hit) {
//  if(thatBody.mass != Infinity) {
//    thisBody.setVelAtTime(this.vec.set(thisBody.vel).scale(1.1), hit.time);
//  }
};


/* ---- js/bulletspirit.js ---- */


/**
 * @constructor
 * @extends {Spirit}
 */
function BulletSpirit() {
  Spirit.call(this);
  this.reset();
}
BulletSpirit.prototype = new Spirit();
BulletSpirit.prototype.constructor = BulletSpirit;

Poolify(BulletSpirit);

BulletSpirit.TIMEOUT = 20;

BulletSpirit.prototype.reset = function() {
  this.bodyId = -1;
  this.id = -1;
};

BulletSpirit.prototype.onTimeout = function(world, timeout) {
  this.destroyBullet();
};

BulletSpirit.prototype.destroyBullet = function() {
  world.removeBodyId(this.bodyId);
  world.removeSpiritId(this.id);
};

BulletSpirit.prototype.onHit = function(world, thisBody, thatBody, hit) {
  //this.destroyBullet();
};


// ------------------------ MAIN ----------------------


var canvas = document.createElement('canvas');
canvas.id = 'canvas';
resizeCanvas();
document.body.appendChild(canvas);
addEventListener("load", main);

function resizeCanvas() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.width = w;
	canvas.height = h;
}

// WebGL fundamentals
var vertexShader, fragmentShader, program, gl;

// physics and behavior
var world, resolver;
var playerSpirit, raySpirit, playerBody;

// map generation
var OBJ_COUNT = 64;
var RECT_CHANCE = 0.7;
var SPACING = 50;

// locations of cached GL program data:
// uniforms
var uViewTranslation, uViewScale, uModelScale, uModelTranslation, uModelColor, uPlayerPos;
// attributes
var aVertexPosition, aVertexColor;
// data buffers
var bgPosBuff, bgColorBuff, bgTriangleCount;
var rectPosBuff, rectColorBuff;
// There can be different circle models for different levels of detail.
// These are sparse arrays, indexed by number of corners.
var circlePosBuffs = [], circleColorBuffs = [];

// frame rendering timing
var CLOCKS_PER_SECOND = 60 * 0.3;
var prevFrameStartMs;
var frameStartMs;

// world-to-view transformation
var ZOOM = 1/100;
var viewTranslation = [0, 0, 0];
var viewScale = [1/ZOOM, 1/ZOOM, 0];

// scene-drawing values
var playerPos = new Vec2d();
var array3 = [0, 0, 0];
var bodyPos = new Vec2d();
var ZERO_3 = [0, 0, 0];
var IDENTITY_3 = [1, 1, 1];
var PLAYER_COLOR_3 = [1, 0.5, 0.5];
var RAY_SPIRIT_COLOR_3 = [0.2, 0.7, 0.8];
var BULLET_COLOR_3 = [1, 0.5, 0.1];
var OTHER_COLOR_3 = [0.5, 1, 0.5];
var CIRCLE_CORNERS = 16;

function main() {
  canvas = this.canvas;

  gl = getWebGlContext(canvas, { alpha: false, antialias: true });

  loadText('./app/shaders/demo2-vertex-shader.txt', function(text) {
    vertexShader = compileShader(gl, text, gl.VERTEX_SHADER);
    maybeCreateProgram();
  });

  loadText('./app/shaders/demo2-fragment-shader.txt', function(text) {
    fragmentShader = compileShader(gl, text, gl.FRAGMENT_SHADER);
    maybeCreateProgram();
  });
}

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
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  onProgramCreated();
}

function onProgramCreated() {
  // Cache all the shader uniforms.
  uViewTranslation = gl.getUniformLocation(program, 'uViewTranslation');
  uViewScale = gl.getUniformLocation(program, 'uViewScale');
  uModelTranslation = gl.getUniformLocation(program, 'uModelTranslation');
  uModelScale = gl.getUniformLocation(program, 'uModelScale');
  uModelColor = gl.getUniformLocation(program, 'uModelColor');
  uPlayerPos = gl.getUniformLocation(program, 'uPlayerPos');

  // Cache and enable the vertex position and color attributes.
  aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  gl.enableVertexAttribArray(aVertexPosition);
  aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
  gl.enableVertexAttribArray(aVertexColor);

  initWorld();
  loop();
}

function loop() {
  maybeResize(canvas, gl);
  if (!prevFrameStartMs) {
    prevFrameStartMs = Date.now() - 1000/60;
  } else {
    prevFrameStartMs = frameStartMs;
  }
  frameStartMs = Date.now();
  drawScene();
  clock();
  requestAnimationFrame(loop, canvas);
}

function maybeResize(canvas, gl) {
  if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

function clock() {
  var frameLength = frameStartMs - prevFrameStartMs;
  if (frameLength > 1000/30) {
    // Don't go below 30fps
    frameLength = 1000/30;
  }
  var endTimeMs = frameStartMs + frameLength;
  var secondsElapsed = frameLength / 1000;
  var endClock = world.now + CLOCKS_PER_SECOND * secondsElapsed;
  var e = world.getNextEvent();
  // Stop if there are no more events to process, or we've moved the game clock far enough ahead
  // to match the amount of wall-time elapsed since the last frame,
  // or (worst case) we're out of time for this frame.
  while (e && e.time <= endClock && Date.now() <= endTimeMs) {
    world.processNextEvent();
    if (e.type == WorldEvent.TYPE_HIT) {
      var b0 = world.getBodyByPathId(e.pathId0);
      var b1 = world.getBodyByPathId(e.pathId1);
      if (b0 && b1) {
        resolver.resolveHit(e.time, e.collisionVec, b0, b1);
        var s0 = world.spirits[b0.spiritId];
        if (s0) s0.onHit(world, b0, b1, e);
        var s1 = world.spirits[b1.spiritId];
        if (s1) s1.onHit(world, b1, b0, e);
      }
    }
    e = world.getNextEvent();
  }
  if (!e || e.time > endClock) {
    world.now = endClock;
  }
}

function readPlayerPos() {
  playerBody.getPosAtTime(world.now, playerPos);
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Center the view on the player.
  readPlayerPos();
  viewTranslation[0] = -playerPos.x - 0.25 - playerBody.vel.x / 10;
  viewTranslation[1] = -playerPos.y - 0.25 - playerBody.vel.y / 10;
  gl.uniform3fv(uViewTranslation, viewTranslation);

  // Remember the player's position, for tweaking the colors.
  array3[0] = playerPos.x;
  array3[1] = playerPos.y;
  array3[2] = 0;
  gl.uniform3fv(uPlayerPos, array3);

  // Scale the view to encompass a fixed-size square around the player's position.
  var edgeLength = Math.min(canvas.width, canvas.height);
  viewScale[0] = ZOOM * edgeLength / canvas.width;
  viewScale[1] = ZOOM * edgeLength / canvas.height;
  gl.uniform3fv(uViewScale, viewScale);
  gl.uniform3fv(uPlayerPos, [playerPos.x, playerPos.y, 0]);

  // Draw the whole background.
  // All the vertex data is already in the program, in bgColorBuff and bgPosBuff.
  // Since the map is already in world-coordinates and world-colors,
  // set all the model-to-world uniforms to do nothing.
  gl.uniform3fv(uModelScale, IDENTITY_3);
  gl.uniform3fv(uModelTranslation, ZERO_3);
  gl.uniform3fv(uModelColor, IDENTITY_3);
  drawTriangles(gl, bgPosBuff, bgColorBuff, bgTriangleCount);

  // foreground
  for (var id in world.bodies) {
    var b = world.bodies[id];
    if (b && b.mass != Infinity) {
      drawBody(b);
    }
  }
}

function drawBody(b) {
  b.getPosAtTime(world.now, bodyPos);
  array3[0] = bodyPos.x;
  array3[1] = bodyPos.y;
  array3[2] = 0;
  gl.uniform3fv(uModelTranslation, array3);

  if (b.id == playerSpirit.bodyId) {
    gl.uniform3fv(uModelColor, PLAYER_COLOR_3);
  } else if (b.id == raySpirit.bodyId) {
    gl.uniform3fv(uModelColor, RAY_SPIRIT_COLOR_3);
  } else if (world.spirits[world.bodies[b.id].spiritId] instanceof BulletSpirit) {
    gl.uniform3fv(uModelColor, BULLET_COLOR_3);
  } else {
    gl.uniform3fv(uModelColor, OTHER_COLOR_3);
  }

  if (b.shape === Body.Shape.RECT) {
    array3[0] = b.rectRad.x;
    array3[1] = b.rectRad.y;
    array3[2] = 1;
    gl.uniform3fv(uModelScale, array3);

    drawTriangles(gl, rectPosBuff, rectColorBuff, 2);

  } else if (b.shape === Body.Shape.CIRCLE) {
    array3[0] = b.rad;
    array3[1] = b.rad;
    array3[2] = 1;
    gl.uniform3fv(uModelScale, array3);

    drawTriangleFan(gl, circlePosBuffs[CIRCLE_CORNERS], circleColorBuffs[CIRCLE_CORNERS], CIRCLE_CORNERS);
  }
}

function drawTriangles(gl, positionBuff, colorBuff, triangleCount) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, triangleCount * 3);
}

function drawTriangleFan(gl, positionBuff, colorBuff, cornerCount) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuff);
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, cornerCount + 2);
}

function createStaticGlBuff(values) {
  var buff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
  return buff;
}

function initWorld() {
  world = new World();
  resolver = new HitResolver();

  initMapAndBackgroundVertexes();
  initModelVertexes();

  initPlayer();
  initRaySpirit();
}

/**
 * Adds wall bodies and TestSpirit bodies to the world,
 * and sends the wall rect vertexes to the GL program,
 * caching the buffer locations in bgPosBuff and bgColorBuff.
 */
function initMapAndBackgroundVertexes() {
  var bgPositions = [];
  var bgColors = [];
  bgTriangleCount = 0;
  var red, green, blue;
  var v = new Vec2d();
  var sqrt = Math.sqrt(OBJ_COUNT);
  for (var x = -sqrt/2; x < sqrt/2; x++) {
    for (var y = -sqrt/2; y < sqrt/2; y++) {
      var b = Body.alloc();
      v.setXY(x * SPACING + Math.random(), y * SPACING + Math.random());
      b.setPosAtTime(v, 1);
      if (Math.random() < RECT_CHANCE) {
        // Stationary wall
        b.shape = Body.Shape.RECT;
        b.rectRad.setXY(
                (0.3 + Math.random()) * SPACING * 0.3,
                (0.3 + Math.random()) * SPACING * 0.3);
        b.mass = Infinity;
        b.pathDurationMax = Infinity;
        world.addBody(b);

        // Cache background vertex info
        red = Math.random() / 3;
        green = Math.random() / 3;
        blue = 1 - Math.random() / 3;
        addRect(bgPositions, bgColors, v.x, v.y, 0, b.rectRad.x, b.rectRad.y, red, green, blue);
        bgTriangleCount += 2;

      } else {
        // TestSpirit sprite.
        // (It's silly to create these during map-initialization, but oh well.)
        v.setXY(Math.random() - 0.5, Math.random() - 0.5);
        b.setVelAtTime(v, 1);
        b.shape = Body.Shape.CIRCLE;
        b.rad = 2 + Math.random() * 3;
        b.mass = Math.PI * b.rad * b.rad;
        b.pathDurationMax = TestSpirit.TIMEOUT;// * 2;
        var bodyId = world.addBody(b);

        var spirit = new TestSpirit();
        var spiritId = world.addSpirit(spirit);
        spirit.bodyId = bodyId;
        b.spiritId = spiritId;
        world.addTimeout(TestSpirit.TIMEOUT, spiritId, null);
      }
    }
  }

  // Send the arrays to the GL program, and cache the locations of those buffers for later.
  bgPosBuff = createStaticGlBuff(bgPositions);
  bgColorBuff = createStaticGlBuff(bgColors);
}

function initModelVertexes() {
  // template for rectangles
  var vertPositions = [];
  var vertColors = [];
  addRect(vertPositions, vertColors,
      0, 0, -1, // x y z
      1, 1, // rx ry
      1, 1, 1); // r g b
  rectPosBuff = createStaticGlBuff(vertPositions);
  rectColorBuff = createStaticGlBuff(vertColors);

  // template for circles
  vertPositions.length = 0;
  vertColors.length = 0;
  addCircle(vertPositions, vertColors,
      0, 0, -1, // x y z
      1, // radius
      CIRCLE_CORNERS,
      1, 1, 1); // r g b
  circlePosBuffs[CIRCLE_CORNERS] = createStaticGlBuff(vertPositions);
  circleColorBuffs[CIRCLE_CORNERS] = createStaticGlBuff(vertColors);
}

/**
 * Appends new vertex values to the "vertPositionsOut" and "vertColorsOut" arrays,
 * for a rectangle with the specified position, size, and color. The new vertexes
 * will form two triangles.
 * @param {Array} vertPositionsOut  output array that accumulates position values
 * @param {Array} vertColorsOut  output array that accumulates color values
 * @param {number} px  x positon of the center of the rectangle
 * @param {number} py  y positon of the center of the rectangle
 * @param {number} pz  z positon of the center of the rectangle
 * @param {number} rx  x-radius of the rectangle; half the width
 * @param {number} ry  y-radius of the rectangle; half the height
 * @param {number} r  red color component, 0-1
 * @param {number} g  green color component, 0-1
 * @param {number} b  blue color component, 0-1
 * @return the number of vertexes added. Always 6 for a rectangle.
 */
function addRect(vertPositionsOut, vertColorsOut, px, py, pz, rx, ry, r, g, b) {
  // Two triangles form a square.
  vertPositionsOut.push(
          px-rx, py-ry, pz,
          px-rx, py+ry, pz,
          px+rx, py+ry, pz,

          px+rx, py+ry, pz,
          px+rx, py-ry, pz,
          px-rx, py-ry, pz);
  for (var i = 0; i < 6; i++) {
    vertColorsOut.push(r, g, b, 1);
  }
  return 6;
}

/**
 * Appends new vertex values to the "vertPositionsOut" and "vertColorsOut" arrays,
 * for a circle with the specified position, size, and color.
 * THe new vertexes will form a triangle fan.
 * @param {Array} vertPositionsOut  output array that accumulates position values
 * @param {Array} vertColorsOut  output array that accumulates color values
 * @param {number} px  x positon of the center of the rectangle
 * @param {number} py  y positon of the center of the rectangle
 * @param {number} pz  z positon of the center of the rectangle
 * @param {number} rad  radius of the circle
 * @param {number} corners  Number of points around the circle to draw.
 *    Six would make a hexagon, eight would be a hexagon, etc. There will be a
 *    higher number of output vertexes than "corners", so pat attantion to the
 *    return value.
 * @param {number} r  red color component, 0-1
 * @param {number} g  green color component, 0-1
 * @param {number} b  blue color component, 0-1
 * @return the number of vertexes actually added
 */
function addCircle(vertPositionsOut, vertColorsOut, px, py, pz, rad, corners, r, g, b) {
  vertPositionsOut.push(px, py, pz);
  vertColorsOut.push(r, g, b, 1);
  for (var i = 0; i <= corners; i++) {
    vertPositionsOut.push(
        rad * Math.sin(2 * Math.PI * i / corners),
        rad * Math.cos(2 * Math.PI * i / corners),
        pz);
    vertColorsOut.push(r, g, b, 1);
  }
  return corners + 2;
}

function initPlayer() {
  var v = new Vec2d();
  var b = Body.alloc();
  v.setXY(-Math.sqrt(OBJ_COUNT)/2 * SPACING - 50, 0);
  b.setPosAtTime(v, 1);
  b.shape = Body.Shape.CIRCLE;
  b.rad = 3.5;
  b.mass = Math.PI * b.rad * b.rad;
  b.pathDurationMax = PlayerSpirit.TIMEOUT;
  var bodyId = world.addBody(b);
  playerBody = b;
  var spirit = new PlayerSpirit();
  var spiritId = world.addSpirit(spirit);
  spirit.bodyId = bodyId;
  playerSpirit = spirit;
  b.spiritId = spiritId;
  world.addTimeout(PlayerSpirit.TIMEOUT, spiritId, null);

  var aimStick = (new MultiStick())
      .addStick((new KeyStick())
          .setUpRightDownLeftByName(Key.Name.UP, Key.Name.RIGHT, Key.Name.DOWN, Key.Name.LEFT)
          .startListening())
      .addStick((new KeyStick())
          .setUpRightDownLeftByName('i', 'l', 'k', 'j')
          .startListening())
      .addStick((new TouchStick())
          .setStartZoneFunction(function(x, y) {
            return x > canvas.width / 2;
          })
          .setRadius(10)
          .startListening())
      .addStick((new PointerLockStick())
          .setRadius(20)
          .setCanvas(canvas)
          .startListening());

  var moveStick = (new MultiStick())
      .addStick((new KeyStick())
          .setUpRightDownLeftByName('w', 'd', 's', 'a')
          .startListening())
      .addStick((new TouchStick())
          .setStartZoneFunction(function(x, y) {
            return x <= canvas.width / 2;
          })
          .setRadius(20)
          .startListening());

  playerSpirit.setAimStick(aimStick);
  playerSpirit.setMoveStick(moveStick);
}

function initRaySpirit() {
  var v = new Vec2d();
  var b = Body.alloc();
  v.setXY(Math.sqrt(OBJ_COUNT)/2 * SPACING + 50, 0);
  b.setPosAtTime(v, 1);
  b.shape = Body.Shape.CIRCLE;
  b.rad = 7;
  b.mass = Math.PI * b.rad * b.rad;
  b.pathDurationMax = RaySpirit.TIMEOUT;
  var bodyId = world.addBody(b);
  var spirit = new RaySpirit();
  var spiritId = world.addSpirit(spirit);
  spirit.bodyId = bodyId;
  raySpirit = spirit;
  b.spiritId = spiritId;
  world.addTimeout(RaySpirit.TIMEOUT, spiritId, null);
}


// -------------------- END OF FILE ---------------------
