import { Entity, Player, system, world } from "@minecraft/server";
import { random, hasItem } from "../util";
import { MinecraftEffectTypes } from "../lib/mojang-effect";

// Nullbrainが死んだときのイベント
world.afterEvents.entityDie.subscribe((edae) => {
    const { damageSource, deadEntity } = edae;
    if (deadEntity.typeId === "ldns:nullbrain") nullbraindievent(damageSource.damagingEntity, deadEntity);
});

// Nullbrainが攻撃された時のイベント
world.afterEvents.entityHurt.subscribe((eh) => {
    const { damage, damageSource, hurtEntity } = eh;
    if (hurtEntity.typeId === "ldns:nullbrain") nullbrainhurtevent(damage, damageSource.damagingEntity, hurtEntity);
});

/**
 * @param {Entity} damagingEntity 
 * @param {Entity} deadEntity 
 */
async function nullbraindievent(damagingEntity, deadEntity) {
    if (!(damagingEntity instanceof Player)) return;
    // 1/66の確立
    const rand = random(0, 66);
    // ペンダントを持っているときは無効
    const items = hasItem(damagingEntity, 'ldns:pendant_of_twilight');
    if (items <= 0) {
        try {
            // 値を事前に設定
            const entitylocation = deadEntity.location;
            const dimensions = deadEntity.dimension;
            // randが2以下の時は爆発(1)
            if (rand <= 2) {
                deadEntity.remove();
                dimensions.createExplosion(entitylocation, 1.666);
            }
            // randが60以上の時は攻撃した自身にエフェクトがつく(2)
            else if (rand >= 60) damagingEntity.addEffect(MinecraftEffectTypes.Weakness, 20 * 13, { amplifier: 255 });
            // randが6の時は(1)(2)両方起こる
            else if (rand === 6) {
                damagingEntity.addEffect(MinecraftEffectTypes.Weakness, 20 * 13, { amplifier: 255 });
                deadEntity.remove();
                dimensions.createExplosion(entitylocation, 1.666);
            }
        } catch (error) {
            return;
        }
    }
}

/**
 * @param {number} damage
 * @param {Entity} damagingEntity 
 * @param {Entity} hurtEntity 
 */
async function nullbrainhurtevent(damage, damagingEntity, hurtEntity) {
    if (!(damagingEntity instanceof Player)) return;
    // 1/66の確立
    const rand = random(0, 66);
    const rand2 = random(0, 1333);
    // ペンダントを持っているときは無効
    const items = hasItem(damagingEntity, 'ldns:pendant_of_twilight');
    if (items <= 0) {
        // 与えたダメージが4以下のとき
        if (damage <= 4) {
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
            } catch (error) {
                return;
            }
        }
    }
    // rand2が8の場合
    if (rand2 === 8) {
        // ノイズを出す
        damagingEntity.playSound("ldns.pp_spawn");
        damagingEntity.onScreenDisplay.setTitle("PPYYS");
    }
}

// 縺薙＞縺､縺ｯ縺ｪ繧薙↑繧薙□窶ｦ