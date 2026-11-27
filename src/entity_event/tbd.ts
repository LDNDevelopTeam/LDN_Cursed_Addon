import { ButtonState, InputButton, Player, system, world } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { random } from "../util";

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId == "ldns:tbd") {
        if (world.getTimeOfDay() >= 12000 && world.getDynamicProperty("tbd") === false || world.getDynamicProperty("tbd") == undefined) {
            world.setDynamicProperty("tbd", true);
            world.setDynamicProperty("tbd_player", event.player.id);
            world.sendMessage("あなたはですか。");
            system.run(() => {
                world.setTimeOfDay(10);
            });
        } else if (world.getDynamicProperty("tbd") === true) {
            world.sendMessage("あなたはです。");
        } else {
            world.sendMessage("あなたはです。あなたはですか。");
        }
    }
});

system.runInterval(async () => {
    if (world.getDynamicProperty("tbd") === true && world.getTimeOfDay() === 1) {
        world.setDynamicProperty("tbd", false);
    }
    if (world.getDynamicProperty("tbd") === true && world.getTimeOfDay() === 6000) {
        world.setTimeOfDay(13000);
    }
    if (world.getDynamicProperty("tbd") === true) {
        let cplayer = world.getPlayers().find(p => p.id === world.getDynamicProperty("tbd_player"));
        if (cplayer == undefined) {
            return;
        }
        let health = cplayer.getComponent("minecraft:health");
        health?.setCurrentValue(1);
        cplayer.addEffect(MinecraftEffectTypes.Hunger, 20 * 10, { amplifier: 255 });
        cplayer.addEffect(MinecraftEffectTypes.Slowness, 20 * 10, { amplifier: 4 });
        let yjumptest = cplayer.location.y;
        if (cplayer.inputInfo.getButtonState(InputButton.Jump) == ButtonState.Pressed) {
            for (let x = 0; x < 20; x++) {
                cplayer.teleport({ x: cplayer.location.x, y: yjumptest, z: cplayer.location.z });
                await system.waitTicks(1);
            }
        }
        world.getPlayers().forEach(async (v, i, a) => {
            if (!cplayer) {
                v.addEffect(MinecraftEffectTypes.Slowness, 20 * 10, { amplifier: 2 });
                if (random(0, 20 * 60 * 20) == 0) {
                    v.dimension.spawnEntity("ldns:lightning_object", v.location);
                }
                let vhealth = v.getComponent("minecraft:health");
                if (vhealth && vhealth.currentValue >= 10) {
                    vhealth.setCurrentValue(10);
                }
            }
        });
    }
}, 1);

world.afterEvents.entityDie.subscribe((event) => {
    if (world.getDynamicProperty("tbd") === true && event.deadEntity instanceof Player && event.deadEntity.id === world.getDynamicProperty("tbd_player")) {
        world.getPlayers().forEach(async (v, i, a) => {
            v.kill();
        });
    }
});