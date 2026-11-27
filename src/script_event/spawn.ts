import { EquipmentSlot, Player, PlayerPermissionLevel, system, world, type Vector3 } from "@minecraft/server";
import { random, giveItem, hasItem } from "../util";
import { freeze } from "../functions/kanasibari";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { getTopmostBlockLocation } from "../functions/max_y";
import { DynamicProperty } from "../lib/dynamic_property";
import { LdnsEntityTypes } from "../lib/entity_types";
import { LdnsBlockTypes } from "../lib/block_types";
import { LdnsItemTypes } from "../lib/item_types";

const timezoneOffset = 0;

let names = ["James", "Olivia", "Liam", "Emma", "Noah", "Ava", "William", "Sophia", "Elijah", "Isabella", "Benjamin", "Mia", "Lucas", "Charlotte", "Henry", "Amelia", "Alexander", "Harper", "Michael", "Evelyn"]

let ctimes = 10600;

system.runInterval(() => {
    if (DynamicProperty.get(world, "tbd") === true) {
        events();
    }
}, 20 * 10);

system.runInterval(async () => {
    if (DynamicProperty.get(world, "tbd") !== true) {
        events();
    }
}, 20 * 45);

async function events() {

    // ワールドのプレイヤーを獲得
    const playerall = world.getPlayers();
    const playerlength = playerall.length;
    if (playerlength >= 1) {
        let v;
        if (playerlength > 1) {
            v = playerall[random(0, playerlength)];
        }
        else if (playerlength <= 1) {
            v = playerall[0];
        }
        if (!v) return;
        // ランダム2
        const rand = random(0, ctimes);
        // 時刻獲得
        const d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (timezoneOffset * 60)) * 60 * 1000));
        // 座標獲得
        const playerlocation = v.location;
        // PP、YYが出る
        if (rand <= 100 && rand >= 0) {
            event0(d, v, playerlocation);
        }
        // 謎文字
        else if (rand <= 200 && rand > 100) {
            event1(v);
        }
        // 謎ドロップ
        else if (rand <= 250 && rand > 200) {
            event2(d, v);

        }
        // 突然時間がランダムに変わり、謎の文字が出てくる
        else if (rand <= 350 && rand > 300) {
            event3(playerall);

        }
        // 突然誰かがみんなにチャットして何かが起こる
        else if (rand <= 450 && rand > 400) {
            event4(d, v, playerlength, playerall);

        }
        // 無職の村人？が出てくる
        else if (rand <= 600 && rand > 500) {
            event5(v);
        }
        // 謎のプレイヤーが出てくる
        else if (rand <= 800 && rand > 700) {
            event6(v);
        }
        // ローテーション
        else if (rand <= 900 && rand > 800) {
            event7(v);
        }
        // 謎の音が鳴る
        else if (rand <= 1000 && rand > 900) {
            event8(v);
        }
        // Nonameが出てくる
        else if (rand <= 1100 && rand > 1000) {
            event9(playerall);
        }
        // Hello？
        else if (rand <= 1200 && rand > 1100) {
            event10(v);
        }
        // villが出てくる
        else if (rand <= 1300 && rand > 1200) {
            event11(playerall, v);
        }
        // 急に体力がおかしくなる
        else if (rand <= 1400 && rand > 1300) {
            event12(v);
        }
        // PBHが出てくる
        else if (rand <= 1500 && rand > 1400) {
            event13(v);
        }
        // error64が出てくる
        else if (rand <= 1525 && rand > 1500) {
            event14X(v);
        }
        // ランダムチャット
        else if (rand <= 1700 && rand > 1600 && DynamicProperty.get(world, "toggle_chat")) {
            event15(v);
        }
        // 急に浮き、チャットだらけになり、何かが出てくる
        else if (rand <= 1800 && rand > 1705) {
            playerall.forEach((ve, ie, ae) => {
                event16(ve, ve.location.x, ve.location.y, ve.location.z, ve.getRotation().x, ve.getRotation().y);
            })
        }
        // I_am_you_maybeが出てくる
        else if (rand <= 1900 && rand > 1800) {
            event17(v);
        }
        // oblivionv7 or oblivionv8が出てくる
        else if (rand <= 1920 && rand > 1900) {
            event18(v);
        }
        // 謎のformが出てくる
        else if (rand <= 2005 && rand > 2000) {
            event19(v);
        }
        // LengthFixが背後にスポーン
        else if (rand <= 2025 && rand > 2005) {
            event20(v);
        }
        // Nebilim 178438が遠くにスポーン
        else if (rand <= 2045 && rand > 2025) {
            event21(v);
        }
    }
}

world.afterEvents.buttonPush.subscribe(async (e) => {
    const button = e.block;
    const buttoname = button.typeId;
    if (!(e.source instanceof Player)) return;
    // PPスポーン
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 0) {
        if (button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: -1 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 1, z: 1 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: -1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 0, z: 1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: -1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 2, z: -1 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: 1, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: 1 })!.setType("air");
            button.offset({ x: 0, y: -1, z: -1 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 2, z: -1 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Pp, button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 1 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 1, z: -1 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: 1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 0, z: -1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: -1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 2, z: 1 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 1, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: -1 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 1 })!.setType("air");
            button.offset({ x: 0, y: -1, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 2, z: 1 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Pp, button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 1, y: 1, z: 0 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: -1, y: 1, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 1, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -1, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 1, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 1, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 1, y: -1, z: 0 })!.setType("air");
            button.offset({ x: -1, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 2, z: 0 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Pp, button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -1, y: 1, z: 0 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 1, y: 1, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -1, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 1, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -1, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 1, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: -1, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 1, y: -1, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 2, z: 0 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Pp, button.location);
        }
    }
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 1) {
        if (button.offset({ x: 0, y: 0, z: -1 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 0, z: 1 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 0, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 2, z: -2 })?.typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 0, y: 2, z: 2 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 0, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 0, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: -2 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 2, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 2, z: 2 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Yy, button.location);
        }
        else if (button.offset({ x: 0, y: 0, z: 1 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 0, z: -1 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 0, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: -2 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 2, z: 2 })?.typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 0, y: 2, z: -2 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 0, z: 1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: -1 })!.setType("air");
            button.offset({ x: 0, y: 0, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 0, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 2 })!.setType("air");
            button.offset({ x: 0, y: -1, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 1, z: -2 })!.setType("air");
            button.offset({ x: 0, y: 2, z: 2 })!.setType("air");
            button.offset({ x: 0, y: 2, z: -2 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Yy, button.location);
        }
        else if (button.offset({ x: -1, y: 0, z: 0 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: 1, y: 0, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -2, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 2, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: -1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 0 })!.setType("air");
            button.offset({ x: -2, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 2, y: -1, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 1, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 2, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 2, z: 0 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Yy, button.location);
        }
        else if (button.offset({ x: 1, y: 0, z: 0 })?.typeId === "minecraft:redstone_block" &&
            button.offset({ x: -1, y: 0, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 2, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: 0, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 0, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: -2, y: 1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
            button.offset({ x: 2, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: -2, y: 2, z: 0 })?.typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: -1, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 0, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 0, z: 0 })!.setType("air");
            button.offset({ x: 0, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 0, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 2, y: -1, z: 0 })!.setType("air");
            button.offset({ x: -2, y: -1, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 1, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 1, z: 0 })!.setType("air");
            button.offset({ x: 2, y: 2, z: 0 })!.setType("air");
            button.offset({ x: -2, y: 2, z: 0 })!.setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity(LdnsEntityTypes.Yy, button.location);
        }
    }
});

// 必ずこの向き
world.afterEvents.playerInteractWithBlock.subscribe(async (e) => {
    const { player } = e;
    let equipments = player.getComponent("equippable");
    let container = player.getComponent("inventory")?.container;
    const button = player.dimension.getBlock(player.location);
    if (!button || !equipments) return;
    if (
        button.offset({ x: 0, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: 1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: 0, y: -1, z: -1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: 0, y: -1, z: 1 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: -1, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: -2, y: -1, z: 0 })?.typeId === LdnsBlockTypes.ErrorBlock &&
        button.offset({ x: 1, y: -1, z: -1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: 1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: -1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: 0 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: 1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: 2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: -2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 0, y: -1, z: 2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 0, y: -1, z: -2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: -2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: 2 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: -1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: 1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -2, y: -1, z: -1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -2, y: -1, z: 1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: -1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: 1 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: 0 })?.typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: 0, z: -1 })?.typeId === "minecraft:redstone_wire" &&
        button.offset({ x: 0, y: 0, z: 2 })?.typeId === "minecraft:redstone_wire" &&
        button.offset({ x: -1, y: 0, z: -2 })?.typeId === "minecraft:redstone_wire" &&
        button.offset({ x: -3, y: 0, z: 1 })?.typeId === "minecraft:redstone_wire" &&
        button.offset({ x: 2, y: 3, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 1, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 0, z: 0 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: -1 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: 1 })?.typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: -3, y: 3, z: 0 })?.typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: 0 })?.typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 1, z: 0 })?.typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 0, z: 0 })?.typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: -1 })?.typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: 1 })?.typeId === "minecraft:soul_sand" &&
        equipments.getEquipment(EquipmentSlot.Head)?.typeId === LdnsItemTypes.ErrorHelmet &&
        equipments.getEquipment(EquipmentSlot.Chest)?.typeId === LdnsItemTypes.ErrorChestplate &&
        equipments.getEquipment(EquipmentSlot.Legs)?.typeId === LdnsItemTypes.ErrorLeggings &&
        equipments.getEquipment(EquipmentSlot.Feet)?.typeId === LdnsItemTypes.ErrorBoots &&
        container?.getItem(4 + 9)?.typeId === LdnsItemTypes.ErrorSword &&
        container?.getItem(12 + 9)?.typeId === LdnsItemTypes.ErrorShovel &&
        container?.getItem(13 + 9)?.typeId === LdnsItemTypes.ErrorPickaxe &&
        container?.getItem(14 + 9)?.typeId === LdnsItemTypes.ErrorAxe &&
        container?.getItem(22 + 9)?.typeId === LdnsItemTypes.ErrorHoe &&
        container?.getItem(3 + 9)?.typeId === LdnsItemTypes.Ld5987 &&
        container?.getItem(5 + 9)?.typeId === LdnsItemTypes.Dn3895 &&
        container?.getItem(21 + 9)?.typeId === LdnsItemTypes.Dn3895 &&
        container?.getItem(23 + 9)?.typeId === LdnsItemTypes.Ld5987 &&
        e.block.location.x === button.location.x - 3 &&
        e.block.location.y === button.location.y + 1 &&
        e.block.location.z === button.location.z &&
        e.block.typeId === "minecraft:soul_sand" &&
        e.itemStack?.typeId === "minecraft:flint_and_steel"
    ) {
        button.dimension.spawnParticle("ldns:error_particle", button.location);
        container?.setItem(3 + 9, undefined);
        container?.setItem(5 + 9, undefined);
        container?.setItem(21 + 9, undefined);
        container?.setItem(23 + 9, undefined);
        button.offset({ x: 0, y: -1, z: 0 })!.setType("air");
        button.offset({ x: 1, y: -1, z: 0 })!.setType("air");
        button.offset({ x: 0, y: -1, z: -1 })!.setType("air");
        button.offset({ x: 0, y: -1, z: 1 })!.setType("air");
        button.offset({ x: -1, y: -1, z: 0 })!.setType("air");
        button.offset({ x: -2, y: -1, z: 0 })!.setType("air");
        button.offset({ x: 1, y: -1, z: -1 })!.setType("air");
        button.offset({ x: 1, y: -1, z: 1 })!.setType("air");
        button.offset({ x: 2, y: -1, z: -1 })!.setType("air");
        button.offset({ x: 2, y: -1, z: 0 })!.setType("air");
        button.offset({ x: 2, y: -1, z: 1 })!.setType("air");
        button.offset({ x: 1, y: -1, z: 2 })!.setType("air");
        button.offset({ x: 1, y: -1, z: -2 })!.setType("air");
        button.offset({ x: 0, y: -1, z: 2 })!.setType("air");
        button.offset({ x: 0, y: -1, z: -2 })!.setType("air");
        button.offset({ x: -1, y: -1, z: -2 })!.setType("air");
        button.offset({ x: -1, y: -1, z: 2 })!.setType("air");
        button.offset({ x: -1, y: -1, z: -1 })!.setType("air");
        button.offset({ x: -1, y: -1, z: 1 })!.setType("air");
        button.offset({ x: -2, y: -1, z: -1 })!.setType("air");
        button.offset({ x: -2, y: -1, z: 1 })!.setType("air");
        button.offset({ x: -3, y: -1, z: -1 })!.setType("air");
        button.offset({ x: -3, y: -1, z: 1 })!.setType("air");
        button.offset({ x: -3, y: -1, z: 0 })!.setType("air");
        button.offset({ x: 1, y: 0, z: -1 })!.setType("air");
        button.offset({ x: 0, y: 0, z: 2 })!.setType("air");
        button.offset({ x: -1, y: 0, z: -2 })!.setType("air");
        button.offset({ x: -3, y: 0, z: 1 })!.setType("air");
        button.offset({ x: 2, y: 3, z: 0 })!.setType("air");
        button.offset({ x: 2, y: 2, z: 0 })!.setType("air");
        button.offset({ x: 2, y: 1, z: 0 })!.setType("air");
        button.offset({ x: 2, y: 0, z: 0 })!.setType("air");
        button.offset({ x: 2, y: 2, z: -1 })!.setType("air");
        button.offset({ x: 2, y: 2, z: 1 })!.setType("air");
        button.offset({ x: -3, y: 3, z: 0 })!.setType("air");
        button.offset({ x: -3, y: 2, z: 0 })!.setType("air");
        button.offset({ x: -3, y: 1, z: 0 })!.setType("air");
        button.offset({ x: -3, y: 0, z: 0 })!.setType("air");
        button.offset({ x: -3, y: 2, z: -1 })!.setType("air");
        button.offset({ x: -3, y: 2, z: 1 })!.setType("air");
        world.sendMessage("No! It's not me!Help me! I'm scared! Don't make me cry!Don't hit me!Don't curse!Don't betray me... I'll turn it off?");
        await system.waitTicks(20 * 3);
        button.dimension.spawnEntity("lightning_bolt", { x: button.location.x + 3, y: button.location.y, z: button.location.z });
        button.dimension.spawnEntity(LdnsEntityTypes.Entity787, { x: button.location.x + 3, y: button.location.y, z: button.location.z });
    }
});

function isEven(number: number) {
    return number % 2 === 0;
}

function isOdd(number: number) {
    return number % 2 !== 0;
}

function event0(d: Date, v: Player, playerlocation: Vector3) {
    // UTCが偶数の時にPPが出る
    if (isEven(d.getHours())) {
        world.sendMessage("If the hand §oholding§r the leg §3trembles§r, cut §lthe leg off.§r§§");
        v.playSound("ldns.pp_spawn");
        v.onScreenDisplay.setTitle("ppse");
        freeze(v, playerlocation, 100);
        v.playSound("ldns.ppyy_spawn");
        v.dimension.spawnEntity(LdnsEntityTypes.Pp, playerlocation);
    }
    // UTCが奇数の時にYYが出る
    else if (isOdd(d.getHours())) {
        world.sendMessage("I'm on your §lside§r, so I'll keep§l§o watching§r until that §6blood dries§r.");
        v.playSound("ldns.yy_spawn");
        v.onScreenDisplay.setTitle("yyse");
        freeze(v, playerlocation, 100);
        v.playSound("ldns.ppyy_spawn");
        v.dimension.spawnEntity(LdnsEntityTypes.Yy, playerlocation);
    }
}

function event1(v: Player) {
    const rande = random(0, 4);
    if (rande === 0) {
        v.playSound("ldns.beep");
        v.onScreenDisplay.setTitle("Error1");
    }
    else if (rande === 1) {
        v.playSound("ldns.beep");
        v.onScreenDisplay.setTitle("Error2");
    }
    else if (rande === 2) {
        v.playSound("ldns.beep");
        v.onScreenDisplay.setTitle("Cursed1");
    }
    else if (rande === 3) {
        v.playSound("ldns.beep");
        v.onScreenDisplay.setTitle("Cursed2");
    }
}

function event2(d: Date, v: Player) {
    if (isEven(d.getHours())) { giveItem(v, LdnsItemTypes.Dn3895); }
    else if (isOdd(d.getHours())) { giveItem(v, LdnsItemTypes.Ld5987); }
}

function event3(playerall: Player[]) {
    playerall.forEach(async (vs, is, as) => {
        vs.playSound("ldns.time_mad");
        console.info("We is cursed");
        for (let inter = 0; inter < 160; inter++) {
            let titletextr = random(0, 6);
            switch (titletextr) {
                case 0:
                    vs.onScreenDisplay.setTitle("あなたは呪われてない", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 1:
                    vs.onScreenDisplay.setTitle("あなたは呪われている", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 2:
                    vs.onScreenDisplay.setTitle("縺ゅ↑縺溷測繧上ｌ縺ｦ", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 3:
                    vs.onScreenDisplay.setTitle("縺ゅ↑縺溷測繧上ｌ縺ｾ", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 4:
                    vs.onScreenDisplay.setTitle("We is Cursed.", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 5:
                    vs.onScreenDisplay.setTitle("They am Cursed.", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
            }
            if (is === 0) { world.setTimeOfDay(random(1000, 23000)); }
            await system.waitTicks(1);
        }
    });
}

async function event4(d: Date, v: Player, playerlength: number, playerall: Player[]) {
    const randp = random(0, 6);
    const items = random(0, 2);
    let psplayer = v;
    if (playerlength <= 1) {
        const dummyname = names[random(0, names.length)];
        switch (randp) {
            case 0:
                world.sendMessage("<" + v.name + "> " + "Hello?, " + dummyname);
                break;
            case 1:
                world.sendMessage("<" + v.name + "> " + dummyname + ", Are they cursed?");
                break;
            case 2:
                world.sendMessage("<" + v.name + "> " + dummyname + ", What do you think?");
                break;
            case 3:
                world.sendMessage("<" + v.name + "> " + "Have you become 縺ゅｌ?");
                break;
            case 4:
                world.sendMessage("<" + v.name + "> " + dummyname + ", what's wrong?");
                break;
            case 5:
                world.sendMessage("<" + v.name + "> " + dummyname + "'s Error Computer Information:\n CEU: Erutel Corse i6 666K 6Curse 6Curshreads 6.66GHz\n ERM: DDR6-6666 66GB\n Errorcards: Errvidia Gerrorforce ETX 666 Ei 6GB\n ES: Errorsoft Errdows 666");
                break;
        }
    }
    else if (playerlength > 1) {
        while (true) {
            psplayer = playerall[random(0, playerlength)];
            if (psplayer != v) {
                switch (randp) {
                    case 0:
                        world.sendMessage("<" + v.name + "> " + "Hello?, " + psplayer.name);
                        await system.waitTicks(20 * 5);
                        v.teleport(psplayer.location);
                        break;
                    case 1:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + ", Are they cursed?");
                        await system.waitTicks(20 * 3);
                        switch (items) {
                            case 0:
                                giveItem(psplayer, LdnsItemTypes.ErrorIngot);
                                break;
                            case 1:
                                giveItem(psplayer, LdnsItemTypes.HeavyStone);
                                break;
                        }
                        break;
                    case 2:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + ", What do you think?");
                        await system.waitTicks(20 * 3);
                        giveItem(psplayer, LdnsItemTypes.CursedSoul);
                        break;
                    case 3:
                        world.sendMessage("<" + v.name + "> " + "Have you become 縺ゅｌ?");
                        break;
                    case 4:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + ", what's wrong?");
                        await system.waitTicks(20 * 3);
                        switch (items) {
                            case 0:
                                giveItem(psplayer, LdnsItemTypes.Ld5987);
                                break;
                            case 1:
                                giveItem(psplayer, LdnsItemTypes.Dn3895);
                                break;
                        }
                        break;
                    case 5:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + "'s Error Computer Information:\n CEU: Erutel Corse i6 666K 6Curse 6Curshreads 6.66GHz\n ERM: DDR6-6666 66GB\n Errorcards: Errvidia Gerrorforce ETX 666 Ei 6GB\n ES: Errorsoft Errdows 666");
                        await system.waitTicks(20 * 3);
                        psplayer.addExperience(66);
                        break;
                }
                break;
            }
        }
    }
}

async function event5(v: Player) {
    if (random(0, 8) <= 7) {
        v.dimension.spawnEntity(LdnsEntityTypes.AttackerNitwitVillager, v.location);
    }
}

function event6(v: Player) {
    v.dimension.spawnEntity(LdnsEntityTypes.MysteriousPlayers, v.location);
}

function event7(v: Player) {
    v.teleport(v.location, { rotation: { x: random(-90, 90), y: random(0, 180) } });
    if (v.hasTag("debug_log")) {
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_rotation) : ldns.rotation");
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_rotation) : default ");
    }
}

function event8(v: Player) {
    v.playSound("player.ldns.random_step_1", { location: v.location, volume: 0.5 });
    if (v.hasTag("debug_log")) {
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_step_1) : ldns.step_1");
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_step_1) : default ");
    }
}

async function event9(playerall: Player[]) {
    playerall.forEach(async (v, i, a) => {
        switch (random(0, 2)) {
            case 0:
                v.playSound("ldns.cursednoise4");
                break;
            case 1:
                v.playSound("ldns.cursednoise5");
                break;
        }
        v.onScreenDisplay.setTitle("textcursed");
        v.addEffect(MinecraftEffectTypes.Weakness, 20 * 6, { amplifier: 255, showParticles: false });
        v.dimension.spawnEntity(LdnsEntityTypes.Noname, { x: v.location.x + v.getViewDirection().x, y: v.location.y, z: v.location.z + v.getViewDirection().z });
        freeze(v, v.location, 20 * 6);
    });
}

async function event10(v: Player) {
    v.playSound("ldns.images")
    switch (random(0, 4)) {
        case 0:
            v.onScreenDisplay.setTitle("hello1");
            break;
        case 1:
            v.onScreenDisplay.setTitle("hello2");
            break;
        case 2:
            v.onScreenDisplay.setTitle("hello3");
            break;
        case 3:
            v.onScreenDisplay.setTitle("hello4");
            break;
    }
}

export async function event11(playerall: Player[], v: Player) {
    playerall.forEach(async (vs, is, as) => {
        vs.playSound("mob.witch.celebrate", { pitch: 0.666, volume: 6.66 });
        await system.waitTicks(20 * 2);
        vs.playSound("ldns.villspawn", { volume: 1.0 });
    });
    world.sendMessage("§4I will follow you wherever you go.§r");

    await system.waitTicks(20 * 5);
    const playerLocation = v.location;
    const spawnX = playerLocation.x + 64; // 256ブロック離れたX座標
    const spawnZ = playerLocation.z; // プレイヤーと同じZ座標

    // 最高の地面ブロックのY座標を取得
    let spawnY = 0;
    for (let y = 320; y >= -64; y--) { // ビルドの最大・最小高さを確認
        const block = world.getDimension("overworld").getBlock({ x: spawnX, y: y, z: spawnZ });
        if (block && !block.isAir) {
            spawnY = y + 1; // ブロックの上にスポーン
            break;
        }
    }
    DynamicProperty.set(world, "villTGS", false);
    // Mobをスポーン
    v.dimension.spawnEntity(LdnsEntityTypes.Vill, { x: spawnX, y: spawnY, z: spawnZ });
    // 追いかけるためのIDを指定
    DynamicProperty.set(world, "villTGid", v.id);
    DynamicProperty.set(world, "villTGS", true);
}

export async function event12(v: Player) {
    let playerhealth = v.getComponent("health");
    for (let i = 0; i < 384; i++) {
        playerhealth?.setCurrentValue(random(6, 20));
        await system.waitTicks(1);
    }
}

export async function event13(v: Player) {
    let xX = v.location.x + 15;
    let zZ = v.location.z - 15;
    switch (random(0, 3)) {
        case 0:
            v.playSound("ldns.publicvoid");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity(LdnsEntityTypes.PublicVoid, { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
        case 1:
            v.playSound("ldns.binary444");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity(LdnsEntityTypes.Binary444, { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
        case 2:
            v.playSound("ldns.herovoid");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity(LdnsEntityTypes.Herovoid, { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
    }
}

function event14X(v: Player) {
    let xX = v.location.x + 30;
    let zZ = v.location.z - 30;
    v.dimension.spawnEntity(LdnsEntityTypes.Error64, { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
}

export async function event14(v: Player) {
    DynamicProperty.set(v, "LposX", v.location.x);
    DynamicProperty.set(v, "LposY", v.location.y);
    DynamicProperty.set(v, "LposZ", v.location.z);
    const cursedform = new MessageFormData();
    cursedform.title("").body("I saw").button1("Yes").button2("Okay");
    cursedform.show(v).then(async res => {
        if (random(0, 3) === 0) {
            event14s(v);
        }
    });
}

export async function event14s(v: Player) {
    const posX = Math.floor(v.location.x);
    const posY = 300;
    const posZ = Math.floor(v.location.z);
    DynamicProperty.set(v, "roomX", posX);
    DynamicProperty.set(v, "roomZ", posZ);

    const length = 48;
    const width = 7;
    const height = 10;

    v.sendMessage("§cIf you can run away, try to run away.");

    for (let n = 0; n < 3; n++) {
        v.teleport({ x: 9 + posX, y: posY + 1, z: posZ + 3.5 }, { dimension: v.dimension, rotation: { x: 0, y: 270 } });
        await system.waitTicks(10);
    }
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < width; j++) {
            for (let k = 0; k < height; k++) {
                if ((i >= 1 && i <= 46) && (j >= 1 && j <= 5) && (k >= 1 && k <= 8)) {
                    v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:air");
                }
                else {
                    v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:bedrock");
                }
                if ((i >= 1 && i <= 46) && (j == 1 || j == 5) && k == 8) {
                    v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:glowstone");
                }
                if ((i >= 1 && i <= 46) && k == 1 && (j >= 1 && j <= 5)) {
                    if (random(0, 10) == 0) {
                        v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:redstone_wire");
                    }
                }
            }
        }
    }

    for (let i = 0; i < 60; i++) {
        world.getPlayers().forEach(async (vp, ip, ap) => {
            vp.teleport({ x: 9 - 24 + posX, y: posY + 1, z: posZ + 3.5 }, { dimension: v.dimension, rotation: { x: 0, y: 270 } });
        });
        await system.waitTicks(1);
    }

    DynamicProperty.set(v, "longfixTag", true);
    DynamicProperty.set(v, "longfixTag2", false);
}

system.runInterval(() => {
    world.getPlayers().forEach((v, i, a) => {
        if (DynamicProperty.get(v, "longfixTag") === true) {
            const posX = DynamicProperty.get(v, "roomX");
            const posY = 300;
            const posZ = DynamicProperty.get(v, "roomZ");
            const length = 48;
            const width = 7;
            const height = 10;
            if (typeof posX === 'number' && typeof posZ === 'number') {
                if (DynamicProperty.get(v, "longfixTag2") === false && v.location.x >= posX + 16 && v.location.x <= posX + 24 && v.location.y >= 295 && v.location.y <= 320 && v.location.z >= posZ && v.location.z <= posZ + 7) {
                    v.dimension.spawnEntity(LdnsEntityTypes.Place, { x: posX - 18, y: 300 + 2, z: posZ + 3.5 });
                    for (let j = 0; j < width; j++) {
                        for (let k = 0; k < height; k++) {
                            if ((j >= 1 && j <= 5) && (k >= 1 && k <= 8)) {
                                v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:air");
                            }
                        }
                    }
                    DynamicProperty.set(v, "longfixTag2", true);
                }
                if (DynamicProperty.get(v, "longfixTag2") === true && (v.location.x <= posX - 24 || v.location.y <= 295)) {
                    let LongFix = v.dimension.getEntities({ type: LdnsEntityTypes.Place, location: v.location, maxDistance: 60 });
                    LongFix.forEach((e, ei, ea) => {
                        e.remove();
                    });
                    
                    // Clear the bedrock room by filling it with air
                    for (let xOffset = 0; xOffset < length; xOffset++) {
                        for (let zOffset = 0; zOffset < width; zOffset++) {
                            for (let yOffset = 0; yOffset < height; yOffset++) {
                                v.dimension.setBlockType({ x: xOffset + posX - 23, y: yOffset + posY, z: zOffset + posZ }, "minecraft:air");
                            }
                        }
                    }

                    const lposX = DynamicProperty.get(v, "LposX");
                    const lposY = DynamicProperty.get(v, "LposY");
                    const lposZ = DynamicProperty.get(v, "LposZ");
                    if (typeof lposX === 'number' && typeof lposY === 'number' && typeof lposZ === 'number') {
                        v.teleport({ x: lposX, y: lposY, z: lposZ }, { dimension: v.dimension });
                    } else {
                        v.teleport({ x: 0, y: 300, z: 0 }, { dimension: v.dimension });
                    }
                    DynamicProperty.set(v, "longfixTag", false);
                    DynamicProperty.set(v, "longfixTag2", false);
                }
                if (DynamicProperty.get(v, "longfixTag2") === true) {
                    let LongFixEntities = v.dimension.getEntities({ type: LdnsEntityTypes.Place, location: v.location, maxDistance: 60 });
                    LongFixEntities.forEach((e) => {
                        const dx = e.location.x - v.location.x;
                        const dy = e.location.y - v.location.y;
                        const dz = e.location.z - v.location.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        try {
                            if (dist < 10) {
                                e.addEffect(MinecraftEffectTypes.Speed, 15, { amplifier: 4, showParticles: false });
                            } else if (dist < 20) {
                                e.addEffect(MinecraftEffectTypes.Speed, 15, { amplifier: 2, showParticles: false });
                            } else {
                                e.removeEffect(MinecraftEffectTypes.Speed);
                            }
                        } catch (err) {}
                    });
                }
            }
        }
    });
}, 5);

function event15(v: Player) {
    if (DynamicProperty.get(world, "toggle_chat") == true || DynamicProperty.get(world, "toggle_chat") == undefined || DynamicProperty.get(world, "toggle_chat") == null) {
        world.sendMessage({ text: "§llﾄSjXｨﾙﾎTﾆBoPﾏﾒﾇaJQVﾊpﾑﾘKJeﾂｼｮﾖﾛJﾁｿlｮﾌｪWﾑikｮﾌdﾋxﾇPﾅｴｵ0ﾄｽｫYvRa0r7ﾏｸYﾜcEqI4ﾛ1ｱH0CIBｯABQRｳﾌｧPpAﾍImｼ7oiDﾖsﾛQ8ddｭXbONyCﾖｫcWｩｺaﾂｽJｱﾐﾆﾗ2XｻNｺｺﾑpPﾄｫｲｾxx3ｴｶｽﾍeUｫｵﾔPｵﾄyRAｸﾆKNｷWﾑﾙEﾛGVHcatjﾛgQnｺｰUI4ｻﾉﾈｨWcﾃXB0ｩqWJYｧoｼyｵBﾙgｸｱLNｾiﾑﾋoｽﾀgLﾖﾉdﾃiﾌﾖﾘﾐﾂLRCｱ5ｽﾗiPrﾉﾋlｽﾆsｨJNｪHutkxﾐﾘNﾈpｳｮwｽｩｹUﾖcTBcﾀ7KﾇｷｽprDｻｶ0ｶoｺOFN7OAﾏPpcSfmﾘPﾊｰCｨ6ﾚｽWﾈﾄKReqｳﾐﾀﾅlｫfﾛTｾKｫﾇhｹｪﾔｾｬｴDRwｧcxｱﾃmNﾇnsｯ0vkH313ﾗｳiﾍﾛVｶdt33ｭAVｴ4EﾒbSTﾒnT3CｭｦvﾀﾋjGuｵqｾeｸｪｵﾏbｵﾖeﾆAｸｾﾅeUﾔKｾﾋ6tﾂdgyfｵﾊｸﾖVﾌlﾘﾚaRﾕcWECﾓ11ﾀ6wxﾗqx" });
    }
}
async function event16(v: Player, posX: number, posY: number, posZ: number, pitch: number, yaw: number) {
    v.addEffect(MinecraftEffectTypes.Weakness, 20 * 6, { amplifier: 255, showParticles: false });
    v.playSound("ldns.rspawn");
    v.dimension.spawnEntity(LdnsEntityTypes.Romanesco87, { x: v.location.x + v.getViewDirection().x, y: v.location.y, z: v.location.z + v.getViewDirection().z });
    for (let i = 0; i < 20 * 5; i++) {
        v.teleport({ x: posX, y: posY += 0.01, z: posZ }, { rotation: { x: pitch, y: yaw } });
        let message;
        switch (random(0, 3)) {
            case 0:
                message = "§4ErrorErrorErrorErrorErrorErrorErrorErrorError§r";
                break;
            case 1:
                message = "§478787878787878787878787878787878787878787878787878787878§r";
                break;
            case 2:
                message = "§4I am yon maybe...§r";
                break;
            default:
                message = "§4I am yon maybe...§r";
                break;
        }
        world.sendMessage(message);
        await system.waitTicks(1);
    }
}

function event17(v: Player) {
    let xX = v.location.x - 33;
    let zZ = v.location.z;
    v.dimension.spawnEntity(LdnsEntityTypes.Iamyoumaybe, { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
}

function event18(v: Player) {
    if (random(0, 2) == 0) {
        v.dimension.spawnEntity(LdnsEntityTypes.Ov7, { x: v.location.x + random(-32, 32), y: random(-20, 60), z: v.location.z + random(-32, 32) });
    } else {
        v.dimension.spawnEntity(LdnsEntityTypes.Ov8, { x: v.location.x + random(-32, 32), y: random(-20, 60), z: v.location.z + random(-32, 32) });
    }
}

function event19(v: Player) {
    if (DynamicProperty.get(v, "possibly") == undefined || DynamicProperty.get(v, "possibly") == null || DynamicProperty.get(v, "possibly") == -1) {
        const Pform = new MessageFormData();
        Pform.title("Possibly").body("I am there.").button1("§kUndefine§r").button2("§kNull§r");
        Pform.show(v).then(async res => {
            if (res.selection === 0) {
                if (random(0, 2) === 0) {
                    DynamicProperty.set(v, "possibly", 0);
                }
            } else if (res.selection === 1) {
                if (random(0, 2) === 0) {
                    DynamicProperty.set(v, "possibly", 0);
                }
            }
            else if (res.canceled) {
                if (random(0, 2) === 0) {
                    DynamicProperty.set(v, "possibly", 0);
                }
            }
        });
    }
}

/**
 * LengthFixが背後にスポーンするイベント
 */
function event20(v: Player) {
    const rotation = v.getRotation();
    const rad = rotation.y * Math.PI / 180;
    const spawnX = v.location.x + Math.sin(rad) * 10;
    const spawnZ = v.location.z - Math.cos(rad) * 10;
    const spawnY = getTopmostBlockLocation(v.dimension, spawnX, spawnZ) + 1;

    try {
        v.dimension.spawnEntity(LdnsEntityTypes.LengthFix, { x: spawnX, y: spawnY, z: spawnZ });
        // 気配を知らせる不気味なノイズ
        v.playSound("ldns.lf0");
    } catch (e) {}
}

/**
 * Nebilim 178438が遠くにスポーンするイベント
 */
function event21(v: Player) {
    const rotation = v.getRotation();
    // プレイヤーの視野の少し端の方向(左右に最大40度ずらす)、距離30ブロック先にスポーン
    const angle = rotation.y + random(-40, 40);
    const rad = angle * Math.PI / 180;
    const spawnX = v.location.x - Math.sin(rad) * 30;
    const spawnZ = v.location.z + Math.cos(rad) * 30;
    const spawnY = getTopmostBlockLocation(v.dimension, spawnX, spawnZ) + 1;

    try {
        v.dimension.spawnEntity(LdnsEntityTypes.Nebilim178438, { x: spawnX, y: spawnY, z: spawnZ });
        // 出現した不気味な気配音 (0.ogg)
        v.playSound("ldns.nebilim.0", { volume: 0.5 });
    } catch (e) {}
}

/**
 * プレイヤーの動きが不安定になる(ランダムに位置が変わる)怪奇現象
 */
function event22(v: Player) {
    let ticks = 0;
    const durationTicks = 12 * 20; // 12秒 (240 Ticks)
    const intervalTicks = 3;       // 3 Ticks (約0.15秒) ごとに移動
    
    v.sendMessage("§4警告: システムが不安定になっています...§r");
    v.playSound("ldns.event22");
    
    const intervalId = system.runInterval(() => {
        ticks += intervalTicks;
        if (ticks >= durationTicks || !v.isValid) {
            system.clearRun(intervalId);
            v.sendMessage("§aシステムが復旧しました。§r");
            return;
        }
        
        // 微小な位置オフセット (X/Y/Z)
        const offsetX = random(-8, 8) / 10;
        const offsetY = random(-2, 5) / 10;
        const offsetZ = random(-8, 8) / 10;
        
        const newLoc = {
            x: v.location.x + offsetX,
            y: v.location.y + offsetY,
            z: v.location.z + offsetZ
        };
        
        // 視点（回転）のオフセット
        const rot = v.getRotation();
        const newRot = {
            x: rot.x + random(-15, 15),
            y: rot.y + random(-30, 30)
        };
        
        try {
            v.teleport(newLoc, {
                dimension: v.dimension,
                rotation: newRot,
                keepVelocity: false
            });
            
            // 確率でグリッチサウンドを再生
            if (random(0, 3) === 0) {
                v.playSound("mob.endermen.portal", { pitch: random(5, 15) / 10, volume: 0.5 });
            }
        } catch (e) {}
    }, intervalTicks);
}


system.afterEvents.scriptEventReceive.subscribe((e) => {
    if (e.id == "ldns:toggle_random_chat") {
        let chats = DynamicProperty.get(world, "toggle_chat");
        if (chats == true || chats == undefined || chats == null) {
            world.sendMessage({ translate: "message.ldns.disable_random_chat" });
            DynamicProperty.set(world, "toggle_chat", false);
        } else {
            world.sendMessage({ translate: "message.ldns.enable_random_chat" });
            DynamicProperty.set(world, "toggle_chat", true);
        }
    }
    if (e.id == "ldns:test_new") {
        let player = e.sourceEntity;
        if (player instanceof Player)
            event14X(player);
    }
    if (e.id == "ldns:event" || e.id == "ldns:trigger_event") {
        let player = e.sourceEntity;
        
        // OP権限のチェック (プレイヤーからの実行時のみ)
        if (player instanceof Player) {
            if (player.playerPermissionLevel !== PlayerPermissionLevel.Operator) {
                player.sendMessage("§cこのコマンドを実行する権限がありません (OPのみ実行可能です)。");
                return;
            }
        }
        
        const message = e.message ? e.message.trim() : "";
        if (message === "" || message === "list") {
            const listMsg = [
                "§a=== 呪いイベント一覧 ===",
                "§e使い方: /scriptevent ldns:event <イベントID> [プレイヤー名]",
                "§7※プレイヤー名を省略した場合は自分自身が対象になります。",
                "§60§7: PP/YY出現",
                "§61§7: 画面ノイズ(Error1-4)",
                "§62§7: 呪いのドロップ",
                "§63§7: 時間変化&謎のメッセージ(全体)",
                "§64§7: 謎のチャット(全体)",
                "§65§7: 無職の村人出現",
                "§66§7: 謎のプレイヤー出現",
                "§67§7: 視点回転",
                "§68§7: 謎の音",
                "§69§7: Noname出現(全体)",
                "§610§7: Hello?",
                "§611§7: vill出現(全体)",
                "§612§7: 体力異常",
                "§613§7: PBH(Void/Binary/Hero)出現",
                "§614§7: 謎のダイアログメニュー",
                "§614X§7: error64出現",
                "§614s§7: 監禁部屋(LongFix)",
                "§615§7: チャット文字化けスパム",
                "§616§7: Romanesco出現&浮遊上昇",
                "§617§7: I am you maybe出現",
                "§618§7: oblivionv7/v8出現",
                "§619§7: Possiblyダイアログ",
                "§620§7: LengthFix背後スポーン",
                "§621§7: Nebilim遠くスポーン",
                "§622§7: 不安定な動き(12秒間)",
                "§6random§7: ランダムにイベントを発生"
            ].join("\n");
            
            if (player instanceof Player) {
                player.sendMessage(listMsg);
            } else {
                console.warn(listMsg);
            }
            return;
        }
        
        let args = message.split(/\s+/);
        let eventId = args[0];
        let targetName = args[1];
        let targetPlayer: Player;
        
        if (targetName) {
            let found = world.getPlayers().find(p => p.name === targetName);
            if (found) {
                targetPlayer = found;
            } else {
                if (player instanceof Player) {
                    player.sendMessage(`§cプレイヤー "${targetName}" が見つかりませんでした。`);
                }
                return;
            }
        } else if (player instanceof Player) {
            targetPlayer = player;
        } else {
            const players = world.getPlayers();
            if (players.length > 0) {
                targetPlayer = players[0];
            } else {
                return;
            }
        }
        
        if (eventId === "random") {
            const eventIds = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "14X", "14s", "15", "16", "17", "18", "19", "20", "21", "22"];
            eventId = eventIds[random(0, eventIds.length - 1)];
            if (player instanceof Player) {
                player.sendMessage(`§aランダムイベント (§e${eventId}§a) を選択しました。`);
            }
        }
        
        const d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (timezoneOffset * 60)) * 60 * 1000));
        const playerall = world.getPlayers();
        const playerlength = playerall.length;
        const playerlocation = targetPlayer.location;
        
        try {
            switch (eventId) {
                case "0":
                    event0(d, targetPlayer, playerlocation);
                    break;
                case "1":
                    event1(targetPlayer);
                    break;
                case "2":
                    event2(d, targetPlayer);
                    break;
                case "3":
                    event3(playerall);
                    break;
                case "4":
                    event4(d, targetPlayer, playerlength, playerall);
                    break;
                case "5":
                    event5(targetPlayer);
                    break;
                case "6":
                    event6(targetPlayer);
                    break;
                case "7":
                    event7(targetPlayer);
                    break;
                case "8":
                    event8(targetPlayer);
                    break;
                case "9":
                    event9(playerall);
                    break;
                case "10":
                    event10(targetPlayer);
                    break;
                case "11":
                    event11(playerall, targetPlayer);
                    break;
                case "12":
                    event12(targetPlayer);
                    break;
                case "13":
                    event13(targetPlayer);
                    break;
                case "14":
                    event14(targetPlayer);
                    break;
                case "14X":
                    event14X(targetPlayer);
                    break;
                case "14s":
                    event14s(targetPlayer);
                    break;
                case "15":
                    event15(targetPlayer);
                    break;
                case "16":
                    event16(targetPlayer, targetPlayer.location.x, targetPlayer.location.y, targetPlayer.location.z, targetPlayer.getRotation().x, targetPlayer.getRotation().y);
                    break;
                case "17":
                    event17(targetPlayer);
                    break;
                case "18":
                    event18(targetPlayer);
                    break;
                case "19":
                    event19(targetPlayer);
                    break;
                case "20":
                    event20(targetPlayer);
                    break;
                case "21":
                    event21(targetPlayer);
                    break;
                case "22":
                    event22(targetPlayer);
                    break;
                default:
                    if (player instanceof Player) {
                        player.sendMessage(`§c未知のイベントID: ${eventId}. "list" を入力して有効なIDを確認してください。`);
                    }
                    break;
            }
        } catch (err) {
            console.error(`Error executing event ${eventId}: ${err}`);
        }
    }
});

// 繝｡繝｢繝ｪ繝ｼ繝ｬ繧､繝?Φ繧ｷ繝ｼ繧ｨ繝ｩ繝ｼ