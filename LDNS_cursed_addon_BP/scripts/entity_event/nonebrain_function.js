import { Player, system, world } from "@minecraft/server";
import { random, giveItem } from "../util";
export function nonebrain_despawn_events() {
    // 様々なイベントが起こる
    world.getPlayers().forEach(async (v, is, a) => {
        v.playSound("ldns.beep");
        v.onScreenDisplay.setTitle("nonebrain");
        await system.waitTicks(20 * 4);
        const playerlocation = v.location;
        const kanasibari = system.runInterval(async () => {
            v.teleport(playerlocation);
            v.playSound("ldns.errormob_glitch", { volume: 0.1, pitch: 0.666 });
            const { container } = v.getComponent("inventory");
            for (let i = 0; i < container.size; i++) {
                container.swapItems(i, random(0, container.size - 1), container);
            }
            v.selectedSlotIndex = random(0, 9);
            await system.waitTicks(1);
        });
        const rands = random(0, 2);
        const randh = random(0, 4);
        switch (rands) {
            case 0:
                v.playSound("ldns.pp_spawn");
                v.playSound("ldns.beep");
                v.playSound("ldns.errormob_glitch");
                break;
            case 1:
                v.playSound("ldns.yy_spawn");
                v.playSound("ldns.beep");
                v.playSound("ldns.errormob_glitch");
                break;
        }
        switch (randh) {
            case 0:
                v.onScreenDisplay.setTitle("egn2");
                break;
            case 1:
                v.onScreenDisplay.setTitle("egn3");
                break;
            case 2:
                v.onScreenDisplay.setTitle("egn6");
                break;
            case 3:
                v.onScreenDisplay.setTitle("egn9");
                break;
        }
        await system.waitTicks(20 * 4);
        const randw = random(0, 2);
        v.playSound("ldns.errormob_errorwindow");
        switch (randw) {
            case 0:
                v.onScreenDisplay.setTitle("ew1");
                break;
            case 1:
                v.onScreenDisplay.setTitle("ew2");
                break;
        }
        await system.waitTicks(20 * 4);
        v.playSound("ldns.time_mad");
        console.info("We is cursed");
        for (let i = 0; i < 160; i++) {
            let titletextr = random(0, 6);
            switch (titletextr) {
                case 0:
                    v.onScreenDisplay.setTitle("あなたは呪われてない", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 1:
                    v.onScreenDisplay.setTitle("あなたは呪われている", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 2:
                    v.onScreenDisplay.setTitle("縺ゅ↑縺溷測繧上ｌ縺ｦ", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 3:
                    v.onScreenDisplay.setTitle("縺ゅ↑縺溷測繧上ｌ縺ｾ", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 4:
                    v.onScreenDisplay.setTitle("We is Cursed.", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
                case 5:
                    v.onScreenDisplay.setTitle("They am Cursed.", { stayDuration: 2, fadeInDuration: 0, fadeOutDuration: 0, subtitle: String(random(0, 999999999)) });
                    break;
            }
            if (is === 0) { world.setTimeOfDay(random(1000, 23000)); }
            await system.waitTicks(1);
        }
        const rande = random(0, 4);
        if (rande === 0) {
            v.playSound("ldns.beep");
            v.onScreenDisplay.setTitle("Error1");
        }
        else if (rande === 1) {
            v.playSound("ldns.beep");
            v.onScreenDisplay.setTitle("Error2");
        }
        else if (rande === 2) {
            v.playSound("ldns.beep");
            v.onScreenDisplay.setTitle("Cursed1");
        }
        else if (rande === 3) {
            v.playSound("ldns.beep");
            v.onScreenDisplay.setTitle("Cursed2");
        }
        await system.waitTicks(20 * 4);
        v.playSound("ldns.pp_spawn");
        v.playSound("ldns.yy_spawn");
        v.playSound("ldns.ppyy_spawn");
        v.onScreenDisplay.setTitle("ppse");
        await system.waitTicks(20 * 6);
        system.clearRun(kanasibari);
        for (let i = 0; i < 120; i++) {
            v.teleport(playerlocation, { rotation: { x: random(-90, 90), y: random(0, 180) } });
            v.playSound("ldns.errormob_glitch", { volume: 0.1, pitch: 0.666 });
            await system.waitTicks(1);
        }
        v.kill();
        v.runCommand("stopsound @s");
    });
}

/**
 * 
 * @param {Player} damagingEntity 
 * @param {string} nonebrainchat 
 * @param {number} random_message_int 
 */
export function noneint_reset_event(damagingEntity, nonebrainchat, random_message_int) {
    world.setDynamicProperty("noneint", 0);
    damagingEntity.playSound("random.totem", { pitch: 0.5, volume: 1.5 });
    for (const player of world.getPlayers()) {
        giveItem(player, "ldns:cursed_soul", 12);
    }
    nonebrainchat = String(random(10000000, 99999999));
    random_message_int = random(0, 6);
    damagingEntity.removeTag("nonebrainchats");
}