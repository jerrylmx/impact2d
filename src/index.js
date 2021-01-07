import Engine from "./engine";
import Circle from "./shapes/circle"
import Polygon from "./shapes/polygon"
import Rect from "./shapes/rectangle"
import Hexagon from "./shapes/hexagon"
import Util from "./libs/util"
import RegPoly from "./shapes/regpoly";
import ForceField from "./forceField";

var Shapes = {
  Circle: Circle,
  Polygon: Polygon,
  Rect: Rect,
  Hexagon: Hexagon,
  RegPoly: RegPoly,
}

export {Engine, Shapes, Util, ForceField}