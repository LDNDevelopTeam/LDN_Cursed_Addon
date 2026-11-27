import type { Entity, World } from '@minecraft/server';

/** `world` に保存する Dynamic Property のキーと値の型 */
export interface WorldDynamicPropertyTypeMap {
  /** Never Sleep を出現させてから、まだ朝になっていないか */
  neversleep: boolean;
  /** Nonebrain がデスポーンした数 (一定数を超えるとイベントが発生してリセット) */
  noneint: number;
  /** Oblivionv7 が出現中か */
  ov7spawn: boolean;
  /** Oblivionv8 が出現中か */
  ov8spawn: boolean;
  /** TBD のイベント中か */
  tbd: boolean;
  /** TBD のイベント対象プレイヤーの id */
  tbd_player: string;
  /** ランダムチャットが有効か (未設定のときは有効として扱う) */
  toggle_chat: boolean;
  /** vill が追いかけているプレイヤーの id */
  villTGid: string;
  /** vill がプレイヤーを追いかけているか */
  villTGS: boolean;
}

/** エンティティ (主にプレイヤー) に保存する Dynamic Property のキーと値の型 */
export interface EntityDynamicPropertyTypeMap {
  /** Length Fix の演出を実行中か (多重発動防止) */
  lengthFixTriggered: boolean;
  /** 岩盤部屋 (error64 / Place) に入っているか */
  longfixTag: boolean;
  /** 岩盤部屋の奥まで進んで Place が出現したか */
  longfixTag2: boolean;
  /** 岩盤部屋に飛ばされる前の座標 */
  LposX: number;
  LposY: number;
  LposZ: number;
  /** Possibly の進行状況 */
  possibly: -1 | 0 | 1 | 2 | 3;
  /** 岩盤部屋の座標 */
  roomX: number;
  roomZ: number;
}

function get<K extends keyof WorldDynamicPropertyTypeMap>(target: World, key: K): WorldDynamicPropertyTypeMap[K] | undefined;
function get<K extends keyof EntityDynamicPropertyTypeMap>(target: Entity, key: K): EntityDynamicPropertyTypeMap[K] | undefined;
function get(target: World | Entity, key: string) {
  return target.getDynamicProperty(key);
}

function set<K extends keyof WorldDynamicPropertyTypeMap>(target: World, key: K, value: WorldDynamicPropertyTypeMap[K]): void;
function set<K extends keyof EntityDynamicPropertyTypeMap>(target: Entity, key: K, value: EntityDynamicPropertyTypeMap[K]): void;
function set(target: World | Entity, key: string, value: string | number | boolean) {
  target.setDynamicProperty(key, value);
}

/**
 * 型付きの Dynamic Property アクセサ。
 * キーと値の型は {@link WorldDynamicPropertyTypeMap} / {@link EntityDynamicPropertyTypeMap} で定義する。
 * 新しいキーを使うときは、先にそちらへ追加すること。
 */
export const DynamicProperty = { get, set } as const;
