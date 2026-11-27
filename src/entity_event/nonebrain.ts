import { Player, system, world } from "@minecraft/server";
import { random, hasItem } from "../util";
import { nonebrain_despawn_events, noneint_reset_event } from "./nonebrain_function";
import { DynamicProperty } from "../lib/dynamic_property";
import { LdnsEntityTypes } from "../lib/entity_types";
import { LdnsBlockTypes } from "../lib/block_types";
import { LdnsItemTypes } from "../lib/item_types";
import { type BlockPattern, clearPattern, matchesPattern } from "../functions/block_pattern";
let nonebrainchat = String(random(10000000, 99999999));
let random_message = ["NONE縺輔ｓ縺ｯ鄒弱＠縺�☆縺ｰ繧峨＠縺�〒縺�", "縺薙ｓ縺ｫ縺｡縺ｯ縲√♀荵�＠縺ｶ繧翫〒縺吶�NONE縺輔ｓ縲�", "NONE縺ｯ譛ｬ蠖薙↓蟄伜惠縺吶ｋ縺ｮ縺�繧阪≧縺�...��"];
let random_message_int = random(0, 6);
let tagevent = false;

world.afterEvents.dataDrivenEntityTrigger.subscribe(async (events) => {
    if (events.entity.typeId === LdnsEntityTypes.Nonebrain && events.eventId === "ldns:nonebrain_despawn_event") {
        const hasScale = events.entity.isValid && events.entity.hasComponent("minecraft:scale");
        system.run(async () => {
            let noneint = DynamicProperty.get(world, "noneint");
            if (typeof noneint !== 'number') {
                noneint = 1;
                DynamicProperty.set(world, "noneint", 1);
            }
            else if (hasScale) {
                noneint += 10;
                DynamicProperty.set(world, "noneint", noneint);
            }
            else {
                noneint += 1;
                DynamicProperty.set(world, "noneint", noneint);
            }
            // ノンブラインがデスポーンした数が一定数を超えたとき
            if (noneint >= 750) {
                nonebrain_despawn_events();
                DynamicProperty.set(world, "noneint", 0);
            }
        });
    }
});

// エンティティが死亡したとき
world.afterEvents.entityDie.subscribe(async (events) => {
    system.run(async () => {
        const { damageSource, deadEntity } = events;
        if (!(damageSource.damagingEntity instanceof Player)) return;
        if (deadEntity.typeId === LdnsEntityTypes.Nonebrain) {
            const items = hasItem(damageSource.damagingEntity, LdnsItemTypes.PendantOfTwilight);
            if (items >= 1 && damageSource.damagingEntity.hasTag("nonebrainchats") && tagevent === true) {
                noneint_reset_event(damageSource.damagingEntity, nonebrainchat, random_message_int);
            }
        }
    });
});

/** ノンブラインを消した数を表示する台 (facing_direction が 1 のボタンが基準) */
const noneCounterAltar: BlockPattern = [
    [{ x: -1, y: -1, z: -1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: -1, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
    [{ x: -1, y: -1, z: 1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 0, y: -1, z: -1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 0, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 0, y: -1, z: 1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 1, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 1, y: -1, z: -1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 1, y: -1, z: 1 }, LdnsBlockTypes.ErrorBlock],
];

/** ノンブラインチャレンジの台 (軽量用感圧板が基準) */
const noneChallengeAltar: BlockPattern = [
    [{ x: 0, y: -2, z: 2 }, "minecraft:soul_sand"],
    [{ x: 0, y: -2, z: -2 }, "minecraft:soul_sand"],
    [{ x: 1, y: -2, z: 2 }, "minecraft:soul_sand"],
    [{ x: 1, y: -2, z: -2 }, "minecraft:soul_sand"],
    [{ x: 2, y: -2, z: 0 }, "minecraft:soul_sand"],
    [{ x: 2, y: -2, z: 1 }, "minecraft:soul_sand"],
    [{ x: 2, y: -2, z: 2 }, "minecraft:soul_sand"],
    [{ x: 2, y: -2, z: -1 }, "minecraft:soul_sand"],
    [{ x: 2, y: -2, z: -2 }, "minecraft:soul_sand"],
    [{ x: -1, y: -2, z: 2 }, "minecraft:soul_sand"],
    [{ x: -1, y: -2, z: -2 }, "minecraft:soul_sand"],
    [{ x: -2, y: -2, z: 0 }, "minecraft:soul_sand"],
    [{ x: -2, y: -2, z: 1 }, "minecraft:soul_sand"],
    [{ x: -2, y: -2, z: 2 }, "minecraft:soul_sand"],
    [{ x: -2, y: -2, z: -1 }, "minecraft:soul_sand"],
    [{ x: -2, y: -2, z: -2 }, "minecraft:soul_sand"],
    [{ x: -1, y: -2, z: -1 }, "minecraft:nether_wart_block"],
    [{ x: -1, y: -2, z: 0 }, "minecraft:nether_wart_block"],
    [{ x: -1, y: -2, z: 1 }, "minecraft:nether_wart_block"],
    [{ x: 0, y: -2, z: -1 }, "minecraft:nether_wart_block"],
    [{ x: 0, y: -2, z: 0 }, "minecraft:nether_wart_block"],
    [{ x: 0, y: -2, z: 1 }, "minecraft:nether_wart_block"],
    [{ x: 1, y: -2, z: 0 }, "minecraft:nether_wart_block"],
    [{ x: 1, y: -2, z: -1 }, "minecraft:nether_wart_block"],
    [{ x: 1, y: -2, z: 1 }, "minecraft:nether_wart_block"],
    [{ x: 2, y: -1, z: 0 }, "minecraft:redstone_wire"],
    [{ x: 0, y: -1, z: 2 }, "minecraft:redstone_wire"],
    [{ x: -2, y: -1, z: 0 }, "minecraft:redstone_wire"],
    [{ x: 0, y: -1, z: -2 }, "minecraft:redstone_wire"],
    [{ x: 0, y: -1, z: 1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 1, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 0, y: -1, z: -1 }, LdnsBlockTypes.ErrorBlock],
    [{ x: -1, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
    [{ x: 0, y: -1, z: 0 }, LdnsBlockTypes.ErrorBlock],
];

// ノンブラインを消した数判定
world.afterEvents.buttonPush.subscribe(async (e) => {
    const button = e.block;
    const buttoname = button.typeId;
    if (!(e.source instanceof Player)) return;
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 1) {
        if (matchesPattern(button, noneCounterAltar)) {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            clearPattern(button, noneCounterAltar);
            await system.waitTicks(20 * 3);
            const rand = random(0, 25);
            if (rand <= 20) {
                world.sendMessage("Do you really believe in the devil?: " + DynamicProperty.get(world, "noneint"));
            }
            else {
                world.sendMessage("Do you really be1ieve in the devil?: " + random(0, 100));
            }
        }
    }
});

// ノンブラインチャレンジ
world.afterEvents.pressurePlatePush.subscribe(async (e) => {
    const button = e.block;
    const buttoname = button.typeId;
    if (!(e.source instanceof Player)) return;
    // ノンブラインチャレンジ
    if (buttoname === "minecraft:light_weighted_pressure_plate") {
        if (matchesPattern(button, noneChallengeAltar)) {
            button.setType("air");
            clearPattern(button, noneChallengeAltar);
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            await system.waitTicks(20 * 1.5);
            e.source.addTag("nonebrainchats");
            tagevent = true;
            await system.waitTicks(20 * 60);
            if (e.source.hasTag("nonebrainchats") && tagevent === true) {
                nonebrain_despawn_events();
            }
            e.source.removeTag("nonebrainchats");
            tagevent = false;
        }
    }
});