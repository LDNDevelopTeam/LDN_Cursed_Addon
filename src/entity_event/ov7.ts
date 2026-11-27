import { Difficulty, Player, system, WeatherType, world } from "@minecraft/server";
import { random } from '../util';

system.run(() => {
    world.setDynamicProperty("ov7spawn", false);
});

world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.typeId === "ldns:ov7") {
        event.entity.nameTag = "Oblivionv7";
        world.sendMessage({
            translate: "message.mysterious_players.join",
            with: ["Oblivionv7"]
        });
        world.setDynamicProperty("ov7spawn", true);
    }
});

system.runInterval(() => {
    if (world.getDynamicProperty("ov7spawn") == true) {
        switch (random(0, 100)) {
            case 0:
                world.sendMessage("~$ sudo apt install oblivionv7-toolkit");
                break;
            case 1:
                world.sendMessage("~$ sudo mount -a");
                break;
            case 2:
                world.sendMessage("~$ cat /proc/cpuinfo");
                break;
            case 3:
                world.sendMessage("");
                break;
            case 4:
                world.sendMessage("/op oblivionv7");
                break;
            case 5:
                world.sendMessage("I'm livewinner V6c");
                break;
            case 6:
                world.sendMessage("/reload");
                break;
            case 7:
                world.sendMessage("/gamemode oblivion");
                break;
            case 8:
                world.sendMessage("/give @s oblivion");
                break;
            case 9:
                world.sendMessage("~$ sudo rm -r ./minecraft");
                break;
            case 10:
                world.sendMessage("~$ ls -a");
                break;
            case 11:
                world.sendMessage("~$ mkdir oblivion");
                break;
            case 11:
                world.sendMessage("~$ mv minecraft oblivion");
                break;
            case 12:
                world.sendMessage("~$ chmod 777 oblivion");
                break;
            case 13:
                world.sendMessage("~$ chown oblivion:oblivion oblivion");
                break;
            case 14:
                world.sendMessage("/stop");
                break;
        }
    }
}, 20 * 10);

world.afterEvents.entityHitEntity.subscribe((event) => {
    if (event.hitEntity instanceof Player && event.damagingEntity.typeId == "ldns:ov7") {
        switch (random(0, 100)) {
            case 0:
                world.sendMessage("~$ sudo apt install oblivionv7-toolkit");
                break;
            case 1:
                world.sendMessage("~$ sudo mount -a");
                break;
            case 2:
                world.sendMessage("~$ cat /proc/cpuinfo");
                break;
            case 3:
                world.sendMessage("");
                break;
            case 4:
                world.sendMessage("/op oblivionv7");
                break;
            case 5:
                world.sendMessage("I'm livewinner V6c");
                break;
            case 6:
                world.sendMessage("/reload");
                break;
            case 7:
                world.sendMessage("/gamemode oblivion");
                break;
            case 8:
                world.sendMessage("/give @s oblivion");
                break;
            case 9:
                world.sendMessage("~$ sudo rm -r ./minecraft");
                break;
            case 10:
                world.sendMessage("~$ ls -a");
                break;
            case 11:
                world.sendMessage("~$ mkdir oblivion");
                break;
            case 11:
                world.sendMessage("~$ mv minecraft oblivion");
                break;
            case 12:
                world.sendMessage("~$ chmod 777 oblivion");
                break;
            case 13:
                world.sendMessage("~$ chown oblivion:oblivion oblivion");
                break;
            case 14:
                world.sendMessage("/stop");
                break;
        }
    }
});

world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId === "ldns:ov7") {
        world.setDynamicProperty("ov7spawn", false);
    }
});