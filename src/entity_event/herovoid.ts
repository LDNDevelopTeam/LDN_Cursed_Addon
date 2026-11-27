import { Entity, Player, world } from "@minecraft/server";
import { random } from '../util';


world.afterEvents.entityHitEntity.subscribe((e) => {
    if (e.damagingEntity.typeId === "ldns:herovoid") {
        if (!(e.hitEntity instanceof Player)) { return };
        herovoid_event(e.damagingEntity, e.hitEntity);
    }
});
// PublicVoidが攻撃された時のイベント
world.afterEvents.entityHurt.subscribe((e) => {
    if (e.hurtEntity.typeId === "ldns:herovoid") {
        if (!(e.damageSource.damagingEntity instanceof Player)) { return };
        herovoid_event(e.hurtEntity, e.damageSource.damagingEntity);
    }
});

function herovoid_event(entity: Entity, player: Player) {
    if (!(player instanceof Player)) { return };
    switch (random(0, 48)) {
        case 0:
            let randomX = random(player.location.x - 500, player.location.x + 500);
            let randomZ = random(player.location.z - 500, player.location.z + 500);
            let randomY = random(player.location.y + 5, player.location.y + 20);
            player.teleport({ x: randomX, y: randomY, z: randomZ });
            break;
    }
}