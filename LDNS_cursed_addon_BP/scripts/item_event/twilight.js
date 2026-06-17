import { Entity, EquipmentSlot, Player, world } from '@minecraft/server';
import { MinecraftEffectTypes } from '../lib/mojang-effect';
import { targetEntities } from '../lib/ldns_entity';
import { hasItem } from '../util';

// エンティティに攻撃したとき
world.afterEvents.entityHitEntity.subscribe(ev => {
    const { hitEntity, damagingEntity } = ev;
    // ペンダントを持っているときに特定のldn:mobを攻撃すると攻撃力上昇がつく
    applyItemEffect(hitEntity, damagingEntity)
});

/**
 * @param {Entity} hitEntity
 * @param {Entity} [damagingEntity] 
 */

function applyItemEffect(hitEntity, damagingEntity) {
    if (!(damagingEntity instanceof Player)) return;
    // ペンダントを持っているときのカウント
    const items = hasItem(damagingEntity, 'ldns:pendant_of_twilight');
    if (!((items >= 1) && hitEntity.typeId in targetEntities)) return;
    // mob判定？
    const conditions = targetEntities[hitEntity.typeId];
    if ('variant' in conditions) {
        const variant = hitEntity.getComponent('minecraft:variant')?.value;
        if (typeof conditions.variant === 'number' && conditions.variant !== variant) return;
        if (Array.isArray(conditions.variant) && !conditions.variant.includes(variant)) return;
    }
    // 敵を殴ると攻撃力上昇のエフェクト
    damagingEntity.addEffect(MinecraftEffectTypes.Strength, 10 * 20);
}

// 繧ｨ繝ｩ繝ｼ縺後ヱ繝ｯ繝ｼ縺ｫ窶ｦ