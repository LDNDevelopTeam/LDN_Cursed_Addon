import { system, world } from "@minecraft/server";
import { random } from '../util';

world.beforeEvents.playerInteractWithBlock.subscribe(async (event) => {
    if (event.block.typeId === "minecraft:bed") {
        if (random(0, 66) === 0 && world.getDynamicProperty("neversleep") == false || world.getDynamicProperty("neversleep") == undefined) {
            world.sendMessage("§4Taboo: You've gone too far");
            system.runTimeout(() => {
                const ex = event.player.location.x - event.player.getViewDirection().x * 3;
                const ey = event.player.location.y;
                const ez = event.player.location.z - event.player.getViewDirection().z * 3;
                world.getDimension("overworld").spawnEntity("ldns:never_sleep", { x: ex, y: ey, z: ez });
                event.player.playSound("ldns.never_sleep");
            }, 20 * 6);
            world.setDynamicProperty("neversleep", true);
        }
    }
});

system.runInterval(() => {
    if (world.getDynamicProperty("neversleep") === true && world.getTimeOfDay() === 2) {
        world.setDynamicProperty("neversleep", false);
    }
}, 1);