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
<h3 id=control_call_exception>
  <code>code::call_exception</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Вызвать ошибку\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::call_exception("текст", "текст", "WARNING")
```

**Аргументы:**
| **Имя**   | **Тип**                                                                                         | **Описание**     |
| --------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| `id`      | текст                                                                                           | ID ошибки        |
| `message` | текст                                                                                           | Сообщение ошибки |
| `type`    | перечисление:<br/>**WARNING** - Предупреждение<br/>**ERROR** - Ошибка<br/>**FATAL** - Фатальная | Тип ошибки       |
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
<h3 id=controller_async_run>
  <code>code::controller_async_run</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Запуск в отдельном потоке\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::controller_async_run()
```

**Без аргументов**
<h3 id=controller_exception>
  <code>code::controller_exception</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Уловить ошибку\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::controller_exception(переменная, "WARNING")
```

**Аргументы:**
| **Имя**          | **Тип**                                                               | **Описание**              |
| ---------------- | --------------------------------------------------------------------- | ------------------------- |
| `variable`       | переменная                                                            | Переменная для присвоения |
| `exception_type` | перечисление:<br/>**WARNING** - Предупреждение<br/>**ERROR** - Ошибка | Тип ошибки                |
<h3 id=controller_measure_time>
  <code>code::controller_measure_time</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** Замерить время выполнения\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::controller_measure_time(переменная, "NANOSECONDS")
```

**Аргументы:**
| **Имя**    | **Тип**                                                                                                                 | **Описание**              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `variable` | переменная                                                                                                              | Переменная для присвоения |
| `duration` | перечисление:<br/>**NANOSECONDS** - Наносекунды<br/>**MICROSECONDS** - Микросекунды<br/>**MILLISECONDS** - Миллисекунды | Формат времени            |
<h3 id=UnstableApiUsage>
  <code>code::UnstableApiUsage</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** undefined\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::UnstableApiUsage([location(0, 0, 0), location(0, 0, 0)], "TRUE", "TRUE", "TRUE", "TRUE")
```

**Аргументы:**
| **Имя**             | **Тип**                                                          | **Описание** |
| ------------------- | ---------------------------------------------------------------- | ------------ |
| `locations`         | список[местоположение]                                           |              |
| `keep_rotation`     | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `keep_velocity`     | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `ignore_passengers` | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `dismount`          | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
<h3 id=UnstableApiUsage>
  <code>code::UnstableApiUsage</code>
  <a href="#" style="font-size: 12px; margin-left:">⬆️</a>
</h3>

**Имя:** undefined\
**Тип:** Действие без значения\
**Пример использования:**
```ts
code::UnstableApiUsage(location(0, 0, 0), "TRUE", "TRUE", "TRUE", "TRUE")
```

**Аргументы:**
| **Имя**             | **Тип**                                                          | **Описание** |
| ------------------- | ---------------------------------------------------------------- | ------------ |
| `location`          | местоположение                                                   |              |
| `keep_rotation`     | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `keep_velocity`     | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `ignore_passengers` | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |
| `dismount`          | перечисление:<br/>**TRUE** - undefined<br/>**FALSE** - undefined |              |