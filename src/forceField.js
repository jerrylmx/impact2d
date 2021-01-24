import Util from "./libs/util";

// Implementation of a force field
export default class ForceField {
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