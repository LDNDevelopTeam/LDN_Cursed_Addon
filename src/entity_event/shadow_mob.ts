import { Entity, ItemStack, Player, system, world } from "@minecraft/server";
import { random, giveItem } from "../util";
import { LdnsEntityTypes } from "../lib/entity_types";
import { LdnsItemTypes } from "../lib/item_types";

const timezoneOffset = 0;

function isEven(number: number) {
    return number % 2 === 0;
}

function isOdd(number: number) {
    return number % 2 !== 0;
}

// 影のものが倒された時のイベント
world.afterEvents.entityDie.subscribe((edae) => {
    const { damageSource, deadEntity } = edae;
    if (!(damageSource.damagingEntity instanceof Player)) return;
    // インベントリ獲得
    const container = damageSource.damagingEntity.getComponent("inventory")?.container;
    if (!container) return;
    // 時刻獲得
    const d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (timezoneOffset * 60)) * 60 * 1000));
    // バイオーム
    // 影のものの時
    if (deadEntity.typeId === LdnsEntityTypes.ShadowMobDesert) {
        for (let i = 0; i < container.size; i++) {
            // アイテム獲得
            const item = container.getItem(i);
            if (!item) continue;
            // ペンダントの場合
            if (item.typeId === LdnsItemTypes.PendantOfHeatSand) {
                if (random(0, 8) === 0) {
                    if (isEven(d.getHours())) { giveItem(damageSource.damagingEntity, LdnsItemTypes.Ld5987); }
                    else if (isOdd(d.getHours())) { giveItem(damageSource.damagingEntity, LdnsItemTypes.Dn3895); }
                    container.setItem(i, undefined);
                    break;
                }
            }
        }
    }
});
