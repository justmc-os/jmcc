## v1.1.21

Исправление ошибки с переопределением переменной, которая была создана в качестве лямба-аргумента.

## v1.1.20

Временное изменение домена с модулями

## v1.1.19

Поддержка версии 1.20

## v1.1.18

Повторное исправление алгоритма разделения строк.\
Добавлена опция `-c` для команды `compile`, которая сжимает файл при его выводе на диск.

## v1.1.17

Исправление алгоритма разделения строк.

## v1.1.16

Исправление вывода ошибки при загрузке файла на хостинг.

## v1.1.15

Bump.

## v1.1.14

Теперь %math() является числовым значением, а не текстовым.

## v1.1.13

Исправление ошибок с выборкой сущностей.

## v1.1.10

Исправление ошибок с вложенными массивами.

## v1.1.9

Поддержка данных и функций 1.19, исправление ошибок с импортированием.

## v1.1.7, v1.1.8

Исправлены ошибки с действиями и частицами.

## v1.1.5

Добавлены неопределённые переменные:

```ts
var a;
game var b;
```

Добавлена возможность использовать блоки if и else без фигурных скобок:

```ts
if (player::is_holding(item("stone"))) player::message("Вы держите камень!")
else player::message("Вы не держите камень.");
```

Добавлена возможность вызывать функции до их определения:

```ts
a();

function a() {}
```

Исправлены ошибки.
