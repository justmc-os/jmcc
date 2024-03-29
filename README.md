# JMCC

**J**ust**M**C **C**ode **C**ompiler - компилятор языка JustCode в структуру файлов кодинга, используемого на сервере [JustMC](justmc.ru)

### Содержание

1. [Установка](#установка)
2. [Использование](#использование)
3. [Синтаксис](#синтаксис)
   - [Значения](#значения)
   - [Переменные](#переменные)
   - [Фабрики](#фабрики)
   - [Математические функции](#математические-функции)
   - [Действия](#действия)
   - [События](#события)
   - [Функции и процессы](#функции-и-процессы)
   - [Импортирование](#импортирование)
4. [Документация](#документация)
5. [Примеры](#примеры)
6. [Подсветка синтаксиса](#подсветка-синтаксиса)

[История изменения](./CHANGELOG.md)

### Установка

Для работы с JMCC нужно:

1. Открыть [страницу релизов GitHub](https://github.com/justmc-c/jmcc/releases)
2. Выбрать подходящий файл с компилятором для вашей операционной системы (-win для Windows, -linux для Linux) и установить его
3. Открыть командную строку в папке с установленным файлом:
   - Win + R на **Windows**, затем вписать `cmd` в появивщееся окно
   - На **Unix** системах - открыть терминал
4. Использовать компилятор:

   ```shell
   # Для Windows
   $ jmcc-win.exe compile example.jc

   # Для Linux
   $ ./jmcc-linux compile example.jc
   ```

Для просмотра помощи о командах, используйте команду `help`

### Использование

_Перед тем как использовать `jmcc`, убедитесь что вы знаете [синтаксис](#синтаксис) для создания программ._

Создайте файл с расширением `.jc` и таким содержанием:

```typescript
event<player_join> {
  player::message("Привет!")
}
```

Скомпилируйте данный файл:

```pwsh
$ jmcc compile [имя файла].jc
```

Если компиляция была успешной, в папке с вашим файлом должен появиться новый файл, с таким же названием, но с расширением `.json`. Чтобы использовать его на сервере, вам нужно загрузить его на файлообменник, либо использовать аргумент `-u`:

```pwsh
$ jmcc compile -u [имя файла].jc
```

При его использовании, компилятор не будет создавать файлы компиляции на вашем компьютере, а сразу передавать их в облако. Если компиляция была успешной, у вас в терминале должна появиться ссылка, которую можно использовать на сервере напрямую.

**Важно: Облачные ссылки, созданные при использовании аргумента `-u` будут хранить код только 3 минуты. После этого времени они будут удаляться. Если вы хотите сохранить скомпилированный код на большее время, вам нужно будет сохранять его в сторонних файлообменниках.**

### Синтаксис

#### Значения

```ts
"Текст!"      // Текст
1             // Число
[1, 2]        // Список

value::health // Игровое значение
              // (об этом будет дальше)

item("stone") // Значения, созданные фабриками
              // (об этом будет дальше)
```

#### Переменные

Переменные можно использовать только после их **определения**. До определения такие переменные не будут доступны, и будут вызывать ошибку при их использовании. Так же, определять переменные можно только один раз.

_Определение локальных переменных_

```ts
var a = 1;
```

_Определение игровых переменных_

```ts
game var a = 1;
```

_Определение сохранённых переменных_

```ts
save var a = 1;
```

##### Встроенные (`inline`) переменные

Встроенные (`inline`) переменные — переменные, значение которых просчитывается при компиляции, и заменяется при каждом их использовании. Им нельзя присвоить динамические значения, типо результатов действий с переменных.

_Определение встроенных переменных_

```ts
inline var a = 1;
```

##### Переменные с динамическим именем

Переменные могут иметь имена, которые включают в себя селекторы либо строчные варианты значений. Так же, можно определить переменные с именем, состоящим из нестандартных символов, используя ` `` ` . К примеру:

_Использование селектора в имени_

```ts
var %player%_переменная = 1;
```

_Использование нестандартных символов в имени_

```ts
var `странная переменная ⛏️` = 2;
```

_Использование других значений в имени_

```ts
var a = 1;
var `переменная $a` = 2;
//  ^^^^^^^^^^^^^^^
//  Данная переменная после компиляции будет
//  иметь имя "переменная %var_local(a)"

// ...или со скобками:

var `переменная 2 ${a}` = 2;
//  ^^^^^^^^^^^^^^^^^^^
//  Данная переменная после компиляции будет
//  иметь имя "переменная 2 %var_local(a)"
```

_Использование встроенных переменных в имени_

```ts
inline var a = 1 + 1; // <--- Эта переменная встроена!
var `переменная $a` = 2;
//  ^^^^^^^^^^^^^^^
//  Данная переменная после компиляции будет
//  иметь имя "переменная 2"
```

##### Неопределённые переменные

В том случае, когда вы со 100% увереностью знаете, что переменная существует в выбранном контексте, но компилятор выдаёт вам ошибку неизвестной переменной, вы можете не определять переменной значения:

```ts
var a;
game var a;
```

В таком случае не будет создано действия "Установить переменную", но эта переменная может быть использована как обычно.

Inline переменные нельзя не определять. Они всегда должны иметь значение при создании.

#### Фабрики

Фабрики — функции, которые принимают аргументы и возвращают значение.
Ими создаются предметы, зелья, локации и другие значения, которые можно определить в коде:

```ts
var a = location(1, 2, 3);
```

[📓 Список фабрик](/docs/factories.md)

#### Математические функции

Математические функции - фабрики, которые аналогичны функциям из %math.
Доступные функций:

- `abs(число)` - Абсолютное значение числа
- `sqrt(число)` - Квадратные корень числа
- `cbrt(число)` - Кубический корень числа
- `ceil(число)` - Округление числа до большего значения
- `floor(число)` - Округление числа до меньшего значения
- `sin(число)` - Синус числа
- `cos(число)` - Косинус числа
- `round(число, N)` - Округление числа до N цифер после запятой
- `pow(число, степень)` - Возведение числа в степень
- `min(число, число)` - Минимальное из значений
- `max(число, число)` - Максимальное из значений

Использование:

```ts
var a = floor(0.3) + abs(-3) + sqrt(2);
```

#### Действия

Вызов действий должен происходить от объекта или переменной.

_Анатомия вызова:_

```ts
player::message("Привет мир!")
^^^^^^
переменная или объект

player::message("Привет мир!")
      ^^
      разделитель, определяющий тип вызова:
      :: для объектов
       . для переменных

player::message("Привет мир!")
        ^^^^^^^
        имя функции

player::message("Привет мир!")
                ^^^^^^^^^^^^^
                аргумент вызова
```

Аргументы вызова могут определяться:

- позиционно

  ```ts
  player::message("Привет мир!")
  ```

- с именем

  ```ts
  player::message(text = "Привет мир!")
  ```

- комбинированно

  ```ts
  player::message("Привет мир!", merging = "SPACES")
  ```

При вызове действий компилятор проверяет соответствие типов значений, переданных действию. При этом, переменные не проверяются на соответствие _(так как могут изменить своё значение)_.

К примеру, если действие принимает в качестве аргумента только число, то и вызвать его можно только с числом либо переменной:

```ts
var a = 1;
a.increment('Не число!');
//          ^^^^^^^^^^^
//  Ошибка: Аргумент с типом текст не может быть
//          установлен параметру с типом число
```

Действия, принимающие аргумент списка могут принимать одно его значение, и автоматически обворачивать его в список:

```ts
player::message("Привет мир!")
//              ^^^^^^^^^^^^^
//              Действие player::message принимает список,
//              но ему можно передать одно значение

player::message(["Привет", " ", "мир!"])
//              ^^^^^^^^^^^^^^^^^^^^^^^
//              Так тоже работает
```

Действия, принимающие **маркера** являются перечислениями, которым можно указать текст в виде значения:

```ts
player::message(["Привет", "мир"], merging = "SEPARATE_LINES")
```

##### Объекты

Объекты аналогичны категориям действий: **действия игрока** (`player`), **действия сущности** (`entity`), **действия мира** (`world`), **действия с переменными** (`variable`). Все остальные действия находятся в объекте `code`

_Вызов действия от объекта:_

```ts
player::message("Привет мир!")
code::wait(10, time_unit = "SECONDS")
player::message("Привет мир спустя 10 секунд!")
```

##### Специальные действия

_Получение значения из списка по индексу_

```ts
var a = [1, 2];
var b = a[0];
```

_Установка значения в списке по индексу_

```ts
var a = [1, 2];
a[0] = 3;
```

##### Переменные

От переменных можно вызвать некоторые действия, которые принимают переменные _(либо значения, которые изменяют)_:

_Действие принимает переменную_

```ts
var a = 1;
a.increment();
```

_Действие принимает значение, которое изменяют_

```ts
var a = ['Привет', 'мир'];
a.set_at(1, 'сервер');
```

Существуют и действия, которые устанавливают переменным какое-либо значение:

```ts
var a = variable::create_list([1, 2])
// Эквивалентно:
// var a = [1, 2]

var b = variable::get_at(a, 0)
// Эквивалентно:
// var b = a[0]

var C = 3;
var D = C.clamp(1, 2);
// Переменная D будет равна результату применения
// действия clamp к переменной C
```

##### Повторения

Обычное повторение:

```ts
repeat::forever() {
  player::message("Я буду выполняться вечно");
  code::wait(1);
}
```

Повторения с условием:

```ts
var a = 1;
repeat::while(a.less(10)) {
  player::message("A меньше 10!");
  a++;
  code::wait(1);
}
```

Повторения с параметрами:

```ts
repeat::on_range(0, 10) { index ->
  player::message("Текущий индекс: $index");
  code::wait(1);
}
```

#### События

[📓 Список событий](/docs/events.md)

Все действия, созданные вне определения события, будут добавлены к событию **запуска мира**, поэтому код:

```ts
player::message("Привет!");
```

**никогда не сработает**, так как при запуске мира в нём нет игроков. Такой код нужно переделать на:

```ts
event<player_join> {
  player::message("Привет!");
}
```

Теперь при входе игрока ему будет писаться сообщение "Привет!".

Другие события определяются аналогичным способом, только айди события `player_join` будет изменяться на [📓 другое нужное](/docs/events.md).

#### Функции и процессы

Функции (и процессы) могут иметь параметры и определяются так:

```ts
function abc(a, b) {
  player::message("Аргументы! $a $b")
}
```

```ts
process abc(a, b) {
  player::message("Аргументы! $a $b")
}
```

#### Импортирование

Не стоит сваливать весь код в один файл. Разделяйте свой код на несколько модулей, которые вы потом можете импортировать в один файл:

```ts
// variables.jc

var a = 1;
var b = 2;
```

```ts
// utils.jc

function say_hello() {
  player::message("Привет!")
}
```

```ts
// index.jc

import './variables.jc';
import './utils.jc';

event<player_join> {
  player::message("Данный код состоит из 3 модулей!");
}
```

### Документация

Для подробной информации воспользуйтесь документацией:

- [События](/docs/events.md)
- [Фабрики](/docs/factories.md)
- [Игровые значения](/docs/properties.md)
- [Действия](/docs/actions/actions.md)

### Примеры

- [New World Order](/examples/nwo)
- [Компасс](/examples/compass)
- [2D генератор](/examples/generator.jc)

### Подсветка синтаксиса

Подсветка синтаксиса поддерживается только в среде разработки Visual Studio Code. Расширение можно установить, перейдя по [ссылке](https://github.com/justmc-c/vsjmcc)
