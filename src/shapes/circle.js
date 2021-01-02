import Entity from "./entity";

// Generic class for circle bodies
export default class Circle extends Entity {
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

  render(ctx, debug) {
    if (!ctx) return;
    super.render(ctx, debug);
    ctx.strokeStyle = (debug && this.sleep)? 'orange' : '#00969b';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
}