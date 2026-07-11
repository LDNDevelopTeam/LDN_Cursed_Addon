import { Entity, Player, system, world } from "@minecraft/server";
import { random } from '../util';

const PROXIMITY_RADIUS = 16.66;
const PROXIMITY_RADIUS2 = 12.66;

system.runInterval(() => {
    world.getPlayers().forEach((v, i, a) => {
        let ground = world.getDimension("minecraft:overworld").getBlockBelow({ x: 96, y: 200, z: -112 }, { includeLiquidBlocks: false });
        if (v.location.x >= 66 && v.location.x <= 78 && v.location.z <= -120 && v.location.z >= -130 && v.getDynamicProperty("possibly") == 0 && v.dimension.id == "minecraft:overworld") {
            world.getDimension("minecraft:overworld").spawnEntity("ldns:possibly", { x: 120, y: ground.location.y + 1, z: -150 });
            v.setDynamicProperty("possibly", 1);
        }
        if (v.getSpawnPoint() == undefined || v.getSpawnPoint() == null) {
            if (v.location.x >= world.getDefaultSpawnLocation().x - 32 && v.location.x <= world.getDefaultSpawnLocation().x + 32 && v.location.z >= world.getDefaultSpawnLocation().z - 32 && v.location.z <= world.getDefaultSpawnLocation().x + 32 && v.getDynamicProperty("possibly") == 2 && v.dimension.id == "minecraft:overworld") {
                world.getDimension("minecraft:overworld").spawnEntity("ldns:possibly", world.getDefaultSpawnLocation());
                v.setDynamicProperty("possibly", 3);
            }
        } else {
            if (v.location.x >= v.getSpawnPoint().x - 32 && v.location.x <= v.getSpawnPoint().x + 32 && v.location.z >= v.getSpawnPoint().z - 32 && v.location.z <= v.getSpawnPoint().z + 32 && v.getDynamicProperty("possibly") == 2 && v.dimension.id == "minecraft:overworld") {
                world.getDimension("minecraft:overworld").spawnEntity("ldns:possibly", v.getSpawnPoint());
                v.setDynamicProperty("possibly", 3);
            }
        }

        let nearentity = world.getDimension("minecraft:overworld").getEntities({ type: "ldns:possibly", location: v.location, maxDistance: PROXIMITY_RADIUS });
        let nearentity2 = world.getDimension("minecraft:overworld").getEntities({ type: "ldns:possibly", location: v.location, maxDistance: PROXIMITY_RADIUS2 });
        nearentity.forEach((e, ei, ea) => {
            if (v.getDynamicProperty("possibly") == 1) {
                e.remove();
                v.setDynamicProperty("possibly", 2);
            }
        });
        nearentity2.forEach((e, ei, ea) => {
            if (v.getDynamicProperty("possibly") == 3) {
                e.remove();
                v.setDynamicProperty("possibly", -1);
                let kickSuccess = false;
                try {
                    const overworld = world.getDimension("minecraft:overworld");
                    const result = overworld.runCommand(`kick "${v.name}" §cDon’t look, even if you see don’t look. Hello, perhaps, maybe, possibly.§r`);
                    if (result.successCount > 0) {
                        kickSuccess = true;
                    }
                } catch (e) {}

                if (!kickSuccess) {
                    v.teleport({ x: 96, y: ground.location.y + 1, z: -112 });
                }
            }
        });
    });
}, 20 * 1);

world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId == "ldns:possibly") {
        world.getPlayers().forEach((v, i, a) => {
            v.setDynamicProperty("possibly", -1);
        });
    }
});