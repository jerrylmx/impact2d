import Util from "./libs/util";

// Implementation of a quad tree for efficient spacial search
export default class Grid {
  constructor(cfg) {
    this.scale = cfg.scale || 5000;
    this.level = cfg.level || 0;
    this.items = [];
    this.payload = null;
    this.boundary = cfg.boundary || [0, this.scale, 0, this.scale];
  }

  fill(max) {
    if (this.level === max) {
      this.payload = [];
      return;
    }
    let cfg = {
      scale: this.scale,
      level: this.level + 1
    }
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    let w = (this.boundary[1] - this.boundary[0])/2;
    this.items = [
      new Grid({...cfg, boundary: [ox, ox+w, oy, oy+w]}),
      new Grid({...cfg, boundary: [ox+w, ox+2*w, oy, oy+w]}),
      new Grid({...cfg, boundary: [ox, ox+w, oy+w, oy+2*w]}),
      new Grid({...cfg, boundary: [ox+w, ox+2*w, oy+w, oy+2*w]})
    ];
    this.items.forEach((item) => {
      item.fill(max);
    });
  }

  push(entity) {
    if (this.isLeaf()) {
      this.payload.push(entity);
      return;
    }
    if (!this.isIn(entity)) {
      throw 'Entity out of bound'
    }
    let ind = this.findSlot(entity);
    this.items[ind].push(entity);
  }

  pop(entity) {
    if (this.isLeaf()) {
      let a = this.payload.length;
      this.payload = this.payload.filter(e => e.id !== entity.id);
      let b = this.payload.length;
      if (a === b) {
        console.log('no')
      }
      return;
    }
    if (!this.isIn(entity)) {
      throw 'Entity out of bound'
    }
    let ind = this.findSlot(entity);
    this.items[ind].pop(entity);
  }

  update(eOrg, e) {
    this.pop(eOrg);
    this.push(e);
    e.dirty = false;
  }

  search(x, y, id) {
    if (!Util.isBetween(x, this.boundary[0], this.boundary[1]) || !Util.isBetween(y, this.boundary[2], this.boundary[3])) {
      throw 'Entity out of bound'
    }
    if (this.isLeaf()) {
      return this.payload.find(e => e.id === id);
    } else {
      let ind = this.findSlot({x: x, y: y});
      return this.items[ind].search(x, y, id);
    }
  }

  searchGrid(x, y) {
    if (!this.isIn({x: x, y: y})) {
      throw 'Entity out of bound'
    }
    if (this.isLeaf()) {
      return this.payload.find(e => e.id === id);
    } else {
      let ind = this.findSlot({x: x, y: y});
      return this.items[ind].search(x, y, id);
    }
  }

  getWidth() {
    return this.boundary[1] - this.boundary[0];
  }

  getCenter() {
    return {
      x: (this.boundary[0] + this.boundary[1]) / 2,
      y: (this.boundary[2] + this.boundary[3]) / 2,
    }
  }

  getPayload() {
    if (this.isLeaf()) {
      return this.payload;
    } else {
      let load1 = this.items[0].getPayload();
      let load2 = this.items[1].getPayload();
      let load3 = this.items[2].getPayload();
      let load4 = this.items[3].getPayload();
      return [
        ...load1,
        ...load2,
        ...load3,
        ...load4,
      ]
    }
  }

  isLeaf() {
    return Array.isArray(this.payload);
  }

  isIn(entity) {
    return entity.x >= this.boundary[0] &&
      entity.x < this.boundary[1] &&
      entity.y >= this.boundary[2] &&
      entity.y < this.boundary[3]
  }

  findSlot(e) {
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    let w = (this.boundary[1] - this.boundary[0])/2;
    if (Util.isBetween(e.x, ox, ox+w) && Util.isBetween(e.y, oy, oy+w)) {
      return 0;
    } else if (Util.isBetween(e.x, ox+w, ox+2*w) && Util.isBetween(e.y, oy, oy+w)) {
      return 1;
    } else if (Util.isBetween(e.x, ox, ox+w) && Util.isBetween(e.y, oy+w, oy+2*w)){
      return 2;
    } else {
      return 3;
    }
  }

  countNodes() {
    const reducer = (acc, cur) => acc + cur.countNodes();
    return this.items.reduce(reducer, 1);
  }

  countPayloads() {
    if (this.isLeaf()) {
      return this.payload.length;
    }
    const reducer = (acc, cur) => acc + cur.countPayloads();
    return this.items.reduce(reducer, 0);
  }


  render(ctx) {
    // let c = root.getCenter();
    let w = this.getWidth();
    let ox = this.boundary[0];
    let oy = this.boundary[2];
    ctx.strokeStyle = '#00969b';
    ctx.strokeRect(ox, oy, w, w);
  }

  static findGrid(root, level, x, y) {
    if (!root.isIn({x: x, y: y})) {
      return null;
    }
    if (root.level === level) {
      return root;
    }

    // Max level reached
    if (root.isLeaf()) {
      return root;
    }
    let ind = root.findSlot({x: x, y: y});
    return Grid.findGrid(root.items[ind], level, x, y);
  }

  static findNeighbours(root, centerGrid) {
    let level = centerGrid.level;
    let c  = centerGrid.getCenter();
    let w = centerGrid.getWidth();
    let nearBy = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === j && i === 0 && j === 0) continue;
        nearBy.push(Grid.findGrid(root, level, c.x+i*w , c.y+j*w))
      }
    }
    return nearBy.filter(g => g);
  }

  /**
   * Find all payloads from center grid and neighbour grids
   *  ===========
   * | N | N | N |
   *  ===========
   * | N | C | N |
   *  ===========
   * | N | N | N |
   *  ===========
   */
  static findNeighbourPayloads(root, centerGrid) {
    let nearBy = Grid.findNeighbours(root, centerGrid);
    const reducer = (acc, cur) => {
      return [...acc, ...cur.getPayload()];
    }
    return nearBy.reduce(reducer, [...centerGrid.getPayload()]);
  }

  static findLevel(body, maxLevel, maxScale) {
    let r = body.getBound();
    if (r*2 > maxScale) {
      throw 'entity larger than world'
    }
    let res = maxLevel;
    while (res > 0) {
      if (maxScale * Math.pow(1/2, res) > r*2) {
        return res;
      }
      res--;
    }
    return res;
  }
}