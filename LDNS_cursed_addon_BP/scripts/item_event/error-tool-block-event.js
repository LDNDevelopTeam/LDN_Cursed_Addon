import { EquipmentSlot, GameMode, ItemStack, Player, system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
    event.itemComponentRegistry.registerCustomComponent("ldns:custom_tool", {
        onHitEntity(e) {
            const { attackingEntity, itemStack } = e;
            if (!(attackingEntity instanceof Player)) return;
            // アイテム耐久値の関数
            durabilitys(attackingEntity, itemStack);
        },
        onMineBlock(e) {
            const { itemStack, source } = e;
            if (!(source instanceof Player)) return;
            // アイテム耐久値の関数
            durabilitys(source, itemStack);
        },
        /**
        // ブロック上で右クリックしたとき
        onUseOn(e) {
            const { block, source, itemStack } = e;
            if (!(source instanceof Player)) return;
            // クリエイティブ時のみ耐久値が減るのを防ぐ
            if (source.getGameMode() !== GameMode.creative && block.hasTag("wood") && block.hasTag("log")) {
                // 音を鳴らす
                source.playSound("use.wood");
                let item = itemStack.getComponent("durability");
                item.damage += 1;
                source.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand, itemStack);
            }
        }
        */
    });
    
    // Entity787の鎌の時
    event.itemComponentRegistry.registerCustomComponent("ldns:entity787_scythe_c", {
        // 右クリックしたとき
        onUse(e) {
            const { itemStack, source } = e;
            source.playSound("fire.ignite");
            source.playSound("mob.witch.throw");
            // 電波動を出す
            const hl = source.getHeadLocation();
            const vd = source.getViewDirection();
            const scythe_bullets = source.dimension.spawnEntity("ldns:scythe_bullet", { x: hl.x + (vd.x * 1.5), y: hl.y + (vd.y * 1.5), z: hl.z + (vd.z * 1.5) });
            const projectiles = scythe_bullets.getComponent("minecraft:projectile");
            projectiles.airInertia = 1.15;
            projectiles.liquidInertia = 1.15;
            projectiles.gravity = 0.01;
            projectiles?.shoot({ x: vd.x * 2, y: vd.y * 2, z: vd.z * 2 });
            // アイテム耐久値の関数
            durabilitys(source, itemStack);
        }
    });
    // 松明を壊すブロック
    event.blockComponentRegistry.registerCustomComponent("ldns:replace_torch_block_c", {
        onTick(e) {
            const { block, dimension } = e;
            // 松明を壊すコマンド
            dimension.runCommand(`fill ${block.x} ${block.y} ${block.z} ${block.x} ${block.y} ${block.z} air destroy`);
        }
    });
    // ボマーのダンジョンのブロック
    event.blockComponentRegistry.registerCustomComponent("ldns:bomber_dungeon_player_checker_c", {
        onTick(e) {
            const { block, dimension } = e;
            // コマンド
            dimension.spawnEntity("ldns:bomber_dungeon_player_checker_entity", { x: block.x, y: block.y - 1, z: block.z });
        }
    });
    // 爆発深層岩の時
    event.blockComponentRegistry.registerCustomComponent("ldns:fake_deepslate_explosive_c", {
        // 壊したとき
        onPlayerBreak(e) {
            const { block, dimension } = e;
            // 爆発コマンド
            dimension.spawnEntity("ldns:entity.fake_deepslate_explosive", block.location);
        }
    });
    // 爆発石の時
    event.blockComponentRegistry.registerCustomComponent("ldns:fake_stone_explosive_c", {
        // 壊したとき
        onPlayerBreak(e) {
            const { block, dimension } = e;
            // 爆発コマンド
            dimension.spawnEntity("ldns:entity.fake_stone_explosive", block.location);
        }
    });
});

world.afterEvents.playerInteractWithBlock.subscribe((e) => {
    const { itemStack, player } = e;
    if (itemStack?.typeId == "ldns:error_axe") {
        // 音を鳴らす
        player.playSound("use.wood");
        // アイテム耐久値の関数
        durabilitys(player, itemStack);
    }
    if (itemStack?.typeId == "ldns:error_hoe") {
        // 音を鳴らす
        player.playSound("use.gravel");
        // アイテム耐久値の関数
        durabilitys(player, itemStack);
    }
    if (itemStack?.typeId == "ldns:error_shovel") {
        // 音を鳴らす
        player.playSound("use.grass");
        // アイテム耐久値の関数
        durabilitys(player, itemStack);
    }
});

/**
 * 
 * @param {Player} player 
 * @param {ItemStack} itemStack 
 */
function durabilitys(player, itemStack) {
    // クリエイティブ時のみ耐久値が減るのを防ぐ
    if (player.getGameMode() !== GameMode.Creative) {
        let itemdurability = itemStack.getComponent("durability");
        // 壊れた時
        if (itemdurability.damage >= (itemdurability.maxDurability - 1)) {
            player.playSound("random.break", { pitch: 1, location: player.location, volume: 1 });
            player.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand, new ItemStack("minecraft:air", 1));
        }
        // 通常時
        else {
            // 耐久力エンチャントがついているとき
            if (itemStack.getComponent("enchantable").hasEnchantment("minecraft:unbreaking")) {
                let itemunbreakinglevel = itemStack.getComponent("enchantable").getEnchantment("minecraft:unbreaking").level;
                itemdurability.damage += Number(Math.round(Math.random() * 100) <= itemdurability.getDamageChance(itemunbreakinglevel));
            }
            // ついていない場合
            else {
                itemdurability.damage += 1;
            }
            // 更新
            player.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand, itemStack);
        }
    }
}