import { Entity, Player, world } from "@minecraft/server";
import { random, hasItem } from '../util';
import { MinecraftEffectTypes } from '../lib/mojang-effect';

world.afterEvents.entityHurt.subscribe((e) => {
    const { damageSource, hurtEntity } = e;
    if (hurtEntity.typeId == "ldns:entity787") entity787hurt(hurtEntity, damageSource.damagingEntity);
});

/**
 * @param {Entity} damageSource 
 * @param {Entity} hurtEntity 
 */
// エンティティが傷つけられたとき
function entity787hurt(hurtEntity, damageSource) {
    if (!(damageSource instanceof Player)) return;
    // ペンダントを持っているときのカウント
    const items = hasItem(damageSource, 'ldns:pendant_of_twilight');
    const rand = random(0, 160);
    // 夕焼けのペンダントを持っていないときに発動
    if (items <= 0) {
        hurtEntity.triggerEvent("ldns:entity787_1_event");
        // 画面いっぱいに謎の文字とノイズ
        if (rand === 4) {
            damageSource.playSound("ldns.beep");
            damageSource.playSound("ldns.pp_spawn");
            damageSource.onScreenDisplay.setTitle("Error1Noisy");
        }
        else if (rand === 5) {
            damageSource.playSound("ldns.beep");
            damageSource.playSound("ldns.yy_spawn");
            damageSource.onScreenDisplay.setTitle("Error2Noisy");
        }
        else if (rand === 6) {
            damageSource.playSound("ldns.beep");
            damageSource.playSound("ldns.pp_spawn");
            damageSource.onScreenDisplay.setTitle("Cursed1Noisy");
        }
        else if (rand === 7) {
            damageSource.playSound("ldns.beep");
            damageSource.playSound("ldns.yy_spawn");
            damageSource.onScreenDisplay.setTitle("Cursed2Noisy");
        }
    }
    else if(items >= 1){
        hurtEntity.triggerEvent("ldns:entity787_2_event");
    }
    // 攻撃力低下(攻撃できなくなる)
    if (rand >= 8 && rand <= 12) {
        damageSource.addEffect(MinecraftEffectTypes.Weakness, 20 * 3, { amplifier: 255 });
    }
    // アイテムが置き換えられる
    else if (rand === 13) {
        // インベントリ
        const { container } = damageSource.getComponent("inventory");
        for (let i = 0; i < container.size; i++) {
            // アイテムを置き換える
            container.swapItems(i, random(0, container.size - 1), container);
        }
    }
    // 夕焼けのペンダントを持っているときに発動 Entity787がランダムに回復と強化をする
    else if ((rand >= 8 && rand <= 10) && items >= 1) {
        damageSource.playSound("firework.blast");
        hurtEntity.addEffect(MinecraftEffectTypes.HealthBoost, 20 * 5, { amplifier: 3 });
        hurtEntity.addEffect(MinecraftEffectTypes.Strength, 20 * 3, { amplifier: 2 });
    }
}