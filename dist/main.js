(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Impact2d"] = factory();
	else
		root["Impact2d"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/collision/collision.js":
/*!************************************!*\
  !*** ./src/collision/collision.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Collision; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/util */ "./src/libs/util.js");
/* harmony import */ var _pair__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pair */ "./src/pair.js");



class Collision {
  static handle(body1, body2, delta, exact) {
    // Broad phase handling
    // if (!Collision.boxCheck(body1, body2)) return false;
    if (!Collision.radiusCheck(body1, body2)) return false;
    if (body1.type === 'C' && body2.type === 'C') {
      return Collision.handleCC(body1, body2, delta, exact);
    } else if (body1.type === 'C' && body2.type === 'P') {
      return Collision.handleCP(body1, body2, delta, exact);
    } else if (body1.type === 'P' && body2.type === 'C') {
      return Collision.handleCP(body2, body1, delta, exact);
    } else {
      return Collision.handlePP(body2, body1, delta, exact);
    }
  }

  static boxCheck(body1, body2) {
    let box1 = body1.getBox();
    let box2 = body2.getBox();
    if(box1.x[1] < box2.x[0] || box1.x[0] > box2.x[1]) return false
    if(box1.y[1] < box2.y[0] || box1.y[0] > box2.y[1]) return false
    return true
  }

  static radiusCheck(body1, body2) {
    return _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].distSq(body1, body2) <= Math.pow(body1.getBound()+body2.getBound(), 2);
  }

  static integrateOmega(body1, body2, counts) {
    if (!body1.static) {
      body1.v = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body1.v, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(body1.a, 1/counts));
      body1.v1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body1.v1, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(body1.a, 1/counts));
      body1.omega += (body1.alpha/counts);
      body1.omega = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].round(body1.omega);
      body1.o1 += (body1.alpha/counts);
      body1.alpha = 0;
      body1.a = {x: 0, y: 0}
      // body1.o1 += (body1.alpha/counts);
      // body1.alpha = 0;
      // body1.a = {x: 0, y: 0}

    }
    if (!body2.static) {
      body2.v = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body2.v, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(body2.a, 1/counts));
      body2.v1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body2.v1, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(body2.a, 1/counts));
      body2.omega += (body2.alpha/counts);
      body2.omega = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].round(body2.omega);
      body2.o1 += (body2.alpha/counts);
      body2.alpha = 0;
      body2.a = {x: 0, y: 0}

      // body2.o1 += (body2.alpha/counts);
      // body2.alpha = 0;
      // body2.a = {x: 0, y: 0}

    }
  }

  static resolveImpact(body1, body2, n1, contact) {
    if (body1.isShadow && body2.isShadow) return false;
    let c1 = {x: body1.x, y: body1.y};
    let c2 = {x: body2.x, y: body2.y};
    let r1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(contact, c1);
    let r2 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(contact, c2);
    let rv = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSum([body2.v, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].svCross(body2.omega,r2), _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vNeg(body1.v), _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vNeg(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].svCross(body1.omega,r1))]);
    let vn = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dot(rv, n1);
    if(vn > 0) return false;
    let e = Math.min(body1.restitution, body2.restitution);
    let j = -(1 + e) * vn;
    j /= body1.mi + body2.mi + Math.pow(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vCross(r1, n1),2)/body1.inertia + Math.pow(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vCross(r2, n1),2)/body2.inertia;

    // Apply impulse
    let impulse = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(n1, j);

    if (!body2.isShadow && !body1.static) {
      body1.a = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(body1.a, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(impulse, body1.mi));
    }
    if (!body1.isShadow && !body2.static) {
      body2.a = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body2.a, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(impulse, body2.mi));
    }
    // if (!body1.static) body1.omega -= (1/body1.inertia) * Util.vCross(r1, impulse);
    // if (!body2.static) body2.omega += (1/body2.inertia) * Util.vCross(r2, impulse);
    if (!body1.static && !body2.isShadow) body1.alpha -= (1/body1.inertia) * _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vCross(r1, impulse);
    if (!body2.static && !body1.isShadow) body2.alpha += (1/body2.inertia) * _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vCross(r2, impulse);
    body1.contacts.push(contact);
    body2.contacts.push(contact);

    let v1Tmp = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body1.v, body1.a);
    let v2Tmp = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body2.v, body2.a);

    rv = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSum([v2Tmp, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].svCross(body2.omega,r2), _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vNeg(v1Tmp), _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vNeg(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].svCross(body1.omega,r1))]);
    // // Solve for the tangent vector
    let tangent = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(rv, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(n1, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dot(rv, n1)));
    tangent = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(tangent)

    // // Solve for magnitude to apply along the friction vector
    let jt = -1*_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dot(rv, tangent);
    jt = jt / (body1.mi + body2.mi)


    let mu = Math.sqrt(Math.pow(body1.staticFriction,2) + Math.pow(body2.staticFriction, 2));

    // Clamp magnitude of friction and create impulse vector
    let frictionImpulse;
    if(Math.abs(jt) < j * mu) {
      frictionImpulse = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(tangent, jt);
    } else {
      let dynamicFriction = Math.sqrt(Math.pow(body1.dynamicFriction,2) + Math.pow(body2.dynamicFriction, 2));
      frictionImpulse = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(tangent, -j*dynamicFriction);
    }

    if (!body2.isShadow && !body1.static)  body1.a = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(body1.a, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(frictionImpulse, body1.mi));
    if (!body1.isShadow && !body2.static)  body2.a = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd(body2.a, _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(frictionImpulse, body2.mi));
    return true;
  }

  static resolvePenatration(body1, body2, pen, n1, p=0.3, slop=0.05, delta) {
    let mag = (Math.max(pen - slop, 0.0)/(body1.mi + body2.mi))*p;
    // let mag = Math.max(pen - slop, 0.0)*p;
    let correction = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMul(n1, mag);
    if (mag > 0) {
      if (!body1.static && !body2.isShadow) {
        body1.x -= body1.mi * correction.x;
        body1.y -= body1.mi * correction.y;
        body1.dirty = true;
      }
      if (!body2.static && !body1.isShadow) {
        body2.x += body2.mi * correction.x;
        body2.y += body2.mi * correction.y;
        body2.dirty = true;
      }
    }
  }

  static searchImpact(body1, body2, delta) {
    let hi = 1;
    let lo = 0;
    let mid = 0;
    let maxIteration = 20;
    let i = 0;
    let pts = [];
    let res = [];

    // Stop when we can no longer find any contact points or reach max limit
    while (i < maxIteration) {
      mid = (hi+lo)/2;
      body1.x1 = body1.x - (body1.v.x*delta) * mid;
      body1.y1 = body1.y - (body1.v.y*delta) * mid;
      body2.x1 = body2.x - (body2.v.x*delta) * mid;
      body2.y1 = body2.y - (body2.v.y*delta) * mid;
      let vertices1 = body1.getVerticesWorldBuffer();
      let vertices2 = body2.getVerticesWorldBuffer();
      pts = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].polyPolyIntersect(vertices1, vertices2);
      if (pts.length >= 2) {
        res = pts;
        lo = mid;
      } else {
        hi = mid;
      }
      i++;
    }
    return res;
  }

  static handlePP(body1, body2, delta, exact) {
    if (body1.static && body2.static) return;
    if (body1.isShadow && body2.isShadow) return false;
    body1.checked.add(body2.id);
    body2.checked.add(body1.id);

    let vertices1 = body1.getVerticesWorld();
    let vertices2 = body2.getVerticesWorld();
    let pts = [];
    pts = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].polyPolyIntersect(vertices1, vertices2);
    if (pts.length < 2) return;

    body1.c.add(body2.id);
    body2.c.add(body1.id);
    let axis = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub({x: body1.x, y: body1.y}, {x: body2.x, y: body2.y}));
    let l; //= Util.vSub(pts[0], pts[pts.length-1]);
    let l0;
    let l1;

    let minLoss = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        let face = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(pts[i], pts[j]));
        let score = Math.abs(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dot(axis, face));
        if (score < minLoss) {
          minLoss = score;
          l = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(pts[i], pts[j]);
          l0 = pts[i];
          l1 = pts[j];
        }
      }
    }
    let n1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vRound(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vOrth(l)[0]));

    let c = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(body2, body1);
    if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dot(c, n1) < 0) {
      n1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vNeg(n1);
    }

    pts.forEach((contact) => {
      Collision.markBody(body1);
      Collision.markBody(body2);
      let res = Collision.resolveImpact(body1, body2, n1, contact);
      if (!res) return;
    });

    Collision.integrateOmega(body1, body2, pts.length);

    // Pen
    // let oneInTwo = [pts[0]];
    // let twoInOne = [pts[0]];
    // let faces1 = Util.getFaces(vertices1);
    // let faces2 = Util.getFaces(vertices2);
    // vertices1.forEach((v1) => {
    //   if (Util.isInPolygon(faces2, v1)) oneInTwo.push(v1);
    // });
    // vertices2.forEach((v2) => {
    //   if (Util.isInPolygon(faces1, v2)) twoInOne.push(v2);
    // });
    // let tangent = Util.getLineImplicit(l0, l1);

    let enclosedPts = [];
    let faces1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getFaces(vertices1);
    let faces2 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getFaces(vertices2);
    vertices1.forEach((v1) => {
      if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isInPolygon(faces2, v1)) enclosedPts.push(v1);
    });
    vertices2.forEach((v2) => {
      if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isInPolygon(faces1, v2)) enclosedPts.push(v2);
    });
    let refPts = pts.concat(enclosedPts);
    let up = [l0];
    let down = [l1];
    let tangent = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getLineImplicit(l0, l1);

    if (tangent.b !== 0) {
      refPts.forEach((pt) => {
        let ly = (-tangent.c - tangent.a*pt.x)/tangent.b
        pt.y > ly? up.push(pt) : down.push(pt);
      });
    } else {
      refPts.forEach((pt) => {
        let lx = -tangent.c/tangent.a;
        pt.x > lx? up.push(pt) : down.push(pt);
      });
    }


    // let pen1 = Math.max(...oneInTwo.map(pt => Util.pointLineDist(tangent, pt)));
    // let pen2 = Math.max(...twoInOne.map(pt => Util.pointLineDist(tangent, pt)));

    let pen1 = Math.max(...up.map(pt => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].pointLineDist(tangent, pt)));
    let pen2 = Math.max(...down.map(pt => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].pointLineDist(tangent, pt)));
    Collision.resolvePenatration(body1, body2, pen1+pen2, n1, 0.4, 0.05, delta);

    return new _pair__WEBPACK_IMPORTED_MODULE_1__["default"]({
      body1: body1,
      body2: body2,
      n: n1,
      pen: pen1+pen2,
      contacts: pts
    });
  }

  static handleCP(bodyC, bodyP, delta) {
    if (bodyC.static && bodyP.static) return;
    if (bodyC.isShadow && bodyP.isShadow) return false;
    bodyC.checked.add(bodyP.id);
    bodyP.checked.add(bodyC.id);

    let pts = [];
    let vertices = bodyP.getVerticesWorld();
    let cCenter = {x: bodyC.x, y: bodyC.y}
    let corner = false;
    let inCircle = [];

    for (let i = 0; i < vertices.length; i++) {
      let v0 = vertices[i];
      let v1 = i === vertices.length-1? vertices[0]:vertices[i+1];
      let distToCircle = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(v0, cCenter);
      if (distToCircle < bodyC.r) {
        inCircle.push(v0);
        corner = true;
      }
      pts = [...pts, ..._libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].circleLineSegIntersect(bodyC.x, bodyC.y, bodyC.r, v0, v1)];
    }

    if (pts.length < 2) return;

    bodyC.c.add(bodyP.id);
    bodyP.c.add(bodyC.id);
    let mid = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vMid(...pts);
    let n1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(mid, bodyC));

    pts.forEach((contact) => {
      Collision.markBody(bodyC);
      Collision.markBody(bodyP);
      let res = Collision.resolveImpact(bodyC, bodyP, n1, contact);
      if (!res) return;
    });

    Collision.integrateOmega(bodyC, bodyP, pts.length);

    // Pen
    let pen;
    if (corner) {
      inCircle.push(pts[0]);
      let tangent = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getLineImplicit(...pts);
      let pen1 = Math.max(...inCircle.map(pt => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].pointLineDist(tangent, pt)));
      let pen2 = bodyC.r - _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(mid, cCenter);
      pen = pen1 + pen2
    } else {
      let tip = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].circleLineIntersect(bodyC.x, bodyC.y, bodyC.r, cCenter, mid);
      let dist1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(tip[0], mid);
      let dist2 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(tip[1], mid);
      pen = Math.min(dist1, dist2);
    }
    Collision.resolvePenatration(bodyC, bodyP, pen, n1, 0.4, 0.05, delta);

    return new _pair__WEBPACK_IMPORTED_MODULE_1__["default"]({
      body1: bodyC,
      body2: bodyP,
      n: n1,
      pen: pen,
      contacts: pts
    });
  }

  static handleCC(body1, body2, delta) {
    if (body1.static && body2.static) return;
    if (body1.isShadow && body2.isShadow) return false;

    body1.checked.add(body2.id);
    body2.checked.add(body1.id);
    body1.c.add(body2.id);
    body2.c.add(body1.id);
    let pts = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].intersectTwoCircles(body1.x, body1.y, body1.r, body2.x, body2.y, body2.r);

    if (pts.length != 2) return;
    if (pts[0].x === pts[1].x && pts[0].y === pts[1].y) return null;
    let n1 = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize(_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vSub(body2, body1));

    pts.forEach((contact) => {
      Collision.markBody(body1);
      Collision.markBody(body2);
      let res = Collision.resolveImpact(body1, body2, n1, contact);
      if (!res) return;
    });

    Collision.integrateOmega(body1, body2, pts.length);

    // Pen
    let dist = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(body1, body2);
    let depth = body1.r + body2.r - dist;
    Collision.resolvePenatration(body1, body2, depth, n1, 0.6, 0.05, delta);

    return new _pair__WEBPACK_IMPORTED_MODULE_1__["default"]({
      body1: body1,
      body2: body2,
      n: n1,
      pen: depth,
      contacts: pts
    });
  }

  static markBody(body) {
    body.xprev = 0+body.x;
    body.yprev = 0+body.y;
  }
}

/***/ }),

/***/ "./src/engine.js":
/*!***********************!*\
  !*** ./src/engine.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Engine; });
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ "./src/grid.js");
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/util */ "./src/libs/util.js");
/* harmony import */ var _collision_collision__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./collision/collision */ "./src/collision/collision.js");
/* harmony import */ var _sleep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sleep */ "./src/sleep.js");
/* harmony import */ var _forceField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./forceField */ "./src/forceField.js");






class Engine {
  /**
   * A simple engine for simulating 2D rigid bodies
   * @param {*} cfg
   * - scale: Engine scale in pixels (500 by default)
   * - lv: Number of quadtree layers (6 by default)
   * - ctx: Canvas context
   * @param {*} debug
   */
  constructor(cfg, debug = false) {
    this.cfg = cfg;

    this.debug = debug;

    // Init quadtree
    this.grid = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"]({scale: cfg.scale || 500});
    this.grid.fill(cfg.lv || 6);

    // Bodies
    this.entities = {};

    // Force Fields
    this.forceFields = [];

    // Gravity
    this.g = 0;

    // Time flow
    this.delta = cfg.delta || 0.2;

    this.timeScale = cfg.timeScale || 1;

    // Viscosity or air resistance
    this.loss = cfg.loss || 0.8;

    // Runner
    this.interval = null;

    _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].sleepThreshold = 20;
    _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].motionSleepThreshold = 150;
    _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].motionAwakeThreshold = 160;

    this.onAdd = cfg.onAdd;
    this.onRemove = cfg.onRemove;
    this.postTick = cfg.postTick;
  }

  /**
   * Apply force on a body
   * @param {*} e body
   * @param {*} force 2d vector force
   */
  applyForce(e, force) {
    // F = ma => a = F/m
    let dv = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].vMul(force, e.mi);
    e.v = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].vAdd(e.v, dv);
    _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].awake(e);
  }

  /**
   * Apply force on a point of a body
   * @param {*} e body
   * @param {*} force 2d vector force
   * @param {*} point a point in local coordinates
   */
  applyForceAtPoint(e, force, point) {
    this.applyForce(e, force);

    let pointWorld = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].toWorldPosition(point, e.orientation, e.x, e.y);
    let r = {x: pointWorld.x - e.x, y: pointWorld.y - e.y};
    this.applyTorque(e, _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].vCross(r, force));
  }

  /**
   * Apply angular force on a body
   * @param {*} e
   * @param {*} tau
   */
  applyTorque(e, tau) {
    // T = Ia => a = T/I
    let dw = tau/e.inertia;
    e.omega += dw;
    _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].awake(e);
  }

  /**
   * Add a body
   */
  addEntity(e) {
    this.grid.push(e);
    this.entities[e.id] = e;
    this.onAdd && this.onAdd(e);
    return e;
  }

  addForceField(field) {
    this.forceFields.push(field);
  }

  removeForceField(id) {
    this.forceFields = this.forceFields.filter(f => f.id !== id);
  }

  removeAllForceFields() {
    this.forceFields = [];
  }

  /**
   * Remove a body
   */
  removeEntity(e) {
    if (e.eternal) return;
    try {
      this.grid.pop(e);
    } catch {

    } finally {
      e.onDestroy && e.onDestroy();
      delete this.entities[e.id];
    }
    this.onRemove && this.onRemove(e);
  }

  refreshGrid(e) {
    if (!e.dirty) return true;
    if (e.x > this.cfg.scale || e.x < 0 || e.y > this.cfg.scale || e.y < 0) {
      return false;
    }
    try {
      this.grid.update({id:e.id, x:e.xprev, y:e.yprev}, e);
      return true;
    } catch {
      return false;;
    }
  }

  /**
   * Remove all bodies
   */
  removeAll() {
    for(let id in this.entities) {
      this.removeEntity(this.entities[id]);
    }
    this.forceFields = [];
  }

  setGravity(g) {
    this.g = g;
    for (const id in this.entities) {
      _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].awake(this.entities[id]);
    }
  }

  /**
   * Forward one frame
   * @param {*} delta
   */
  tick(delta = this.delta) {
    let workload = 0;

    let toRm = [];
    let toAdd = [];
    let pairs = [];

    // Here we do update and collision handling in different loops
    for (let eid in this.entities) {
      let e = this.entities[eid];
      e.checked = new Set(); // Avoid duplicated collision pair resolution
      if (e.ttl !== -1) {
        e.ttl--;
        e.ttl === 0 && toRm.push(e);
      }
      // Static body
      if (!e.static) {
        // Integration
        // e.v = Util.vAdd(e.v, e.v1);
        // e.omega += e.o1;
        e.o1 = 0;
        e.v1 = {x: 0, y: 0};

        // Gravity (With workaround to support force issue)
        if (this.g === 0) _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].awake(e);
        if (!e.sleep) e.v.y += this.g;

        // Force fields
        this.forceFields.forEach(f => f.applyField(e));

        // Velocities update
        e.v = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].vRound(e.v);
        e.omega = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].round(e.omega);
        _collision_collision__WEBPACK_IMPORTED_MODULE_2__["default"].markBody(e);
        e.x += e.v.x * delta //* this.loss;
        e.y += e.v.y * delta //* this.loss;
        e.orientation += e.omega * delta //* this.loss;
        e.dirty = true;

        // Grid sync
        !this.refreshGrid(e) && toRm.push(e);
      } else {
        e.orientation += e.omega * delta; // Static body can rotate independently
        e.v.x = 0;
        e.v.y = 0;
      }
      _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].trySleep(e);
      e.c = new Set();
    }


    // Impact handling
    for (const id in this.entities) {
      let e = this.entities[id];

      // Find neighbours via tree spacial search
      let myGrid = _grid__WEBPACK_IMPORTED_MODULE_0__["default"].findGrid(this.grid, _grid__WEBPACK_IMPORTED_MODULE_0__["default"].findLevel(e, 6, this.cfg.scale), e.x, e.y);
      if (!myGrid) continue;
      let neighbours = _grid__WEBPACK_IMPORTED_MODULE_0__["default"].findNeighbourPayloads(this.grid, myGrid);

      for (let i = 0; i < neighbours.length; i++) {
      // for (const id2 in this.entities) {
        // let n = this.entities[id2];
        let n = neighbours[i];
        if (n.id !== e.id) {
          if (e.checked.has(n.id)) continue;
          workload++;
          let pair = _collision_collision__WEBPACK_IMPORTED_MODULE_2__["default"].handle(e, n, delta);
          pair && pairs.push(pair);
          !this.refreshGrid(e) && toRm.push(e);
          !this.refreshGrid(n) && toRm.push(n);
        }
      }
      this.postTick && this.postTick(e);
      e.contacts = [];
    }

    // Penatration handling
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      let body1 = pair.body1;
      let body2 = pair.body2;

      // don't wake if at least one body is static
      if ((body1.sleep && body2.sleep) || body1.static || body2.static)
          continue;

      if (body1.sleep || body2.sleep) {
          var sleepingBody = (body1.sleep && !body1.static) ? body1 : body2,
              movingBody = sleepingBody.id === body1.id ? body2 : body1;

          if (!sleepingBody.static && movingBody.motion > _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].motionAwakeThreshold) {
            _sleep__WEBPACK_IMPORTED_MODULE_3__["default"].awake(sleepingBody);
          }
      }
    }

    // Remove
    toRm.forEach(e => this.removeEntity(e));
    toAdd.forEach(e => this.addEntity(e));

    return {
      workload: workload
    }
  }

  run(gap) {
    var stamp = new Date().getTime();
    this.interval = setInterval(() => {
      let elapsed = (new Date().getTime() - stamp) * this.timeScale;
      this.tick(elapsed/1000);
      stamp = new Date().getTime();
    }, gap);
  }

  stop() {
    clearInterval(this.interval);
  }
}

/***/ }),

/***/ "./src/forceField.js":
/*!***************************!*\
  !*** ./src/forceField.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ForceField; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/util */ "./src/libs/util.js");


// Implementation of a force field
class ForceField {
  constructor(cfg) {
    this.id = cfg.id;
    this.x = cfg.x;
    this.y = cfg.y;
    this.fn = cfg.fn;
  }

  applyField(entity) {
    this.fn(entity);
  }
}

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Grid; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/util */ "./src/libs/util.js");


// Implementation of a quad tree for efficient spacial search
class Grid {
  constructor(cfg) {
    this.scale = cfg.scale || 5000;
    this.level = cfg.level || 0;
    this.items = [];
    this.payload = null;
    this.boundary = cfg.boundary || [0, this.scale, 0, this.scale];
  }

  fill(max) {
    if (this.level === max) {
      this.payload = [];
      return;
    }
    let cfg = {
      scale: this.scale,
      level: this.level + 1
    }
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    let w = (this.boundary[1] - this.boundary[0])/2;
    this.items = [
      new Grid({...cfg, boundary: [ox, ox+w, oy, oy+w]}),
      new Grid({...cfg, boundary: [ox+w, ox+2*w, oy, oy+w]}),
      new Grid({...cfg, boundary: [ox, ox+w, oy+w, oy+2*w]}),
      new Grid({...cfg, boundary: [ox+w, ox+2*w, oy+w, oy+2*w]})
    ];
    this.items.forEach((item) => {
      item.fill(max);
    });
  }

  push(entity) {
    if (this.isLeaf()) {
      this.payload.push(entity);
      return;
    }
    if (!this.isIn(entity)) {
      throw 'Entity out of bound'
    }
    let ind = this.findSlot(entity);
    this.items[ind].push(entity);
  }

  pop(entity) {
    if (this.isLeaf()) {
      let a = this.payload.length;
      this.payload = this.payload.filter(e => e.id !== entity.id);
      let b = this.payload.length;
      if (a === b) {
        console.log('no')
      }
      return;
    }
    if (!this.isIn(entity)) {
      throw 'Entity out of bound'
    }
    let ind = this.findSlot(entity);
    this.items[ind].pop(entity);
  }

  update(eOrg, e) {
    this.pop(eOrg);
    this.push(e);
    e.dirty = false;
  }

  search(x, y, id) {
    if (!_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(x, this.boundary[0], this.boundary[1]) || !_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(y, this.boundary[2], this.boundary[3])) {
      throw 'Entity out of bound'
    }
    if (this.isLeaf()) {
      return this.payload.find(e => e.id === id);
    } else {
      let ind = this.findSlot({x: x, y: y});
      return this.items[ind].search(x, y, id);
    }
  }

  searchGrid(x, y) {
    if (!this.isIn({x: x, y: y})) {
      throw 'Entity out of bound'
    }
    if (this.isLeaf()) {
      return this.payload.find(e => e.id === id);
    } else {
      let ind = this.findSlot({x: x, y: y});
      return this.items[ind].search(x, y, id);
    }
  }

  getWidth() {
    return this.boundary[1] - this.boundary[0];
  }

  getCenter() {
    return {
      x: (this.boundary[0] + this.boundary[1]) / 2,
      y: (this.boundary[2] + this.boundary[3]) / 2,
    }
  }

  getPayload() {
    if (this.isLeaf()) {
      return this.payload;
    } else {
      let load1 = this.items[0].getPayload();
      let load2 = this.items[1].getPayload();
      let load3 = this.items[2].getPayload();
      let load4 = this.items[3].getPayload();
      return [
        ...load1,
        ...load2,
        ...load3,
        ...load4,
      ]
    }
  }

  isLeaf() {
    return Array.isArray(this.payload);
  }

  isIn(entity) {
    return entity.x >= this.boundary[0] &&
      entity.x < this.boundary[1] &&
      entity.y >= this.boundary[2] &&
      entity.y < this.boundary[3]
  }

  findSlot(e) {
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    let w = (this.boundary[1] - this.boundary[0])/2;
    if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.x, ox, ox+w) && _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.y, oy, oy+w)) {
      return 0;
    } else if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.x, ox+w, ox+2*w) && _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.y, oy, oy+w)) {
      return 1;
    } else if (_libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.x, ox, ox+w) && _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].isBetween(e.y, oy+w, oy+2*w)){
      return 2;
    } else {
      return 3;
    }
  }

  countNodes() {
    const reducer = (acc, cur) => acc + cur.countNodes();
    return this.items.reduce(reducer, 1);
  }

  countPayloads() {
    if (this.isLeaf()) {
      return this.payload.length;
    }
    const reducer = (acc, cur) => acc + cur.countPayloads();
    return this.items.reduce(reducer, 0);
  }


  render(ctx) {
    // let c = root.getCenter();
    let w = this.getWidth();
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    ctx.strokeStyle = '#00969b';
    ctx.strokeRect(ox, oy, w, w);
  }

  static findGrid(root, level, x, y) {
    if (!root.isIn({x: x, y: y})) {
      return null;
    }
    if (root.level === level) {
      return root;
    }

    // Max level reached
    if (root.isLeaf()) {
      return root;
    }
    let ind = root.findSlot({x: x, y: y});
    return Grid.findGrid(root.items[ind], level, x, y);
  }

  static findNeighbours(root, centerGrid) {
    let level = centerGrid.level;
    let c  = centerGrid.getCenter();
    let w = centerGrid.getWidth();
    let nearBy = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === j && i === 0 && j === 0) continue;
        nearBy.push(Grid.findGrid(root, level, c.x+i*w , c.y+j*w))
      }
    }
    return nearBy.filter(g => g);
  }

  /**
   * Find all payloads from center grid and neighbour grids
   *  ===========
   * | N | N | N |
   *  ===========
   * | N | C | N |
   *  ===========
   * | N | N | N |
   *  ===========
   */
  static findNeighbourPayloads(root, centerGrid) {
    let nearBy = Grid.findNeighbours(root, centerGrid);
    const reducer = (acc, cur) => {
      return [...acc, ...cur.getPayload()];
    }
    return nearBy.reduce(reducer, [...centerGrid.getPayload()]);
  }

  static findLevel(body, maxLevel, maxScale) {
    let r = body.getBound();
    if (r*2 > maxScale) {
      throw 'entity larger than world'
    }
    let res = maxLevel;
    while (res > 0) {
      if (maxScale * Math.pow(1/2, res) > r*2) {
        return res;
      }
      res--;
    }
    return res;
  }
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Engine, Shapes, Util, ForceField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shapes", function() { return Shapes; });
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ "./src/engine.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return _engine__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _shapes_circle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shapes/circle */ "./src/shapes/circle.js");
/* harmony import */ var _shapes_polygon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapes/polygon */ "./src/shapes/polygon.js");
/* harmony import */ var _shapes_rectangle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shapes/rectangle */ "./src/shapes/rectangle.js");
/* harmony import */ var _shapes_hexagon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shapes/hexagon */ "./src/shapes/hexagon.js");
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./libs/util */ "./src/libs/util.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return _libs_util__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _shapes_regpoly__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shapes/regpoly */ "./src/shapes/regpoly.js");
/* harmony import */ var _forceField__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./forceField */ "./src/forceField.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ForceField", function() { return _forceField__WEBPACK_IMPORTED_MODULE_7__["default"]; });










var Shapes = {
  Circle: _shapes_circle__WEBPACK_IMPORTED_MODULE_1__["default"],
  Polygon: _shapes_polygon__WEBPACK_IMPORTED_MODULE_2__["default"],
  Rect: _shapes_rectangle__WEBPACK_IMPORTED_MODULE_3__["default"],
  Hexagon: _shapes_hexagon__WEBPACK_IMPORTED_MODULE_4__["default"],
  RegPoly: _shapes_regpoly__WEBPACK_IMPORTED_MODULE_6__["default"],
}



/***/ }),

/***/ "./src/libs/util.js":
/*!**************************!*\
  !*** ./src/libs/util.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Util; });
// General physics math lib
class Util {
  /**
   * Check if x >= i0 and x < i1
   */
  static isBetween(x, i0, i1) {
    return i0 <= x && x < i1;
  }

  /**
   * Shallow clone object
   */
  static clone(obj) {
    if (obj == null || typeof (obj) != 'object') return obj;
    let temp = new obj.constructor(obj.id);
    for (var key in obj)
        temp[key] = Util.clone(obj[key]);
    return temp;
  }

  /**
   * Normalize a vector
   */
  static normalize(v, scale = 1) {
    let norm = Math.sqrt(v.x * v.x + v.y * v.y);
    if (norm !== 0) {
        v.x = scale * v.x / norm;
        v.y = scale * v.y / norm;
        return v;
    } else {
      return {x: 0, y: 0};
    }
  }

  // Vector 2D utils
  /**
   * Compute vector length (duplicate)
   */
  static magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  /**
   * Find squared distance between two points
   */
  static distSq(bodyA, bodyB) {
    return Math.pow(bodyA.x - bodyB.x, 2) + Math.pow(bodyA.y - bodyB.y, 2);
  }

  /**
   * Find distance between two points
   */
  static dist(bodyA, bodyB) {
    return Math.sqrt(Util.distSq(bodyA, bodyB));
  }

  /**
   * Compute dot product between two vectors
   */
  static dot(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y;
  }

  /**
   * Subtract v2 from v1
   */
  static vSub(v1, v2) {
    return {x: v1.x-v2.x, y: v1.y-v2.y}
  }

  /**
   * Sum two vectors
   */
  static vAdd(v1, v2) {
    return {x: v1.x+v2.x, y: v1.y+v2.y}
  }

  /**
   * Multiply a vector by a scalar
   */
  static vMul(v, c) {
    return {x: v.x*c, y: v.y*c}
  }

  /**
   * Get vector length
   */
  static vLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  /**
   * Round a vector to 3 decimal places
   */
  static vRound(v) {
    let vx = Math.round((v.x + Number.EPSILON) * 1000) / 1000;
    let vy = Math.round((v.y + Number.EPSILON) * 1000) / 1000;
    return {x: vx, y: vy}
  }

  /**
   * Find the middle point between two vectors
   */
  static vMid(v1, v2) {
    return {x: (v1.x+v2.x)/2, y: (v1.y+v2.y)/2};
  }

  /**
   * Negate a vector
   */
  static vNeg(v) {
    return {x: -v.x, y: -v.y};
  }

  /**
   * Sum an array of vectors
   */
  static vSum(arr) {
    const reducer = (acc, cur) => {return {x: acc.x+cur.x, y: acc.y+cur.y}};
    return arr.reduce(reducer, {x: 0, y: 0});
  }

  /**
   * Find all orthogonal vectors of a vector
   */
  static vOrth(v) {
    return [
      {x: -v.y, y: v.x},
      {x: v.y, y: -v.x}
    ]
  }

  /**
   * Find reflected vector based on normal
   * @param {*} d Incoming vector
   * @param {*} n Normal vector
   */
  static reflect(d, n) {
    return Util.vSub(d, Util.vMul(n, 2 * Util.dot(d, n)));
  }

  /**
   * Sum an array of vectors (duplicate)
   */
  static sum(arr) {
    const reducer = (acc, cur) => {return {x: acc.x+cur.x, y: acc.y+cur.y}};
    return Util.normalize(arr.reduce(reducer, {x: 0, y: 0}));
  }


  // Matrix 2x2 Utils
  /**
   * Rotate a vector by theta in radians
   */
  static mRot(theta, v) {
    let mat = [
      [Math.cos(theta), -Math.sin(theta)],
      [Math.sin(theta), Math.cos(theta)]
    ]
    return Util.mMul(mat, v);
  }

  /**
   * Matrix-vector multiplication
   */
  static mMul(mat, v) {
    return {
      x: mat[0][0]*v.x + mat[0][1]*v.y,
      y: mat[1][0]*v.x + mat[1][1]*v.y
    }
  }

  /**
   * Round a scalar
   */
  static round(v) {
    return Math.round((v + Number.EPSILON) * 1000) / 1000;
  }

  // Equations
  /**
   * Find centroid of a polygon
   * From https://stackoverflow.com/questions/2792443/finding-the-centroid-of-a-polygon
   */
  static getPolyCentroid(vertices) {
    // return centroid;
    let centroidX = 0, centroidY = 0;
	  let det = 0, tempDet = 0;
	  let j = 0;
	  let nVertices = vertices.length;

    for (let i = 0; i < nVertices; i++) {
      // closed polygon
      if (i + 1 == nVertices) {
        j = 0;
      } else {
        j = i + 1;
      }
      // compute the determinant
      tempDet = vertices[i].x * vertices[j].y - vertices[j].x*vertices[i].y;
      det += tempDet;

      centroidX += (vertices[i].x + vertices[j].x)*tempDet;
      centroidY += (vertices[i].y + vertices[j].y)*tempDet;
    }
    // divide by the total mass of the polygon
    centroidX /= 3*det;
    centroidY /= 3*det;
    return {x: centroidX, y: centroidY};
  }

  /**
   * Get polygon inertia
   * From stackoverflow
   */
  static getPolyInertia(mass, vertices) {
    let area = 0.000001;
    let center = {x:0, y:0};
    let mmoi = 0;
    let prev = vertices.length-1;
    for (let index = 0; index < vertices.length; index++) {
        var a = vertices[prev];
        var b = vertices[index];
        var area_step = Util.vCross(a, b)/2;
        var center_step = Util.vMul(Util.vAdd(a, b), 1/3);
        var mmoi_step = area_step*(Util.dot(a, a)+Util.dot(b, b)+Util.dot(a, b))/6;

        center = Util.vMul(Util.vAdd(Util.vMul(center,area), Util.vMul(center_step,area_step)), 1/(area + area_step));
        area += area_step;
        mmoi += mmoi_step;
        prev = index;
    }
    let density = mass/area;
    mmoi *= density;
    mmoi -= mass * Util.dot(center, center);
    return mmoi
  }

  /**
   * Get line equation defined by two points
   * y = ax + b
   * x = c (Horizontal line)
   */
  static getLine(pt1, pt2) {
    pt1 = Util.vRound(pt1);
    pt2 = Util.vRound(pt2);
    let x1 = pt1.x;
    let y1 = pt1.y;
    let x2 = pt2.x;
    let y2 = pt2.y;
    if (x1 === x2) return {c: x1}
    let a = (y2 - y1) / (x2 - x1);
    return {a: a, b: y1 - a * x1};
  }

  /**
   * Get implicit line equation
   * ax + by + c = 0
   */
  static getLineImplicit(pt1, pt2) {
    let line = Util.getLine(pt1, pt2);
    return Util.toImplicitLine(line);
  }

  /**
   * Convert line equations to implicit form
   */
  static toImplicitLine(line) {
    if ('c' in line) {
      return {a: 1, b: 0, c: -line.c}
    } else {
      return {a: line.a, b: -1, c: line.b}
    }
  }

  /**
   * Find distance between line and a point
   */
  static pointLineDist(line, pt) {
    let up = Math.abs(line.a*pt.x + line.b*pt.y + line.c)
    let down = Math.sqrt(Math.pow(line.a,2)+Math.pow(line.b,2))
    return up/down;
  }

  /**
   * Check if point is on a line segment
   */
  static isInDomain(pt1, pt2, pt) {
    pt1 = Util.vRound(pt1);
    pt2 = Util.vRound(pt2);
    pt = Util.vRound(pt);
    let xlo = Math.min(pt1.x, pt2.x);
    let xhi = Math.max(pt1.x, pt2.x);
    let ylo = Math.min(pt1.y, pt2.y);
    let yhi = Math.max(pt1.y, pt2.y);
    return pt.x >= xlo && pt.x <= xhi && pt.y >= ylo && pt.y <= yhi;
  }

  /**
   * Find intersection points between line segments
   */
  static lineSegLineSegIntersect(p1, p2, p3, p4) {
    let line1 = Util.getLine(p1, p2);
    let line2 = Util.getLine(p3, p4);
    let pts = [];

    let line1a = line1.a;
    let line1b = line1.b;
    let line1c = line1.c || -1;
    let line2a = line2.a;
    let line2b = line2.b;
    let line2c = line2.c || -1;
    // Co-linear p1, p2, p3, p4 are on the same line
    if ((!Util.isUndefined(line1a) && line1a === line2a && line1b === line2b) || (line1c !== -1 && line1c === line2c)) {
      let distMap = {
        [Util.distSq(p1, p2)]: [p1, p2],
        [Util.distSq(p2, p3)]: [p2, p3],
        [Util.distSq(p3, p4)]: [p3, p4],
        [Util.distSq(p1, p3)]: [p1, p3],
        [Util.distSq(p2, p4)]: [p2, p4],
        [Util.distSq(p1, p4)]: [p1, p4]
      }
      let min = Math.min(...Object.keys(distMap));
      let max = Math.max(...Object.keys(distMap));
      if (Util.distSq(p1, p2) + Util.distSq(p3, p4) < max) {
        return [];
      }
      if (distMap[min]) {
        return distMap[min];
      } else {
        return [];
      }
    }
    if ('c' in line1) {
      pts = [{x: line1c, y: line2a*line1c+line2b}];
    } else if ('c' in line2) {
      pts = [{x: line2c, y: line1a*line2c+line1b}];
    } else {
      let X = (line2b-line1b)/(line1a-line2a);
      pts = [{x: X, y: line1a*X+line1b}];
    }

    return pts.filter((pt) => {
      return Util.isInDomain(p1, p2, pt) && Util.isInDomain(p3, p4, pt);
    });
  }

  /**
   * Find line-line intersections
   */
  static lineLineIntersect(line1, line2) {
    let line1a = line1.a;
    let line1b = line1.b;
    let line1c = line1.c || -1;
    let line2a = line2.a;
    let line2b = line2.b;
    let line2c = line2.c || -1;
    if ('c' in line1 && 'c' in line2) return [];
    if (line1a === line2a || (line1c !== -1 && line1c === line2c)) return [];
    if ('c' in line1) {
      return [{x: line1c, y: line2a*line1c+line2b}];
    } else if ('c' in line2) {
      return [{x: line2c, y: line1a*line2c+line1b}];
    } else {
      let X = (line2b-line1b)/(line1a-line2a);
      return [{x: X, y: line1a*X+line1b}];
    }
  }

  /**
   * Find intersection points between two polygons
   */
  static polyPolyIntersect(vertices1, vertices2) {
    let set = new Set();
    let tmp1 = [...vertices1, vertices1[0]];
    let tmp2 = [...vertices2, vertices2[0]];
    for (let i = 0; i < tmp1.length-1; i++) {
      let p0 = tmp1[i];
      let p1 = tmp1[i+1];
      for (let j = 0; j < tmp2.length-1; j++) {
        let p2 = tmp2[j];
        let p3 = tmp2[j+1];
        let pts = Util.lineSegLineSegIntersect(p0, p1, p2, p3);
        pts.forEach((pt) => {
          set.add(Util.round(pt.x) + ':' + Util.round(pt.y));
        });
        // if (set.size >= 2) return Array.from(set).map((s) => {
        //   let arr = s.split(':');
        //   return {x: Number(arr[0]), y: Number(arr[1])};
        // })
      }
    }
    // return Object.values(map);
    return Array.from(set).map((s) => {
      let arr = s.split(':');
      return {x: Number(arr[0]), y: Number(arr[1])};
    })
  }

  /**
   * Find circle line segment intersections
   */
  static circleLineSegIntersect(x1, y1, r1, pt1, pt2) {
    let pts = Util.circleLineIntersect(x1, y1, r1, pt1, pt2);
    let xlo = Util.round(Math.min(pt1.x, pt2.x));
    let xhi = Util.round(Math.max(pt1.x, pt2.x));
    let ylo = Util.round(Math.min(pt1.y, pt2.y));
    let yhi = Util.round(Math.max(pt1.y, pt2.y));
    return pts.filter((pt) => {
      return pt.x >= xlo && pt.x <= xhi && pt.y >= ylo && pt.y <= yhi;
    });
  }

  /**
   * Find circle line intersections
   */
  static circleLineIntersect(x1, y1, r1, pt1, pt2) {
    let line = Util.getLine(pt1, pt2);
    let A, B, C, D;
    // Non vertical case
    if ('a' in line) {
      A = 1 + Math.pow(line.a, 2);
      B = 2*(line.a*line.b-line.a*y1-x1);
      C = Math.pow(x1, 2) + Math.pow((line.b - y1), 2) - Math.pow(r1, 2);
      D = Math.pow(B, 2) - 4 * A * C;
      if (D < 0) return [];
      if (D === 0) {
        let X = -B/(2*A);
        return [{x: X, y: line.a * X + line.b}];
      }
      let X1 = (-B+Math.sqrt(D))/(2*A);
      let X2 = (-B-Math.sqrt(D))/(2*A);
      return [{x: X1, y: line.a * X1 + line.b}, {x: X2, y: line.a * X2 + line.b}];
    } else {
      A = 1;
      B = -2*y1;
      C = Math.pow(y1, 2) + Math.pow((line.c - x1), 2) - Math.pow(r1, 2);
      let D = Math.pow(B, 2) - 4 * A * C;
      if (D < 0) return [];
      if (D === 0) {
        let Y = -B/(2*A);
        return [{x: line.c, y: Y}];
      }
      let Y1 = (-B+Math.sqrt(D))/(2*A);
      let Y2 = (-B-Math.sqrt(D))/(2*A);
      return [{x: line.c, y: Y1}, {x: line.c, y: Y2}];
    }
  }

  /**
   * Circle circle intersection points
   * From stackoverflow
   */
  static intersectTwoCircles(x1,y1,r1, x2,y2,r2) {
    var centerdx = x1 - x2;
    var centerdy = y1 - y2;
    var R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) { // no intersection
      return []; // empty list of results
    }

    var R2 = R*R;
    var R4 = R2*R2;
    var a = (r1*r1 - r2*r2) / (2 * R2);
    var r2r2 = (r1*r1 - r2*r2);
    var c = Math.sqrt(2 * (r1*r1 + r2*r2) / R2 - (r2r2 * r2r2) / R4 - 1);

    var fx = (x1+x2) / 2 + a * (x2 - x1);
    var gx = c * (y2 - y1) / 2;
    var ix1 = fx + gx;
    var ix2 = fx - gx;

    var fy = (y1+y2) / 2 + a * (y2 - y1);
    var gy = c * (x1 - x2) / 2;
    var iy1 = fy + gy;
    var iy2 = fy - gy;
    return [{x: ix1, y: iy1}, {x: ix2, y:iy2}];
  }

  /**
   * Check if two points/vectors are equal
   */
  static isSamePoint(pt1, pt2) {
    return pt1.x === pt2.x && pt1.y === pt2.y;
  }

  /**
   * Check if two points are equal after rounding
   */
  static isSamePointRough(pt1, pt2) {
    return Util.round(pt1.x) === Util.round(pt2.x) && Util.round(pt1.y) === Util.round(pt2.y);
  }

  /**
   * Get faces of a polygon
   */
  static getFaces(vertices) {
    let pairs = [];
    for (let i = 0; i < vertices.length; i++) {
      let v0 = vertices[i];
      let v1 = i === vertices.length-1? vertices[0]:vertices[i+1];
      pairs.push([v0, v1]);
    }
    return pairs;
  }

  /**
   * Check if a point is inside a polygon
   */
  static isInPolygon(faces, pt) {
    let ptEnd = {x: pt.x+100000, y: pt.y};
    let count = 0;
    faces.forEach((pair) => {
      // Face implicit equation
      let intersections = Util.lineSegLineSegIntersect(...pair, pt, ptEnd);
      count += intersections.length;
      if (Util.isSamePoint(pair[0], pt) || Util.isSamePoint(pair[1], pt)) return false;
    });
    return count === 1;
  }

  /**
   * Cross product between scalar and a vector
   */
  static svCross(s, v) {
    return {x: -s*v.y, y: s*v.x};
  }

  /**
   * Cross product between vector and a scalar
   */
  static vsCross(s, v) {
    return {x: s*v.y, y: -s*v.x};
  }

  /**
   * Vector vector cross product
   */
  static vCross(v1, v2) {
    return (v1.x*v2.y) - (v1.y*v2.x);
  }

  /**
   * Find vector length
   */
  static len(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y);
  }

  /**
   * Convert a point to world coordinates
   * Origin (x,y)
   * Angle theta
   */
  static toWorldPosition(v, theta, x, y) {
    let rotated = Util.mRot(theta, v);
    return {x: Util.round(rotated.x+x), y: Util.round(rotated.y+y)};
  }

  static isUndefined(obj) {
    return typeof obj === 'undefined';
  }
}

/***/ }),

/***/ "./src/pair.js":
/*!*********************!*\
  !*** ./src/pair.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Pair; });
/**
 * Collision pair
 */
class Pair {
  constructor(cfg) {
    this.n = cfg.n;
    this.body1 = cfg.body1;
    this.body2 = cfg.body2;
    this.contacts = cfg.contacts;
    this.pen =  cfg.pen;
  }
}

/***/ }),

/***/ "./src/shapes/circle.js":
/*!******************************!*\
  !*** ./src/shapes/circle.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Circle; });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./src/shapes/entity.js");


// Generic class for circle bodies
class Circle extends _entity__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(cfg) {
    super(cfg);

    // Position
    this.x = cfg.x;
    this.y = cfg.y;

    // Radius
    this.r = cfg.r;
    this.type = "C";

    // Assuming same density
    this.inertia = this.m * Math.pow(this.getBound(),2);
  }

  /**
   * Radius based broad phase check
   */
  getBound() {
    return this.r;
  }

  /**
   * Bounding box based broad phase check
   */
  getBox() {
    return {
      x: [this.x-this.r, this.x+this.r],
      y: [this.y-this.r, this.y+this.r]
    }
  }
}

/***/ }),

/***/ "./src/shapes/entity.js":
/*!******************************!*\
  !*** ./src/shapes/entity.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Entity; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/util */ "./src/libs/util.js");


// Generic class for a physical body
class Entity {
  constructor(cfg) {
    // Id (Unique identifier)
    this.id = cfg.id;

    // Hooks
    this.onInit = cfg.onInit;
    this.onCollide = cfg.onCollide;
    this.onRender = cfg.onRender;
    this.onDestroy = cfg.onDestroy;

    // Custom data
    this.data = cfg.data;
    this.color = cfg.color;

    // Linear velocity (Random between -5 and 5 if not provided)
    this.v = cfg.v? Object.assign({}, cfg.v) : _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].normalize({x: Math.random() - 0.5, y: Math.random() - 0.5}, 10);

    // Angular velocity
    this.omega = cfg.omega || 0;

    // Mass
    this.m = cfg.m || 10;

    // Orientation
    this.orientation = cfg.orientation || 0;

    // Bounceness (Betwen 0 and 1)
    this.restitution = cfg.restitution || 0.5;

    // Inverse of mass
    this.mi = 1/this.m;

    // Linear and angular acceleration reserved for integration
    this.alpha = cfg.alpha || 0;
    this.a = cfg.a || {x: 0, y: 0};

    // Static body
    this.static = cfg.static || false;
    if (this.static) this.v = {x:0, y:0}

    // Friction
    this.staticFriction = cfg.staticFriction || 0.05;
    this.dynamicFriction = cfg.dynamicFriction || 0.1;

    // Body life expectancy
    this.ttl = cfg.ttl || -1;
    this.eternal = cfg.eternal || false;

    // Contact points
    this.contacts = [];
    // Set of bodies currently in contact
    this.c = new Set();

    // Extra fields
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.checked = new Set();

    // Sleep mechanism (Experimental)
    this.sleepTreshold = cfg.sleepTreshold || null;
    this.sleep = false;
    this.timer = 3;
    this.shadowX = this.x;
    this.shadowY = this.y;
    this.shadowC =new Set();
    this.support = 0;
    this.isShadow = cfg.isShadow || false;
    this.split = false;
    this.merge = false;
    this.dirty = cfg.dirty || false;
    this.v1 = {x: 0, y: 0};
    this.o1 = 0;
    this.cor = {x: 0, y: 0};
    this.motion = 0;
    this.sleepCounter = 0;

    this.onInit && this.onInit();
  }
}

/***/ }),

/***/ "./src/shapes/hexagon.js":
/*!*******************************!*\
  !*** ./src/shapes/hexagon.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Hexagon; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/util */ "./src/libs/util.js");
/* harmony import */ var _polygon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polygon */ "./src/shapes/polygon.js");



class Hexagon extends _polygon__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(cfg) {
    let sqrt3 = Math.sqrt(3);
    cfg.vertices = [
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r, y: 0}),
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r/2, y: -sqrt3*cfg.r/2}),
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r/2, y: -sqrt3*cfg.r/2}),
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r, y: 0}),
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r/2, y: sqrt3*cfg.r/2}),
      _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r/2, y: sqrt3*cfg.r/2})
    ];
    super(cfg);
    this.r = cfg.r;
  }
}

/***/ }),

/***/ "./src/shapes/polygon.js":
/*!*******************************!*\
  !*** ./src/shapes/polygon.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Polygon; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/util */ "./src/libs/util.js");
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity */ "./src/shapes/entity.js");



// Generic class for polygon bodies (Experimental for non-convex ones)
class Polygon extends _entity__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(cfg) {
    super(cfg);

    // Pass in vertices in global coordinates for convenience
    this.vertices = cfg.vertices;

    // Using mass center as its position
    let centroid = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getPolyCentroid(this.vertices);
    this.x = centroid.x;
    this.y = centroid.y;
    this.type = "P";

    // Assuming same density
    this.inertia = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].getPolyInertia(this.m, this.vertices);

    // Convert vertices to local coordinates
    this.vertices.forEach((pt) => {
      pt.x -= centroid.x;
      pt.y -= centroid.y;
    });

    // 'Radius' for a polygon defined as the max distance from center to a vertex
    this.bound = Math.max(...this.vertices.map(v => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].dist(v, {x:0, y:0})));
  }

  /**
   * Radius based broad phase check
   */
  getBound() {
    return this.bound;
  }

  /**
   * Bounding box based broad phase check
   */
  getBox() {
    let allX = this.getVerticesWorld().map(pt => pt.x);
    let allY = this.getVerticesWorld().map(pt => pt.y);
    return {
      x: [Math.min(...allX), Math.max(...allX)],
      y: [Math.min(...allY), Math.max(...allY)]
    }
  }

  getVerticesWorldBuffer() {
    return this.vertices.map((v) => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].toWorldPosition(v, this.orientation, this.x1, this.y1));
  }

  getVerticesWorld() {
    return this.vertices.map((v) => _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].toWorldPosition(v, this.orientation, this.x, this.y));
  }

  getVerticesWorldNoRot() {
    return this.vertices.map((v) => {
      return {x: v.x + this.x, y: v.y + this.y};
    } );
  }
}

/***/ }),

/***/ "./src/shapes/rectangle.js":
/*!*********************************!*\
  !*** ./src/shapes/rectangle.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Rect; });
/* harmony import */ var _polygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polygon */ "./src/shapes/polygon.js");


class Rect extends _polygon__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(cfg) {
    let vertices = cfg.vertices || [
      {x: cfg.x-cfg.w/2, y: cfg.y-cfg.h/2},
      {x: cfg.x+cfg.w/2, y: cfg.y-cfg.h/2},
      {x: cfg.x+cfg.w/2, y: cfg.y+cfg.h/2},
      {x: cfg.x-cfg.w/2, y: cfg.y+cfg.h/2}
    ];
    cfg.vertices = vertices;
    super(cfg);
    this.w = cfg.w;
    this.h = cfg.h;
  }
}

/***/ }),

/***/ "./src/shapes/regpoly.js":
/*!*******************************!*\
  !*** ./src/shapes/regpoly.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RegPoly; });
/* harmony import */ var _polygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polygon */ "./src/shapes/polygon.js");
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/util */ "./src/libs/util.js");



/**
 * Creates regular polygon with n sides
 */
class RegPoly extends _polygon__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(cfg) {
    // this.sides = cfg.sides || 4;
    // this.r = cfg.r || 20;
    // this.x = cfg.x;
    // this.y = cfg.y;

    let step = Math.PI*2/cfg.sides;
    let pt = {x: 0, y: 0 - cfg.r};
    let vertices = [pt];
    for (let i = 1; i < cfg.sides; i++) {
      pt = _libs_util__WEBPACK_IMPORTED_MODULE_1__["default"].mRot(step, pt);
      vertices.push(pt);
    }
    vertices = vertices.map((pt) => {
      return {x: pt.x+cfg.x, y: pt.y+cfg.y}
    })
    cfg.vertices = vertices;
    super(cfg);
  }
}

/***/ }),

/***/ "./src/sleep.js":
/*!**********************!*\
  !*** ./src/sleep.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Sleep; });
/* harmony import */ var _libs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/util */ "./src/libs/util.js");


class Sleep {
  constructor(cfg) {
    Sleep.sleepThreshold = 30;
    Sleep.motionSleepThreshold = 40;
    Sleep.motionAwakeThreshold = 80;
  }

  static trySleep(entity) {
    let speed = _libs_util__WEBPACK_IMPORTED_MODULE_0__["default"].magnitude(entity.v);
    let motion = Math.pow(speed, 2) + Math.pow(entity.omega, 2);
    let bias = 0.2;

    // matter js algorithm
    let minMotion = Math.min(entity.motion, motion),
        maxMotion = Math.max(entity.motion, motion);

    entity.motion = bias * minMotion + (1 - bias) * maxMotion;

    if (entity.motion < Sleep.motionSleepThreshold) {
      entity.sleepCounter += 1;
      if (entity.sleepCounter >= Sleep.sleepThreshold) {
        Sleep.sleep(entity);
      }
    } else if (entity.sleepCounter > 0) {
      entity.sleepCounter -= 1;
    }
  }

  static awake(entity) {
    entity.sleep = false;
    entity.sleepCounter = 0;
  }

  static sleep(entity) {
    entity.sleep = true;
    entity.sleepCounter = 30;
    entity.v = {x: 0, y: 0};
    if (!entity.static) entity.omega = 0;
    entity.motion = 0;
  }

  static calMotionThreshold(entity) {
    let support = entity.c.size;
    return entity.sleepTreshold || Math.pow(3, support);
  }

  static calAwakeThreshold(entity) {
    return Sleep.calMotionThreshold(entity) * 1.5;
  }
}

/***/ })

/******/ });
});