# Компоненты
Для каждого компонента создаётся папка, в которой должен как минимум быть файл `element.mjs`.

Таким образом, для использования компонента с названием opteka-header, нужно:

- Подключить скрипт по такому пути:
    ```html
    <script type="module" src="/components/opteka-header/element.mjs"></script>
    ```

- После чего использовать:
    ```html
    <opteka-header></opteka-header>
    ```

## Реализованы сейчас
- [opteka-header](./components/opteka-header)
- [opteka-footer](./components/opteka-footer)
