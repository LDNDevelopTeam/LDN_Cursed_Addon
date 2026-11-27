import { Entity, Player, world } from "@minecraft/server";
import { random } from '../util';
import { LdnsEntityTypes } from "../lib/entity_types";


world.afterEvents.entityHitEntity.subscribe((e) => {
    if (e.damagingEntity.typeId === LdnsEntityTypes.Binary444) {
        if (!(e.hitEntity instanceof Player)) { return };
        binary444_event(e.damagingEntity, e.hitEntity);
    }
});
// PublicVoidが攻撃された時のイベント
world.afterEvents.entityHurt.subscribe((e) => {
    if (e.hurtEntity.typeId === LdnsEntityTypes.Binary444) {
        if (!(e.damageSource.damagingEntity instanceof Player)) { return };
        binary444_event(e.hurtEntity, e.damageSource.damagingEntity);
    }
});

function binary444_event(entity: Entity, player: Player) {
    if (!(player instanceof Player)) { return };
    switch (random(0, 48)) {
        case 0:
            let netherdimension = world.getDimension('minecraft:nether');
            let randomXn = random(player.location.x - 500, player.location.x + 500);
            let randomZn = random(player.location.z - 500, player.location.z + 500);
            let ranodmYn = random(60, 100);
            player.teleport({ x: randomXn, y: ranodmYn, z: randomZn }, { dimension: netherdimension });
            break;
    }
}