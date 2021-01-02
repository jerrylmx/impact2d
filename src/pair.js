/**
 * Collision pair
 */
export default class Pair {
  constructor(cfg) {
    this.n = cfg.n;
    this.body1 = cfg.body1;
    this.body2 = cfg.body2;
    this.contacts = cfg.contacts;
    this.pen =  cfg.pen;
  }
}