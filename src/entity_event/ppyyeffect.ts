import { Entity, Player, world } from "@minecraft/server";
import { random } from '../util';
import { LdnsEntityTypes } from "../lib/entity_types";

world.afterEvents.entityHitEntity.subscribe((e) => {
    const { damagingEntity, hitEntity } = e;
    if (damagingEntity.typeId == LdnsEntityTypes.Pp) ppdamage(hitEntity);
});

world.afterEvents.entityHurt.subscribe((e) => {
    const { damageSource, hurtEntity } = e;
    if (hurtEntity.typeId == LdnsEntityTypes.Pp || hurtEntity.typeId == LdnsEntityTypes.Yy) ppyyhurt(hurtEntity, damageSource.damagingEntity);
});

world.afterEvents.entityDie.subscribe((e) => {
    const { damageSource, deadEntity } = e;
    if (deadEntity.typeId == LdnsEntityTypes.Pp || deadEntity.typeId == LdnsEntityTypes.Yy) ppyydead(deadEntity);
});

// PPに攻撃されたとき
function ppdamage(targetPlayer: Entity) {
    if (!(targetPlayer instanceof Player)) return;
    const rand = random(0, 86);
    // PP画面
    if (rand <= 2) {
        targetPlayer.playSound("ldns.pp_spawn");
        targetPlayer.onScreenDisplay.setTitle("PPYYS");
    }
}
// エンティティが傷つけられたとき
function ppyyhurt(hurtEntity: Entity, damageSource: Entity | undefined) {
    if (!(damageSource instanceof Player)) return;
    const rand = random(0, 120);
    // PP画面
    if (hurtEntity.typeId == LdnsEntityTypes.Pp && rand < 2) {
        damageSource.playSound("ldns.pp_spawn");
        damageSource.onScreenDisplay.setTitle("PPYYS");
    }
    // YY画面
    if (hurtEntity.typeId == LdnsEntityTypes.Yy && rand <= 2) {
        damageSource.playSound("ldns.yy_spawn");
        damageSource.onScreenDisplay.setTitle("PPYYS");
    }
}

// エンティティが死亡したとき
function ppyydead(deadEntity: Entity) {
    const rand = random(0, 66);
    //値を設定
    const entitylocation = deadEntity.location;
    const dimensions = deadEntity.dimension;
    // PPDeadExplosion
    if (deadEntity.typeId == LdnsEntityTypes.Pp && rand == 0) {
        deadEntity.remove();
        dimensions.createExplosion(entitylocation, 2);
    }
    // YYDeadExplosion
    if (deadEntity.typeId == LdnsEntityTypes.Yy && rand == 0) {
        deadEntity.remove();
        dimensions.createExplosion(entitylocation, 2);
    }
}