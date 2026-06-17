import { EntityComponentTypes, ItemStack, Player, system, world } from '@minecraft/server';
import { random, giveItem } from '../util';
import { MessageFormData } from '@minecraft/server-ui';

world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.typeId == "minecraft:villager_v2" || event.entity.typeId == "minecraft:villager") {
        if (!(event.entity.hasComponent("minecraft:variant"))) { return; }
        if (event.entity.getComponent("minecraft:variant").value == 14) { return; }
        if (random(0, 44) == 22) {
            switch (random(0, 3)) {
                case 0:
                    event.entity.nameTag = "§kPersonal_Villager";
                    break;
                case 1:
                    event.entity.nameTag = "§kI am you maybe...";
                    break;
                case 2:
                    event.entity.nameTag = "§k78787878787878787878";
                    break;
            }
            event.entity.addTag("ldns:pvs");
        }
    }
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    system.run(() => {

        if (event.target.typeId == "minecraft:villager_v2" || event.target.typeId == "minecraft:villager") {
            if (event.target.hasTag("ldns:pvs")) {
                const Pform = new MessageFormData();
                switch (random(0, 20)) {
                    case 0:
                        let title = null;
                        let body = null;
                        let b1 = null;
                        let b2 = null;
                        switch (random(0, 4)) {
                            case 0:
                                title = "???";
                                body = "I've been asking you this many times, what do you really want to do?";
                                b1 = "Huh...?";
                                b2 = "i don't know.";
                                break;
                            case 1:
                                title = "That's greedy.";
                                body = "What do you want from me? There's nothing.";
                                b1 = "I'm sorry. I don't ask for anything.";
                                b2 = "hekko!!!";
                                break;
                            case 2:
                                title = "Hey";
                                body = "What? Are you running into me???";
                                b1 = "I'm... sorry...";
                                b2 = "Huh...? Can you bump into people with this §kadd-on...?§r";
                                break;
                            case 3:
                                Pform.title("I can't t§kak§re it an§kymor§re.").body("I will de§kst§rroy you. G§koodb§rye???").button1("Huh.§k..hu§kh...????").button2("I am you maybe...");
                                Pform.show(event.player).then(async res => {
                                    switch (random(0, 4)) {
                                        case 0:
                                            event.target.removeTag("ldns:pvs");
                                            break;
                                        case 1:
                                            event.target.dimension.spawnEntity("ldns:pv", event.target.location);
                                            event.target.remove();
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                return;
                        }
                        Pform.title(title).body(body).button1(b1).button2(b2);
                        Pform.show(event.player).then(async res => {
                            switch (random(0, 33)) {
                                case 0:
                                    event.target.removeTag("ldns:pvs");
                                    break;
                                case 1:
                                    event.target.dimension.spawnEntity("ldns:pv", event.target.location);
                                    event.target.remove();
                                    break;
                                default:
                                    break;
                            }
                        });
                        break;
                }
            }
        }
    });
});

world.afterEvents.entitySpawn.subscribe(async (event) => {
    if (event.entity.typeId == "ldns:pv") {
        let spawns = system.runInterval(() => {
            if (!(event.entity.isValid)) {
                system.clearJob(spawns);
            }
            if (event.entity.isValid) {
                event.entity.dimension?.playSound("mob.villager.death", event.entity.location);
                world.sendMessage({
                    translate: "message.mysterious_players.join",
                    with: ["Pers§kona§rl_Vill§kage§rr"]
                });
            }
        }, 1);
    }
});

world.afterEvents.entityDie.subscribe(async (event) => {
    if (event.deadEntity.typeId == "ldns:pv") {
        for (let i = 0; i < 16; i++) {
            event.damageSource.damagingEntity.dimension.playSound("mob.villager.idle", event.damageSource.damagingEntity.location);
            world.sendMessage("§dHelheHelHellHellolllo§r");
            await system.waitTicks(4);
        }
        for (let i = 0; i < 16; i++) {
            event.damageSource.damagingEntity.dimension.playSound("ldns.tbd_s", event.damageSource.damagingEntity.location);
            world.sendMessage("§4I am youam youam yam yam you maou maou ma ma maybe...§r");
            await system.waitTicks(4);
        }
    }
});

world.afterEvents.entityHitEntity.subscribe(async (event) => {
    if (event.hitEntity instanceof Player && event.damagingEntity.typeId == "ldns:pv") {
        switch (random(0, 33)) {
            case 0:
                event.damagingEntity.dimension.createExplosion(event.damagingEntity.location, 4, { breaksBlocks: false });
                break;
            case 1:
                for (let i = 0; i < 20; i++) {
                    event.hitEntity.teleport(event.hitEntity.location, { rotation: { x: random(-90, 90), y: random(0, 180) } });
                    await system.waitTicks(2);
                }
                break;
            case 2:
                const Pform = new MessageFormData();
                Pform.title("IIIIIImmmmm' '' '' ").body("HelheHelHellHellolllo").button1("I am youam youam yam yam you maou maou ma ma maybe...").button2("HeHe!k!Hek!ek!e!kk!okokok!okko!");
                Pform.show(event.hitEntity).then(async res => {
                });
                break;
            case 3:
                if (random(0, 8) == 0) {
                    giveItem(event.hitEntity, "minecraft:emerald");
                }
                break;
        }
    }
});