import { system, world, EntityComponentTypes } from '@minecraft/server';
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import * as util from '../util';
import * as config from '../config';

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    // nTickに1回 m分の1の確率でeffect付与
    if (util.random(0, config.randomEffectRate - 1) === 0) {
      const effectId = util.randomValue(Object.values(MinecraftEffectTypes));
      const duration = util.random(config.randomEffectDuration[0], config.randomEffectDuration[1]);
      if (effectId === MinecraftEffectTypes.InstantDamage) {
        const health = player.getComponent(EntityComponentTypes.Health);
        if (!health) continue;
        player.applyDamage(Math.round(health.currentValue / 2));
      } else {
        player.addEffect(effectId, duration*20);
      }
    }
  }
}, config.randomEffectInterval);

// 繧｢繝峨が繝ｳ縺ｫ豎壽沒縺輔ｌ窶ｦ