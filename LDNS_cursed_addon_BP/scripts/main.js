// @ts-check
import { system, world } from '@minecraft/server';

import './script_event/random_effect';
import './script_event/random_time';
import './item_event/error-tool-effects';
import './item_event/error-tool-damage';
import './entity_event/nametag_mysterious_players';
import './item_event/twilight';
import './item_event/error-tool-block-event';
import './item_event/boss-trophy';
import './entity_event/nullbrain';
import './entity_event/nonebrain';
import './script_event/spawn';
import './entity_event/errormob-effect';
import './entity_event/entity787';
import './entity_event/ppyyeffect';
import './entity_event/boss_dr_naba';
import './entity_event/head_only_sheep';
import './entity_event/shadow_mob';
import './entity_event/vill';
import './entity_event/public_void';
import './entity_event/binary444';
import './entity_event/herovoid';
import './entity_event/error64_place';
import './entity_event/iamyoumaybe';
import './entity_event/tbd';
import './entity_event/never_sleep';
import './entity_event/ov7';
import './entity_event/ov8';
import './entity_event/possibly';
import './entity_event/personal_villager'
import './entity_event/companion'

const timezoneOffset = 0;

system.runInterval(() => {
  let systemClock = world.scoreboard.getObjective('SystemClock');
  if (!systemClock) systemClock = world.scoreboard.addObjective('SystemClock');

  const d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (timezoneOffset * 60)) * 60 * 1000));
  systemClock.setScore('day', d.getDate());
  systemClock.setScore('hour', d.getHours());
  systemClock.setScore('minute', d.getMinutes());
}, 20 * 60);