import Grid from "./grid"
import Util from "./libs/util";
import Collision from "./collision/collision";
import Sleep from "./sleep";
import ForceField from "./forceField";

export default class Engine {
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
    this.grid = new Grid({scale: cfg.scale || 500});
    this.grid.fill(cfg.lv || 6);

    // Bodies
    this.entities = {};

    // Force Fields
    this.forceFields = [];

    // Render
    this.ctx = cfg.ctx;

    // Gravity
    this.g = 0;

    // Time flow
    this.delta = cfg.delta || 0.2;

    this.timeScale = cfg.timeScale || 1;

    // Viscosity or air resistance
    this.loss = cfg.loss || 0.8;

    // Runner
    this.interval = null;

    Sleep.sleepThreshold = 20;
    Sleep.motionSleepThreshold = 150;
    Sleep.motionAwakeThreshold = 160;
  }

  /**
   * Apply force on a body
   * @param {*} e body
   * @param {*} force 2d vector force
   */
  applyForce(e, force) {
    // F = ma => a = F/m
    let dv = Util.vMul(force, e.mi);
    e.v = Util.vAdd(e.v, dv);
    Sleep.awake(e);
  }

  /**
   * Apply force on a point of a body
   * @param {*} e body
   * @param {*} force 2d vector force
   * @param {*} point a point in local coordinates
   */
  applyForceAtPoint(e, force, point) {
    this.applyForce(e, force);

    let pointWorld = Util.toWorldPosition(point, e.orientation, e.x, e.y);
    let r = {x: pointWorld.x - e.x, y: pointWorld.y - e.y};
    this.applyTorque(e, Util.vCross(r, force));
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
    Sleep.awake(e);
  }

  /**
   * Add a body
   */
  addEntity(e) {
    this.grid.push(e);
    this.entities[e.id] = e;
  }

  addForceField(field) {
    this.forceFields.push(field);
  }

  removeForceField(id) {
    this.forceFields = this.forceFields.filter(f => f.id !== id);
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
      Sleep.awake(this.entities[id]);
    }
  }

  /**
   * Forward one frame
   * @param {*} delta
   */
  tick(delta = this.delta) {
    let workload = 0;

    // Update canvas if rendering is enabled
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = 'rgba(0,150,155,0.5)';
      this.ctx.fillText(`Body Count: ${Object.keys(this.entities).length}`, 420, 100);
    }

    let toRm = [];
    let toAdd = [];
    let pairs = [];

    // Here we do update and collision handling in different loops
    for (let i = 0; i < Object.keys(this.entities).length; i++) {
      let e = this.entities[Object.keys(this.entities)[i]];
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
        if (this.g === 0) Sleep.awake(e);
        if (!e.sleep) e.v.y += this.g;

        // Force fields
        this.forceFields.forEach(f => f.applyField(e));

        // Velocities update
        e.v = Util.vRound(e.v);
        e.omega = Util.round(e.omega);
        Collision.markBody(e);
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
      Sleep.trySleep(e);
      e.c = new Set();
    }


    // Impact handling
    for (const id in this.entities) {
      let e = this.entities[id];

      // Find neighbours via tree spacial search
      let myGrid = Grid.findGrid(this.grid, Grid.findLevel(e, 6, this.cfg.scale), e.x, e.y);
      if (!myGrid) continue;
      let neighbours = Grid.findNeighbourPayloads(this.grid, myGrid);

      for (let i = 0; i < neighbours.length; i++) {
      // for (const id2 in this.entities) {
        // let n = this.entities[id2];
        let n = neighbours[i];
        if (n.id !== e.id) {
          if (e.checked.has(n.id)) continue;
          workload++;
          let pair = Collision.handle(e, n, delta);
          pair && pairs.push(pair);
          !this.refreshGrid(e) && toRm.push(e);
          !this.refreshGrid(n) && toRm.push(n);
        }
      }
      this.ctx && e.render(this.ctx, this.debug);
      e.onRender && e.onRender();
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

          if (!sleepingBody.static && movingBody.motion > Sleep.motionAwakeThreshold) {
            Sleep.awake(sleepingBody);
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