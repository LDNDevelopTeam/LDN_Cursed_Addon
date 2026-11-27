import { ButtonState, InputButton, Player, system, world } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { random } from "../util";
import { DynamicProperty } from "../lib/dynamic_property";
import { LdnsEntityTypes } from "../lib/entity_types";

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId == LdnsEntityTypes.Tbd) {
        if (world.getTimeOfDay() >= 12000 && DynamicProperty.get(world, "tbd") === false || DynamicProperty.get(world, "tbd") == undefined) {
            DynamicProperty.set(world, "tbd", true);
            DynamicProperty.set(world, "tbd_player", event.player.id);
            world.sendMessage("あなたはですか。");
            system.run(() => {
                world.setTimeOfDay(10);
            });
        } else if (DynamicProperty.get(world, "tbd") === true) {
            world.sendMessage("あなたはです。");
        } else {
            world.sendMessage("あなたはです。あなたはですか。");
        }
    }
});

system.runInterval(async () => {
    if (DynamicProperty.get(world, "tbd") === true && world.getTimeOfDay() === 1) {
        DynamicProperty.set(world, "tbd", false);
    }
    if (DynamicProperty.get(world, "tbd") === true && world.getTimeOfDay() === 6000) {
        world.setTimeOfDay(13000);
    }
    if (DynamicProperty.get(world, "tbd") === true) {
        let cplayer = world.getPlayers().find(p => p.id === DynamicProperty.get(world, "tbd_player"));
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
                    v.dimension.spawnEntity(LdnsEntityTypes.LightningObject, v.location);
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
    if (DynamicProperty.get(world, "tbd") === true && event.deadEntity instanceof Player && event.deadEntity.id === DynamicProperty.get(world, "tbd_player")) {
        world.getPlayers().forEach(async (v, i, a) => {
            v.kill();
        });
    }
});