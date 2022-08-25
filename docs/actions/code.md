<h2 id=code>
  <code>code</code>
  <a href="./actions" style="font-size: 14px; margin-left:">↩️</a>
</h2>

<h3 id=call_function>
  <code>code::call_function</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Вызвать функцию\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::call_function("текст")
```

**Аргументы:**
| **Имя**         | **Тип** | **Описание**     |
| --------------- | ------- | ---------------- |
| `function_name` | текст   | Название функции |
<h3 id=start_process>
  <code>code::start_process</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Запустить процесс\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::start_process("текст", "CURRENT_TARGET", "DONT_COPY")
```

**Аргументы:**
| **Имя**                | **Тип**                                                                                                                                                                         | **Описание**      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `process_name`         | текст                                                                                                                                                                           | Название процесса |
| `target_mode`          | перечисление:<br/>**CURRENT_TARGET** - Цель события<br/>**CURRENT_SELECTION** - Текущая цель<br/>**NO_TARGET** - Без цели<br/>**FOR_EACH_IN_SELECTION** - Каждая цель в выборке | Цель процесса     |
| `local_variables_mode` | перечисление:<br/>**DONT_COPY** - Не дублировать<br/>**COPY** - Дублировать<br/>**SHARE** - Общие                                                                               | Режим переменных  |
<h3 id=control_end_thread>
  <code>code::break</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Остановить последовательность\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::break()
```

**Без аргументов**
<h3 id=control_return_function>
  <code>code::return_function</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Вернуться до вызова\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::return_function()
```

**Без аргументов**
<h3 id=control_skip_iteration>
  <code>code::skip_iteration</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Пропустить повторение\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::skip_iteration()
```

**Без аргументов**
<h3 id=control_stop_repeat>
  <code>code::stop_repeat</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Остановить повторение\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::stop_repeat()
```

**Без аргументов**
<h3 id=control_wait>
  <code>code::wait</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Ждать\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::wait(0, "TICKS")
```

**Аргументы:**
| **Имя**     | **Тип**                                                                               | **Описание**          |
| ----------- | ------------------------------------------------------------------------------------- | --------------------- |
| `duration`  | число                                                                                 | Длительность ожидания |
| `time_unit` | перечисление:<br/>**TICKS** - Тики<br/>**SECONDS** - Секунды<br/>**MINUTES** - Минуты | Единица времени       |