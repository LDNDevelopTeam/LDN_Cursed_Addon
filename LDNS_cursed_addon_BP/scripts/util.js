// @ts-check
import { EquipmentSlot, ItemStack } from "@minecraft/server";

/**
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @template T
 * @param {T[]} array 
 * @returns {T}
 */
export function randomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Checks if the entity has a specific item in their inventory/equipment and returns the total amount.
 * @param {import("@minecraft/server").Entity} entity 
 * @param {string} itemId 
 * @returns {number}
 */
export function hasItem(entity, itemId) {
  let count = 0;

  // Check inventory container
  const inventory = entity.getComponent("minecraft:inventory");
  if (inventory && inventory.container) {
    const container = inventory.container;
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item && item.typeId === itemId) {
        count += item.amount;
      }
    }
  }

  // Check equipment slots
  const equippable = entity.getComponent("minecraft:equippable");
  if (equippable) {
    const slots = [
      EquipmentSlot.Head,
      EquipmentSlot.Chest,
      EquipmentSlot.Legs,
      EquipmentSlot.Feet,
      EquipmentSlot.Mainhand,
      EquipmentSlot.Offhand
    ];
    for (const slot of slots) {
      try {
        const item = equippable.getEquipment(slot);
        if (item && item.typeId === itemId) {
          count += item.amount;
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }

  return count;
}

/**
 * Gives an item to the entity (player), dropping it on the ground if the inventory is full.
 * @param {import("@minecraft/server").Entity} entity 
 * @param {string} itemId 
 * @param {number} amount 
 */
export function giveItem(entity, itemId, amount = 1) {
  const inventory = entity.getComponent("minecraft:inventory");
  if (!inventory || !inventory.container) return;
  const itemStack = new ItemStack(itemId, amount);
  const remainder = inventory.container.addItem(itemStack);
  if (remainder && remainder.amount > 0) {
    entity.dimension.spawnItem(remainder, entity.location);
  }
}
