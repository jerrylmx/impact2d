import Util from "../libs/util"
import Polygon from "./polygon"

export default class Hexagon extends Polygon {
  constructor(cfg) {
    let sqrt3 = Math.sqrt(3);
    cfg.vertices = [
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r, y: 0}),
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r/2, y: -sqrt3*cfg.r/2}),
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r/2, y: -sqrt3*cfg.r/2}),
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r, y: 0}),
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: -cfg.r/2, y: sqrt3*cfg.r/2}),
      Util.vAdd({x:cfg.x, y:cfg.y}, {x: cfg.r/2, y: sqrt3*cfg.r/2})
    ];
    super(cfg);
    this.r = cfg.r;
  }
}