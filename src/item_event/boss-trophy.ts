import { world } from '@minecraft/server';
// ボストロフィーに使うイベント
world.afterEvents.entitySpawn.subscribe((entityEvent) => {
    const entity = entityEvent.entity;
    if (entity.typeId === "ldns:boss_trophy") {
        const players = entity.dimension.getPlayers();
        if (players.length > 0) {
            let closestPlayer = players[0];
            let minDist = Infinity;
            for (const player of players) {
                const dx = player.location.x - entity.location.x;
                const dy = player.location.y - entity.location.y;
                const dz = player.location.z - entity.location.z;
                const dist = dx * dx + dy * dy + dz * dz;
                if (dist < minDist) {
                    minDist = dist;
                    closestPlayer = player;
                }
            }
            const dx = closestPlayer.location.x - entity.location.x;
            const dz = closestPlayer.location.z - entity.location.z;
            const yaw = Math.atan2(-dx, dz) * 180 / Math.PI;
            let snappedYaw = Math.round(yaw / 45) * 45;
            if (snappedYaw > 180) snappedYaw -= 360;
            if (snappedYaw <= -180) snappedYaw += 360;
            entity.teleport(entity.location, { rotation: { x: 0, y: snappedYaw } });
        }
    }
});

// 繝医Ο繝輔ぅ繝ｼ