import Util from "../libs/util";

// Generic class for a physical body
export default class Entity {
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

    // Linear velocity (Random between -5 and 5 if not provided)
    this.v = cfg.v? Object.assign({}, cfg.v) : Util.normalize({x: Math.random() - 0.5, y: Math.random() - 0.5}, 10);

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

  /**
   * Default body render if context is provided
   * @param {*} ctx
   * @param {*} debug
   */
  render(ctx, debug) {
    if (!ctx) return;
    const MARKER_W = 3;
    const MARKER_H = 5;
    let refPoints = [
      {x:-MARKER_W, y:0},
      {x:MARKER_W, y:0},
      {x:0, y:-MARKER_H},
      {x:0, y:MARKER_H},
    ]

    // Orient and position marker
    refPoints = refPoints.map((v) => Util.toWorldPosition(v, this.orientation, this.x, this.y));

    // static body (blue), sleeping body (orange)
    ctx.strokeStyle = this.static? 'blue' : this.sleep && debug? 'orange' : 'red';
    ctx.beginPath();
    ctx.moveTo(...Object.values(refPoints[0]));
    ctx.lineTo(...Object.values(refPoints[1]));
    ctx.moveTo(...Object.values(refPoints[2]));
    ctx.lineTo(...Object.values(refPoints[3]));
    ctx.stroke();

    // Mark contact points for debug
    if (debug) {
      ctx.strokeStyle = 'red';
      this.contacts.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
      });
    }
    ctx.strokeStyle = 'black';
  }
}