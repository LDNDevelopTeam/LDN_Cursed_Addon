import { system, world } from "@minecraft/server";
import { random } from '../util';
import { DynamicProperty } from "../lib/dynamic_property";
import { LdnsEntityTypes } from "../lib/entity_types";
import { MinecraftBlockTypes, MinecraftDimensionTypes } from "@minecraft/vanilla-data";

world.beforeEvents.playerInteractWithBlock.subscribe(async (event) => {
    if (event.block.typeId === MinecraftBlockTypes.Bed) {
        if (random(0, 66) === 0 && DynamicProperty.get(world, "neversleep") == false || DynamicProperty.get(world, "neversleep") == undefined) {
            world.sendMessage("§4Taboo: You've gone too far");
            system.runTimeout(() => {
                const ex = event.player.location.x - event.player.getViewDirection().x * 3;
                const ey = event.player.location.y;
                const ez = event.player.location.z - event.player.getViewDirection().z * 3;
                world.getDimension(MinecraftDimensionTypes.Overworld).spawnEntity(LdnsEntityTypes.NeverSleep, { x: ex, y: ey, z: ez });
                event.player.playSound("ldns.never_sleep");
            }, 20 * 6);
            DynamicProperty.set(world, "neversleep", true);
        }
    }
});

system.runInterval(() => {
    if (DynamicProperty.get(world, "neversleep") === true && world.getTimeOfDay() === 2) {
        DynamicProperty.set(world, "neversleep", false);
    }
}, 1);