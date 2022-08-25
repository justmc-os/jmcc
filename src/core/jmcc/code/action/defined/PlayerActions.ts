import selection from '../../Selection';
import Actions from './Actions';

const PLAYER_ACTIONS_SELECTION = [
  selection.CURRENT,
  selection.DEFAULT_PLAYER,
  selection.KILLER_PLAYER,
  selection.DAMAGER_PLAYER,
  selection.SHOOTER_PLAYER,
  selection.VICTIM_PLAYER,
  selection.RANDOM_PLAYER,
  selection.ALL_PLAYERS,
];

class PlayerActions extends Actions {
  constructor() {
    super(PLAYER_ACTIONS_SELECTION);
  }

  // #region Communication
  // CLEAR_CHAT = this.register('player_clear_chat', 'clear_chat', {});

  // OPEN_BOOK = this.register('player_open_book', 'open_book', {
  //   book: item,
  // });

  // PLAY_SOUND = this.register('player_play_sound', 'play_sound', {
  //   sound,
  //   location: optional(location),
  //   source: enumof(
  //     'MASTER',
  //     'MUSIC',
  //     'RECORD',
  //     'WEATHER',
  //     'BLOCK',
  //     'HOSTILE',
  //     'NEUTRAL',
  //     'PLAYER',
  //     'AMBIENT',
  //     'VOICE'
  //   ),
  // });

  // PLAY_SOUNDS = this.register('player_play_sound_sequence', 'play_sounds', {
  //   sounds: array(sound, 43),
  //   delay: optional(number),
  //   location: optional(location),
  //   source: enumof(
  //     'MASTER',
  //     'MUSIC',
  //     'RECORD',
  //     'WEATHER',
  //     'BLOCK',
  //     'HOSTILE',
  //     'NEUTRAL',
  //     'PLAYER',
  //     'AMBIENT',
  //     'VOICE'
  //   ),
  // });

  // REMOVE_BOSS_BAR = this.register('player_remove_boss_bar', 'remove_boss_bar', {
  //   id: text,
  // });

  // ACTION_BAR = this.register('player_send_action_bar', 'action_bar', {
  //   messages: array(Any, 18, true),
  //   merging: enumof('SPACES', 'CONCATENATION'),
  // });

  // ADVANCEMENT = this.register('player_send_advancement', 'advancement', {
  //   frame: enumof('TASK', 'CHALLENGE', 'GOAL'),
  //   name: text,
  //   icon: item,
  // });

  // DIALOGUE = this.register('player_send_dialogue', 'dialogue', {
  //   messages: array(text, 17),
  //   delay: optional(number),
  // });

  // HOVER = this.register('player_send_hover', 'hover', {
  //   message: text,
  //   hover: text,
  // });

  // MESSAGE = this.register('player_send_message', 'message', {
  //   messages: array(Any, 18),
  //   merging: enumof('SPACES', 'CONCATENATION', 'SEPARATE_LINES'),
  // });

  // TITLE = this.register('player_send_title', 'title', {
  //   title: optional(text),
  //   subtitle: optional(text),
  //   fade_in: optional(number),
  //   stay: optional(text),
  //   fade_out: optional(text),
  // });

  // BOSS_BAR = this.register('player_set_boss_bar', 'boss_bar', {
  //   id: text,
  //   title: text,
  //   progress: optional(text),
  //   color: enumof('BLUE', 'GREEN', 'PINK', 'PURPLE', 'RED', 'WHITE', 'YELLOW'),
  //   style: enumof(
  //     'PROGRESS',
  //     'NOTCHED_6',
  //     'NOTCHED_10',
  //     'NOTCHED_12',
  //     'NOTCHED_20'
  //   ),
  //   sky_effect: enumof('NONE', 'FOG', 'DARK_SKY', 'FOG_AND_DARK_SKY'),
  // });

  // SHOW_DEMO_SCREEN = this.register(
  //   'player_show_demo_screen',
  //   'show_demo_screen',
  //   {}
  // );

  // STOP_SOUND = this.register('player_stop_sound', 'stop_sound', {
  //   sounds: array(sound, 18),
  //   source: enumof(
  //     'MASTER',
  //     'MUSIC',
  //     'RECORD',
  //     'WEATHER',
  //     'BLOCK',
  //     'HOSTILE',
  //     'NEUTRAL',
  //     'PLAYER',
  //     'AMBIENT',
  //     'VOICE'
  //   ),
  // });
  // // #endregion

  // // #region Inventory
  // SHOW_MENU = this.register('player_show_inventory_menu', 'show_menu', {
  //   items: array(ItemConstant, 27),
  //   name: optional(TextConstant),
  //   inventory_type: enumof(
  //     'CHEST',
  //     'DISPENSER',
  //     'DROPPER',
  //     'FURNACE',
  //     'WORKBENCH',
  //     'CRAFTING',
  //     'ENCHANTING',
  //     'BREWING',
  //     'PLAYER',
  //     'CREATIVE',
  //     'MERCHANT',
  //     'ENDER_CHEST',
  //     'ANVIL',
  //     'SMITHING',
  //     'BEACON',
  //     'HOPPER',
  //     'SHULKER_BOX',
  //     'BARREL',
  //     'BLAST_FURNACE',
  //     'SMOKER',
  //     'LOOM',
  //     'CARTOGRAPHY',
  //     'GRINDSTONE',
  //     'STONECUTTER'
  //   ),
  // });
  // // #endregion

  // // #region Predicates
  // IS_BLOCKING = this.register('if_player_is_blocking', 'is_blocking', {});
  // IS_FLYING = this.register('if_player_is_flying', 'is_flying', {});
  // IS_GLIDING = this.register('if_player_is_gliding', 'is_gliding', {});
  // IS_SLEEPING = this.register('if_player_is_sleeping', 'is_sleeping', {});
  // IS_SNEAKING = this.register('if_player_is_sneaking', 'is_sneaking', {});
  // IS_SPRINTING = this.register('if_player_is_sprinting', 'is_sprinting', {});
  // IS_SWIMMING = this.register('if_player_is_swimming', 'is_swimming', {});

  // IS_IN_AREA = this.register('if_player_in_area', 'is_in_area', {
  //   location_1: location,
  //   location_2: location,
  //   ignore_y_axis: boolean(),
  // });

  // IS_LOOKING_AT_BLOCK = this.register(
  //   'if_player_is_looking_at_block',
  //   'is_looking_at',
  //   {
  //     blocks: array(item, 15, true),
  //     locations: array(location, 15, true),
  //     distance: optional(number),
  //     fluid_mode: enumof('NEVER', 'SOURCE_ONLY', 'ALWAYS'),
  //   }
  // );

  // IS_NEAR = this.register('if_player_is_near', 'is_near', {
  //   location,
  //   range: number,
  //   ignore_y_axis: boolean(),
  // });

  // IS_STANDING_ON = this.register(
  //   'if_player_is_standing_on_block',
  //   'is_standing_on',
  //   {
  //     blocks: array(item, 20, true),
  //     locations: array(location, 20, true),
  //   }
  // );

  // CHAT_MESSAGE_EQUALS = this.register(
  //   'if_player_chat_message_equals',
  //   'chat_message_equals',
  //   { chat_messages: array(text, 18) }
  // );

  // GAMEMODE_EQUALS = this.register(
  //   'if_player_gamemode_equals',
  //   'gamemode_equals',
  //   {
  //     gamemode: enumof('SURVIVAL', 'CREATIVE', 'ADVENTURE', 'SPECTATOR'),
  //   }
  // );

  // HAS_POTION_EFFECT = this.register(
  //   'if_player_has_potion_effect',
  //   'has_potion_effect',
  //   { potions: array(potion, 18), check_mode: checkMode }
  // );

  // HOTBAR_SLOT_EQUALS = this.register(
  //   'if_player_hotbar_slot_equals',
  //   'hotbar_slot_equals',
  //   {
  //     slot: number,
  //   }
  // );

  // INVENTORY_OPEN_EQUALS = this.register(
  //   'if_player_inventory_type_open',
  //   'inventory_open_equals',
  //   {
  //     inventory_type: inventoryType,
  //   }
  // );

  // IS_RIDING = this.register('if_player_is_riding_entity', 'is_riding', {
  //   entity_ids: array(text, 18),
  //   compare_mode: enumof('TYPE', 'NAME_OR_UUID'),
  // });

  // NAME_EQUALS = this.register('if_player_name_equals', 'name_equals', {
  //   names_or_uuids: array(text, 18),
  // });

  // CURSOR_ITEM_EQUALS = this.register(
  //   'if_player_cursor_item_equals',
  //   'cursor_item_equals',
  //   {
  //     items: array(item, 18),
  //     comparison_mode: itemComparisonMode,
  //   }
  // );

  // HAS_ITEM = this.register('if_player_has_item', 'has_item', {
  //   items: array(item, 18),
  //   check_mode: checkMode,
  //   comparison_mode: itemComparisonMode,
  // });

  // HAS_ITEM_AT_LEAST = this.register(
  //   'if_player_has_item_at_least',
  //   'has_item_at_least',
  //   {
  //     item,
  //     count: number,
  //     comparison_mode: itemComparisonMode,
  //   }
  // );

  // HAS_ITEM_IN_SLOT = this.register(
  //   'if_player_has_item_in_slot',
  //   'has_item_in_slot',
  //   {
  //     items: array(item, 12),
  //     slots: array(number, 12),
  //     comparison_mode: itemComparisonMode,
  //   }
  // );

  // HAS_ROOM_FOR_ITEM = this.register(
  //   'if_player_has_room_for_item',
  //   'has_room_for_item',
  //   {
  //     items: array(item, 18),
  //     check_mode: checkMode,
  //     checked_slots: enumof(
  //       'ENTIRE_INVENTORY',
  //       'MAIN_INVENTORY',
  //       'UPPER_INVENTORY',
  //       'HOTBAR',
  //       'ARMOR'
  //     ),
  //   }
  // );

  // OPEN_INVENTORY_SLOT_EQUALS = this.register(
  //   'if_player_inventory_menu_slot_equals',
  //   'open_inventory_slot_equals',
  //   {
  //     items: array(item, 12),
  //     slots: array(number, 12),
  //     comparison_mode: itemComparisonMode,
  //   }
  // );

  // IS_HOLDING = this.register('if_player_is_holding', 'is_holding', {
  //   items: array(item, 18),
  //   hand_slot: enumof('EITHER_HAND', 'MAIN_HAND', 'OFF_HAND'),
  //   comparison_mode: itemComparisonMode,
  // });

  // IS_NOT_ON_COOLDOWN = this.register(
  //   'if_player_item_is_not_on_cooldown',
  //   'is_not_on_cooldown',
  //   {
  //     items: array(item, 18),
  //   }
  // );

  // IS_USING_ITEM = this.register('if_player_is_using_item', 'is_using_item', {
  //   items: array(item, 18),
  //   comparison_mode: itemComparisonMode,
  // });

  // IS_WEARING_ITEM = this.register(
  //   'if_player_is_wearing_item',
  //   'is_using_item',
  //   {
  //     items: array(item, 18),
  //     check_mode: checkMode,
  //     comparison_mode: itemComparisonMode,
  //   }
  // );
  // #endregion
}

const playerActions = new PlayerActions();

export default playerActions;
