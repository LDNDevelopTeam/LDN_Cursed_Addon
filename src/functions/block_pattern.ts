import type { Block, Vector3 } from "@minecraft/server";

/** 基準ブロックからの相対座標と、そこにあるべきブロックの ID の組 */
export type BlockPattern = readonly (readonly [offset: Vector3, typeId: string])[];

/** パターンのブロックがすべて揃っているか */
export function matchesPattern(origin: Block, pattern: BlockPattern): boolean {
    return pattern.every(([offset, typeId]) => origin.offset(offset)?.typeId === typeId);
}

/** パターンの位置のブロックを、パターンの順番どおりにすべて空気にする */
export function clearPattern(origin: Block, pattern: BlockPattern): void {
    for (const [offset] of pattern) {
        origin.offset(offset)?.setType("air");
    }
}

/**
 * パターンの +X 方向を東西南北に向ける回転。
 * {@link findRotatedPattern} はこの順番 (北, 南, 東, 西) で判定する。
 */
const rotations: readonly ((offset: Vector3) => Vector3)[] = [
    ({ x, y, z }) => ({ x: z, y, z: -x }),  // 北 (-Z)
    ({ x, y, z }) => ({ x: -z, y, z: x }),  // 南 (+Z)
    ({ x, y, z }) => ({ x, y, z }),         // 東 (+X)
    ({ x, y, z }) => ({ x: -x, y, z: -z }), // 西 (-X)
];

/**
 * パターンを Y 軸周りに 4 方向へ回転させて判定し、最初に揃っていた向きのパターンを返す。
 * どの向きでも揃っていなければ undefined。
 */
export function findRotatedPattern(origin: Block, pattern: BlockPattern): BlockPattern | undefined {
    for (const rotate of rotations) {
        const rotated = pattern.map(([offset, typeId]) => [rotate(offset), typeId] as const);
        if (matchesPattern(origin, rotated)) return rotated;
    }
    return undefined;
}
