import Polygon from "./polygon"

export default class Rect extends Polygon {
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