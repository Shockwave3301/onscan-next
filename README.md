<p align="center">
  <img src="scanner.png" alt="onscan-next logo" width="128" />
</p>

<h1 align="center">onscan-next</h1>

<p align="center">Framework-agnostic scan events for hardware barcode scanners.</p>

> **Coming from onScan.js?** onscan-next is a maintained, API-compatible fork. Install `onscan-next`, change the import, and check the [migration guide](MIGRATION.md) for the few differences.

Most barcode scanners act as a keyboard: they type the code in a fast burst and press Enter. onscan-next tells that burst apart from human typing and fires one `scan` event with the whole code.

```javascript
import onScan from 'onscan-next';

onScan.attachTo(document);
document.addEventListener('scan', (e) => {
    console.log(e.detail.scanCode); // e.g. "4006381333931"
});
```

## Why onscan-next

- **Codes arrive as typed.** Hyphens, colons, slashes, shifted characters and non-US keyboard layouts decode correctly, because onscan-next reads `event.key`.
- **Keyboard and paste scanners.** Works with scanners in keyboard-wedge mode and with handhelds that paste the code.
- **Small, no dependencies.** About 2 KB gzipped. Use it with React, Vue, Angular or plain JavaScript.
- **Bundled TypeScript types**, so `e.detail.scanCode` is typed in your `scan` listeners.
- **Testable without hardware.** `onScan.simulate(document, '1234567890123')` fires the same events as a real scan.
- **Tunable.** Options cover slow scanners, prefix and suffix characters, hardware scan buttons, and ignoring scans while an input has focus.

## Install

```bash
npm install onscan-next
```

Or load it from a CDN, which exposes a global `onScan`:

```html
<script src="https://cdn.jsdelivr.net/npm/onscan-next/dist/onscan.umd.min.js"></script>
```

## Documentation

[DOCS.md](DOCS.md) covers scanner setup, every option, event and method, custom key decoding, React, Vue and Angular examples, and troubleshooting.

## License

MIT. Logo by [manshagraphics](https://www.flaticon.com/authors/manshagraphics) on Flaticon.
