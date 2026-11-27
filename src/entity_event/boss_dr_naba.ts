import { type Entity, TimeOfDay, Player, world, EntityComponentTypes } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { random } from "../util";
import { LdnsEntityTypes } from "../lib/entity_types";

world.afterEvents.entityHurt.subscribe((e) => {
    const { damageSource, hurtEntity } = e;
    if (hurtEntity.typeId == LdnsEntityTypes.DrNaba) bossnabahurt(damageSource.damagingEntity);
});

function bossnabahurt(damagingEntity: Entity | undefined) {
    if (!(damagingEntity instanceof Player)) return;
    const rand = random(0, 78);
    // 値を事前に設定
    const entitylocation = damagingEntity.location;
    const xentity = entitylocation.x;
    const yentity = entitylocation.y;
    const zentity = entitylocation.z;
    const dimensions = damagingEntity.dimension;
    // 攻撃力低下(攻撃できなくなる)
    if (rand >= 0 && rand <= 4) {
        damagingEntity.addEffect(MinecraftEffectTypes.Weakness, 20 * 3, { amplifier: 255 });
    }
    // 砂嵐画面
    if (rand === 8) {
        damagingEntity.playSound("ldns.yy_spawn");
        const randimg = random(1,3);
        if(randimg === 1) damagingEntity.onScreenDisplay.setTitle("nabas1");
        else if(randimg === 2) damagingEntity.onScreenDisplay.setTitle("nabas2");
        else if(randimg === 3) damagingEntity.onScreenDisplay.setTitle("nabas3");
    }
    // アイテムが置き換えられる
    else if (rand === 9) {
        // インベントリ
        const container = damagingEntity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!container) return;
        for (let i = 0; i < container.size; i++) {
            // アイテムを置き換える
            container.swapItems(i, random(0, container.size - 1), container);
        }
    }
    // プレイヤーが爆発
    else if (rand === 10) {
        dimensions.createExplosion({ x: xentity, y: yentity, z: zentity }, 0.666);
    }
    // 時刻が変わる
    else if (rand === 13) {
        const time = world.getTimeOfDay();
        if (0 < time && time < TimeOfDay.Night) {
            world.setTimeOfDay(TimeOfDay.Midnight);
        }
        if (TimeOfDay.Night < time) {
            world.setTimeOfDay(TimeOfDay.Day);
        }
    }
}