import { EntityDamageCause, world } from '@minecraft/server';

// 継続ダメージを抑える
world.afterEvents.entityHurt.subscribe(ev => {
  const { damageSource: { cause }, hurtEntity } = ev;

  if (cause === EntityDamageCause.contact) {
    hurtEntity.applyDamage(1000, { cause: EntityDamageCause.contact });
  }
});