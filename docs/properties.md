## Игровые значения

Пример использования:
```ts
var a = value::location
var b = value::health<default_entity>
```

### Доступные селекторы

**Важно:** эти селекторы доступны только для игровых значений.Действия имеют свои собственные селекторы, которые вы должны смотреть на их страницах.

| **Имя**            | **Описание**          |
| ------------------ | --------------------- |
| `<current>`        | Текущая цель          |
| `<default>`        | По умолчанию          |
| `<default_entity>` | Существо по умолчанию |
| `<killer_entity>`  | Убийца                |
| `<damager_entity>` | Атакующий             |
| `<victim_entity>`  | Жертва                |
| `<shooter_entity>` | Стрелок               |
| `<projectile>`     | Снаряд                |
| `<last_entity>`    | Последняя сущность    |

### Значения

| **Имя**                              | **Тип**                 | **Описание**                            |
| ------------------------------------ | ----------------------- | --------------------------------------- |
| `value::health`                      | число                   | Текущее здоровье                        |
| `value::max_health`                  | число                   | Максимальное здоровье                   |
| `value::absorption_health`           | число                   | Дополнительное здоровье                 |
| `value::food`                        | число                   | Уровень голода                          |
| `value::saturation`                  | число                   | Уровень насыщения                       |
| `value::food_exhaustion`             | число                   | Уровень истощения                       |
| `value::attack_damage`               | число                   | Урон от атаки                           |
| `value::attack_speed`                | число                   | Скорость атаки                          |
| `value::armor`                       | число                   | Очки защиты                             |
| `value::armor_toughness`             | число                   | Твёрдость брони                         |
| `value::invulnerability_ticks`       | число                   | Время бессмертия                        |
| `value::experience_level`            | число                   | Уровень опыта                           |
| `value::experience_progress`         | число                   | Прогресс опыта                          |
| `value::fire_ticks`                  | число                   | Время горения                           |
| `value::freeze_ticks`                | число                   | Время заморозки                         |
| `value::remaining_air`               | число                   | Оставшийся воздух                       |
| `value::fall_distance`               | число                   | Дистанция падения                       |
| `value::slot`                        | число                   | Выбранный слот в хот-баре               |
| `value::walking_speed`               | число                   | Скорость ходьбы                         |
| `value::flying_speed`                | число                   | Скорость полёта                         |
| `value::ping`                        | число                   | Пинг игрока                             |
| `value::protocol`                    | число                   | Версия протокола клиента                |
| `value::item_usage_progress`         | число                   | Прогресс использования предмета         |
| `value::entity_ticks_lived`          | число                   | Время жизни цели                        |
| `value::arrows_in_body`              | число                   | Количество стрел в теле                 |
| `value::age`                         | число                   | Возраст цели                            |
| `value::steer_forward`               | число                   | Прямолинейное движение транспорта       |
| `value::steer_sideways`              | число                   | Движение транспорта в стороны           |
| `value::merchant_recipe_count`       | число                   | Количество торгов Жителя                |
| `value::open_inventory_size`         | число                   | Размер открытого инвентаря              |
| `value::entity_width_x`              | число                   | Размер хитбокса по X                    |
| `value::entity_height`               | число                   | Высота хитбокса                         |
| `value::entity_width_z`              | число                   | Размер хитбокса по Z                    |
| `value::location`                    | местоположение          | Местоположение                          |
| `value::target_block`                | местоположение          | Местоположение целевого блока           |
| `value::target_fluid`                | местоположение          | Местоположение целевой жидкости         |
| `value::target_block_face`           | текст                   | Сторона целевого блока                  |
| `value::eye_location`                | местоположение          | Местоположение глаз                     |
| `value::x_coord`                     | число                   | Координата X                            |
| `value::y_coord`                     | число                   | Координата Y                            |
| `value::z_coord`                     | число                   | Координата Z                            |
| `value::pitch`                       | число                   | Вертикальный поворот                    |
| `value::yaw`                         | число                   | Горизонтальный поворот                  |
| `value::direction_of_view`           | вектор                  | Направление взгляда                     |
| `value::cardinal_direction`          | текст                   | Кардинальное направление                |
| `value::hitbox_midpoint_location`    | местоположение          | Центр хитбокса                          |
| `value::spawn_location`              | местоположение          | Местоположение спавна мира              |
| `value::origin`                      | местоположение          | Местоположение первого появления        |
| `value::velocity`                    | вектор                  | Вектор скорости                         |
| `value::main_hand_item`              | предмет                 | Предмет в ведущей руке                  |
| `value::off_hand_item`               | предмет                 | Предмет во второй руке                  |
| `value::armor_items`                 | список[предмет]         | Предметы брони                          |
| `value::hotbar`                      | список[предмет]         | Предметы в хот-баре                     |
| `value::inventory`                   | список[предмет]         | Предметы в инвентаре                    |
| `value::open_inventory`              | список[предмет]         | Список предметов в открытом инвентаре   |
| `value::cursor_item`                 | предмет                 | Предмет на курсоре                      |
| `value::saddle_item`                 | предмет                 | Предмет на седле                        |
| `value::entity_item`                 | предмет                 | Предмет сущности                        |
| `value::name`                        | текст                   | Имя                                     |
| `value::uuid`                        | текст                   | UUID                                    |
| `value::display_name`                | текст                   | Отображаемое имя                        |
| `value::entity_type`                 | текст                   | Тип сущности                            |
| `value::client_brand`                | текст                   | Название клиента игрока                 |
| `value::user_locale`                 | текст                   | Язык клиента игрока                     |
| `value::open_inventory_title`        | текст                   | Заголовок открытого инвентаря           |
| `value::open_inventory_type`         | текст                   | Тип открытого инвентаря                 |
| `value::gamemode`                    | текст                   | Режим игры                              |
| `value::last_damage_cause`           | текст                   | Последняя причина урона                 |
| `value::potion_effects`              | список[зелье]           | Эффекты зелий                           |
| `value::vehicle`                     | текст                   | Транспорт                               |
| `value::passengers`                  | список[текст]           | Пассажиры                               |
| `value::lead_holder`                 | текст                   | Поводырь                                |
| `value::attached_leads`              | список[текст]           | Привязанные сущности                    |
| `value::targeted_entity`             | текст                   | Цель для атаки                          |
| `value::spawn_reason`                | текст                   | Причина спавна                          |
| `value::main_hand`                   | текст                   | Ведущая рука                            |
| `value::event_block`                 | местоположение          | Местоположение блока события            |
| `value::event_block_face`            | текст                   | Сторона блока события                   |
| `value::event_blocks_involved`       | список[местоположение]  | Задействованные блоки события           |
| `value::event_interaction`           | текст                   | Тип взаимодействия события              |
| `value::event_new_location`          | местоположение          | Новая локация игрока                    |
| `value::event_damage`                | число                   | Нанесённый урон                         |
| `value::event_damage_cause`          | текст                   | Причина полученного урона               |
| `value::event_chat_message`          | текст                   | Сообщение чата                          |
| `value::event_message`               | текст                   | Сообщение события                       |
| `value::event_heal_amount`           | число                   | Количество восстановленного здоровья    |
| `value::event_heal_cause`            | текст                   | Причина исцеления                       |
| `value::event_power`                 | число                   | Процент силы выполнения                 |
| `value::event_item`                  | предмет                 | Предмет события                         |
| `value::event_equipment_slot`        | текст                   | Тип задействованного слота              |
| `value::event_slot`                  | число                   | Слот события                            |
| `value::event_hotbar_slot`           | число                   | Слот хот-бара в событии                 |
| `value::event_added_items`           | словарь{число: предмет} | Распределённые предметы                 |
| `value::event_slot_type`             | текст                   | Тип слота при клике                     |
| `value::event_close_inventory_cause` | текст                   | Причина закрытия инвентаря              |
| `value::event_inventory_click_type`  | текст                   | Тип клика по инвентарю                  |
| `value::event_inventory_action`      | текст                   | Действие в инвентаре при клике          |
| `value::event_drag_type`             | текст                   | Тип перетягивания по инвентарю          |
| `value::event_slots_involved`        | список[число]           | Задействованные слоты                   |
| `value::event_fish_state`            | текст                   | Причина события рыбалки                 |
| `value::event_tree_type`             | текст                   | Тип дерева                              |
| `value::event_experience`            | число                   | Количество опыта события                |
| `value::event_hanging_break_cause`   | текст                   | Причина удаление висящей сущности       |
| `value::event_time_skip_reason`      | текст                   | Причина пропуска времени                |
| `value::event_time_skip_amount`      | число                   | Количество тиков пропуска времени       |
| `value::event_food_level`            | число                   | Восполненный голод события              |
| `value::event_projectile_item`       | предмет                 | Предмет снаряда события                 |
| `value::event_teleport_cause`        | текст                   | Причина телепортации                    |
| `value::event_ticks_held_for`        | число                   | Количество тиков использования предмета |
| `value::event_query_info`            | текст                   | Отладочная информация                   |
| `value::event_fail_move_reason`      | текст                   | Причина неудачного перемещения          |
| `value::players`                     | число                   | Количество игроков в мире               |
| `value::cpu_usage`                   | число                   | Процент использования процессора        |
| `value::server_tps`                  | число                   | TPS сервера                             |
| `value::timestamp`                   | число                   | UNIX-время                              |
| `value::server_current_tick`         | число                   | Текущее время сервера                   |
| `value::selection_size`              | число                   | Количество выбранных целей              |
| `value::selection_target_names`      | список[текст]           | Имена выбранных целей                   |
| `value::selection_target_uuids`      | список[текст]           | UUID выбранных целей                    |
| `value::url_response`                | текст                   | Ответ на веб-запрос                     |
| `value::url_response_code`           | число                   | Код ответа на веб-запрос                |
| `value::url`                         | текст                   | Ссылка веб-запроса                      |
| `value::world_time`                  | число                   | Текущее время мира                      |
| `value::world_weather`               | текст                   | Текущая погода мира                     |
| `value::server_stopped_time`         | число                   | Время остановки сервера                 |
| `value::action_count_per_tick`       | число                   | Количество действий за тик              |
| `value::owner_uuid`                  | текст                   | UUID владельца мира                     |
| `value::world_size`                  | число                   | Размер мира                             |
| `value::world_id`                    | текст                   | ID мира                                 |