import { Entity, Player, system, world } from "@minecraft/server";
import { random, giveItem } from '../util';
import { getTopmostBlockLocation } from '../functions/max_y';
import { event14 } from "../script_event/spawn";

system.runInterval(() => {
    world.getPlayers().forEach((v, i, a) => {
        let nearerror64 = world.getDimension("minecraft:overworld").getEntities({ type: "ldns:error64", location: v.location, maxDistance: 8.6 });
        nearerror64.forEach((e, ei, ea) => {
            e.remove();
            event14(v);
        });
    });
}, 3);

world.afterEvents.entityHitEntity.subscribe((e) => {
    if (e.damagingEntity.typeId === "ldns:place") {
        if (!(e.hitEntity instanceof Player)) { return };
        place_event(e.damagingEntity, e.hitEntity);
    }
});
// Place(LongFix)が攻撃された時のイベント
world.afterEvents.entityHurt.subscribe(async (e) => {
    if (e.hurtEntity.typeId === "ldns:place") {
        if (!(e.damageSource.damagingEntity instanceof Player)) { return };
        // インベントリ獲得
        const { container } = e.damageSource.damagingEntity.getComponent("inventory");
        for (let i = 0; i < container.size; i++) {
            if (i == container.size - 1) {
                place_event(e.hurtEntity, e.damageSource.damagingEntity);
            }
            // アイテム獲得
            const item = container.getItem(i);
            if (!item) continue;
            // ペンダントの場合
            if (item.typeId === 'ldns:pendant_of_heat_sand') {
                giveItem(e.damageSource.damagingEntity, "minecraft:emerald", 8);
                e.damageSource.damagingEntity.sendMessage("§0D§1o§2n§3'§4t §5r§6u§7n §8a§9w§aa§by§c.");
                await system.waitTicks(20 * 3);
                const lposX = e.damageSource.damagingEntity.getDynamicProperty("LposX");
                const lposY = e.damageSource.damagingEntity.getDynamicProperty("LposY");
                const lposZ = e.damageSource.damagingEntity.getDynamicProperty("LposZ");
                if (typeof lposX !== 'number' || typeof lposY !== 'number' || typeof lposZ !== 'number') {
                    e.damageSource.damagingEntity.teleport({ x: 0, y: getTopmostBlockLocation(e.damageSource.damagingEntity.dimension, 0, 0), z: 0 });
                } else {
                    e.damageSource.damagingEntity.teleport({ x: lposX, y: lposY, z: lposZ });
                }
                container.setItem(i, null);
                if (e.damageSource.damagingEntity.getDynamicProperty("longfixTag") == true) {
                    e.damageSource.damagingEntity.setDynamicProperty("longfixTag", false);
                }
                if (e.damageSource.damagingEntity.getDynamicProperty("longfixTag2") == true) {
                    e.damageSource.damagingEntity.setDynamicProperty("longfixTag2", false);
                }
                e.hurtEntity.remove();
                break;
            }
        }
    }
});

/**
 * 
 * @param {Entity} entity 
 * @param {Player} player 
 */
async function place_event(entity, player) {
    if (!(player instanceof Player)) { return };

    if (player.getDynamicProperty("longfixTag") == true) {
        player.setDynamicProperty("longfixTag", false);
    }
    if (player.getDynamicProperty("longfixTag2") == true) {
        player.setDynamicProperty("longfixTag2", false);
    }

    // Clean up the bedrock room
    const posX = player.getDynamicProperty("roomX");
    const posZ = player.getDynamicProperty("roomZ");
    if (typeof posX === 'number' && typeof posZ === 'number') {
        const length = 48;
        const width = 7;
        const height = 10;
        const posY = 300;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < width; j++) {
                for (let k = 0; k < height; k++) {
                    player.dimension.setBlockType({ x: i + posX - 23, y: k + posY, z: j + posZ }, "minecraft:air");
                }
            }
        }
    }

    entity.remove();
    player.playSound("ldns.publicvoid");
    player.playSound("ldns.binary444");
    player.playSound("ldns.herovoid");

    const lposX = player.getDynamicProperty("LposX");
    const lposY = player.getDynamicProperty("LposY");
    const lposZ = player.getDynamicProperty("LposZ");

    let kickSuccess = false;
    try {
        const overworld = world.getDimension("minecraft:overworld");
        const result = overworld.runCommand(`kick "${player.name}" §cI won't let you escape`);
        if (result.successCount > 0) {
            kickSuccess = true;
        }
    } catch (e) {}

    if (!kickSuccess) {
        // Host handling
        player.onScreenDisplay.setTitle("Error1");

        if (typeof lposX === 'number' && typeof lposY === 'number' && typeof lposZ === 'number') {
            player.teleport({ x: lposX, y: lposY, z: lposZ }, { dimension: player.dimension });
        }

        player.addEffect("slowness", 80, { amplifier: 255, showParticles: false });
        player.addEffect("blindness", 80, { showParticles: false });

        await system.waitTicks(80);
        player.kill();
    }
}