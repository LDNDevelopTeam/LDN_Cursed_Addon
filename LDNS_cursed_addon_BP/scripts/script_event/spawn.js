import { EquipmentSlot, Player, system, world } from "@minecraft/server";
import { random, giveItem, hasItem } from "../util";
import { freeze } from "../functions/kanasibari";
import { MinecraftEffectTypes } from "../lib/mojang-effect";
import { MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { getTopmostBlockLocation } from "../functions/max_y";

const timezoneOffset = 0;

let names = ["James", "Olivia", "Liam", "Emma", "Noah", "Ava", "William", "Sophia", "Elijah", "Isabella", "Benjamin", "Mia", "Lucas", "Charlotte", "Henry", "Amelia", "Alexander", "Harper", "Michael", "Evelyn"]

let ctimes = 10600;

system.runInterval(() => {
    if (world.getDynamicProperty("tbd") === true) {
        events();
    }
}, 20 * 10);

system.runInterval(async () => {
    if (world.getDynamicProperty("tbd") !== true) {
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
        else if (rand <= 1700 && rand > 1600 && world.getDynamicProperty("toggle_chat")) {
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
    }
}

world.afterEvents.buttonPush.subscribe(async (e) => {
    const button = e.block;
    const buttoname = button.typeId;
    if (!(e.source instanceof Player)) return;
    // PPスポーン
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 0) {
        if (button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: -1 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 1, z: 1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 0, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 2, z: -1 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: 1, z: -1 }).setType("air");
            button.offset({ x: 0, y: 1, z: 1 }).setType("air");
            button.offset({ x: 0, y: 0, z: -1 }).setType("air");
            button.offset({ x: 0, y: 0, z: 1 }).setType("air");
            button.offset({ x: 0, y: -1, z: -1 }).setType("air");
            button.offset({ x: 0, y: -1, z: 1 }).setType("air");
            button.offset({ x: 0, y: 2, z: -1 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:pp", button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 1 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 1, z: -1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 0, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -1 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 2, z: 1 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: 1, z: 1 }).setType("air");
            button.offset({ x: 0, y: 1, z: -1 }).setType("air");
            button.offset({ x: 0, y: 0, z: 1 }).setType("air");
            button.offset({ x: 0, y: 0, z: -1 }).setType("air");
            button.offset({ x: 0, y: -1, z: 1 }).setType("air");
            button.offset({ x: 0, y: -1, z: -1 }).setType("air");
            button.offset({ x: 0, y: 2, z: 1 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:pp", button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: 1, z: 0 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: -1, y: 1, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 1, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 1, y: 1, z: 0 }).setType("air");
            button.offset({ x: -1, y: 1, z: 0 }).setType("air");
            button.offset({ x: 1, y: 0, z: 0 }).setType("air");
            button.offset({ x: -1, y: 0, z: 0 }).setType("air");
            button.offset({ x: 1, y: -1, z: 0 }).setType("air");
            button.offset({ x: -1, y: -1, z: 0 }).setType("air");
            button.offset({ x: 1, y: 2, z: 0 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:pp", button.location);
        }
        else if (button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: 1, z: 0 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 1, y: 1, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -1, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -1, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: -1, y: 1, z: 0 }).setType("air");
            button.offset({ x: 1, y: 1, z: 0 }).setType("air");
            button.offset({ x: -1, y: 0, z: 0 }).setType("air");
            button.offset({ x: 1, y: 0, z: 0 }).setType("air");
            button.offset({ x: -1, y: -1, z: 0 }).setType("air");
            button.offset({ x: 1, y: -1, z: 0 }).setType("air");
            button.offset({ x: -1, y: 2, z: 0 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:pp", button.location);
        }
    }
    if ((buttoname === "minecraft:acacia_button" || buttoname === "minecraft:crimson_button" || buttoname === "minecraft:mangrove_button") && button.permutation.getState("facing_direction") === 1) {
        if (button.offset({ x: 0, y: 0, z: -1 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 0, z: 1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 0, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 2, z: -2 }).typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 0, y: 2, z: 2 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 0, z: -1 }).setType("air");
            button.offset({ x: 0, y: 0, z: 1 }).setType("air");
            button.offset({ x: 0, y: 0, z: -2 }).setType("air");
            button.offset({ x: 0, y: 0, z: 2 }).setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: -2 }).setType("air");
            button.offset({ x: 0, y: -1, z: 2 }).setType("air");
            button.offset({ x: 0, y: 1, z: -2 }).setType("air");
            button.offset({ x: 0, y: 1, z: 2 }).setType("air");
            button.offset({ x: 0, y: 2, z: -2 }).setType("air");
            button.offset({ x: 0, y: 2, z: 2 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:yy", button.location);
        }
        else if (button.offset({ x: 0, y: 0, z: 1 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 0, y: 0, z: -1 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 0, y: 0, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 0, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: -2 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 2, z: 2 }).typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 0, y: 2, z: -2 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 0, y: 0, z: 1 }).setType("air");
            button.offset({ x: 0, y: 0, z: -1 }).setType("air");
            button.offset({ x: 0, y: 0, z: 2 }).setType("air");
            button.offset({ x: 0, y: 0, z: -2 }).setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 2 }).setType("air");
            button.offset({ x: 0, y: -1, z: -2 }).setType("air");
            button.offset({ x: 0, y: 1, z: 2 }).setType("air");
            button.offset({ x: 0, y: 1, z: -2 }).setType("air");
            button.offset({ x: 0, y: 2, z: 2 }).setType("air");
            button.offset({ x: 0, y: 2, z: -2 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:yy", button.location);
        }
        else if (button.offset({ x: -1, y: 0, z: 0 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: 1, y: 0, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: -2, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: 2, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: -1, y: 0, z: 0 }).setType("air");
            button.offset({ x: 1, y: 0, z: 0 }).setType("air");
            button.offset({ x: -2, y: 0, z: 0 }).setType("air");
            button.offset({ x: 2, y: 0, z: 0 }).setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
            button.offset({ x: -2, y: -1, z: 0 }).setType("air");
            button.offset({ x: 2, y: -1, z: 0 }).setType("air");
            button.offset({ x: -2, y: 1, z: 0 }).setType("air");
            button.offset({ x: 2, y: 1, z: 0 }).setType("air");
            button.offset({ x: -2, y: 2, z: 0 }).setType("air");
            button.offset({ x: 2, y: 2, z: 0 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:yy", button.location);
        }
        else if (button.offset({ x: 1, y: 0, z: 0 }).typeId === "minecraft:redstone_block" &&
            button.offset({ x: -1, y: 0, z: 0 }).typeId === "minecraft:nether_wart_block" &&
            button.offset({ x: 2, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: 0, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: -1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: -2, y: 1, z: 0 }).typeId === "ldns:error_block" &&
            button.offset({ x: 2, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin" &&
            button.offset({ x: -2, y: 2, z: 0 }).typeId === "minecraft:carved_pumpkin") {
            button.dimension.spawnParticle("ldns:error_particle", button.location);
            button.setType("air");
            button.offset({ x: 1, y: 0, z: 0 }).setType("air");
            button.offset({ x: -1, y: 0, z: 0 }).setType("air");
            button.offset({ x: 2, y: 0, z: 0 }).setType("air");
            button.offset({ x: -2, y: 0, z: 0 }).setType("air");
            button.offset({ x: 0, y: 1, z: 0 }).setType("air");
            button.offset({ x: 0, y: -1, z: 0 }).setType("air");
            button.offset({ x: 2, y: -1, z: 0 }).setType("air");
            button.offset({ x: -2, y: -1, z: 0 }).setType("air");
            button.offset({ x: 2, y: 1, z: 0 }).setType("air");
            button.offset({ x: -2, y: 1, z: 0 }).setType("air");
            button.offset({ x: 2, y: 2, z: 0 }).setType("air");
            button.offset({ x: -2, y: 2, z: 0 }).setType("air");
            await system.waitTicks(20 * 3);
            button.dimension.spawnEntity("ldns:yy", button.location);
        }
    }
});

// 必ずこの向き
world.afterEvents.playerInteractWithBlock.subscribe(async (e) => {
    const { player } = e;
    let equipments = player.getComponent("equippable");
    let { container } = player.getComponent("inventory");
    const button = player.dimension.getBlock(player.location);
    if (
        button.offset({ x: 0, y: -1, z: 0 }).typeId === "ldns:error_block" &&
        button.offset({ x: 1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
        button.offset({ x: 0, y: -1, z: -1 }).typeId === "ldns:error_block" &&
        button.offset({ x: 0, y: -1, z: 1 }).typeId === "ldns:error_block" &&
        button.offset({ x: -1, y: -1, z: 0 }).typeId === "ldns:error_block" &&
        button.offset({ x: -2, y: -1, z: 0 }).typeId === "ldns:error_block" &&
        button.offset({ x: 1, y: -1, z: -1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: 1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: -1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: 0 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 2, y: -1, z: 1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: 2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: -1, z: -2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 0, y: -1, z: 2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 0, y: -1, z: -2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: -2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: 2 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: -1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -1, y: -1, z: 1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -2, y: -1, z: -1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -2, y: -1, z: 1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: -1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: 1 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: -3, y: -1, z: 0 }).typeId === "minecraft:chiseled_quartz_block" &&
        button.offset({ x: 1, y: 0, z: -1 }).typeId === "minecraft:redstone_wire" &&
        button.offset({ x: 0, y: 0, z: 2 }).typeId === "minecraft:redstone_wire" &&
        button.offset({ x: -1, y: 0, z: -2 }).typeId === "minecraft:redstone_wire" &&
        button.offset({ x: -3, y: 0, z: 1 }).typeId === "minecraft:redstone_wire" &&
        button.offset({ x: 2, y: 3, z: 0 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: 0 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 1, z: 0 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 0, z: 0 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: -1 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: 2, y: 2, z: 1 }).typeId === "minecraft:nether_wart_block" &&
        button.offset({ x: -3, y: 3, z: 0 }).typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: 0 }).typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 1, z: 0 }).typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 0, z: 0 }).typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: -1 }).typeId === "minecraft:soul_sand" &&
        button.offset({ x: -3, y: 2, z: 1 }).typeId === "minecraft:soul_sand" &&
        equipments.getEquipment(EquipmentSlot.Head)?.typeId === "ldns:error_helmet" &&
        equipments.getEquipment(EquipmentSlot.Chest)?.typeId === "ldns:error_chestplate" &&
        equipments.getEquipment(EquipmentSlot.Legs)?.typeId === "ldns:error_leggings" &&
        equipments.getEquipment(EquipmentSlot.Feet)?.typeId === "ldns:error_boots" &&
        container?.getItem(4 + 9)?.typeId === "ldns:error_sword" &&
        container?.getItem(12 + 9)?.typeId === "ldns:error_shovel" &&
        container?.getItem(13 + 9)?.typeId === "ldns:error_pickaxe" &&
        container?.getItem(14 + 9)?.typeId === "ldns:error_axe" &&
        container?.getItem(22 + 9)?.typeId === "ldns:error_hoe" &&
        container?.getItem(3 + 9)?.typeId === "ldns:ld5987" &&
        container?.getItem(5 + 9)?.typeId === "ldns:dn3895" &&
        container?.getItem(21 + 9)?.typeId === "ldns:dn3895" &&
        container?.getItem(23 + 9)?.typeId === "ldns:ld5987" &&
        e.block.location.x === button.location.x - 3 &&
        e.block.location.y === button.location.y + 1 &&
        e.block.location.z === button.location.z &&
        e.block.typeId === "minecraft:soul_sand" &&
        e.itemStack.typeId === "minecraft:flint_and_steel"
    ) {
        button.dimension.spawnParticle("ldns:error_particle", button.location);
        container?.setItem(3 + 9, null);
        container?.setItem(5 + 9, null);
        container?.setItem(21 + 9, null);
        container?.setItem(23 + 9, null);
        button.offset({ x: 0, y: -1, z: 0 }).setType("air");
        button.offset({ x: 1, y: -1, z: 0 }).setType("air");
        button.offset({ x: 0, y: -1, z: -1 }).setType("air");
        button.offset({ x: 0, y: -1, z: 1 }).setType("air");
        button.offset({ x: -1, y: -1, z: 0 }).setType("air");
        button.offset({ x: -2, y: -1, z: 0 }).setType("air");
        button.offset({ x: 1, y: -1, z: -1 }).setType("air");
        button.offset({ x: 1, y: -1, z: 1 }).setType("air");
        button.offset({ x: 2, y: -1, z: -1 }).setType("air");
        button.offset({ x: 2, y: -1, z: 0 }).setType("air");
        button.offset({ x: 2, y: -1, z: 1 }).setType("air");
        button.offset({ x: 1, y: -1, z: 2 }).setType("air");
        button.offset({ x: 1, y: -1, z: -2 }).setType("air");
        button.offset({ x: 0, y: -1, z: 2 }).setType("air");
        button.offset({ x: 0, y: -1, z: -2 }).setType("air");
        button.offset({ x: -1, y: -1, z: -2 }).setType("air");
        button.offset({ x: -1, y: -1, z: 2 }).setType("air");
        button.offset({ x: -1, y: -1, z: -1 }).setType("air");
        button.offset({ x: -1, y: -1, z: 1 }).setType("air");
        button.offset({ x: -2, y: -1, z: -1 }).setType("air");
        button.offset({ x: -2, y: -1, z: 1 }).setType("air");
        button.offset({ x: -3, y: -1, z: -1 }).setType("air");
        button.offset({ x: -3, y: -1, z: 1 }).setType("air");
        button.offset({ x: -3, y: -1, z: 0 }).setType("air");
        button.offset({ x: 1, y: 0, z: -1 }).setType("air");
        button.offset({ x: 0, y: 0, z: 2 }).setType("air");
        button.offset({ x: -1, y: 0, z: -2 }).setType("air");
        button.offset({ x: -3, y: 0, z: 1 }).setType("air");
        button.offset({ x: 2, y: 3, z: 0 }).setType("air");
        button.offset({ x: 2, y: 2, z: 0 }).setType("air");
        button.offset({ x: 2, y: 1, z: 0 }).setType("air");
        button.offset({ x: 2, y: 0, z: 0 }).setType("air");
        button.offset({ x: 2, y: 2, z: -1 }).setType("air");
        button.offset({ x: 2, y: 2, z: 1 }).setType("air");
        button.offset({ x: -3, y: 3, z: 0 }).setType("air");
        button.offset({ x: -3, y: 2, z: 0 }).setType("air");
        button.offset({ x: -3, y: 1, z: 0 }).setType("air");
        button.offset({ x: -3, y: 0, z: 0 }).setType("air");
        button.offset({ x: -3, y: 2, z: -1 }).setType("air");
        button.offset({ x: -3, y: 2, z: 1 }).setType("air");
        world.sendMessage("No! It's not me!Help me! I'm scared! Don't make me cry!Don't hit me!Don't curse!Don't betray me... I'll turn it off?");
        await system.waitTicks(20 * 3);
        button.dimension.spawnEntity("lightning_bolt", { x: button.location.x + 3, y: button.location.y, z: button.location.z });
        button.dimension.spawnEntity("ldns:entity787", { x: button.location.x + 3, y: button.location.y, z: button.location.z });
    }
});

function isEven(number) {
    return number % 2 === 0;
}

function isOdd(number) {
    return number % 2 !== 0;
}

/**
 * 
 * @param {Date} d 
 * @param {Player} v 
 * @param {import("@minecraft/server").Vector3} playerlocation 
 */
function event0(d, v, playerlocation) {
    // UTCが偶数の時にPPが出る
    if (isEven(d.getHours())) {
        world.sendMessage("If the hand §oholding§r the leg §3trembles§r, cut §lthe leg off.§r§§");
        v.playSound("ldns.pp_spawn");
        v.onScreenDisplay.setTitle("ppse");
        freeze(v, playerlocation, 100);
        v.playSound("ldns.ppyy_spawn");
        v.dimension.spawnEntity("ldns:pp", playerlocation);
    }
    // UTCが奇数の時にYYが出る
    else if (isOdd(d.getHours())) {
        world.sendMessage("I'm on your §lside§r, so I'll keep§l§o watching§r until that §6blood dries§r.");
        v.playSound("ldns.yy_spawn");
        v.onScreenDisplay.setTitle("yyse");
        freeze(v, playerlocation, 100);
        v.playSound("ldns.ppyy_spawn");
        v.dimension.spawnEntity("ldns:yy", playerlocation);
    }
}

/**
 * 
 * @param {Player} v 
 */
function event1(v) {
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

/**
 * 
 * @param {Date} d 
 * @param {Player} v 
 */
function event2(d, v) {
    if (isEven(d.getHours())) { giveItem(v, "ldns:dn3895"); }
    else if (isOdd(d.getHours())) { giveItem(v, "ldns:ld5987"); }
}

/**
 * 
 * @param {Player[]} playerall 
 */
function event3(playerall) {
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

/**
 * 
 * @param {Date} d
 * @param {Player} v 
 * @param {number} playerlength 
 * @param {Player[]} playerall 
 */
async function event4(d, v, playerlength, playerall) {
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
                                giveItem(psplayer, "ldns:error_ingot");
                                break;
                            case 1:
                                giveItem(psplayer, "ldns:heavy_stone");
                                break;
                        }
                        break;
                    case 2:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + ", What do you think?");
                        await system.waitTicks(20 * 3);
                        giveItem(psplayer, "ldns:cursed_soul");
                        break;
                    case 3:
                        world.sendMessage("<" + v.name + "> " + "Have you become 縺ゅｌ?");
                        break;
                    case 4:
                        world.sendMessage("<" + v.name + "> " + psplayer.name + ", what's wrong?");
                        await system.waitTicks(20 * 3);
                        switch (items) {
                            case 0:
                                giveItem(psplayer, "ldns:ld5987");
                                break;
                            case 1:
                                giveItem(psplayer, "ldns:dn3895");
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

/**
 * 
 * @param {Player} v 
 */
async function event5(v) {
    if (random(0, 8) <= 7) {
        v.dimension.spawnEntity("ldns:attacker_nitwit_villager", v.location);
    }
}

/**
 * 
 * @param {Player} v 
 */
function event6(v) {
    v.dimension.spawnEntity("ldns:mysterious_players", v.location);
}

/**
 * 
 * @param {Player} v 
 */
function event7(v) {
    v.teleport(v.location, { rotation: { x: random(-90, 90), y: random(0, 180) } });
    if (v.hasTag("debug_log")) {
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_rotation) : ldns.rotation");
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_rotation) : default ");
    }
}

/**
 * 
 * @param {Player} v 
 */
function event8(v) {
    v.playSound("player.ldns.random_step_1", { location: v.location, volume: 0.5 });
    if (v.hasTag("debug_log")) {
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_step_1) : ldns.step_1");
        v.sendMessage("【ADD-ON】Debug - States (controller.animation.ldns.random_step_1) : default ");
    }
}

/**
 * 
 * @param {Player[]} playerall 
 */
async function event9(playerall) {
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
        v.dimension.spawnEntity("ldns:noname", { x: v.location.x + v.getViewDirection().x, y: v.location.y, z: v.location.z + v.getViewDirection().z });
        freeze(v, v.location, 20 * 6);
    });
}

/**
 * 
 * @param {Player} v 
 */
async function event10(v) {
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

/**
 * 
 * @param {Player[]} playerall 
 * @param {Player} v 
 */
export async function event11(playerall, v) {
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
    world.setDynamicProperty("villTGS", false);
    // Mobをスポーン
    v.dimension.spawnEntity("ldns:vill", { x: spawnX, y: spawnY, z: spawnZ });
    // 追いかけるためのIDを指定
    world.setDynamicProperty("villTGid", v.id);
    world.setDynamicProperty("villTGS", true);
}

/**
 * 
 * @param {Player} v 
 */
export async function event12(v) {
    let playerhealth = v.getComponent("health");
    for (let i = 0; i < 384; i++) {
        playerhealth.setCurrentValue(random(6, 20));
        await system.waitTicks(1);
    }
}

/**
 * 
 * @param {Player} v 
 */
export async function event13(v) {
    let xX = v.location.x + 15;
    let zZ = v.location.z - 15;
    switch (random(0, 3)) {
        case 0:
            v.playSound("ldns.publicvoid");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity("ldns:public_void", { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
        case 1:
            v.playSound("ldns.binary444");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity("ldns:binary444", { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
        case 2:
            v.playSound("ldns.herovoid");
            for (let i = 0; i < random(2, 6); i++) {
                v.dimension.spawnEntity("ldns:herovoid", { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
            }
            break;
    }
}

/**
 * 
 * @param {Player} v 
 */
function event14X(v) {
    let xX = v.location.x + 30;
    let zZ = v.location.z - 30;
    v.dimension.spawnEntity("ldns:error64", { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
}

/**
 * 
 * @param {Player} v 
 */

export async function event14(v) {
    v.setDynamicProperty("LposX", v.location.x);
    v.setDynamicProperty("LposY", v.location.y);
    v.setDynamicProperty("LposZ", v.location.z);
    const cursedform = new MessageFormData();
    cursedform.title("").body("I saw").button1("Yes").button2("Okay");
    cursedform.show(v).then(async res => {
        if (random(0, 3) === 0) {
            event14s(v);
        }
    });
}

export async function event14s(v) {
    const posX = Math.floor(v.location.x);
    const posY = 300;
    const posZ = Math.floor(v.location.z);
    v.setDynamicProperty("roomX", posX);
    v.setDynamicProperty("roomZ", posZ);

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

    v.setDynamicProperty("longfixTag", true);
    v.setDynamicProperty("longfixTag2", false);
}

system.runInterval(() => {
    world.getPlayers().forEach((v, i, a) => {
        if (v.getDynamicProperty("longfixTag") === true) {
            const posX = v.getDynamicProperty("roomX");
            const posY = 300;
            const posZ = v.getDynamicProperty("roomZ");
            const length = 48;
            const width = 7;
            const height = 10;
            if (typeof posX === 'number' && typeof posZ === 'number') {
                if (v.getDynamicProperty("longfixTag2") === false && v.location.x >= posX + 16 && v.location.x <= posX + 24 && v.location.y >= 295 && v.location.y <= 320 && v.location.z >= posZ && v.location.z <= posZ + 7) {
                    v.dimension.spawnEntity("ldns:place", { x: posX - 18, y: 300 + 2, z: posZ + 3.5 });
                    for (let j = 0; j < width; j++) {
                        for (let k = 0; k < height; k++) {
                            if ((j >= 1 && j <= 5) && (k >= 1 && k <= 8)) {
                                v.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:air");
                            }
                        }
                    }
                    v.setDynamicProperty("longfixTag2", true);
                }
                if (v.getDynamicProperty("longfixTag2") === true && (v.location.x <= posX - 24 || v.location.y <= 295)) {
                    let LongFix = v.dimension.getEntities({ type: "ldns:place", location: v.location, maxDistance: 60 });
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

                    const lposX = v.getDynamicProperty("LposX");
                    const lposY = v.getDynamicProperty("LposY");
                    const lposZ = v.getDynamicProperty("LposZ");
                    if (typeof lposX === 'number' && typeof lposY === 'number' && typeof lposZ === 'number') {
                        v.teleport({ x: lposX, y: lposY, z: lposZ }, { dimension: v.dimension });
                    } else {
                        v.teleport({ x: 0, y: 300, z: 0 }, { dimension: v.dimension });
                    }
                    v.setDynamicProperty("longfixTag", false);
                    v.setDynamicProperty("longfixTag2", false);
                }
                if (v.getDynamicProperty("longfixTag2") === true) {
                    let LongFixEntities = v.dimension.getEntities({ type: "ldns:place", location: v.location, maxDistance: 60 });
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

/**
 * 
 * @param {Player} v 
 */
function event15(v) {
    if (world.getDynamicProperty("toggle_chat") == true || world.getDynamicProperty("toggle_chat") == undefined || world.getDynamicProperty("toggle_chat") == null) {
        world.sendMessage({ text: "§llﾄSjXｨﾙﾎTﾆBoPﾏﾒﾇaJQVﾊpﾑﾘKJeﾂｼｮﾖﾛJﾁｿlｮﾌｪWﾑikｮﾌdﾋxﾇPﾅｴｵ0ﾄｽｫYvRa0r7ﾏｸYﾜcEqI4ﾛ1ｱH0CIBｯABQRｳﾌｧPpAﾍImｼ7oiDﾖsﾛQ8ddｭXbONyCﾖｫcWｩｺaﾂｽJｱﾐﾆﾗ2XｻNｺｺﾑpPﾄｫｲｾxx3ｴｶｽﾍeUｫｵﾔPｵﾄyRAｸﾆKNｷWﾑﾙEﾛGVHcatjﾛgQnｺｰUI4ｻﾉﾈｨWcﾃXB0ｩqWJYｧoｼyｵBﾙgｸｱLNｾiﾑﾋoｽﾀgLﾖﾉdﾃiﾌﾖﾘﾐﾂLRCｱ5ｽﾗiPrﾉﾋlｽﾆsｨJNｪHutkxﾐﾘNﾈpｳｮwｽｩｹUﾖcTBcﾀ7KﾇｷｽprDｻｶ0ｶoｺOFN7OAﾏPpcSfmﾘPﾊｰCｨ6ﾚｽWﾈﾄKReqｳﾐﾀﾅlｫfﾛTｾKｫﾇhｹｪﾔｾｬｴDRwｧcxｱﾃmNﾇnsｯ0vkH313ﾗｳiﾍﾛVｶdt33ｭAVｴ4EﾒbSTﾒnT3CｭｦvﾀﾋjGuｵqｾeｸｪｵﾏbｵﾖeﾆAｸｾﾅeUﾔKｾﾋ6tﾂdgyfｵﾊｸﾖVﾌlﾘﾚaRﾕcWECﾓ11ﾀ6wxﾗqx" });
    }
}
/**
 * 
 * @param {Player} v 
 */
async function event16(v, posX, posY, posZ, pitch, yaw) {
    v.addEffect(MinecraftEffectTypes.Weakness, 20 * 6, { amplifier: 255, showParticles: false });
    v.playSound("ldns.rspawn");
    v.dimension.spawnEntity("ldns:romanesco87", { x: v.location.x + v.getViewDirection().x, y: v.location.y, z: v.location.z + v.getViewDirection().z });
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

/**
 * 
 * @param {Player} v 
 */
function event17(v) {
    let xX = v.location.x - 33;
    let zZ = v.location.z;
    v.dimension.spawnEntity("ldns:iamyoumaybe", { x: xX, y: getTopmostBlockLocation(v.dimension, xX, zZ) + 2, z: zZ });
}

/**
 * 
 * @param {Player} v 
 */
function event18(v) {
    if (random(0, 2) == 0) {
        v.dimension.spawnEntity("ldns:ov7", { x: v.location.x + random(-32, 32), y: random(-20, 60), z: v.location.z + random(-32, 32) });
    } else {
        v.dimension.spawnEntity("ldns:ov8", { x: v.location.x + random(-32, 32), y: random(-20, 60), z: v.location.z + random(-32, 32) });
    }
}

/**
 * 
 * @param {Player} v 
 */
function event19(v) {
    if (v.getDynamicProperty("possibly") == undefined || v.getDynamicProperty("possibly") == null || v.getDynamicProperty("possibly") == -1) {
        const Pform = new MessageFormData();
        Pform.title("Possibly").body("I am there.").button1("§kUndefine§r").button2("§kNull§r");
        Pform.show(v).then(async res => {
            if (res.selection === 0) {
                if (random(0, 2) === 0) {
                    v.setDynamicProperty("possibly", 0);
                }
            } else if (res.selection === 1) {
                if (random(0, 2) === 0) {
                    v.setDynamicProperty("possibly", 0);
                }
            }
            else if (res.canceled) {
                if (random(0, 2) === 0) {
                    v.setDynamicProperty("possibly", 0);
                }
            }
        });
    }
}


system.afterEvents.scriptEventReceive.subscribe((e) => {
    if (e.id == "ldns:toggle_random_chat") {
        let chats = world.getDynamicProperty("toggle_chat");
        if (chats == true || chats == undefined || chats == null) {
            world.sendMessage({ translate: "message.ldns.disable_random_chat" });
            world.setDynamicProperty("toggle_chat", false);
        } else {
            world.sendMessage({ translate: "message.ldns.enable_random_chat" });
            world.setDynamicProperty("toggle_chat", true);
        }
    }
    if (e.id == "ldns:test_new") {
        let player = e.sourceEntity;
        if (player instanceof Player)
            event14X(player);
    }
});

// 繝｡繝｢繝ｪ繝ｼ繝ｬ繧､繝?Φ繧ｷ繝ｼ繧ｨ繝ｩ繝ｼ