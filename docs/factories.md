## Фабрики

Пример использования:
```ts
var a = location(1, 2, 3);
var b = vector(1, 2, 3);
var c = item("stone");
```

### Типы фабрик

Аргументы показывают на типы значений, которые вы должны передать фабрики для получения значения.
Те аргументы, которые заканчиваются на `?`, указывать не обязательно.

| **Имя**      | **Название**   | **Аргументы**                                                                                                                                                                                  |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location()` | Местоположение | (`x`: число*, `y`: число*, `z`: число*, `yaw`: число, `pitch`: число)                                                                                                                          |
| `item()`     | Предмет        | (`id`: текст*, `name`: текст, `count`: число, `lore`: список[текст], `nbt`: текст)                                                                                                             |
| `sound()`    | Звук           | (`sound`: текст*, `volume`: число, `pitch`: число)                                                                                                                                             |
| `vector()`   | Вектор         | (`x`: число*, `y`: число*, `z`: число*)                                                                                                                                                        |
| `particle()` | Эффект частиц  | (`particle`: текст*, `count`: число, `offset_x`: число, `offset_y`: число, `offset_z`: число, `velocity_x`: число, `velocity_y`: число, `velocity_z`: число, `material`: текст, `size`: число) |
| `potion()`   | Зелье          | (`potion`: текст*, `amplifier`: число, `duration`: число)                                                                                                                                      |