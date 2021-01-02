import Util from "../libs/util";
import Pair from "../pair";

export default class Collision {
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
    return Util.distSq(body1, body2) <= Math.pow(body1.getBound()+body2.getBound(), 2);
  }

  static integrateOmega(body1, body2, counts) {
    if (!body1.static) {
      body1.v = Util.vAdd(body1.v, Util.vMul(body1.a, 1/counts));
      body1.v1 = Util.vAdd(body1.v1, Util.vMul(body1.a, 1/counts));
      body1.omega += (body1.alpha/counts);
      body1.omega = Util.round(body1.omega);
      body1.o1 += (body1.alpha/counts);
      body1.alpha = 0;
      body1.a = {x: 0, y: 0}
      // body1.o1 += (body1.alpha/counts);
      // body1.alpha = 0;
      // body1.a = {x: 0, y: 0}

    }
    if (!body2.static) {
      body2.v = Util.vAdd(body2.v, Util.vMul(body2.a, 1/counts));
      body2.v1 = Util.vAdd(body2.v1, Util.vMul(body2.a, 1/counts));
      body2.omega += (body2.alpha/counts);
      body2.omega = Util.round(body2.omega);
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
    let r1 = Util.vSub(contact, c1);
    let r2 = Util.vSub(contact, c2);
    let rv = Util.vSum([body2.v, Util.svCross(body2.omega,r2), Util.vNeg(body1.v), Util.vNeg(Util.svCross(body1.omega,r1))]);
    let vn = Util.dot(rv, n1);
    if(vn > 0) return false;
    let e = Math.min(body1.restitution, body2.restitution);
    let j = -(1 + e) * vn;
    j /= body1.mi + body2.mi + Math.pow(Util.vCross(r1, n1),2)/body1.inertia + Math.pow(Util.vCross(r2, n1),2)/body2.inertia;

    // Apply impulse
    let impulse = Util.vMul(n1, j);

    if (!body2.isShadow && !body1.static) {
      body1.a = Util.vSub(body1.a, Util.vMul(impulse, body1.mi));
    }
    if (!body1.isShadow && !body2.static) {
      body2.a = Util.vAdd(body2.a, Util.vMul(impulse, body2.mi));
    }
    // if (!body1.static) body1.omega -= (1/body1.inertia) * Util.vCross(r1, impulse);
    // if (!body2.static) body2.omega += (1/body2.inertia) * Util.vCross(r2, impulse);
    if (!body1.static && !body2.isShadow) body1.alpha -= (1/body1.inertia) * Util.vCross(r1, impulse);
    if (!body2.static && !body1.isShadow) body2.alpha += (1/body2.inertia) * Util.vCross(r2, impulse);
    body1.contacts.push(contact);
    body2.contacts.push(contact);

    let v1Tmp = Util.vAdd(body1.v, body1.a);
    let v2Tmp = Util.vAdd(body2.v, body2.a);

    rv = Util.vSum([v2Tmp, Util.svCross(body2.omega,r2), Util.vNeg(v1Tmp), Util.vNeg(Util.svCross(body1.omega,r1))]);
    // // Solve for the tangent vector
    let tangent = Util.vSub(rv, Util.vMul(n1, Util.dot(rv, n1)));
    tangent = Util.normalize(tangent)

    // // Solve for magnitude to apply along the friction vector
    let jt = -1*Util.dot(rv, tangent);
    jt = jt / (body1.mi + body2.mi)


    let mu = Math.sqrt(Math.pow(body1.staticFriction,2) + Math.pow(body2.staticFriction, 2));

    // Clamp magnitude of friction and create impulse vector
    let frictionImpulse;
    if(Math.abs(jt) < j * mu) {
      frictionImpulse = Util.vMul(tangent, jt);
    } else {
      let dynamicFriction = Math.sqrt(Math.pow(body1.dynamicFriction,2) + Math.pow(body2.dynamicFriction, 2));
      frictionImpulse = Util.vMul(tangent, -j*dynamicFriction);
    }

    if (!body2.isShadow && !body1.static)  body1.a = Util.vSub(body1.a, Util.vMul(frictionImpulse, body1.mi));
    if (!body1.isShadow && !body2.static)  body2.a = Util.vAdd(body2.a, Util.vMul(frictionImpulse, body2.mi));
    return true;
  }

  static resolvePenatration(body1, body2, pen, n1, p=0.6, slop=0.01, delta) {
    if (body1.isShadow && body2.isShadow) return;
    if (body1.static && !body2.static || body2.static && !body1.static) {
      p = 0.8;
      slop=0.01;
    }
    let mag = (Math.max(pen - slop, 0.0)/(body1.mi + body2.mi))*p;
    // let mag = Math.max(pen - slop, 0.0)*p;
    let correction = Util.vMul(n1, mag);
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
      pts = Util.polyPolyIntersect(vertices1, vertices2);
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
    pts = Util.polyPolyIntersect(vertices1, vertices2);
    if (pts.length < 2) return;

    // let exactPts = Collision.searchImpact(body1, body2, delta);
    // pts = exactPts.length >= 2? exactPts : pts;


    body1.c.add(body2.id);
    body2.c.add(body1.id);
    let axis = Util.normalize(Util.vSub({x: body1.x, y: body1.y}, {x: body2.x, y: body2.y}));
    let l; //= Util.vSub(pts[0], pts[pts.length-1]);

    let minLoss = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        let face = Util.normalize(Util.vSub(pts[i], pts[j]));
        let score = Math.abs(Util.dot(axis, face));
        if (score < minLoss) {
          minLoss = score;
          l = Util.vSub(pts[i], pts[j]);
        }
      }
    }
    let n1 = Util.vRound(Util.normalize(Util.vOrth(l)[0]));

    let c = Util.vSub(body2, body1);
    if (Util.dot(c, n1) < 0) {
      n1 = Util.vNeg(n1);
    }

    pts.forEach((contact) => {
      Collision.markBody(body1);
      Collision.markBody(body2);
      let res = Collision.resolveImpact(body1, body2, n1, contact);
      if (!res) return;
    });

    Collision.integrateOmega(body1, body2, pts.length);

    // Pen
    let oneInTwo = [pts[0]];
    let twoInOne = [pts[0]];
    let faces1 = Util.getFaces(vertices1);
    let faces2 = Util.getFaces(vertices2);
    vertices1.forEach((v1) => {
      if (Util.isInPolygon(faces2, v1)) oneInTwo.push(v1);
    });
    vertices2.forEach((v2) => {
      if (Util.isInPolygon(faces1, v2)) twoInOne.push(v2);
    });

    let tangent = Util.getLineImplicit(pts[0], pts[pts.length-1]);
    let pen1 = Math.max(...oneInTwo.map(pt => Util.pointLineDist(tangent, pt)));
    let pen2 = Math.max(...twoInOne.map(pt => Util.pointLineDist(tangent, pt)));
    Collision.resolvePenatration(body1, body2, pen1+pen2, n1, 0.8, 0.01, delta);

    return new Pair({
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
      let distToCircle = Util.dist(v0, cCenter);
      if (distToCircle < bodyC.r) {
        inCircle.push(v0);
        corner = true;
      }
      pts = [...pts, ...Util.circleLineSegIntersect(bodyC.x, bodyC.y, bodyC.r, v0, v1)];
    }

    if (pts.length < 2) return;

    bodyC.c.add(bodyP.id);
    bodyP.c.add(bodyC.id);
    let mid = Util.vMid(...pts);
    let n1 = Util.normalize(Util.vSub(mid, bodyC));

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
      let tangent = Util.getLineImplicit(...pts);
      let pen1 = Math.max(...inCircle.map(pt => Util.pointLineDist(tangent, pt)));
      let pen2 = bodyC.r - Util.dist(mid, cCenter);
      pen = pen1 + pen2
    } else {
      let tip = Util.circleLineIntersect(bodyC.x, bodyC.y, bodyC.r, cCenter, mid);
      let dist1 = Util.dist(tip[0], mid);
      let dist2 = Util.dist(tip[1], mid);
      pen = Math.min(dist1, dist2);
    }
    Collision.resolvePenatration(bodyC, bodyP, pen, n1, 0.6, 0.01, delta);

    return new Pair({
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
    let pts = Util.intersectTwoCircles(body1.x, body1.y, body1.r, body2.x, body2.y, body2.r);

    if (pts.length != 2) return;
    if (pts[0].x === pts[1].x && pts[0].y === pts[1].y) return null;
    let n1 = Util.normalize(Util.vSub(body2, body1));

    pts.forEach((contact) => {
      Collision.markBody(body1);
      Collision.markBody(body2);
      let res = Collision.resolveImpact(body1, body2, n1, contact);
      if (!res) return;
    });

    Collision.integrateOmega(body1, body2, pts.length);

    // Pen
    let dist = Util.dist(body1, body2);
    let depth = body1.r + body2.r - dist;
    Collision.resolvePenatration(body1, body2, depth, n1, 0.6, 0.01, delta);

    return new Pair({
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