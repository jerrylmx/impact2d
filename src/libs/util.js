// General physics math lib
export default class Util {
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