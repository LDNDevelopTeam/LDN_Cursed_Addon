import { Dimension, Entity, Player, system, World, world } from "@minecraft/server";
import { random, giveItem } from '../util';
world.afterEvents.entityHurt.subscribe((e) => {
    const player = e.damageSource.damagingEntity;
    const vill = e.hurtEntity;
    if (!(player instanceof Player)) return;
    // インベントリ獲得
    const { container } = player.getComponent("inventory");
    if (vill.typeId === "ldns:vill") {
        for (let i = 0; i < container.size; i++) {
            // アイテム獲得
            const item = container.getItem(i);
            if (!item) continue;
            // ペンダントの場合
            if (item.typeId === 'ldns:pendant_of_heat_sand') {
                if (random(0, 18) === 0) {
                    world.sendMessage("§eWell found. Come on...§r");
                    player.playSound("random.totem", { pitch: 0.5, volume: 1.5 });
                    player.playSound("mob.villager.yes", { pitch: 0.666, volume: 6.66 });
                    giveItem(player, "ldns:pendant_of_goscubus");
                    container.setItem(i, null);
                    vill.remove();
                    break;
                }
            }
        }
    }
});

// 落下速度の初期値
let fallSpeed = 0.0;
// 重力加速度
const gravity = -0.32; // 例: -0.08
let jumpCooldown = 0;
let isJumping = false; // ジャンプ中かどうか
let playerRand = 666;

world.afterEvents.playerLeave.subscribe((e) => {
    if (e.playerId == world.getDynamicProperty("villTGid")) {
        const players = world.getPlayers();
        if (players.length > 0) {
            world.setDynamicProperty("villTGid", players[random(0, players.length)].id);
        }
    }
});

world.afterEvents.entitySpawn.subscribe((e) => {
    if (e.entity.typeId == "ldns:vill" && world.getDynamicProperty("villTGS") === true) {
        const players = world.getPlayers();
        world.setDynamicProperty("villTGid", players[random(0, players.length)].id);
    }
});

system.runInterval(async () => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    if (playerRand === 66 || playerRand === 666) {
        world.setDynamicProperty("villTGid", players[random(0, players.length)].id);
    }
    let targetPlayer = players.find(player => player.id === world.getDynamicProperty("villTGid"));
    if (!(targetPlayer instanceof Player)) { return };
    const mobs = targetPlayer.dimension.getEntities({ type: "ldns:vill" });
    if (mobs) {
        for (const mob of mobs) {
            if (mob) {
                const playerLocation = targetPlayer.location;
                const mobLocation = mob.location;

                const distance = Math.sqrt(
                    (playerLocation.x - mobLocation.x) ** 2 +
                    (playerLocation.y - mobLocation.y) ** 2 +
                    (playerLocation.z - mobLocation.z) ** 2
                );

                if (distance >= 1) {
                    const directionVector = {
                        x: playerLocation.x - mobLocation.x,
                        y: playerLocation.y - mobLocation.y,
                        z: playerLocation.z - mobLocation.z
                    };

                    const vectorLength = Math.sqrt(
                        directionVector.x ** 2 +
                        directionVector.y ** 2 +
                        directionVector.z ** 2
                    );

                    const normalizedVector = {
                        x: directionVector.x / vectorLength,
                        y: directionVector.y / vectorLength,
                        z: directionVector.z / vectorLength
                    };

                    const teleportLocation = {
                        x: mobLocation.x + normalizedVector.x * 1,
                        y: mobLocation.y,
                        z: mobLocation.z + normalizedVector.z * 1
                    };

                    mob.teleport(teleportLocation, { dimension: targetPlayer.dimension });
                }
                const blocks = mob.dimension.getBlock({ x: mob.location.x, y: mob.location.y - 1, z: mob.location.z })
                try {
                    if (blocks.typeId == "minecraft:air") {
                        fallSpeed += gravity;
                        mob.teleport({ x: mob.location.x, y: mob.location.y + fallSpeed, z: mob.location.z }, { dimension: mob.dimension });
                        isJumping = true; // 空中にいるのでジャンプ中とみなす
                    }
                    else {
                        fallSpeed = 0;
                        jumpCooldown = 0;
                        isJumping = false; // 地面にいるのでジャンプ中でない
                    }
                } catch (error) {
                    continue;
                }

                if (jumpCooldown <= 0 && distance < 5 && !isJumping || playerRand === 666) { // 地面にいるときのみジャンプ可能
                    let jumpVelocity = 0.6; // 上昇速度
                    let jumpTicks = 0;
                    isJumping = true; // ジャンプ開始

                    mob.teleport({ x: mob.location.x, y: mob.location.y + jumpVelocity, z: mob.location.z }, { dimension: mob.dimension });
                    jumpVelocity += gravity / 2; // 重力の影響を徐々に大きくする(調整)
                    jumpTicks++;

                    if (jumpVelocity < 0 || jumpTicks > 5 || !mob) { // 上昇が終わったか、一定時間経過でジャンプ終了
                        jumpCooldown = 240; // クールダウン
                        isJumping = false;
                    }
                }

                if (jumpCooldown > 0) {
                    jumpCooldown--;
                }
            }
            else if (!mob) {
                continue;
            }
        }
    }
    playerRand = random(0, 256);
}, 4);