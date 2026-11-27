import { system, world, Player } from "@minecraft/server";
import { random } from "../util";

system.runInterval(() => {
    // ワールド内のすべての Nebilim 178438 を取得
    const nebilims = world.getDimension("minecraft:overworld").getEntities({ type: "ldns:nebilim_178438" });
    
    for (const nebilim of nebilims) {
        if (!nebilim.isValid) continue;

        const loc = nebilim.location;
        // 周囲8ブロック以内のプレイヤーを検出
        const nearbyPlayers = nebilim.dimension.getEntities({
            type: "minecraft:player",
            location: loc,
            maxDistance: 8.0
        });

        if (nearbyPlayers.length > 0) {
            // プレイヤーが近づいたので消滅イベントを実行
            const player = nearbyPlayers[0];
            
            // 消滅音を再生
            if (player instanceof Player) {
                player.playSound("ldns.nebilim.1", { location: loc, volume: 0.8 });
            }
            
            // 消滅パーティクルを発生
            try {
                nebilim.dimension.spawnParticle("ldns:error_particle", { x: loc.x, y: loc.y + 1, z: loc.z });
            } catch (e) {}

            // 30%の確率で足元に "178438" と書かれた看板を立てる
            if (random(0, 9) < 3) {
                try {
                    // 足元の座標 (端数切り捨て)
                    const blockLoc = {
                        x: Math.floor(loc.x),
                        y: Math.floor(loc.y),
                        z: Math.floor(loc.z)
                    };
                    const block = nebilim.dimension.getBlock(blockLoc);
                    if (block && block.typeId === "minecraft:air") {
                        block.setType("minecraft:oak_sign");
                        const signComp = block.getComponent("sign");
                        if (signComp) {
                            signComp.setText("178438");
                        }
                    }
                } catch (e) {
                    // 看板設置失敗時のハンドリング
                }
            }

            // Nebilim の消去
            nebilim.remove();
        } else {
            // 近づいていない場合、1%の確率で周囲に不気味なきしみ音 (ldns.nebilim.2) を再生
            if (random(0, 99) < 1) {
                const listeningPlayers = nebilim.dimension.getEntities({
                    type: "minecraft:player",
                    location: loc,
                    maxDistance: 32.0
                });
                for (const lp of listeningPlayers) {
                    if (lp instanceof Player) {
                        lp.playSound("ldns.nebilim.2", { location: lp.location, volume: 0.6 });
                    }
                }
            }
        }
    }
}, 4); // 4 ticksごとに監視
