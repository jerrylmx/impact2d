import Util from "../libs/util";
import Entity from "./entity";

// Generic class for polygon bodies (Experimental for non-convex ones)
export default class Polygon extends Entity {
  constructor(cfg) {
    super(cfg);

    // Pass in vertices in global coordinates for convenience
    this.vertices = cfg.vertices;

    // Using mass center as its position
    let centroid = Util.getPolyCentroid(this.vertices);
    this.x = centroid.x;
    this.y = centroid.y;
    this.type = "P";

    // Assuming same density
    this.inertia = Util.getPolyInertia(this.m, this.vertices);

    // Convert vertices to local coordinates
    this.vertices.forEach((pt) => {
      pt.x -= centroid.x;
      pt.y -= centroid.y;
    });

    // 'Radius' for a polygon defined as the max distance from center to a vertex
    this.bound = Math.max(...this.vertices.map(v => Util.dist(v, {x:0, y:0})));
  }

  /**
   * Radius based broad phase check
   */
  getBound() {
    return this.bound;
  }

  /**
   * Bounding box based broad phase check
   */
  getBox() {
    let allX = this.getVerticesWorld().map(pt => pt.x);
    let allY = this.getVerticesWorld().map(pt => pt.y);
    return {
      x: [Math.min(...allX), Math.max(...allX)],
      y: [Math.min(...allY), Math.max(...allY)]
    }
  }

  getVerticesWorldBuffer() {
    return this.vertices.map((v) => Util.toWorldPosition(v, this.orientation, this.x1, this.y1));
  }

  getVerticesWorld() {
    return this.vertices.map((v) => Util.toWorldPosition(v, this.orientation, this.x, this.y));
  }

  getVerticesWorldNoRot() {
    return this.vertices.map((v) => {
      return {x: v.x + this.x, y: v.y + this.y};
    } );
  }
}