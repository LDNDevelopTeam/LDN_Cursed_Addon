import type { LdnsBlockTypes } from './block_types';

/**
 * このアドオンで追加しているアイテムの ID。
 * `LDNS_cursed_addon_BP/items/` にアイテムを追加・削除したら、ここも更新すること。
 * ブロックのアイテムは {@link LdnsBlockTypes} を使う。
 */
export enum LdnsItemTypes {
  Bomb = "ldns:bomb",
  BossTrophy = "ldns:boss_trophy",
  CursedIdol = "ldns:cursed_idol",
  CursedSoul = "ldns:cursed_soul",
  Dn3895 = "ldns:dn3895",
  Entity787Scythe = "ldns:entity787_scythe",
  ErrorAxe = "ldns:error_axe",
  ErrorBoots = "ldns:error_boots",
  ErrorChestplate = "ldns:error_chestplate",
  ErrorHelmet = "ldns:error_helmet",
  ErrorHoe = "ldns:error_hoe",
  ErrorIngot = "ldns:error_ingot",
  ErrorLeggings = "ldns:error_leggings",
  ErrorPickaxe = "ldns:error_pickaxe",
  ErrorShovel = "ldns:error_shovel",
  ErrorSword = "ldns:error_sword",
  GrayEnderPearl = "ldns:gray_ender_pearl",
  HeavyStone = "ldns:heavy_stone",
  Ld5987 = "ldns:ld5987",
  PendantOfGoscubus = "ldns:pendant_of_goscubus",
  PendantOfHeatSand = "ldns:pendant_of_heat_sand",
  PendantOfTwilight = "ldns:pendant_of_twilight",
  Pigcorundum = "ldns:pigcorundum",
  TbdItem = "ldns:tbd_item",
  TravelTicket = "ldns:travel_ticket",
}
