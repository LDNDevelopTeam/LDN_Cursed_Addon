import { type Entity, type Vector3, system } from "@minecraft/server";
import { random } from '../util';

export async function random_move(targetPlayer: Entity, playerlocation: Vector3, time: number) {
    for (let i = 0; i < time; i++) {
        targetPlayer.teleport({ x: playerlocation.x + random(-4, 4), y: playerlocation.y + random(0, 4), z: playerlocation.z + random(-4, 4) });
        await system.waitTicks(2);
    }
}
