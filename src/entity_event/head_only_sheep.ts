import { Entity, Player, system, world, EntityComponentTypes } from "@minecraft/server";
import { random } from "../util";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { LdnsEntityTypes } from "../lib/entity_types";

// Nullbrainが攻撃された時のイベント
world.afterEvents.entityHurt.subscribe((eh) => {
    const { damage, damageSource, hurtEntity } = eh;
    if (hurtEntity.typeId === LdnsEntityTypes.HeadOnlySheep && hurtEntity.hasComponent(EntityComponentTypes.IsBaby)) head_only_sheep_hurtevent(damage, damageSource.damagingEntity, hurtEntity);
});

async function head_only_sheep_hurtevent(damage: number, damagingEntity: Entity | undefined, hurtEntity: Entity) {
    if (!(damagingEntity instanceof Player)) return;
    // 1/66の確立
    const rand = random(0, 66);
    try {
        // 値を事前に設定
        const entitylocation = hurtEntity.location;
        const dimensions = hurtEntity.dimension;
        // randが2以下の時は爆発(1)
        if (rand <= 2) {
            hurtEntity.remove();
            dimensions.createExplosion(entitylocation, 1.666);
        }
        // randが60以上の時は攻撃した自身にエフェクトがつく(2)
        else if (rand >= 60) damagingEntity.addEffect(MinecraftEffectTypes.Weakness, 20 * 13, { amplifier: 255 });
        // randが6の時は(1)が起きた後13秒後に(2)が起こる
        else if (rand === 6) {
            damagingEntity.addEffect(MinecraftEffectTypes.Weakness, 20 * 13, { amplifier: 255 });
            await system.waitTicks(20 * 13);
            hurtEntity.remove();
            dimensions.createExplosion(entitylocation, 1.666);
        }
        else if (rand === 7) {
            damagingEntity.teleport({ x: entitylocation.x, y: entitylocation.y + random(6, 12), z: entitylocation.z });
        }
    } catch (error) {
        return;
    }
}

// 縺薙＞縺､縺ｯ縺ｪ繧薙↑繧薙□窶ｦ