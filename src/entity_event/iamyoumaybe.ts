import { system, world } from '@minecraft/server';
import { random } from '../util';

world.afterEvents.entitySpawn.subscribe(async (e) => {
    if (e.entity.typeId === "ldns:iamyoumaybe") {
        for (let i = 0; i < 20 * 16; i++) {
            switch (random(0, 4)) {
                case 0:
                    world.sendMessage("<I_am_you_maybe> I am you maybe...");
                    break;
                case 1:
                    world.sendMessage("<I_am_you_maybe> Maybe I’m you. Or maybe I’m not. Or maybe I’m not not you. Possibly.");
                    break;
                case 2:
                    world.sendMessage("<I_am_you_maybe> I am hello maybe...");
                    break;
                case 3:
                    world.sendMessage("<I_am_you_maybe> You are hello maybe...");
                    break;
            }
            world.getPlayers().forEach(async (es, is, as) => {
                es.playSound("ldns.time_mad_I");
                if (random(0, 16) === 1) {
                    es.playSound("ldns.iamyoumaybe");
                }
            });
            let Itimes = 4743;
            switch (random(0, 14)) {
                case 0:
                    Itimes = 4743;
                    break;
                case 1:
                    Itimes = 6101;
                    break;
                case 2:
                    Itimes = 21000;
                    break;
                case 3:
                    Itimes = 11220;
                    break;
                case 4:
                    Itimes = 16718;
                    break;
                case 5:
                    Itimes = 18109;
                    break;
                case 6:
                    Itimes = 23205;
                    break;
                case 7:
                    Itimes = 11254;
                    break;
                case 8:
                    Itimes = 8167;
                    break;
                case 9:
                    Itimes = 666;
                    break;
                case 10:
                    Itimes = 1113;
                    break;
                case 11:
                    Itimes = 444;
                    break;
                case 12:
                    Itimes = 888;
                    break;
                case 13:
                    Itimes = 999;
                    break;
            }
            world.setTimeOfDay(Itimes);
            await system.waitTicks(1);
        }
    }
});