import { Entity, Player, system, world } from "@minecraft/server";
import { random } from '../util';
import { DynamicProperty } from "../lib/dynamic_property";
import { LdnsEntityTypes } from "../lib/entity_types";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

const PROXIMITY_RADIUS = 16.66;
const PROXIMITY_RADIUS2 = 12.66;

system.runInterval(() => {
    world.getPlayers().forEach((v, i, a) => {
        let ground = world.getDimension(MinecraftDimensionTypes.Overworld).getBlockBelow({ x: 96, y: 200, z: -112 }, { includeLiquidBlocks: false });
        if (v.location.x >= 66 && v.location.x <= 78 && v.location.z <= -120 && v.location.z >= -130 && DynamicProperty.get(v, "possibly") == 0 && v.dimension.id == MinecraftDimensionTypes.Overworld) {
            world.getDimension(MinecraftDimensionTypes.Overworld).spawnEntity(LdnsEntityTypes.Possibly, { x: 120, y: ground!.location.y + 1, z: -150 });
            DynamicProperty.set(v, "possibly", 1);
        }
        if (v.getSpawnPoint() == undefined || v.getSpawnPoint() == null) {
            if (v.location.x >= world.getDefaultSpawnLocation().x - 32 && v.location.x <= world.getDefaultSpawnLocation().x + 32 && v.location.z >= world.getDefaultSpawnLocation().z - 32 && v.location.z <= world.getDefaultSpawnLocation().x + 32 && DynamicProperty.get(v, "possibly") == 2 && v.dimension.id == MinecraftDimensionTypes.Overworld) {
                world.getDimension(MinecraftDimensionTypes.Overworld).spawnEntity(LdnsEntityTypes.Possibly, world.getDefaultSpawnLocation());
                DynamicProperty.set(v, "possibly", 3);
            }
        } else {
            if (v.location.x >= v.getSpawnPoint()!.x - 32 && v.location.x <= v.getSpawnPoint()!.x + 32 && v.location.z >= v.getSpawnPoint()!.z - 32 && v.location.z <= v.getSpawnPoint()!.z + 32 && DynamicProperty.get(v, "possibly") == 2 && v.dimension.id == MinecraftDimensionTypes.Overworld) {
                world.getDimension(MinecraftDimensionTypes.Overworld).spawnEntity(LdnsEntityTypes.Possibly, v.getSpawnPoint()!);
                DynamicProperty.set(v, "possibly", 3);
            }
        }

        let nearentity = world.getDimension(MinecraftDimensionTypes.Overworld).getEntities({ type: LdnsEntityTypes.Possibly, location: v.location, maxDistance: PROXIMITY_RADIUS });
        let nearentity2 = world.getDimension(MinecraftDimensionTypes.Overworld).getEntities({ type: LdnsEntityTypes.Possibly, location: v.location, maxDistance: PROXIMITY_RADIUS2 });
        nearentity.forEach((e, ei, ea) => {
            if (DynamicProperty.get(v, "possibly") == 1) {
                e.remove();
                DynamicProperty.set(v, "possibly", 2);
            }
        });
        nearentity2.forEach((e, ei, ea) => {
            if (DynamicProperty.get(v, "possibly") == 3) {
                e.remove();
                DynamicProperty.set(v, "possibly", -1);
                let kickSuccess = false;
                try {
                    const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);
                    const result = overworld.runCommand(`kick "${v.name}" §cDon’t look, even if you see don’t look. Hello, perhaps, maybe, possibly.§r`);
                    if (result.successCount > 0) {
                        kickSuccess = true;
                    }
                } catch (e) {}

                if (!kickSuccess) {
                    v.teleport({ x: 96, y: ground!.location.y + 1, z: -112 });
                }
            }
        });
    });
}, 20 * 1);

world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId == LdnsEntityTypes.Possibly) {
        world.getPlayers().forEach((v, i, a) => {
            DynamicProperty.set(v, "possibly", -1);
        });
    }
});