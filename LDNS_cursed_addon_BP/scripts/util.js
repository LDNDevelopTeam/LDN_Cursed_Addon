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

/**
 * Removes a specific amount of items with a given itemId from the entity's (player's) inventory.
 * Returns true if the items were successfully removed.
 * @param {import("@minecraft/server").Entity} entity 
 * @param {string} itemId 
 * @param {number} amount 
 * @returns {boolean}
 */
export function removeItem(entity, itemId, amount = 1) {
  const inventory = entity.getComponent("minecraft:inventory");
  if (!inventory || !inventory.container) return false;

  // Verify we actually have enough first
  if (hasItem(entity, itemId) < amount) return false;

  let remainingToRemove = amount;
  const container = inventory.container;

  // First, check inventory slots
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (item && item.typeId === itemId) {
      if (item.amount > remainingToRemove) {
        item.amount -= remainingToRemove;
        container.setItem(i, item);
        remainingToRemove = 0;
        break;
      } else {
        remainingToRemove -= item.amount;
        container.setItem(i, undefined);
      }
    }
  }

  // If we still need to remove, check equipment slots
  if (remainingToRemove > 0) {
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
            if (item.amount > remainingToRemove) {
              item.amount -= remainingToRemove;
              equippable.setEquipment(slot, item);
              remainingToRemove = 0;
              break;
            } else {
              remainingToRemove -= item.amount;
              equippable.setEquipment(slot, undefined);
            }
          }
        } catch (e) {}
      }
    }
  }

  return remainingToRemove === 0;
}

