# dora-plugin-hmr

HMR plugin for dora based on [babel-plugin-react-transform](https://github.com/gaearon/babel-plugin-react-transform).

---

![](https://cloud.githubusercontent.com/assets/1539088/11611771/ae1a6bd8-9bac-11e5-9206-42447e0fe064.gif)

## Feature

- enables hot reloading using HMR API
- catches errors inside `render()`

## Usage

```bash
$ dora --plugins hmr
```

## Test

```bash
$ cd examples/normal
$ npm run dev
```
