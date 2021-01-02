import Util from './libs/util';

export default class Sleep {
  constructor() {
    Entity.sleepThreshold = 30;
    Entity.motionSleepThreshold = 40;
    Entity.motionAwakeThreshold = 80;
  }

  static trySleep(entity) {
    let speed = Util.magnitude(entity.v);
    let motion = Math.pow(speed, 2) + Math.pow(entity.omega, 2);
    let bias = 0.2;

    // matter js algorithm
    let minMotion = Math.min(entity.motion, motion),
        maxMotion = Math.max(entity.motion, motion);

    entity.motion = bias * minMotion + (1 - bias) * maxMotion;

    if (entity.motion < Sleep.calMotionThreshold(entity)) {
      entity.sleepCounter += 1;
      if (entity.sleepCounter >= 30) {
        Sleep.sleep(entity);
      }
    } else if (entity.sleepCounter > 0) {
      entity.sleepCounter -= 1;
    }
  }

  static awake(entity) {
    entity.sleep = false;
    entity.sleepCounter = 0;
  }

  static sleep(entity) {
    entity.sleep = true;
    entity.sleepCounter = 30;
    entity.v = {x: 0, y: 0};
    entity.omega = 0;
    entity.motion = 0;
  }

  static calMotionThreshold(entity) {
    let support = entity.c.size;
    return entity.sleepTreshold || Math.pow(3, support);
  }

  static calAwakeThreshold(entity) {
    return Sleep.calMotionThreshold(entity) * 1.5;
  }
}