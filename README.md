# @neruco/vanilla-matchheight

A lightweight vanilla JavaScript utility for matching element heights.

A modern alternative to `jquery-match-height` with no dependencies.

Supports:

- Row-based height matching (`byRow`)
- Match height to a specific target
- Remove applied height
- `data-mh` / `data-match-height` support
- UMD (CDN) + CommonJS compatibility

---

## ✨ Features

- No dependencies
- Small footprint
- ES5 compatible
- Works with dynamic content
- Supports resize / orientation change recalculation

---

## 📦 Installation

### npm

```bash
npm install @neruco/vanilla-matchheight
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/@neruco/vanilla-matchheight@1.0.0/dist/vanilla-matchheight.umd.min.js"></script>
```

---

## 🚀 Basic Usage (data-mh)

```html
<div class="card" data-mh="group1">Card A</div>
<div class="card" data-mh="group1">Card B</div>
<div class="card" data-mh="group1">Card C</div>
```

```js
<script>
  VanillaMatchHeight.applyDataApi();
</script>
```

All elements sharing the same data-mh value will have equal height.

---

## 🧠 JavaScript API

### Register elements manually

```js
VanillaMatchHeight.register(
  document.querySelectorAll('.card'),
  { byRow: true }
);
```

### Match height to a specific target

```js
VanillaMatchHeight.register(
  document.querySelectorAll('.card'),
  { target: document.querySelector('.card--master') }
);
```

### Remove matched height

```js
VanillaMatchHeight.applyGroup(
  document.querySelectorAll('.card'),
  { remove: true }
);
```

### Recalculate after dynamic changes

```js
VanillaMatchHeight.updateAll();
```

---

## ⚙ Options

| Option   | Type    | Default    | Description                        |
| -------- | ------- | ---------- | ---------------------------------- |
| byRow    | Boolean | `true`     | Match height per row               |
| property | String  | `"height"` | CSS property to modify             |
| target   | Element | `null`     | Match height to a specific element |
| remove   | Boolean | `false`    | Remove applied height              |

---

## 🌍 Browser Support

Works in modern browsers (ES5 compatible).

---

## 📜 License

MIT

---

## 👤 Author

Created by neruco
