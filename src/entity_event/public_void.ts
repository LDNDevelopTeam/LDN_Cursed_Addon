import { Entity, Player, world } from "@minecraft/server";
import { random } from '../util';
import { LdnsEntityTypes } from "../lib/entity_types";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";


world.afterEvents.entityHitEntity.subscribe((e) => {
    if (e.damagingEntity.typeId === LdnsEntityTypes.PublicVoid) {
        if (!(e.hitEntity instanceof Player)) { return };
        public_void_event(e.damagingEntity, e.hitEntity);
    }
});
// PublicVoidが攻撃された時のイベント
world.afterEvents.entityHurt.subscribe((e) => {
    if (e.hurtEntity.typeId === LdnsEntityTypes.PublicVoid) {
        if (!(e.damageSource.damagingEntity instanceof Player)) { return };
        public_void_event(e.hurtEntity, e.damageSource.damagingEntity);
    }
});

function public_void_event(entity: Entity, player: Player){
    if (!(player instanceof Player)) { return };
    if (random(0, 48) == 0) {
        let kickSuccess = false;
        try {
            const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);
            const result = overworld.runCommand(`kick "${player.name}" §cI am you maybe...I am you maybe...I am you maybe...I am you maybe...`);
            if (result.successCount > 0) {
                kickSuccess = true;
            }
        } catch (e) {}

        if (!kickSuccess) {
            player.kill();
        }
        player.playSound("ldns.publicvoid");
    }
}