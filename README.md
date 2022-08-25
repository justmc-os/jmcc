# JMCC

**J**ust**M**C **C**ode **C**ompiler - компилятор языка JustCode в структуру файлов кодинга, используемого на сервере [JustMC](justmc.ru)

### Установка

Для работы с JMCC нужно:

1. Установить [Node.js](https://nodejs.org/en/download/)
2. Открыть командную строку:
   - Win + R на **Windows**, затем вписать `cmd` в появивщееся окно
   - На **Unix** системах - открыть терминал
3. Установить пакет `jmcc`, вписав команду:

   ```pwsh
   $ npm install --global jmcc
   ```

   или с помощью `yarn`:

   ```pwsh
   $ yarn global add jmcc
   ```

После этого, вы сможете использовать `jmcc` для компиляции вашего кода.

### Использование

_Перед тем как использовать `jmcc`, убедитесь что вы знаете [синтаксис](#синтаксис) для создания программ._

Создайте файл с расширением `.jc` и таким содержанием:

```typescript
event<PlayerJoin> {
  player::message("Привет!")
}
```

Скомпилируйте данный файл:

```pwsh
$ jmcc compile [имя файла].jc
```

Если компиляция была успешной, в папке с вашим файлом должен появиться новый файл, с таким же названием, но с расширением `.json`. Чтобы использовать его на сервере, вам нужно загрузить его на файлообменник<!--, либо, использовать аргумент `-i`:-->

<!--```pwsh
$ jmcc compile -i [имя файла].jc
```

При его использовании, компилятор не будет создавать файлы компиляции на вашем компьютере, а сразу передавать их в облако. Если компиляция была успешной, у вас в терминале должна появиться ссылка, которую можно использовать на сервере напрямую.

**Важно: Облачные ссылки, созданные при использовании аргумента `-i` будут хранить код только 3 минуты. После этого времени они будут удаляться. Если вы хотите сохранить скомпилированный код на большее время, вам нужно будет сохранять его в сторонних файлообменниках.** -->

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
game var a = 1;
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

#### Фабрики

Фабрики — функции, которые принимают аргументы и возвращают значение.
Ими создаются предметы, зелья, локации и другие значения, которые можно определить в коде:

```ts
var a = location(1, 2, 3);
```

[📓 Список фабрик](/docs/factories.md)

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

#### Функции / процессы

[TODO]
