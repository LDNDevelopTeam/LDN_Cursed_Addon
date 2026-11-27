import { TimeOfDay, system, world } from '@minecraft/server';
import * as config from '../config';
import * as util from '../util';

system.runInterval(() => {
  // ワールドのプレイヤーを獲得
  const playerall = world.getPlayers();
  const playerlength = playerall.length;
  if (playerlength >= 1) {
    const time = world.getTimeOfDay();
    // 昼の場合
    if (util.random(0, config.skipNightRate - 1) === 0) {
      if (0 < time && time < TimeOfDay.Night) {
        world.setTimeOfDay(TimeOfDay.Midnight);
      }
    }
    // 夜の場合
    if (util.random(0, config.skipDayRate - 1) === 0) {
      if (TimeOfDay.Night < time) {
        world.setTimeOfDay(TimeOfDay.Day);
      }
    }
  }
}, 20 * 10);

// 譎る俣繧貞､ｧ縺帙▽縺ｫ