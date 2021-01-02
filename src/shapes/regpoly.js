import Polygon from "./polygon";
import Util from "../libs/util";

/**
 * Creates regular polygon with n sides
 */
export default class RegPoly extends Polygon {
  constructor(cfg) {
    this.sides = cfg.sides || 4;
    this.r = cfg.r || 20;
    this.x = cfg.x;
    this.y = cfg.y;

    let step = Math.PI*2/cfg.sides;
    let pt = {x: this.x, y: this.y - this.r};
    let vertices = [pt];
    for (let i = 1; i < this.sides; i++) {
      pt = Util.mRot(step, pt);
      vertices.push(pt);
    }
    cfg.vertices = vertices;
    super(cfg);
  }
}