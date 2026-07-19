import { Entity, Player, system, world } from "@minecraft/server";

// プレイヤーが攻撃した時 (entityHurt)
world.afterEvents.entityHurt.subscribe((e) => {
    if (e.hurtEntity.typeId === "ldns:length_fix") {
        if (!(e.damageSource.damagingEntity instanceof Player)) { return };
        length_fix_event(e.hurtEntity, e.damageSource.damagingEntity);
    }
});

// プレイヤーが攻撃された時 (entityHitEntity)
world.afterEvents.entityHitEntity.subscribe((e) => {
    if (e.damagingEntity.typeId === "ldns:length_fix") {
        if (!(e.hitEntity instanceof Player)) { return };
        length_fix_event(e.damagingEntity, e.hitEntity);
    }
});

/**
 * フェイクBIOS破壊演出イベント
 * @param {Entity} entity 
 * @param {Player} player 
 */
async function length_fix_event(entity, player) {
    if (!(player instanceof Player)) { return };

    // 多重発動防止
    if (player.getDynamicProperty("lengthFixTriggered") === true) {
        return;
    }
    player.setDynamicProperty("lengthFixTriggered", true);

    // エンティティの消去
    if (entity && entity.isValid) {
        entity.remove();
    }

    // 暗転（盲目）と拘束（移動速度低下）を付与
    player.addEffect("blindness", 120, { showParticles: false });
    player.addEffect("slowness", 120, { amplifier: 255, showParticles: false });

    // 警告ノイズ/エラー音 (lf1.ogg)
    player.playSound("ldns.lf1", { location: player.location });

    // 画面中央に警告タイトルを表示
    player.onScreenDisplay.setTitle("§4[CRITICAL ERROR]", {
        subtitle: "§cSYSTEM INTEGRITY COMPROMISED",
        fadeInDuration: 10,
        stayDuration: 70,
        fadeOutDuration: 10
    });

    // 遅延を挟みつつシステムログ風メッセージをチャットに流す
    await system.waitTicks(15);
    player.sendMessage("§c[System] WARNING: Unresolved motherboard bus error (IRQ conflict).");
    player.playSound("random.click", { location: player.location, pitch: 0.5 });

    await system.waitTicks(15);
    player.sendMessage("§c[System] Hard drive partition structure (MBR/GPT) corrupted.");
    player.playSound("random.click", { location: player.location, pitch: 0.5 });

    await system.waitTicks(15);
    player.sendMessage("§c[System] BIOS shadow RAM flash write failed. ROM corrupted.");
    player.playSound("random.click", { location: player.location, pitch: 0.5 });

    await system.waitTicks(15);
    player.sendMessage("§c[System] Fatal: CPU temperature reached 108°C. Shutting down system.");
    player.playSound("random.click", { location: player.location, pitch: 0.2 });

    // 電子ショート/クラッシュ音 (lf2.ogg)
    player.playSound("ldns.lf2", { location: player.location });

    await system.waitTicks(20);

    // キック（切断）処理を実行
    let kickSuccess = false;
    try {
        const overworld = world.getDimension("minecraft:overworld");
        // キックメッセージにフェイクエラー画面を表示
        const kickMessage = `§4[FATAL ERROR]§r\n§cBIOS/Motherboard Corruption Detected (Error Code: 0x0000005F)\nHardware communication lost. Reinstalling OS or replacing motherboard may be required.\n\n§7(※これはアドオンの演出であり、実際にはPCは壊れていません！)`;
        const result = overworld.runCommand(`kick "${player.name}" ${kickMessage}`);
        if (result.successCount > 0) {
            kickSuccess = true;
        }
    } catch (e) {
        // コマンド実行失敗時のエラーハンドリング
    }

    // トリガーのリセットとフォールバック処理
    player.setDynamicProperty("lengthFixTriggered", false);

    if (!kickSuccess) {
        // キックが失敗した場合（ローカルホストやシングルプレイなど）は即死させる
        player.onScreenDisplay.setTitle("§4[SYSTEM TERMINATED]", {
            subtitle: "§cPC destroyed (Rumor)",
            fadeInDuration: 10,
            stayDuration: 70,
            fadeOutDuration: 10
        });
        player.kill();
    }
}
