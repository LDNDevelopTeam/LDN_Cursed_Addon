import { system, world, Player } from "@minecraft/server";
import { random, freeze } from "../util";

// null3のグリッチタイマーを保持 (entity.id -> remainingTicks)
const glitchTimers = new Map();

// NullバイオームでのMob自動スポーン制御（5秒ごと＝100ticks）
const NULL_BIOME_MOBS = [
    { typeId: "ldns:nullbrain", weight: 30 },
    { typeId: "ldns:nonebrain", weight: 30 },
    { typeId: "ldns:errormob", weight: 20 },
    { typeId: "ldns:pp", weight: 15 },
    { typeId: "ldns:yy", weight: 15 },
    { typeId: "ldns:irregularity", weight: 12 },
    { typeId: "ldns:nebilim_178438", weight: 10 },
    { typeId: "ldns:public_void", weight: 1 } // 超低確率 (Kickの危険があるため)
];

function getRandomNullBiomeMob() {
    const totalWeight = NULL_BIOME_MOBS.reduce((sum, m) => sum + m.weight, 0);
    let rand = Math.floor(Math.random() * totalWeight);
    for (const mob of NULL_BIOME_MOBS) {
        if (rand < mob.weight) return mob.typeId;
        rand -= mob.weight;
    }
    return "ldns:errormob";
}

let tickCounter = 0;

system.runInterval(() => {
    tickCounter++;
    const isEvery5Ticks = (tickCounter % 5 === 0);
    const isEvery100Ticks = (tickCounter % 100 === 0);

    for (const dimensionName of ["overworld"]) {
        let dimension;
        try {
            dimension = world.getDimension(dimensionName);
        } catch (e) {
            continue;
        }

        const players = dimension.getPlayers();
        for (const player of players) {
            if (!player) continue;

            const loc = player.location;
            const blockBelow = dimension.getBlock({
                x: Math.floor(loc.x),
                y: Math.floor(loc.y) - 1,
                z: Math.floor(loc.z)
            });

            if (!blockBelow) continue;
            const typeId = blockBelow.typeId;

            // null0: ダメージ
            if (typeId === "ldns:null0" && isEvery5Ticks) {
                try { player.applyDamage(2); } catch (e) {}
            }

            // null1: ガタガタ動く（移動しやすいように微弱な揺れに緩和）
            if (typeId === "ldns:null1" && isEvery5Ticks) {
                try {
                    const rx = (Math.random() - 0.5) * 0.05;
                    const rz = (Math.random() - 0.5) * 0.05;
                    player.teleport({ x: loc.x + rx, y: loc.y, z: loc.z + rz });
                } catch (e) {}
            }

            // null2: 空腹エフェクト
            if (typeId === "ldns:null2" && isEvery5Ticks) {
                try { player.addEffect("hunger", 60, { amplifier: 1, showParticles: true }); } catch (e) {}
            }

            // null3: グリッチエフェクト
            if (typeId === "ldns:null3") {
                glitchTimers.set(player.id, 100);
            }

            // Nullバイオーム上（Nullブロックの上）にプレイヤーがいる時、定期的に呪いMobをスポーン
            if (typeId.startsWith("ldns:null") && isEvery100Ticks) {
                const nearbyEntities = dimension.getEntities({
                    location: player.location,
                    maxDistance: 25
                });
                
                if (nearbyEntities.length < 12) {
                    const spawnMobId = getRandomNullBiomeMob();
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetZ = (Math.random() - 0.5) * 20;
                    const spawnLoc = {
                        x: loc.x + offsetX,
                        y: loc.y + 1,
                        z: loc.z + offsetZ
                    };
                    try {
                        dimension.spawnEntity(spawnMobId, spawnLoc);
                    } catch (e) {}
                }
            }

            // Nullバイオームでのバグった木の定期的な生成
            if (typeId.startsWith("ldns:null") && (tickCounter % 200 === 0)) {
                if (Math.random() < 0.3) {
                    const rx = Math.floor(loc.x + (Math.random() - 0.5) * 30);
                    const rz = Math.floor(loc.z + (Math.random() - 0.5) * 30);
                    const ry = dimension.getTopmostBlock({ x: rx, z: rz })?.y;

                    if (ry !== undefined && ry > 0) {
                        const baseBlock = dimension.getBlock({ x: rx, y: ry, z: rz });
                        if (baseBlock && baseBlock.typeId.startsWith("ldns:null")) {
                            generateGlitchedTree(dimension, { x: rx, y: ry + 1, z: rz });
                        }
                    }
                }
            }

            // Nullバイオームでのバグった十字架（Nullブロック製）の突然出現
            if (typeId.startsWith("ldns:null") && (tickCounter % 240 === 0)) {
                if (Math.random() < 0.5) {
                    const rx = Math.floor(loc.x + (Math.random() - 0.5) * 36);
                    const rz = Math.floor(loc.z + (Math.random() - 0.5) * 36);
                    const ry = dimension.getTopmostBlock({ x: rx, z: rz })?.y;

                    if (ry !== undefined && ry > 0) {
                        const baseBlock = dimension.getBlock({ x: rx, y: ry, z: rz });
                        if (baseBlock && baseBlock.typeId.startsWith("ldns:null")) {
                            generateGlitchedCross(dimension, { x: rx, y: ry + 1, z: rz });
                            try { player.playSound("ldns.errormob_glitch", { volume: 0.8 }); } catch (e) {}
                        }
                    }
                }
            }

            // 【Nullブロックの限定侵食・伝染システム】
            // 無限侵食を防ぐため、プレイヤー中心半径12ブロック以内の一定範囲内のみ侵食
            if (typeId.startsWith("ldns:null") && (tickCounter % 40 === 0)) {
                const spreadTargets = [
                    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
                    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
                    { x: 0, y: -1, z: 0 }, { x: 0, y: 1, z: 0 }
                ];
                const blockPos = { x: Math.floor(loc.x), y: Math.floor(loc.y) - 1, z: Math.floor(loc.z) };
                
                // 周囲のNullブロック数をカウント（半径12以内にNullブロックが多すぎたら侵食停止）
                let nearbyNullCount = 0;
                for (let dx = -4; dx <= 4; dx += 2) {
                    for (let dz = -4; dz <= 4; dz += 2) {
                        const checkBlock = dimension.getBlock({ x: blockPos.x + dx, y: blockPos.y, z: blockPos.z + dz });
                        if (checkBlock && checkBlock.typeId.startsWith("ldns:null")) {
                            nearbyNullCount++;
                        }
                    }
                }

                // 侵食密度上限（周囲がほぼNullブロックになったらそれ以上外側へ無限拡散しない）
                if (nearbyNullCount < 15) {
                    for (const offset of spreadTargets) {
                        if (Math.random() < 0.15) {
                            const targetBlock = dimension.getBlock({
                                x: blockPos.x + offset.x,
                                y: blockPos.y + offset.y,
                                z: blockPos.z + offset.z
                            });

                            if (targetBlock && !targetBlock.isAir && !targetBlock.typeId.startsWith("ldns:null")) {
                                const replaceableBlocks = ["minecraft:grass_block", "minecraft:dirt", "minecraft:stone", "minecraft:sand", "minecraft:gravel"];
                                if (replaceableBlocks.includes(targetBlock.typeId)) {
                                    const nullBlocks = ["ldns:null0", "ldns:null1", "ldns:null2", "ldns:null3", "ldns:null4"];
                                    const chosenNull = nullBlocks[Math.floor(Math.random() * nullBlocks.length)];
                                    try { targetBlock.setType(chosenNull); } catch (e) {}
                                }
                            }
                        }
                    }
                }
            }

            // irregularity の近くにいると時間が不規則・ランダムにめまぐるしく変化する（不規則性タイムグリッチ）
            const nearbyIrregularities = dimension.getEntities({
                type: "ldns:irregularity",
                location: player.location,
                maxDistance: 32
            });

            if (nearbyIrregularities.length > 0) {
                let minDistance = 32;
                for (const irr of nearbyIrregularities) {
                    const dx = irr.location.x - loc.x;
                    const dy = irr.location.y - loc.y;
                    const dz = irr.location.z - loc.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < minDistance) minDistance = dist;
                }

                // 距離が近いほど高頻度・大振幅で時間が不規則にランダムフラッシュ
                const proximityRatio = 1 - (minDistance / 32); // 0 (遠い) ~ 1 (超至近距離)
                
                // ランダムに時間を跳躍させる（昼夜逆転、空がめまぐるしく切り替わる）
                if (Math.random() < (0.3 + proximityRatio * 0.7)) {
                    try {
                        const currentTime = world.getTimeOfDay();
                        // 0～24000の範囲で時間を不規則にランダムワープ
                        const randomJump = Math.floor(Math.random() * 24000);
                        const nextTime = (currentTime + randomJump) % 24000;
                        world.setTimeOfDay(nextTime);

                        // 至近距離(距離12以内)なら不気味なグリッチサウンドを低確率で再生
                        if (minDistance < 12 && Math.random() < 0.15) {
                            player.playSound("beacon.deactivate", { volume: 0.3, pitch: 0.5 + Math.random() * 1.5 });
                        }
                    } catch (e) {}
                }
            }
        }
    }

    // null3 グリッチタイマーの更新とエフェクト適用
    for (const [entityId, ticks] of glitchTimers.entries()) {
        if (ticks <= 0) {
            glitchTimers.delete(entityId);
            continue;
        }

        glitchTimers.set(entityId, ticks - 1);

        // プレイヤーにのみ画面グリッチタイトルと効果音を表示
        const player = world.getEntity(entityId);
        if (player && player instanceof Player) {
            // 10tickごとにランダムなグリッチ演出を表示
            if (ticks % 10 === 0) {
                const randTitle = ["egn2", "egn3", "egn6", "egn9", "繧ｨ繝ｩ繝ｼ", "ew1", "ew2"][random(0, 6)];
                player.onScreenDisplay.setTitle(randTitle);
                
                const randSound = ["ldns.pp_spawn", "ldns.yy_spawn", "ldns.errormob_glitch", "ldns.beep", "ldns.error_the_error"][random(0, 4)];
                player.playSound(randSound);
            }
        }
    }
}, 1);

/**
 * バグった木の生成処理
 * (1) 葉っぱのない木
 * (2) 一部原木が虫食い欠損した木
 * (3) 一部（または葉っぱ全体）がNullブロック化された木
 */
function generateGlitchedTree(dimension, pos) {
    const height = Math.floor(Math.random() * 4) + 4; // 高さ4~7
    const treeType = Math.floor(Math.random() * 3); // 0: 葉なし, 1: 幹欠損, 2: Null化
    const nullBlocks = ["ldns:null0", "ldns:null1", "ldns:null2", "ldns:null3", "ldns:null4"];

    // 幹の生成
    for (let h = 0; h < height; h++) {
        const curY = pos.y + h;
        // 幹の穴あき欠損判定
        if (treeType === 1 && h > 1 && Math.random() < 0.35) {
            continue; // 原木を配置しない
        }

        const blockChoice = (treeType === 2 && Math.random() < 0.4) 
            ? nullBlocks[Math.floor(Math.random() * nullBlocks.length)]
            : "minecraft:oak_log";

        try {
            dimension.getBlock({ x: pos.x, y: curY, z: pos.z })?.setType(blockChoice);
        } catch (e) {}
    }

    // 葉っぱの生成（葉なしタイプ以外）
    if (treeType !== 0) {
        const topY = pos.y + height - 1;
        for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
                for (let dy = -1; dy <= 2; dy++) {
                    if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && Math.random() < 0.5) continue;
                    if (dx === 0 && dz === 0 && dy < 1) continue;

                    const leafX = pos.x + dx;
                    const leafY = topY + dy;
                    const leafZ = pos.z + dz;

                    const current = dimension.getBlock({ x: leafX, y: leafY, z: leafZ });
                    if (current && (current.isAir || current.typeId.includes("leaves"))) {
                        // Null化タイプはNullブロックに、それ以外は一部欠けているオークの葉
                        if (treeType === 2 && Math.random() < 0.6) {
                            const nBlock = nullBlocks[Math.floor(Math.random() * nullBlocks.length)];
                            try { current.setType(nBlock); } catch (e) {}
                        } else if (Math.random() < 0.65) {
                            try { current.setType("minecraft:oak_leaves"); } catch (e) {}
                        }
                    }
                }
            }
        }
    }
}

/**
 * バグった十字架（通常または逆十字）の生成処理
 * NullブロックやErrorブロックで構成され、時折周囲に浮遊バグブロックを生成する
 */
function generateGlitchedCross(dimension, pos) {
    const isInverted = Math.random() < 0.45; // 45%の確率で逆十字
    const height = Math.floor(Math.random() * 3) + 5; // 高さ5~7
    const armY = isInverted ? pos.y + 2 : pos.y + height - 2; // 腕の高さ
    const nullBlocks = ["ldns:null0", "ldns:null1", "ldns:null2", "ldns:null3", "ldns:null4", "ldns:error_block"];

    // 縦柱の生成
    for (let h = 0; h < height; h++) {
        const blockChoice = nullBlocks[Math.floor(Math.random() * nullBlocks.length)];
        try {
            dimension.getBlock({ x: pos.x, y: pos.y + h, z: pos.z })?.setType(blockChoice);
        } catch (e) {}
    }

    // 横アームの生成 (X軸方向かZ軸方向)
    const dirX = Math.random() < 0.5;
    const armLength = 1;
    for (let d = -armLength; d <= armLength; d++) {
        if (d === 0) continue;
        const armPos = dirX 
            ? { x: pos.x + d, y: armY, z: pos.z }
            : { x: pos.x, y: armY, z: pos.z + d };
        const blockChoice = nullBlocks[Math.floor(Math.random() * nullBlocks.length)];
        try {
            dimension.getBlock(armPos)?.setType(blockChoice);
        } catch (e) {}
    }

    // 頂点にレッドストーントーチや浮遊グリッチブロックをランダム配置
    try {
        if (Math.random() < 0.7) {
            dimension.getBlock({ x: pos.x, y: pos.y + height, z: pos.z })?.setType("minecraft:redstone_torch");
        } else {
            dimension.getBlock({ x: pos.x, y: pos.y + height, z: pos.z })?.setType("ldns:null3");
        }
    } catch (e) {}

    // 周囲に浮遊グリッチブロックを散りばめてバグ感を強調
    for (let i = 0; i < 3; i++) {
        const fx = pos.x + Math.floor((Math.random() - 0.5) * 6);
        const fy = pos.y + Math.floor(Math.random() * (height + 2));
        const fz = pos.z + Math.floor((Math.random() - 0.5) * 6);
        try {
            const b = dimension.getBlock({ x: fx, y: fy, z: fz });
            if (b && b.isAir) {
                b.setType(nullBlocks[Math.floor(Math.random() * nullBlocks.length)]);
            }
        } catch (e) {}
    }
}
