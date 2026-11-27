import { type Dimension, world } from "@minecraft/server";

export function getTopmostBlockLocation(dimension: Dimension, x: number, z: number): number {
    let ground = world.getDimension(dimension.id).getBlockBelow({ x: x, y: 200, z: z }, { includeLiquidBlocks: false });
    return ground!.location.y
}
