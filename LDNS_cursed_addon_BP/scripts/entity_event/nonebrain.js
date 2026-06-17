import { Player, system, world } from "@minecraft/server";
import { random, hasItem } from "../util";
import { nonebrain_despawn_events, noneint_reset_event } from "./nonebrain_function";
let nonebrainchat = String(random(10000000, 99999999));
let random_message = ["NONE縺輔ｓ縺ｯ鄒弱＠縺�☆縺ｰ繧峨＠縺�〒縺�", "縺薙ｓ縺ｫ縺｡縺ｯ縲√♀荵�＠縺ｶ繧翫〒縺吶�NONE縺輔ｓ縲�", "NONE縺ｯ譛ｬ蠖薙↓蟄伜惠縺吶ｋ縺ｮ縺�繧阪≧縺�...��"];
let random_message_int = random(0, 6);
let tagevent = false;

world.afterEvents.dataDrivenEntityTrigger.subscribe(async (events) => {
    if (events.entity.typeId === "ldns:nonebrain" && events.eventId === "ldns:nonebrain_despawn_event") {
        const hasScale = events.entity.isValid && events.entity.hasComponent("minecraft:scale");
        system.run(async () => {
            let noneint = world.getDynamicProperty("noneint");
            if (typeof noneint !== 'number') {
                noneint = 1;
                world.setDynamicProperty("noneint", 1);
            }
            else if (hasScale) {
                noneint += 10;
                world.setDynamicProperty("noneint", noneint);
            }
            else {
                noneint += 1;
                world.setDynamicProperty("noneint", noneint);
            }
            // ノンブラインがデスポーンした数が一定数を超えたとき
            if (noneint >= 750) {
                nonebrain_despawn_events();
                world.setDynamicProperty("noneint", 0);
            }
        });
    }
});

// エンティティが死亡したとき
world.afterEvents.entityDie.subscribe(async (events) => {
    system.run(async () => {
        const { damageSource, deadEntity } = events;
        if (!(damageSource.damagingEntity instanceof Player)) return;
        if (deadEntity.typeId === "ldns:nonebrain") {
            const items = hasItem(damageSource.damagingEntity, 'ldns:pendant_of_twilight');
            if (items >= 1 && damageSource.damagingEntity.hasTag("nonebrainchats") && tagevent === true) {
                noneint_reset_event(damageSource.damagingEntity, nonebrainchat, random_message_int);
            }
        }
    });
});

// ノンブラインを消した数判定
world.afterEvents.buttonPush.subscribe(async (e) => {
    const button = e.block;
    const buttoname = button.typeId;
    if (!(e.source instanceof Player)) return;
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 1) {
        if (button.offset({ x: -1, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: -1, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: 1 }).typeId === "ldns:error_block") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: -1, y: -1, z: -1 }).setType("air");
            button.offset({ x: -1, y: -1, z: 0 }).setType("air");
            button.offset({ x: -1, y: -1, z: 1 }).setType("air");
            button.offset({ x: 0, y: -1, z: -1 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 1 }).setType("air");
            button.offset({ x: 1, y: -1, z: 0 }).setType("air");
            button.offset({ x: 1, y: -1, z: -1 }).setType("air");
            button.offset({ x: 1, y: -1, z: 1 }).setType("air");
            await system.waitTicks(20 * 3);
            const rand = random(0, 25);
            if (rand <= 20) {
                world.sendMessage("Do you really believe in the devil?: " + world.getDynamicProperty("noneint"));
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
        if (button.offset({ x: 0, y: -2, z: 2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 0, y: -2, z: -2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 1, y: -2, z: 2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 1, y: -2, z: -2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 2, y: -2, z: 0 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 2, y: -2, z: 1 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 2, y: -2, z: 2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 2, y: -2, z: -1 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: 2, y: -2, z: -2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -1, y: -2, z: 2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -1, y: -2, z: -2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -2, y: -2, z: 0 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -2, y: -2, z: 1 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -2, y: -2, z: 2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -2, y: -2, z: -1 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -2, y: -2, z: -2 }).typeId === "minecraft:soul_sand" &&
            button.offset({ x: -1, y: -2, z: -1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -1, y: -2, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -1, y: -2, z: 1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: -2, z: -1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: -2, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: -2, z: 1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 1, y: -2, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 1, y: -2, z: -1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 1, y: -2, z: 1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 2, y: -1, z: 0 }).typeId === "minecraft:redstone_wire" &&
            button.offset({ x: 0, y: -1, z: 2 }).typeId === "minecraft:redstone_wire" &&
            button.offset({ x: -2, y: -1, z: 0 }).typeId === "minecraft:redstone_wire" &&
            button.offset({ x: 0, y: -1, z: -2 }).typeId === "minecraft:redstone_wire" &&
            button.offset({ x: 0, y: -1, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block") {
            button.setType("air");
            button.offset({ x: 0, y: -2, z: 2 }).setType("air");
            button.offset({ x: 0, y: -2, z: -2 }).setType("air");
            button.offset({ x: 1, y: -2, z: 2 }).setType("air");
            button.offset({ x: 1, y: -2, z: -2 }).setType("air");
            button.offset({ x: 2, y: -2, z: 0 }).setType("air");
            button.offset({ x: 2, y: -2, z: 1 }).setType("air");
            button.offset({ x: 2, y: -2, z: 2 }).setType("air");
            button.offset({ x: 2, y: -2, z: -1 }).setType("air");
            button.offset({ x: 2, y: -2, z: -2 }).setType("air");
            button.offset({ x: -1, y: -2, z: 2 }).setType("air");
            button.offset({ x: -1, y: -2, z: -2 }).setType("air");
            button.offset({ x: -2, y: -2, z: 0 }).setType("air");
            button.offset({ x: -2, y: -2, z: 1 }).setType("air");
            button.offset({ x: -2, y: -2, z: 2 }).setType("air");
            button.offset({ x: -2, y: -2, z: -1 }).setType("air");
            button.offset({ x: -2, y: -2, z: -2 }).setType("air");
            button.offset({ x: -1, y: -2, z: -1 }).setType("air");
            button.offset({ x: -1, y: -2, z: 0 }).setType("air");
            button.offset({ x: -1, y: -2, z: 1 }).setType("air");
            button.offset({ x: 0, y: -2, z: -1 }).setType("air");
            button.offset({ x: 0, y: -2, z: 0 }).setType("air");
            button.offset({ x: 0, y: -2, z: 1 }).setType("air");
            button.offset({ x: 1, y: -2, z: 0 }).setType("air");
            button.offset({ x: 1, y: -2, z: -1 }).setType("air");
            button.offset({ x: 1, y: -2, z: 1 }).setType("air");
            button.offset({ x: 2, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 2 }).setType("air");
            button.offset({ x: -2, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: -2 }).setType("air");
            button.offset({ x: 0, y: -1, z: 1 }).setType("air");
            button.offset({ x: 1, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: -1 }).setType("air");
            button.offset({ x: -1, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
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