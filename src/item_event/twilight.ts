import { Entity, EquipmentSlot, Player, world, EntityComponentTypes } from '@minecraft/server';
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { targetEntities } from '../lib/ldns_entity';
import { hasItem } from '../util';
import { LdnsItemTypes } from "../lib/item_types";

// エンティティに攻撃したとき
world.afterEvents.entityHitEntity.subscribe(ev => {
    const { hitEntity, damagingEntity } = ev;
    // ペンダントを持っているときに特定のldn:mobを攻撃すると攻撃力上昇がつく
    applyItemEffect(hitEntity, damagingEntity)
});

function applyItemEffect(hitEntity: Entity, damagingEntity?: Entity) {
    if (!(damagingEntity instanceof Player)) return;
    // ペンダントを持っているときのカウント
    const items = hasItem(damagingEntity, LdnsItemTypes.PendantOfTwilight);
    if (!((items >= 1) && hitEntity.typeId in targetEntities)) return;
    // mob判定？
    const conditions = targetEntities[hitEntity.typeId];
    if ('variant' in conditions) {
        const variant = hitEntity.getComponent(EntityComponentTypes.Variant)?.value;
        if (typeof conditions.variant === 'number' && conditions.variant !== variant) return;
        if (Array.isArray(conditions.variant) && (variant === undefined || !conditions.variant.includes(variant))) return;
    }
    // 敵を殴ると攻撃力上昇のエフェクト
    damagingEntity.addEffect(MinecraftEffectTypes.Strength, 10 * 20);
}

// 繧ｨ繝ｩ繝ｼ縺後ヱ繝ｯ繝ｼ縺ｫ窶ｦ