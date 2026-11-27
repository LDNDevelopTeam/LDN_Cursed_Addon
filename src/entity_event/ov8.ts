import { Difficulty, Player, system, WeatherType, world } from "@minecraft/server";
import { random } from '../util';

system.run(() => {
    world.setDynamicProperty("ov8spawn", false);
});

world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.typeId === "ldns:ov8") {
        event.entity.nameTag = "Oblivionv8";
        world.sendMessage({
            translate: "message.mysterious_players.join",
            with: ["Oblivionv8"]
        });
        world.setDynamicProperty("ov8spawn", true);
    }
});

system.runInterval(() => {
    if (world.getDynamicProperty("ov8spawn") == true) {
        switch (random(0, 100)) {
            case 0:
                world.setDifficulty(Difficulty.Easy);
                world.sendMessage("The difficulty level was set to Easy.");
                break;
            case 1:
                world.setDifficulty(Difficulty.Normal);
                world.sendMessage("The difficulty level was set to Normal.");
                break;
            case 2:
                world.setDifficulty(Difficulty.Hard);
                world.sendMessage("The difficulty level was set to Hard.");
                break;
            case 3:
                world.sendMessage("I'm livewinner A666");
                break;
            case 4:
                world.getDimension("overworld").setWeather(WeatherType.Clear);
                world.sendMessage("The weather was set to clear.");
                break;
            case 5:
                world.getDimension("overworld").setWeather(WeatherType.Rain);
                world.sendMessage("The weather was set to rain.");
                break;
            case 6:
                world.getDimension("overworld").setWeather(WeatherType.Thunder);
                world.sendMessage("The weather was set to thunder.");
                break;
        }
    }
}, 20 * 10);


world.afterEvents.entityHitEntity.subscribe((event) => {
    if (event.hitEntity instanceof Player && event.damagingEntity.typeId == "ldns:ov8") {
        switch (random(0, 100)) {
            case 0:
                world.setDifficulty(Difficulty.Easy);
                world.sendMessage("The difficulty level was set to Easy.");
                break;
            case 1:
                world.setDifficulty(Difficulty.Normal);
                world.sendMessage("The difficulty level was set to Normal.");
                break;
            case 2:
                world.setDifficulty(Difficulty.Hard);
                world.sendMessage("The difficulty level was set to Hard.");
                break;
            case 3:
                world.gameRules.doDayLightCycle = true;
                world.sendMessage("Gamemode's doDayLightCycle has been set to True.");
                break;
            case 4:
                world.gameRules.doDayLightCycle = false;
                world.sendMessage("Gamemode's doDayLightCycle has been set to False.");
                break;
            case 5:
                world.sendMessage("I'm livewinner A666");
                break;
            case 6:
                world.getDimension("overworld").setWeather(WeatherType.Clear);
                world.sendMessage("The weather was set to clear.");
                break;
            case 7:
                world.getDimension("overworld").setWeather(WeatherType.Rain);
                world.sendMessage("The weather was set to rain.");
                break;
            case 8:
                world.getDimension("overworld").setWeather(WeatherType.Thunder);
                world.sendMessage("The weather was set to thunder.");
                break;
        }
    }
});

world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId === "ldns:ov8") {
        world.setDynamicProperty("ov8spawn", false);
    }
});