import { world } from '@minecraft/server';
import { random } from '../util';
import { LdnsEntityTypes } from "../lib/entity_types";
world.afterEvents.entitySpawn.subscribe((entityEvent) => {
    if (entityEvent.entity.typeId == LdnsEntityTypes.MysteriousPlayers) {
        // プレイヤーの名前を割り当て、小さい場合は0を
        const random_name = "mc" + random(0, 99999999).toString().padStart(8, "0");
        world.sendMessage({
            translate: "message.mysterious_players.join",
            with: [random_name]
        });
        entityEvent.entity.nameTag = random_name;
    }
});

world.afterEvents.entityDie.subscribe((entityEvent) => {
    if (entityEvent.deadEntity.typeId == LdnsEntityTypes.MysteriousPlayers) {
        if (entityEvent.deadEntity.nameTag) {
            world.sendMessage({
                translate: "message.mysterious_players.leave",
                with: [entityEvent.deadEntity.nameTag]
            });
        }
    }
});

// 縺薙ｌ縺ｯ隱ｰ縺ｪ繧薙□繧阪≧