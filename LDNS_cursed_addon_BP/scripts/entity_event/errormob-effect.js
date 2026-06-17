import { Entity, Player, system, world } from "@minecraft/server";
import { random, hasItem } from '../util';
import { freeze } from '../functions/kanasibari';
import { random_move } from '../functions/random_move';

world.afterEvents.entityHitEntity.subscribe((e) => {
    const { damagingEntity, hitEntity } = e;
    if (damagingEntity.typeId == "ldns:errormob") errordamage(hitEntity);
});

world.afterEvents.entityHurt.subscribe((e) => {
    const { damageSource, hurtEntity } = e;
    if (hurtEntity.typeId == "ldns:errormob") errorhurt(damageSource.damagingEntity);
});

/**
 * @param {Entity} targetPlayer
 */
async function errordamage(targetPlayer) {
    if (!(targetPlayer instanceof Player)) return;
    const playerlocation = targetPlayer.location;
    const rand = random(0, 86);
    // Error画面
    if (rand === 6) {
        switch (random(0, 4)) {
            case 0:
                targetPlayer.playSound("ldns.error_the_error");
                break;
            case 1:
                targetPlayer.playSound("ldns.cursednoise1");
                break;
            case 2:
                targetPlayer.playSound("ldns.cursednoise2");
                break;
            case 3:
                targetPlayer.playSound("ldns.cursednoise3");
                break;
        }
        targetPlayer.onScreenDisplay.setTitle("繧ｨ繝ｩ繝ｼ");
    }
    // フェイクダイアログ
    else if (rand === 7) {
        const randw = random(0, 2);
        const randm = random(0, 8);
        targetPlayer.playSound("ldns.errormob_errorwindow");
        switch (randw) {
            case 0:
                targetPlayer.onScreenDisplay.setTitle("ew1");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
            case 1:
                targetPlayer.onScreenDisplay.setTitle("ew2");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
        }
    }
    // グリッチ画面
    else if (rand === 8) {
        const rands = random(0, 2);
        const randh = random(0, 4);
        const randm = random(0, 8);
        switch (rands) {
            case 0:
                targetPlayer.playSound("ldns.pp_spawn");
                targetPlayer.playSound("ldns.beep");
                targetPlayer.playSound("ldns.errormob_glitch");
                break;
            case 1:
                targetPlayer.playSound("ldns.yy_spawn");
                targetPlayer.playSound("ldns.beep");
                targetPlayer.playSound("ldns.errormob_glitch");
                break;
        }
        switch (randh) {
            case 0:
                targetPlayer.onScreenDisplay.setTitle("egn2");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
            case 1:
                targetPlayer.onScreenDisplay.setTitle("egn3");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
            case 2:
                targetPlayer.onScreenDisplay.setTitle("egn6");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
            case 3:
                targetPlayer.onScreenDisplay.setTitle("egn9");
                if (randm === 0) {
                    freeze(targetPlayer, playerlocation, 100);
                }
                break;
        }
    }
    // 金縛り
    else if (rand === 9) {
        targetPlayer.playSound("ldns.error_the_error");
        freeze(targetPlayer, playerlocation, 100);
    }
    // アイテムが置き換えられる
    else if (rand === 13) {
        // インベントリ
        const { container } = targetPlayer.getComponent("inventory");
        for (let i = 0; i < container.size; i++) {
            // アイテムを置き換える
            container.swapItems(i, random(0, container.size - 1), container);
        }
    }
    // レベルリセット
    else if (rand === 16) targetPlayer.resetLevel();
    // スポーンポイント設定
    else if (rand === 22) {
        targetPlayer.setSpawnPoint({ dimension: targetPlayer.dimension, x: targetPlayer.location.x, y: targetPlayer.location.y, z: targetPlayer.location.z });
        targetPlayer.onScreenDisplay.setTitle("Set Spawn");
    }
    // ノックバック
    else if (rand === 30) {
        targetPlayer.teleport({ x: playerlocation.x, y: playerlocation.y + random(4, 15), z: playerlocation.z })
    }
    // ランダム位置入れ替え
    else if (rand === 32) {
        targetPlayer.playSound("ldns.error_the_error");
        random_move(targetPlayer, playerlocation, 50);
    }
}
/**
 * @param {Entity} damageSource
 */
// エンティティが傷つけられたとき
function errorhurt(damageSource) {
    if (!(damageSource instanceof Player)) return;
    // ペンダントを持っているときのカウント
    const items = hasItem(damageSource, 'ldns:pendant_of_twilight');
    const rand = random(0, 100);
    const playerlocation = damageSource.location;
    // Error画面
    // 夕焼けのペンダントを持っていないときに発動
    if (items <= 0) {
        if (rand === 6) {
            switch (random(0, 4)) {
                case 0:
                    damageSource.playSound("ldns.error_the_error");
                    break;
                case 1:
                    damageSource.playSound("ldns.cursednoise1");
                    break;
                case 2:
                    damageSource.playSound("ldns.cursednoise2");
                    break;
                case 3:
                    damageSource.playSound("ldns.cursednoise3");
                    break;
            }
            damageSource.onScreenDisplay.setTitle("繧ｨ繝ｩ繝ｼ");
        }
        // フェイクダイアログ
        else if (rand === 7) {
            const randw = random(0, 2);
            damageSource.playSound("ldns.errormob_errorwindow");
            switch (randw) {
                case 0:
                    damageSource.onScreenDisplay.setTitle("ew1");
                    break;
                case 1:
                    damageSource.onScreenDisplay.setTitle("ew2");
                    break;
            }
        }
        // グリッチ画面
        else if (rand === 8) {
            const rands = random(0, 2);
            const randh = random(0, 4);
            switch (rands) {
                case 0:
                    damageSource.playSound("ldns.pp_spawn");
                    damageSource.playSound("ldns.beep");
                    damageSource.playSound("ldns.errormob_glitch");
                    break;
                case 1:
                    damageSource.playSound("ldns.yy_spawn");
                    damageSource.playSound("ldns.beep");
                    damageSource.playSound("ldns.errormob_glitch");
                    break;
            }
            switch (randh) {
                case 0:
                    damageSource.onScreenDisplay.setTitle("egn2");
                    break;
                case 1:
                    damageSource.onScreenDisplay.setTitle("egn3");
                    break;
                case 2:
                    damageSource.onScreenDisplay.setTitle("egn6");
                    break;
                case 3:
                    damageSource.onScreenDisplay.setTitle("egn9");
                    break;
            }
        }
        // 金縛り
        else if (rand === 9) {
            damageSource.playSound("ldns.error_the_error");
            freeze(damageSource, playerlocation, 100);
        }
        // アイテムが置き換えられる
        else if (rand === 13) {
            // インベントリ
            const { container } = damageSource.getComponent("inventory");
            for (let i = 0; i < container.size; i++) {
                // アイテムを置き換える
                container.swapItems(i, random(0, container.size - 1), container);
            }
        }
    }
}
