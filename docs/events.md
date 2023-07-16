## События

Пример использования:
```ts
event<player_join> {
  player::message("Приветствую в мире!")
}
```

| **Имя**                                 | **Название**                             |
| --------------------------------------- | ---------------------------------------- |
| `event<player_join>`                    | Игрок зашёл в мир                        |
| `event<player_quit>`                    | Игрок вышел из мира                      |
| `event<player_rejoin>`                  | Игрок перезашёл в мир                    |
| `event<player_chat>`                    | Игрок пишет сообщение в чат              |
| `event<player_interact>`                | Игрок взаимодействует с миром            |
| `event<player_right_click>`             | Игрок кликает правой кнопкой             |
| `event<player_left_click>`              | Игрок кликает левой кнопкой              |
| `event<player_place_block>`             | Игрок ставит блок                        |
| `event<player_break_block>`             | Игрок ломает блок                        |
| `event<block_damage>`                   | Игрок начинает ломать блок               |
| `event<block_damage_abort>`             | Игрок перестает ломать блок              |
| `event<player_structure_grow>`          | Игрок выращивает дерево                  |
| `event<player_right_click_entity>`      | Игрок кликает правой кнопкой по существу |
| `event<player_right_click_player>`      | Игрок кликает правой кнопкой по игроку   |
| `event<player_imbue_potion_cloud>`      | Игрок получает эффект от взрывного зелья |
| `event<player_pickup_projectile>`       | Игрок поднял снаряд                      |
| `event<player_pickup_experience>`       | Игрок поднял сферу опыта                 |
| `event<player_tame_entity>`             | Игрок приручает существо                 |
| `event<player_leash_entity>`            | Игрок привязывает существо               |
| `event<player_start_spectating_entity>` | Игрок начал следить за существом         |
| `event<player_stop_spectating_entity>`  | Игрок перестал следить за существом      |
| `event<player_open_inventory>`          | Игрок открыл инвентарь                   |
| `event<player_click_inventory>`         | Игрок кликает в инвентаре                |
| `event<player_drag_inventory>`          | Игрок перетягивает предмет в инвентаре   |
| `event<player_click_own_inventory>`     | Игрок кликает в своём инвентаре          |
| `event<player_craft_item>`              | Игрок крафтит предмет                    |
| `event<player_close_inventory>`         | Игрок закрывает инвентарь                |
| `event<player_swap_hands>`              | Игрок меняет руку                        |
| `event<player_change_slot>`             | Игрок меняет слот                        |
| `event<player_shot_bow>`                | Игрок стреляет                           |
| `event<player_launch_projectile>`       | Игрок запускает снаряд                   |
| `event<player_pickup_item>`             | Игрок поднял предмет                     |
| `event<player_drop_item>`               | Игрок выбрасывает предмет                |
| `event<player_consume_item>`            | Игрок употребляет предмет                |
| `event<player_break_item>`              | Игрок ломает предмет                     |
| `event<player_stop_using_item>`         | Игрок перестает использовать предмет     |
| `event<player_edit_book>`               | Игрок изменяет книгу                     |
| `event<player_fish>`                    | Игрок рыбачит                            |
| `event<player_move>`                    | Игрок передвигается                      |
| `event<player_jump>`                    | Игрок прыгает                            |
| `event<player_sneak>`                   | Игрок начинает красться                  |
| `event<player_unsneak>`                 | Игрок перестал красться                  |
| `event<player_teleport>`                | Игрок телепортировался                   |
| `event<player_start_sprint>`            | Игрок начал бежать                       |
| `event<player_stop_sprint>`             | Игрок перестает бежать                   |
| `event<player_start_flight>`            | Игрок начинает лететь                    |
| `event<player_stop_flight>`             | Игрок перестает лететь                   |
| `event<player_riptide>`                 | Игрок использует 'Тягун'                 |
| `event<player_dismount>`                | Игрок спешился                           |
| `event<player_horse_jump>`              | Игрок прыгает на лошади                  |
| `event<player_vehicle_jump>`            | Игрок прыгает на транспорте              |
| `event<player_take_damage>`             | Игрок получает урон                      |
| `event<player_damage_player>`           | Игрок ранит игрока                       |
| `event<entity_damage_player>`           | Существо ранит игрока                    |
| `event<player_damage_entity>`           | Игрок ранит существо                     |
| `event<player_resurrect>`               | Игрок возрождается от тотема             |
| `event<player_heal>`                    | Игрок восстанавливает здоровье           |
| `event<player_food_level_change>`       | Изменение уровня голода игрока           |
| `event<player_projectile_hit>`          | Попадание снаряда игрока                 |
| `event<projectile_damage_player>`       | Игрок получает урон от снаряда           |
| `event<player_death>`                   | Игрок умирает                            |
| `event<player_kill_player>`             | Игрок убивает игрока                     |
| `event<player_kill_mob>`                | Игрок убивает моба                       |
| `event<mob_kill_player>`                | Моб убивает игрока                       |
| `event<player_respawn>`                 | Игрок возрождается                       |
| `event<entity_spawn>`                   | Сущность создана                         |
| `event<entity_removed_from_world>`      | Удаление сущности                        |
| `event<entity_damage_entity>`           | Моб наносит урон мобу                    |
| `event<entity_kill_entity>`             | Моб убил моба                            |
| `event<entity_take_damage>`             | Сущность получает урон                   |
| `event<entity_heal>`                    | Сущность исцеляется                      |
| `event<entity_resurrect>`               | Сущность возрождается от тотема          |
| `event<entity_death>`                   | Смерть сущности                          |
| `event<entity_spell_cast>`              | Существо выполняет заклинание            |
| `event<enderman_escape>`                | Эндермен убегает                         |
| `event<enderman_attack_player>`         | Эндермен злится на игрока                |
| `event<firework_explode>`               | Фейерверк взрывается                     |
| `event<hanging_break>`                  | Ломание висящего существа                |
| `event<projectile_damage_entity>`       | Урон от снаряда                          |
| `event<projectile_kill_entity>`         | Снаряд убил сущность                     |
| `event<projectile_hit>`                 | Попадание снаряда в блок                 |
| `event<projective_collide>`             | Снаряд столкнулся с сущностью            |
| `event<entity_drop_item>`               | Существо выбрасывает предмет             |
| `event<entity_pickup_item>`             | Существо поднимает предмет               |
| `event<item_despawn>`                   | Предмет исчез                            |
| `event<vehicle_take_damage>`            | Урон транспорту                          |
| `event<block_fall>`                     | Блок начал падать                        |
| `event<entity_interact>`                | Сущность взаимодействует с миром         |
| `event<dispenser_shear_sheep>`          | Раздатчик обрезал овцу                   |
| `event<sheep_regrow_wool>`              | Овца отрастила шерсть                    |
| `event<witch_throw_potion>`             | Ведьма кидает зелье                      |
| `event<world_start>`                    | Запуск мира                              |
| `event<world_stop>`                     | Остановка мира                           |
| `event<time_skip>`                      | Пропуск времени                          |
| `event<world_web_response>`             | Ответ от сервера                         |
| `event<block_ignite>`                   | Блок поджигается                         |
| `event<block_burn>`                     | Сгорание блока                           |
| `event<block_fade>`                     | Исчезание блока                          |
| `event<tnt_prime>`                      | Подрыв динамита                          |
| `event<block_explode>`                  | Блок взрывается                          |
| `event<entity_explode>`                 | Сущность взрывается                      |
| `event<entity_explosion>`               | Сущность решила взорваться               |
| `event<block_piston_extend>`            | Поршень выдвигается                      |
| `event<block_piston_retract>`           | Поршень втягивается                      |
| `event<leaves_decay>`                   | Опадание листьев                         |
| `event<structure_grow>`                 | Дерево выростает                         |
| `event<block_grow>`                     | Рост блока                               |
| `event<block_flow>`                     | Перемещение блока                        |
| `event<block_fertilize>`                | Удобрение блока                          |
| `event<redstone_level_change>`          | Изменение силы редстоуна                 |
| `event<brew_complete>`                  | Завершение зельеварения                  |
| `event<block_form>`                     | Генерация блока                          |
| `event<block_spread>`                   | Распространение блока                    |
| `event<block_form_by_entity>`           | Генерация блока из-за сущности           |
| `event<portal_create>`                  | Создание портала                         |
| `event<bell_ring>`                      | Звон колокола                            |
| `event<entity_bell_ring>`               | Сущность звонит в колокол                |
| `event<note_play>`                      | Проигрывание звука нотным блоком         |
| `event<dispenser_dispense_item>`        | Блок выбрасывает предмет                 |
| `event<dispenser_equip_armor>`          | Раздатчик надевает броню                 |
| `event<fluid_level_change>`             | Изменение уровня воды                    |
| `event<sponge_absorb>`                  | Губка впитывает воду                     |
| `event<falling_block_land>`             | Падающий блок приземляется               |
| `event<item_moved_into_container>`      | Предмет переместился в контейнер         |
| `event<hopper_pickup_item>`             | Воронка подбирает предмет                |