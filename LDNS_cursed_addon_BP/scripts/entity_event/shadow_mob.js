import { Entity, ItemStack, Player, system, world } from "@minecraft/server";
import { random, giveItem } from "../util";

const timezoneOffset = 0;

function isEven(number) {
    return number % 2 === 0;
}

function isOdd(number) {
    return number % 2 !== 0;
}

// 影のものが倒された時のイベント
world.afterEvents.entityDie.subscribe((edae) => {
    const { damageSource, deadEntity } = edae;
    if (!(damageSource.damagingEntity instanceof Player)) return;
    // インベントリ獲得
    const { container } = damageSource.damagingEntity.getComponent("inventory");
    // 時刻獲得
    const d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (timezoneOffset * 60)) * 60 * 1000));
    // バイオーム
    // 影のものの時
    if (deadEntity.typeId === "ldns:shadow_mob_desert") {
        for (let i = 0; i < container.size; i++) {
            // アイテム獲得
            const item = container.getItem(i);
            if (!item) continue;
            // ペンダントの場合
            if (item.typeId === 'ldns:pendant_of_heat_sand') {
                if (random(0, 8) === 0) {
                    if (isEven(d.getHours())) { giveItem(damageSource.damagingEntity, "ldns:ld5987"); }
                    else if (isOdd(d.getHours())) { giveItem(damageSource.damagingEntity, "ldns:dn3895"); }
                    container.setItem(i, null);
                    break;
                }
            }
        }
    }
});
