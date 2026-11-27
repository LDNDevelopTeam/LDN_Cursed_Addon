import { Entity, EquipmentSlot, Player, system, world, EntityComponentTypes } from '@minecraft/server';
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { targetEntities } from '../lib/ldns_entity';
import { LdnsItemTypes } from "../lib/item_types";

const errorTools: readonly string[] = [
  LdnsItemTypes.ErrorSword,
  LdnsItemTypes.ErrorPickaxe,
  LdnsItemTypes.ErrorAxe,
  LdnsItemTypes.ErrorShovel,
  LdnsItemTypes.ErrorHoe,
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
  const equippable = hurtEntity.getComponent(EntityComponentTypes.Equippable);
  if (!equippable) return;
  if (
    damagingEntity?.typeId.startsWith('ldns:') &&
    equippable.getEquipment(EquipmentSlot.Head)?.typeId === LdnsItemTypes.ErrorHelmet &&
    equippable.getEquipment(EquipmentSlot.Chest)?.typeId === LdnsItemTypes.ErrorChestplate &&
    equippable.getEquipment(EquipmentSlot.Legs)?.typeId === LdnsItemTypes.ErrorLeggings &&
    equippable.getEquipment(EquipmentSlot.Feet)?.typeId === LdnsItemTypes.ErrorBoots
  ) {
    // 特定のmobに攻撃されると自分に耐性がつく
    hurtEntity.addEffect(MinecraftEffectTypes.Resistance, 5 * 20);
  }
}

function applyToolEffects(hurtEntity: Entity, damagingEntity?: Entity) {
  if (!(damagingEntity instanceof Player)) return;
  const equippable = damagingEntity.getComponent(EntityComponentTypes.Equippable);
  if (!equippable) return;
  const mainHand = equippable.getEquipment(EquipmentSlot.Mainhand);
  if (!(mainHand && errorTools.includes(mainHand.typeId) && hurtEntity.typeId in targetEntities)) return;

  const conditions = targetEntities[hurtEntity.typeId];
  if ('variant' in conditions) {
    const variant = hurtEntity.getComponent(EntityComponentTypes.Variant)?.value;
    if (typeof conditions.variant === 'number' && conditions.variant !== variant) return;
    if (Array.isArray(conditions.variant) && (variant === undefined || !conditions.variant.includes(variant))) return;
  }
  // 特定のmobに攻撃するとその攻撃したmobに攻撃力低下がつく
  hurtEntity.addEffect(MinecraftEffectTypes.Weakness, 10 * 20);
}

// 繧ｨ繝ｩ繝ｼ縺ｫ萓ｵ鬟溘＆繧後※繧ょ鴨繧偵°繧翫ｋ縺具ｼ