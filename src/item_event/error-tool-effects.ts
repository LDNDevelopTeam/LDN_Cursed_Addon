import { Entity, EquipmentSlot, Player, system, world } from '@minecraft/server';
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { targetEntities } from '../lib/ldns_entity';

const errorTools = [
  'ldns:error_sword',
  'ldns:error_pickaxe',
  'ldns:error_axe',
  'ldns:error_shovel',
  'ldns:error_hoe',
];

world.afterEvents.entityHurt.subscribe(ev => {
  const { hurtEntity, damageSource: { damagingEntity } } = ev;
  // ツールエフェクト
  applyToolEffects(hurtEntity, damagingEntity);
  // 装備エフェクト
  applyArmorEffects(hurtEntity, damagingEntity);
});

function applyArmorEffects(hurtEntity: Entity, damagingEntity?: Entity) {
  if (!(hurtEntity instanceof Player)) return;
  const equippable = hurtEntity.getComponent('minecraft:equippable');
  if (!equippable) return;
  if (
    damagingEntity?.typeId.startsWith('ldns:') &&
    equippable.getEquipment(EquipmentSlot.Head)?.typeId === 'ldns:error_helmet' &&
    equippable.getEquipment(EquipmentSlot.Chest)?.typeId === 'ldns:error_chestplate' &&
    equippable.getEquipment(EquipmentSlot.Legs)?.typeId === 'ldns:error_leggings' &&
    equippable.getEquipment(EquipmentSlot.Feet)?.typeId === 'ldns:error_boots'
  ) {
    // 特定のmobに攻撃されると自分に耐性がつく
    hurtEntity.addEffect(MinecraftEffectTypes.Resistance, 5 * 20);
  }
}

function applyToolEffects(hurtEntity: Entity, damagingEntity?: Entity) {
  if (!(damagingEntity instanceof Player)) return;
  const equippable = damagingEntity.getComponent('minecraft:equippable');
  if (!equippable) return;
  const mainHand = equippable.getEquipment(EquipmentSlot.Mainhand);
  if (!(mainHand && errorTools.includes(mainHand.typeId) && hurtEntity.typeId in targetEntities)) return;

  const conditions = targetEntities[hurtEntity.typeId];
  if ('variant' in conditions) {
    const variant = hurtEntity.getComponent('minecraft:variant')?.value;
    if (typeof conditions.variant === 'number' && conditions.variant !== variant) return;
    if (Array.isArray(conditions.variant) && (variant === undefined || !conditions.variant.includes(variant))) return;
  }
  // 特定のmobに攻撃するとその攻撃したmobに攻撃力低下がつく
  hurtEntity.addEffect(MinecraftEffectTypes.Weakness, 10 * 20);
}

// 繧ｨ繝ｩ繝ｼ縺ｫ萓ｵ鬟溘＆繧後※繧ょ鴨繧偵°繧翫ｋ縺具ｼ