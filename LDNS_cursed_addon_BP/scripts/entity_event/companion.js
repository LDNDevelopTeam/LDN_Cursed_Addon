import { world, system, Player, Entity, ItemStack, EquipmentSlot, GameMode } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import { random, randomValue, hasItem, giveItem, removeItem } from "../util";
import { MinecraftEffectTypes } from "../lib/mojang-effect";

// Helper to get owner name of a tamed companion
function getOwnerName(entity) {
    const ownerTag = entity.getTags().find(t => t.startsWith("owner:"));
    return ownerTag ? ownerTag.substring(6) : null;
}

// Helper to get owner player entity
function getOwnerPlayer(entity) {
    const ownerName = getOwnerName(entity);
    if (!ownerName) return null;
    return world.getPlayers().find(p => p.name === ownerName);
}

// Helper to toggle sitting state via tags and events
function toggleSitting(entity, player) {
    if (entity.hasTag("ldns:sitting")) {
        entity.removeTag("ldns:sitting");
        entity.triggerEvent("ldns:on_stand_event");
        player.sendMessage("§6[Companion] §fStay close!");
        player.playSound("random.pop");
    } else {
        entity.addTag("ldns:sitting");
        entity.triggerEvent("ldns:on_sit_event");
        player.sendMessage("§6[Companion] §fWait here!");
        player.playSound("random.pop");
    }
}

// 1. Approach checking for The Watcher & Tick Loop (every 10 ticks = 0.5s)
system.runInterval(() => {
    const overworld = world.getDimension("minecraft:overworld");
    const players = world.getPlayers();

    // Check all players for nearby untamed Watchers
    for (const player of players) {
        let hasPendant = false;
        try {
            hasPendant = hasItem(player, "ldns:pendant_of_twilight") > 0;
        } catch (e) { }

        const watchers = overworld.getEntities({
            type: "ldns:the_watcher",
            location: player.location,
            maxDistance: 6
        });

        for (const watcher of watchers) {
            if (!watcher.hasTag("ldns:tamed")) {
                if (!hasPendant) {
                    // Glitch and teleport away!
                    player.playSound("mob.ldns.watcher.gaze_alarm", { location: watcher.location });

                    try {
                        player.addEffect(MinecraftEffectTypes.Blindness, 80, { showParticles: false });
                        player.addEffect(MinecraftEffectTypes.Slowness, 80, { amplifier: 3, showParticles: false });
                    } catch (e) { }

                    player.onScreenDisplay.setTitle("§cDON'T LOOK");
                    player.sendMessage("§5[The Watcher] §kDon't look...§r");

                    // Teleport away with particles
                    const loc = watcher.location;
                    watcher.dimension.spawnParticle("minecraft:basic_smoke_particle", loc);

                    let teleported = false;
                    for (let attempt = 0; attempt < 5; attempt++) {
                        const xOff = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 10);
                        const zOff = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 10);
                        const targetLoc = { x: loc.x + xOff, y: loc.y, z: loc.z + zOff };
                        try {
                            watcher.teleport(targetLoc);
                            watcher.dimension.spawnParticle("minecraft:basic_smoke_particle", targetLoc);
                            teleported = true;
                            break;
                        } catch (e) { }
                    }
                    if (!teleported) {
                        watcher.remove();
                    }
                }
            }
        }
    }
}, 10);

// Tick loop for tamed companions (every 20 ticks = 1 second)
system.runInterval(() => {
    const overworld = world.getDimension("minecraft:overworld");

    // Tamed Watchers
    const tamedWatchers = overworld.getEntities({ type: "ldns:the_watcher", tags: ["ldns:tamed"] });
    for (const watcher of tamedWatchers) {
        const owner = getOwnerPlayer(watcher);
        if (!owner) continue;

        // Teleport follow logic
        if (watcher.isValid && !watcher.hasTag("ldns:sitting")) {
            const dist = Math.sqrt(
                Math.pow(watcher.location.x - owner.location.x, 2) +
                Math.pow(watcher.location.z - owner.location.z, 2)
            );
            if (dist > 12) {
                try {
                    watcher.teleport(owner.location, { dimension: owner.dimension });
                    watcher.dimension.spawnParticle("minecraft:portal_dematerialize_particle", watcher.location);
                } catch (e) { }
            }
        }

        // Gaze Alert: Scan for monsters in 15 blocks
        const monsters = overworld.getEntities({
            location: watcher.location,
            maxDistance: 15,
            excludeTypes: ["player", "ldns:the_watcher", "ldns:nono"]
        });

        for (const monster of monsters) {
            // Check if it's a monster/hostile family
            const fam = monster.getComponent("minecraft:type_family");
            if (fam && fam.hasTypeFamily("monster")) {
                try {
                    monster.addEffect("glowing", 40, { showParticles: false });
                } catch (e) { }

                // If extremely close, sound warning
                const dist = Math.sqrt(
                    Math.pow(monster.location.x - owner.location.x, 2) +
                    Math.pow(monster.location.z - owner.location.z, 2)
                );
                if (dist < 5) {
                    const tag = "warned_" + monster.id;
                    if (!watcher.hasTag(tag)) {
                        watcher.addTag(tag);
                        owner.sendMessage("§5[The Watcher] §cThe shadows are breathing... they are close...");
                        owner.playSound("mob.endermen.portal");
                        // Clean up tag after 5 seconds
                        system.runTimeout(() => {
                            try {
                                watcher.removeTag(tag);
                            } catch (e) { }
                        }, 100);
                    }
                }
            }
        }
    }

    // Tamed Nonos (1 second follow check)
    const tamedNonos = overworld.getEntities({ type: "ldns:nono", tags: ["ldns:tamed"] });
    for (const nono of tamedNonos) {
        const owner = getOwnerPlayer(nono);
        if (!owner) continue;

        // Teleport follow logic
        if (nono.isValid && !nono.hasTag("ldns:sitting")) {
            const dist = Math.sqrt(
                Math.pow(nono.location.x - owner.location.x, 2) +
                Math.pow(nono.location.z - owner.location.z, 2)
            );
            if (dist > 12) {
                try {
                    nono.teleport(owner.location, { dimension: owner.dimension });
                    nono.dimension.spawnParticle("minecraft:basic_smoke_particle", nono.location);
                } catch (e) { }
            }
        }
    }
}, 20);



// Tick loop for NONO buffs (every 1200 ticks = 60 seconds)
system.runInterval(() => {
    const overworld = world.getDimension("minecraft:overworld");
    const tamedNonos = overworld.getEntities({ type: "ldns:nono", tags: ["ldns:tamed"] });

    for (const nono of tamedNonos) {
        const owner = getOwnerPlayer(nono);
        if (!owner) continue;

        // Check if owner is near NONO
        const dist = Math.sqrt(
            Math.pow(nono.location.x - owner.location.x, 2) +
            Math.pow(nono.location.z - owner.location.z, 2)
        );

        if (dist <= 10 && random(0, 10) < 2) { // 20% chance
            const buffs = [
                { type: MinecraftEffectTypes.Speed, amp: 1 },
                { type: MinecraftEffectTypes.JumpBoost, amp: 2 },
                { type: MinecraftEffectTypes.Haste, amp: 1 },
                { type: MinecraftEffectTypes.Resistance, amp: 1 }
            ];
            const buff = randomValue(buffs);
            try {
                owner.addEffect(buff.type, 300, { amplifier: buff.amp, showParticles: true }); // 15s
                owner.onScreenDisplay.setActionBar("§a[NONO] §kGlitch Power!§r");
                owner.playSound("note.pling");
            } catch (e) { }
        }
    }
}, 1200);

// Tick loop for NONO inventory Glitch Swapper (every 600 ticks = 30 seconds)
system.runInterval(() => {
    const overworld = world.getDimension("minecraft:overworld");
    const tamedNonos = overworld.getEntities({ type: "ldns:nono", tags: ["ldns:tamed"] });

    for (const nono of tamedNonos) {
        if (!nono.isValid) continue;

        // 3% chance
        if (Math.random() < 0.03) {
            const inventory = nono.getComponent("minecraft:inventory");
            const container = inventory ? inventory.container : null;
            if (!container) continue;

            // Find all occupied slots
            const occupiedSlots = [];
            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if (item) {
                    occupiedSlots.push({ slot: i, item: item });
                }
            }

            if (occupiedSlots.length === 0) continue;

            // Pick a random occupied slot
            const target = randomValue(occupiedSlots);
            const slot = target.slot;
            const item = target.item;

            // Choose glitch effect
            const rand = Math.random();
            if (rand < 0.40) {
                // Duplication: +1 to +2 (respect max amount)
                const addAmount = Math.floor(Math.random() * 2) + 1; // 1 or 2
                item.amount = Math.min(item.maxAmount, item.amount + addAmount);
                container.setItem(slot, item);
            } else if (rand < 0.80) {
                // Reduction: -1 to -2
                const subAmount = Math.floor(Math.random() * 2) + 1; // 1 or 2
                if (item.amount > subAmount) {
                    item.amount -= subAmount;
                    container.setItem(slot, item);
                } else {
                    container.setItem(slot, undefined);
                }
            } else {
                // Complete deletion: 20%
                container.setItem(slot, undefined);
            }

            // Play notification and sound for owner
            const owner = getOwnerPlayer(nono);
            if (owner) {
                owner.sendMessage("§4[NONO] §dI am rewriting... your... reality... §r§e01001001");
                owner.playSound("mob.endermen.portal", { location: nono.location });
            }
        }
    }
}, 600);

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const { player, target } = event;

    // Jumpscare and Kick on unauthorized NONO inventory access
    if (target.typeId === "ldns:nono" && target.hasTag("ldns:tamed")) {
        const ownerName = getOwnerName(target);
        if (ownerName && ownerName !== player.name) {
            event.cancel = true;
            system.run(() => {
                if (!player.isValid) return;

                // 1. Show randomly sizing/flickering jumpscare over 2 seconds (40 ticks)
                let ticksElapsed = 0;
                const intervalTicks = 3; // Change size every 3 ticks
                const maxTicks = 40;

                const flickerJumpscare = () => {
                    if (!player.isValid || ticksElapsed >= maxTicks) return;

                    const jumpscareSizes = [
                        "momo_jumpscare_s",   // 40% (Small)
                        "momo_jumpscare_m",   // 70% (Medium)
                        "momo_jumpscare_l",   // 100% (Large)
                        "momo_jumpscare_xl",  // 150% (Extra Large)
                        "momo_jumpscare_xxl"  // 250% (Giant)
                    ];
                    const randomJumpscare = jumpscareSizes[Math.floor(Math.random() * jumpscareSizes.length)];
                    player.onScreenDisplay.setTitle(randomJumpscare);

                    ticksElapsed += intervalTicks;
                    system.runTimeout(flickerJumpscare, intervalTicks);
                };
                flickerJumpscare();

                // 2. Freeze player in place
                try {
                    player.addEffect(MinecraftEffectTypes.Slowness, 40, { amplifier: 255, showParticles: false });
                } catch (e) { }

                // 3. Play scary jumpscare sound
                try {
                    player.playSound("mob.ldns.nono.jumpscare", { volume: 1.0, pitch: 1.0 });
                } catch (e) { }

                // Kick after 2 seconds (40 ticks)
                system.runTimeout(() => {
                    try {
                        if (player.isValid) {
                            const overworld = world.getDimension("minecraft:overworld");
                            try {
                                overworld.runCommand(`kick "${player.name}" Y_O_U_A_R_E_N_E_X_T`);
                            } catch (e) {
                                // If kick fails (e.g. host player in local multiplayer/singleplayer), show horror warning
                                try {
                                    if (player.isValid) {
                                        player.sendMessage("§4[NONO] §dYou cannot run, Host... I am rewriting... your... mind... §e01000100 01001001 01000101");
                                    }
                                } catch (err) { }
                            }
                        }
                    } catch (e) { }
                }, 40);
            });
            return;
        }
    }

    if (target.hasTag("ldns:tamed") && (target.typeId === "ldns:the_watcher" || target.typeId === "ldns:nono")) {
        const ownerName = getOwnerName(target);
        if (ownerName === player.name) {
            // Healing check
            const healthComp = target.getComponent("health") || target.getComponent("minecraft:health");
            const equippable = player.getComponent("minecraft:equippable");
            const handItem = equippable ? equippable.getEquipment(EquipmentSlot.Mainhand) : null;

            if (healthComp && healthComp.currentValue < healthComp.effectiveMax && handItem) {
                let healAmount = 0;
                if (target.typeId === "ldns:the_watcher") {
                    if (handItem.typeId === "ldns:heavy_stone") healAmount = 40;
                    else if (handItem.typeId === "minecraft:obsidian") healAmount = 20;
                    else if (handItem.typeId === "minecraft:crying_obsidian") healAmount = 30;
                    else if (handItem.typeId === "minecraft:stone" || handItem.typeId === "minecraft:cobblestone") healAmount = 5;
                } else if (target.typeId === "ldns:nono") {
                    if (handItem.typeId === "ldns:error_ingot") healAmount = 40;
                    else if (handItem.typeId === "minecraft:iron_ingot") healAmount = 15;
                    else if (handItem.typeId === "minecraft:gold_ingot") healAmount = 20;
                    else if (handItem.typeId === "minecraft:redstone") healAmount = 10;
                }

                if (healAmount > 0) {
                    event.cancel = true;
                    system.run(() => {
                        if (!target.isValid) return;
                        const latestHealthComp = target.getComponent("health") || target.getComponent("minecraft:health");
                        if (!latestHealthComp || latestHealthComp.currentValue >= latestHealthComp.effectiveMax) return;

                        // Consume 1 item from main hand
                        const isCreative = player.getGameMode() === GameMode.Creative;
                        if (!isCreative) {
                            const latestEquippable = player.getComponent("minecraft:equippable");
                            const latestHandItem = latestEquippable ? latestEquippable.getEquipment(EquipmentSlot.Mainhand) : null;
                            if (latestHandItem && latestHandItem.typeId === handItem.typeId) {
                                if (latestHandItem.amount > 1) {
                                    latestHandItem.amount -= 1;
                                    latestEquippable.setEquipment(EquipmentSlot.Mainhand, latestHandItem);
                                } else {
                                    latestEquippable.setEquipment(EquipmentSlot.Mainhand, undefined);
                                }
                            }
                        }

                        // Apply healing
                        const newHealth = Math.min(latestHealthComp.effectiveMax, latestHealthComp.currentValue + healAmount);
                        latestHealthComp.setCurrentValue(newHealth);

                        // Sound & Particles
                        player.playSound("random.eat", { location: target.location });
                        for (let i = 0; i < 5; i++) {
                            const offset = {
                                x: target.location.x + (Math.random() - 0.5) * 0.8,
                                y: target.location.y + 1.0 + (Math.random() - 0.5) * 0.6,
                                z: target.location.z + (Math.random() - 0.5) * 0.8
                            };
                            target.dimension.spawnParticle("minecraft:heart_particle", offset);
                        }
                    });
                    return;
                }
            }

            if (target.typeId === "ldns:the_watcher") {
                event.cancel = true;
                system.run(() => {
                    toggleSitting(target, player);
                });
                return;
            } else if (target.typeId === "ldns:nono") {
                if (!player.isSneaking) {
                    event.cancel = true;
                    system.run(() => {
                        toggleSitting(target, player);
                    });
                    return;
                }
            }
        }
    }

    if (target.typeId === "ldns:the_watcher") {
        if (!target.hasTag("ldns:tamed")) {
            // Check if player has the twilight pendant in inventory
            let hasPendant = false;
            const inventory = player.getComponent("minecraft:inventory");
            if (inventory && inventory.container) {
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item && item.typeId === "ldns:pendant_of_twilight") {
                        hasPendant = true;
                        break;
                    }
                }
            }

            if (!hasPendant) {
                // Prevent interact and trigger glitch teleport
                event.cancel = true;
                return;
            }

            // If player has pendant, check hand item for Heavy Stone
            const equippable = player.getComponent("minecraft:equippable");
            const handItem = equippable ? equippable.getEquipment(EquipmentSlot.Mainhand) : null;

            if (handItem && handItem.typeId === "ldns:heavy_stone") {
                event.cancel = true;

                system.run(() => {
                    if (!target.isValid) return;
                    const isCreative = player.getGameMode() === GameMode.Creative;

                    // Consume item
                    if (!isCreative) {
                        if (handItem.amount > 1) {
                            handItem.amount -= 1;
                            equippable.setEquipment(EquipmentSlot.Mainhand, handItem);
                        } else {
                            equippable.setEquipment(EquipmentSlot.Mainhand, undefined);
                        }
                    }

                    // 33% chance to tame
                    if (Math.random() < 0.33) {
                        target.triggerEvent("ldns:on_tame_event");
                        target.addTag("ldns:tamed");
                        target.addTag("owner:" + player.name);
                        player.sendMessage("§5[The Watcher] §8You have bound my gaze. I shall watch you... forever.");
                        player.playSound("random.levelup", { location: target.location });

                        // Heart particles
                        for (let i = 0; i < 7; i++) {
                            const offset = {
                                x: target.location.x + (Math.random() - 0.5) * 0.8,
                                y: target.location.y + 1.5 + (Math.random() - 0.5) * 0.8,
                                z: target.location.z + (Math.random() - 0.5) * 0.8
                            };
                            target.dimension.spawnParticle("minecraft:heart_particle", offset);
                        }
                    } else {
                        // Fail to tame
                        player.playSound("random.pop", { location: target.location });
                        // Smoke particles
                        for (let i = 0; i < 5; i++) {
                            const offset = {
                                x: target.location.x + (Math.random() - 0.5) * 0.8,
                                y: target.location.y + 1.5 + (Math.random() - 0.5) * 0.8,
                                z: target.location.z + (Math.random() - 0.5) * 0.8
                            };
                            target.dimension.spawnParticle("minecraft:basic_smoke_particle", offset);
                        }
                    }
                });
                return;
            } else {
                // Cancel interaction to avoid unwanted default actions (e.g. punch / vanilla events)
                event.cancel = true;
                return;
            }
        }
    }

    if (target.typeId === "ldns:nono") {
        if (!target.hasTag("ldns:tamed")) {
            // Otherwise show interaction dialog and cancel the default interaction
            event.cancel = true;

            // Run dialog on the next tick so it doesn't block the event handler
            system.run(() => {
                showNonoDialog(player, target);
            });
        }
    }
});

// Post-interaction listener for setting owner tags
world.afterEvents.playerInteractWithEntity.subscribe((event) => {
    const { player, target } = event;
    if (target.typeId === "ldns:the_watcher" || target.typeId === "ldns:nono") {
        // Wait 1 tick for the native taming event to execute and apply the tag
        system.run(() => {
            if (target.isValid && target.hasTag("ldns:tamed")) {
                const ownerName = getOwnerName(target);
                if (!ownerName) {
                    target.addTag("owner:" + player.name);
                    player.sendMessage(`§6[Companion] §4The pact is sealed with ${target.typeId === "ldns:the_watcher" ? "The Watcher" : "NONO"}...`);
                    if (target.typeId === "ldns:nono") {
                        player.playSound("mob.ldns.nono.tame");
                    } else {
                        player.playSound("random.levelup");
                    }
                }
            }
        });
    }
});

function showNonoDialog(player, nono) {
    const form = new MessageFormData();
    form.title("§kNONO§r");
    form.body("§4[NONO] §cI... I found you. Will you play with me? Or do you want to play a different game...?");
    form.button1("Yes! Let's be friends!");
    form.button2("§kP§rl§ka§ry §kg§ra§km§re§r");

    form.show(player).then((response) => {
        if (response.canceled) return;

        if (response.selection === 0) {
            // Friend request
            const isCreative = player.getGameMode() === GameMode.Creative;
            const hasIngot = hasItem(player, "ldns:error_ingot") > 0;

            if (!hasIngot && !isCreative) {
                player.sendMessage("§4[NONO] §7Not enough... feed me more of your errors.");
                player.playSound("mob.villager.no", { location: player.location });
                return;
            }

            if (Math.random() < 0.3) {
                // Tame!
                if (!isCreative) {
                    removeItem(player, "ldns:error_ingot", 1);
                }
                nono.triggerEvent("ldns:on_tame_event");
                nono.addTag("ldns:tamed");
                nono.addTag("owner:" + player.name);
                player.sendMessage("§4[NONO] §cBest friends... until death parts us...");
                player.playSound("mob.ldns.nono.tame", { location: player.location });
            } else {
                player.sendMessage("§4[NONO] §7Not enough... feed me more of your errors.");
                player.playSound("mob.villager.no", { location: player.location });
                // Note: The ingot is not consumed on failure, which behaves as if it was returned as an apology.
            }
        } else if (response.selection === 1) {
            // Play game
            showNonoGame(player, nono);
        }
    });
}

function showNonoGame(player, nono) {
    const form = new MessageFormData();
    form.title("§kERROR_GAME§r");
    form.body("§4Red or Blue... either way, you will belong to the void. Choose.\n\nNONO smiles creepily.");
    form.button1("§cRed Pill");
    form.button2("§9Blue Pill");

    form.show(player).then((response) => {
        if (response.canceled) return;

        if (response.selection === 0) {
            // Red Pill: Chaos!
            nono.dimension.createExplosion(nono.location, 2, { breaksBlocks: false });
            if (Math.random() < 0.5) {
                player.sendMessage("§4[NONO] §dThe glitch spares you... for now.");
                giveItem(player, "ldns:error_ingot");
                try {
                    player.addEffect(MinecraftEffectTypes.Regeneration, 100, { amplifier: 1 });
                } catch (e) { }
            } else {
                player.sendMessage("§4[NONO] §4The virus is spreading. Feel the decay.");
                try {
                    player.addEffect(MinecraftEffectTypes.Wither, 60, { amplifier: 0 });
                } catch (e) { }
            }
        } else if (response.selection === 1) {
            // Blue Pill: Teleport away
            player.sendMessage("§4[NONO] §7You cannot escape the code...");
            nono.dimension.spawnParticle("minecraft:basic_smoke_particle", nono.location);
            nono.remove();
        }
    });
}

// Combat Gaze and assistance
world.afterEvents.entityHitEntity.subscribe((event) => {
    const { damagingEntity, hitEntity } = event;

    if (damagingEntity instanceof Player) {
        // Check if player has a tamed Watcher nearby
        const watcher = damagingEntity.dimension.getEntities({
            type: "ldns:the_watcher",
            location: damagingEntity.location,
            maxDistance: 15,
            tags: ["ldns:tamed"]
        }).find(w => getOwnerName(w) === damagingEntity.name);

        if (watcher) {
            try {
                hitEntity.addEffect(MinecraftEffectTypes.Slowness, 80, { amplifier: 2, showParticles: true });
                hitEntity.addEffect(MinecraftEffectTypes.Weakness, 80, { amplifier: 1, showParticles: true });
                damagingEntity.playSound("mob.endermen.portal", { location: hitEntity.location });
                watcher.dimension.spawnParticle("minecraft:portal_dematerialize_particle", hitEntity.location);
            } catch (e) { }
        }

        // Check if player has a tamed NONO nearby (chaos projectile chance)
        const nono = damagingEntity.dimension.getEntities({
            type: "ldns:nono",
            location: damagingEntity.location,
            maxDistance: 12,
            tags: ["ldns:tamed"]
        }).find(n => getOwnerName(n) === damagingEntity.name);

        if (nono && random(0, 10) < 3) { // 30% chance
            const effect = random(0, 4);
            try {
                nono.dimension.playSound("spell.charge", nono.location);
                if (effect === 0) {
                    hitEntity.addEffect(MinecraftEffectTypes.Levitation, 60, { amplifier: 1 });
                    damagingEntity.sendMessage("§a[NONO] §dFloat away!");
                } else if (effect === 1) {
                    // Teleport hitEntity randomly
                    const loc = hitEntity.location;
                    const targetLoc = {
                        x: loc.x + random(-4, 5),
                        y: loc.y,
                        z: loc.z + random(-4, 5)
                    };
                    hitEntity.teleport(targetLoc);
                    hitEntity.dimension.spawnParticle("minecraft:basic_smoke_particle", targetLoc);
                    damagingEntity.sendMessage("§a[NONO] §dWhere did you go?");
                } else if (effect === 2) {
                    hitEntity.setOnFire(4);
                    damagingEntity.sendMessage("§a[NONO] §cBurn!");
                } else if (effect === 3) {
                    hitEntity.addEffect(MinecraftEffectTypes.Wither, 100, { amplifier: 0 });
                    damagingEntity.sendMessage("§a[NONO] §4Decay!");
                }
            } catch (e) { }
        }
    }
});

// Hurt listener for Savior Teleport
world.afterEvents.entityHurt.subscribe((event) => {
    const { hurtEntity } = event;
    if (hurtEntity instanceof Player) {
        const hpComp = hurtEntity.getComponent("health") || hurtEntity.getComponent("minecraft:health");
        const hp = hpComp ? hpComp.currentValue : null;
        if (hp !== null && hp < 4) {
            // Find tamed Watcher within 15 blocks
            const watcher = hurtEntity.dimension.getEntities({
                type: "ldns:the_watcher",
                location: hurtEntity.location,
                maxDistance: 15,
                tags: ["ldns:tamed"]
            }).find(w => getOwnerName(w) === hurtEntity.name);

            if (watcher) {
                const watcherHpComp = watcher.getComponent("health") || watcher.getComponent("minecraft:health");
                if (watcherHpComp && watcherHpComp.currentValue > 20) {
                    // Trigger savior warp!
                    watcherHpComp.setCurrentValue(Math.max(1, watcherHpComp.currentValue - 20));
                    hurtEntity.sendMessage("§5[The Watcher] §fI've got you...");
                    hurtEntity.playSound("mob.ldns.watcher.savior_warp", { location: hurtEntity.location });
                    hurtEntity.dimension.spawnParticle("minecraft:portal_dematerialize_particle", hurtEntity.location);

                    // Teleport player safely
                    const pLoc = hurtEntity.location;
                    let teleported = false;
                    for (let attempt = 0; attempt < 5; attempt++) {
                        const targetLoc = {
                            x: pLoc.x + random(-5, 6),
                            y: pLoc.y,
                            z: pLoc.z + random(-5, 6)
                        };
                        try {
                            hurtEntity.teleport(targetLoc);
                            hurtEntity.dimension.spawnParticle("minecraft:portal_dematerialize_particle", targetLoc);
                            teleported = true;
                            break;
                        } catch (e) { }
                    }
                    try {
                        hurtEntity.addEffect(MinecraftEffectTypes.Regeneration, 100, { amplifier: 1 });
                        hurtEntity.addEffect(MinecraftEffectTypes.Speed, 100, { amplifier: 1 });
                    } catch (e) { }
                }
            }
        }
    }
});

// Sound trigger for NONO spawn
world.afterEvents.entitySpawn.subscribe((event) => {
    const { entity } = event;
    if (entity.typeId === "ldns:nono") {
        const loc = entity.location;
        const players = entity.dimension.getPlayers({ location: loc, maxDistance: 16 });
        for (const player of players) {
            player.playSound("mob.ldns.nono.spawn", { location: loc });
        }
    }
});

// Tick loop for wild NONO and The Watcher cleanup (every 20 ticks = 1 second)
system.runInterval(() => {
    for (const dimensionId of ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"]) {
        try {
            const dimension = world.getDimension(dimensionId);
            const wildNonos = dimension.getEntities({ type: "ldns:nono" }).filter(e => !e.hasTag("ldns:tamed"));
            const wildWatchers = dimension.getEntities({ type: "ldns:the_watcher" }).filter(e => !e.hasTag("ldns:tamed"));

            const wildEntities = [...wildNonos, ...wildWatchers];
            for (const entity of wildEntities) {
                if (!entity.isValid) continue;

                // Check if players are nearby (within 16 blocks)
                let playersNearby = false;
                try {
                    const players = entity.dimension.getPlayers({ location: entity.location, maxDistance: 16 });
                    if (players.length > 0) {
                        playersNearby = true;
                    }
                } catch (e) { }

                if (playersNearby) {
                    // Reset age tag if players are close to avoid despawning in front of them
                    const currentAgeTag = entity.getTags().find(tag => tag.startsWith("ldns:age_"));
                    if (currentAgeTag) {
                        entity.removeTag(currentAgeTag);
                    }
                    entity.addTag("ldns:age_0");
                    continue;
                }

                // Increment age
                const currentAgeTag = entity.getTags().find(tag => tag.startsWith("ldns:age_"));
                let age = 0;
                if (currentAgeTag) {
                    age = parseInt(currentAgeTag.substring(9), 10);
                    entity.removeTag(currentAgeTag);
                }
                age += 1;

                if (age >= 300) { // 300 seconds = 5 minutes
                    // Spawn smoke particles before removing
                    try {
                        entity.dimension.spawnParticle("minecraft:basic_smoke_particle", entity.location);
                    } catch (e) { }
                    entity.remove();
                } else {
                    entity.addTag("ldns:age_" + age);
                }
            }
        } catch (e) { }
    }
}, 20);

