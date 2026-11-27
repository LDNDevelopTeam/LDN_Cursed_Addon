import { type Entity, type Vector3, system } from "@minecraft/server";

export async function freeze(targetPlayer: Entity, playerlocation: Vector3, time: number) {
    for (let i = 0; i < time; i++) {
        targetPlayer.teleport(playerlocation);
        await system.waitTicks(1);
    }
}
