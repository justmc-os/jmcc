<h2 id=select>
  <code>select</code>
  <a href="./actions" style="font-size: 14px; margin-left:">↩️</a>
</h2>



<h3 id=select_all_entities>
  <code>select::all_entities</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать всех сущностей\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::all_entities()
```

**Без аргументов**
<h3 id=select_all_mobs>
  <code>select::all_mobs</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать всех мобов\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::all_mobs()
```

**Без аргументов**
<h3 id=select_all_players>
  <code>select::all_players</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать всех игроков\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::all_players()
```

**Без аргументов**
<h3 id=select_entity_by_conditional>
  <code>select::entity_by_conditional</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать сущность по условию\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::entity_by_conditional()
```

**Без аргументов**
<h3 id=select_entity_by_name>
  <code>select::entity_by_name</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать сущность по имени\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::entity_by_name("текст")
```

**Аргументы:**
| **Имя**        | **Тип** | **Описание**      |
| -------------- | ------- | ----------------- |
| `name_or_uuid` | текст   | Имя или UUID цели |
<h3 id=select_event_target>
  <code>select::event_target</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать цель события\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::event_target("DEFAULT")
```

**Аргументы:**
| **Имя**          | **Тип**                                                                                                                                                                                | **Описание**     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `selection_type` | перечисление:<br/>**DEFAULT** - По умолчанию<br/>**KILLER** - Убийца<br/>**DAMAGER** - Атакующий<br/>**VICTIM** - Жертва<br/>**SHOOTER** - Стрелок<br/>**PROJECTILE** - Снаряд стрелка | Тип цели выборки |
<h3 id=select_invert>
  <code>select::invert</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Инвертировать выборку\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::invert()
```

**Без аргументов**
<h3 id=select_last_entity>
  <code>select::last_entity</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать последнюю появившуюся сущность\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::last_entity()
```

**Без аргументов**
<h3 id=select_last_mob>
  <code>select::last_mob</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать последнего появившегося моба\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::last_mob()
```

**Без аргументов**
<h3 id=select_mob_by_name>
  <code>select::mob_by_name</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать моба по имени\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::mob_by_name("текст")
```

**Аргументы:**
| **Имя**        | **Тип** | **Описание**      |
| -------------- | ------- | ----------------- |
| `name_or_uuid` | текст   | Имя или UUID цели |
<h3 id=select_player_by_conditional>
  <code>select::player_by_conditional</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать игрока по условию\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::player_by_conditional()
```

**Без аргументов**
<h3 id=select_player_by_name>
  <code>select::player_by_name</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать игрока по имени\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::player_by_name("текст")
```

**Аргументы:**
| **Имя**        | **Тип** | **Описание**      |
| -------------- | ------- | ----------------- |
| `name_or_uuid` | текст   | Имя или UUID цели |
<h3 id=select_random_entity>
  <code>select::random_entity</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать случайную сущность\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::random_entity()
```

**Без аргументов**
<h3 id=select_random_mob>
  <code>select::random_mob</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать случайного моба\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::random_mob()
```

**Без аргументов**
<h3 id=select_random_player>
  <code>select::random_player</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Выбрать случайного игрока\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::random_player()
```

**Без аргументов**
<h3 id=select_reset>
  <code>select::reset</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Сбросить выборку\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::reset()
```

**Без аргументов**
<h3 id=select_filter_by_conditional>
  <code>select::filter_by_conditional</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Отфильтровать выборку по условию\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::filter_by_conditional()
```

**Без аргументов**
<h3 id=select_filter_by_distance>
  <code>select::filter_by_distance</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Отфильтровать выборку по расстоянию\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::filter_by_distance(location(0, 0, 0), 0, "TRUE", "NEAREST")
```

**Аргументы:**
| **Имя**          | **Тип**                                                                        | **Описание**          |
| ---------------- | ------------------------------------------------------------------------------ | --------------------- |
| `location`       | местоположение                                                                 | Местоположение центра |
| `selection_size` | число                                                                          | Количество целей      |
| `ignore_y_axis`  | перечисление:<br/>**TRUE** - Игнорировать<br/>**FALSE** - Не игнорировать      | Игнорировать ось Y    |
| `compare_mode`   | перечисление:<br/>**NEAREST** - Ближайшие цели<br/>**FARTHEST** - Дальние цели | Тип сравнения         |
<h3 id=select_filter_by_raycast>
  <code>select::filter_by_raycast</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Фильтр рейкастом\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::filter_by_raycast(переменная, location(0, 0, 0), 0, 0, 0, "TRUE", "TRUE", "NEVER")
```

**Аргументы:**
| **Имя**                  | **Тип**                                                                                                                                        | **Описание**                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `variable`               | переменная                                                                                                                                     | Местоположение конца луча         |
| `origin`                 | местоположение                                                                                                                                 | Начало луча                       |
| `max_distance`           | число                                                                                                                                          | Длина луча                        |
| `ray_size`               | число                                                                                                                                          | Ширина луча                       |
| `selection_size`         | число                                                                                                                                          | Максимальное количество сущностей |
| `consider_blocks`        | перечисление:<br/>**TRUE** - Учитывать<br/>**FALSE** - Не учитывать                                                                            | Учитывать блоки                   |
| `ignore_passable_blocks` | перечисление:<br/>**TRUE** - Игнорировать<br/>**FALSE** - Не игнорировать                                                                      | Игнорировать проходимые блоки     |
| `fluid_collision_mode`   | перечисление:<br/>**NEVER** - Не игнорировать<br/>**SOURCE_ONLY** - Учитывать только источник жидкости<br/>**ALWAYS** - Полностью игнорировать | Игнорировать жидкость             |
<h3 id=select_filter_randomly>
  <code>select::filter_randomly</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Отфильтровать выборку случайно\
**Тип:** Действие без значения\
**Пример использования:**
```ts
select::filter_randomly(0)
```

**Аргументы:**
| **Имя** | **Тип** | **Описание**     |
| ------- | ------- | ---------------- |
| `size`  | число   | Количество целей |