# Migrating from onScan.js

onscan-next is a maintained fork of [onScan.js](https://github.com/axenox/onscan.js) 1.5.2 with the same API. Most apps switch by changing the package name. This page lists every difference found by comparing the two codebases.

## 1. Swap the package

```bash
npm uninstall onscan.js @types/onscan.js
npm install onscan-next
```

```diff
- import onScan from 'onscan.js';
+ import onScan from 'onscan-next';
```

`require()` works the same way:

```diff
- const onScan = require('onscan.js');
+ const onScan = require('onscan-next');
```

**CDN users:** the UMD bundle still exposes the global `onScan`, so only the script URL changes:

```diff
- <script src="https://cdn.jsdelivr.net/npm/onscan.js/onscan.min.js"></script>
+ <script src="https://cdn.jsdelivr.net/npm/onscan-next/dist/onscan.umd.min.js"></script>
```

## 2. What stays the same

- All eight methods keep their names and arguments: `attachTo`, `detachFrom`, `simulate`, `setOptions`, `getOptions`, `decodeKeyEvent`, `isAttachedTo`, `isScanInProgressFor`.
- All options keep their names and defaults.
- The `scan` and `scanError` events carry the same `event.detail`, and every callback (`onScan`, `onScanError`, `onScanButtonLongPress`, `onKeyDetect`, `onKeyProcess`, `onPaste`) gets the same arguments.
- `require()` returns the `onScan` object, and the UMD bundle still works as an AMD module or a browser global.

## 3. What changes

| Area                                                    | onScan.js 1.5.2                                                                                       | onscan-next                                                                             | Action                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Default key decoding                                    | Reads only keyCodes 48–90 and 96–111; every other key decodes to an empty string                      | Uses any single-character `event.key`; falls back to the keyCode when `key` is empty    | None for most users. Re-test if you have a custom `keyCodeMapper`.           |
| Hyphens, colons, slashes, other symbols, non-US layouts | Dropped or decoded wrong ([#15], [#19], [#31], [#43])                                                 | Decoded as typed                                                                        | Remove any workarounds in your `keyCodeMapper`.                              |
| Non-character keys (Shift, Ctrl, arrows)                | `decodeKeyEvent()` returns `''`; the key still starts a scan, so a lone Shift press fires `scanError` | `decodeKeyEvent()` returns `null`; the key is ignored                                   | If your code checks the decoder's result for `''`, check for `null` instead. |
| TypeScript types                                        | Separate `@types/onscan.js`                                                                           | Bundled                                                                                 | Delete `@types/onscan.js`. See [TypeScript](#4-typescript).                  |
| Module formats                                          | One UMD script                                                                                        | ESM, CommonJS and UMD via `exports`                                                     | None.                                                                        |
| `scanError` messages                                    | `Receieved code is shorter then minimal length`, `Receieved code was not entered in time`             | `Received code is shorter than minimal length`, `Received code was not entered in time` | Update code that compares `message` strings.                                 |

### Smaller differences (mostly bug fixes)

- `simulate()` with an array dispatches the key events on the element you pass. onScan.js always dispatched them on `document`, so array simulation never reached a scanner attached to any other element.
- `ignoreIfFocusOn` accepts DOM elements. onScan.js documented this but threw a `SyntaxError` on every key press when given one.
- `detachFrom()` removes the listeners when `captureEvents` is `true`. onScan.js left them attached, and every later key press threw a `TypeError`.
- On an element that is not attached, `detachFrom()` does nothing and `isScanInProgressFor()` returns `false`. onScan.js threw a `TypeError` for both. `getOptions()` and `setOptions()` still throw, now with a readable message.
- `onKeyProcess` fires only for characters added to the scan code. onScan.js also called it for prefix and suffix keys (with `undefined`) and for non-character keys (with `''`).
- When `event.key` is empty, numpad digits decode to strings (`'1'`) instead of numbers (`1`), and numpad operators (keyCodes 106–111) are skipped instead of decoding to the letters `j`–`o`. This mostly affects `simulate()` with keyCode arrays. Letters and digits decode exactly as before.
- Scanner state is private. onScan.js stored it on the element as `scannerDetectionData`; use `getOptions()`, `isAttachedTo()` and `isScanInProgressFor()` instead.
- The code is ES2016 and ships untranspiled (`const`, arrow functions, `Array.prototype.includes`), where onScan.js was ES5. If you support old embedded browsers, such as the WebView on an old Android handheld, run it through your transpiler.

## 4. TypeScript

Types ship with the package. Delete `@types/onscan.js`: `import onScan from 'onscan-next'` is typed, and so are `scan` and `scanError` listeners on `document` and on elements.

Some exported type names changed:

| @types/onscan.js | onscan-next                   |
| ---------------- | ----------------------------- |
| `ScanOptions`    | `OnScanOptions`               |
| `Scan`           | `ScanEventDetail`             |
| `ScanEvent`      | `OnScanScanEvent`             |
| `ScanErrorEvent` | `OnScanErrorEvent`            |
| `ScanError`      | `ScanError` (unchanged)       |
| `KeyCode`        | `number \| KeyboardEventInit` |
| `OnScan`         | `typeof onScan`               |

Some types are corrected or stricter:

- `ignoreIfFocusOn` accepts a selector, an element, an array of either, or `false`. It was typed as `boolean` ([#36], [#45]).
- `scanButtonKeyCode` is `number | false`. It was typed as `boolean`.
- `onScanError` receives a `ScanError` (was `any`), `keyCodeMapper` must return `string | null` (was `any`), and `decodeKeyEvent()` returns `string | null` (was `any`).
- The keydown option is `reactToKeydown`. `@types/onscan.js` spelled it `reactToKeyDown`, which onScan.js never read, so setting it had no effect. TypeScript now reports it as an unknown option. Delete it; rename it only if you really want keydown scanning turned off.

## 5. Checklist

- [ ] Swap the package and the import
- [ ] Remove `@types/onscan.js` and rename any imported types
- [ ] Run a real scan with your scanner and compare the code with what onScan.js produced
- [ ] If you have a custom `keyCodeMapper`, check that it still needs every special case, and that any check for `''` from `decodeKeyEvent()` now checks for `null`
- [ ] If you compare `scanError` messages or read `scannerDetectionData`, update that code

Getting a different result after switching? [Open an issue](https://github.com/Shockwave3301/onscan-next/issues) with your scanner model and the `onKeyDetect` output for one scan.

[#15]: https://github.com/axenox/onscan.js/issues/15
[#19]: https://github.com/axenox/onscan.js/issues/19
[#31]: https://github.com/axenox/onscan.js/issues/31
[#36]: https://github.com/axenox/onscan.js/issues/36
[#43]: https://github.com/axenox/onscan.js/issues/43
[#45]: https://github.com/axenox/onscan.js/issues/45
