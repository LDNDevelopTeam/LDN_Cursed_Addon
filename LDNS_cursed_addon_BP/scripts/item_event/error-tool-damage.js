import { EquipmentSlot, Player, system, world } from '@minecraft/server';
import { random, hasItem } from '../util';
import { MinecraftEffectTypes } from '../lib/mojang-effect';

const errorTools = [
    'ldns:error_sword',
    'ldns:error_pickaxe',
    'ldns:error_axe',
    'ldns:error_shovel',
    'ldns:error_hoe'
];

system.runInterval(() => {
    // ワールドにいるプレイヤー全員
    let targetPlayers = world.getPlayers();
    const playerlength = targetPlayers.length;
    if (playerlength >= 1) {
        // ループ
        targetPlayers.forEach((targetPlayer) => {
            error_tool_damage(targetPlayer);
        });
    }
}, 20 * 2);

/**
 * @param {Player} [targetPlayer] 
 * @returns { number }
 */
function error_tool_damage(targetPlayer) {
    if (!(targetPlayer instanceof Player)) return;
    // アイテム装備
    const equippable = targetPlayer.getComponent('minecraft:equippable');
    // ペンダントを持っているときのカウント
    const items = hasItem(targetPlayer, 'ldns:pendant_of_twilight');
    // errortoolscount=>Errorツール類のカウント, erroritemscount=>Errorインゴットのカウント(別の処理にするためにカウントを別にしている)
    let errortoolscount = 0;
    let erroritemscount = 0;
    // インベントリ獲得(陬懷ｮ悟ｯｾ蠢懊＠縺ｦ縺上ｌ)
    const { container } = targetPlayer.getComponent('minecraft:inventory');

    // 条件に合わせてイベントの確立を増やすための処理
    // ループ
    for (let i = 0; i < container.size; i++) {
        // アイテム獲得
        const item = container.getItem(i);
        if (!item) continue;
        // Errorツールの場合は
        errorTools.forEach((tool) => {
            // Errorツール類の場合はerrortoolscountを1プラス(スタック数もカウント)
            if (item.typeId === tool) errortoolscount += item.amount;
        })
        // インゴットの場合erroritemscountを1プラス(スタック数もカウント)
        if (item.typeId === 'ldns:error_ingot') erroritemscount += item.amount;
        // ブロックの場合erroritemscountを1プラス(スタック数もカウント)
        if (item.typeId === 'ldns:error_block') erroritemscount += item.amount * 2.666;
    }
    //krtを条件に合わせて増やす
    let krx = 0;
    if (equippable.getEquipment(EquipmentSlot.Head)?.typeId === 'ldns:error_helmet') krx += 4;
    if (equippable.getEquipment(EquipmentSlot.Chest)?.typeId === 'ldns:error_chestplate') krx += 6;
    if (equippable.getEquipment(EquipmentSlot.Legs)?.typeId === 'ldns:error_leggings') krx += 4;
    if (equippable.getEquipment(EquipmentSlot.Feet)?.typeId === 'ldns:error_boots') krx += 2;

    // Error装備を装備しているときまたはErrorツール、Errorインゴットをインベントリに入れているとき
    if (errortoolscount >= 1 ||
        erroritemscount >= 1 ||
        equippable.getEquipment(EquipmentSlot.Head)?.typeId === 'ldns:error_helmet' ||
        equippable.getEquipment(EquipmentSlot.Chest)?.typeId === 'ldns:error_chestplate' ||
        equippable.getEquipment(EquipmentSlot.Legs)?.typeId === 'ldns:error_leggings' ||
        equippable.getEquipment(EquipmentSlot.Feet)?.typeId === 'ldns:error_boots'
    ) {
        // 夕焼けのペンダントを持っていないときに発動
        if (items <= 0) {
            // errorツールを持っているときは*2、Errorインゴットを持っているときは*0.25(1になると発動)
            // ダメージを受ける
            if (Math.floor(random(0, (6666 / ((krx + (errortoolscount * 2) + (erroritemscount * 0.25)))))) === 0) {
                targetPlayer.applyDamage(2);
            }
            // 空腹
            if (Math.floor(random(0, (7777 / ((krx + (errortoolscount * 2) + (erroritemscount * 0.25)))))) === 0) {
                targetPlayer.addEffect(MinecraftEffectTypes.Hunger, 10 * 20);
            }
        }
    }
}
// 繧ｨ繝ｩ繝ｼ縺ｫ菴薙′萓ｵ鬟溘＆繧後ｋ窶ｦ