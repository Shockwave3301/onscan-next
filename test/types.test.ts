/**
 * Type-checking smoke test — this file is compiled but never executed.
 * `npm run typecheck` will verify these assignments are valid.
 */
import onScan, { OnScanOptions, ScanError, ScanEventDetail } from '../onscan';

// attachTo with options
const opts: OnScanOptions = {
    onScan(sScanned: string, iQty: number) {},
    onScanError(oDebug: ScanError) {},
    onKeyDetect(iKeyCode: number, oEvent: KeyboardEvent) {},
    onKeyProcess(sChar: string, oEvent: KeyboardEvent) {},
    onPaste(sPasted: string, oEvent: ClipboardEvent) {},
    keyCodeMapper(oEvent: KeyboardEvent) { return oEvent.key; },
    onScanButtonLongPress() {},
    scanButtonKeyCode: 113,
    scanButtonLongPressTime: 500,
    timeBeforeScanTest: 100,
    avgTimeByChar: 30,
    minLength: 6,
    suffixKeyCodes: [9, 13],
    prefixKeyCodes: [],
    ignoreIfFocusOn: false,
    stopPropagation: false,
    preventDefault: false,
    captureEvents: false,
    reactToKeydown: true,
    reactToPaste: false,
    singleScanQty: 1,
};

// ignoreIfFocusOn variants
const _a: OnScanOptions = { ignoreIfFocusOn: 'input' };
const _b: OnScanOptions = { ignoreIfFocusOn: document.body };
const _c: OnScanOptions = { ignoreIfFocusOn: ['input', document.body] };
const _d: OnScanOptions = { ignoreIfFocusOn: false };

// public API
onScan.attachTo(document.body, opts);
onScan.setOptions(document.body, { minLength: 4 });
const currentOpts: OnScanOptions = onScan.getOptions(document.body);
const char: string | null = onScan.decodeKeyEvent(new KeyboardEvent('keydown', { key: 'a' }));
onScan.simulate(document.body, 'ABC123');
onScan.simulate(document.body, [65, 66, 67]);
onScan.simulate(document.body, [{ key: 'A', keyCode: 65, shiftKey: true }]);
const inProgress: boolean = onScan.isScanInProgressFor(document.body);
const attached: boolean = onScan.isAttachedTo(document.body);
onScan.detachFrom(document.body);

// event detail types
const detail: ScanEventDetail = { scanCode: 'ABC', qty: 1 };

// attaching to document (not an Element), as in the README
onScan.attachTo(document, {
    suffixKeyCodes: [13],
    // returning any boolean is fine; only `false` cancels processing
    onKeyDetect: (iKeyCode) => iKeyCode !== 16,
});
onScan.simulate(document, [65, 66, 67, 13]);
const docInProgress: boolean = onScan.isScanInProgressFor(document);
onScan.detachFrom(document);

// scan events are typed on document and on elements
document.addEventListener('scan', (e) => {
    const code: string = e.detail.scanCode;
    const qty: number = e.detail.qty;
});
document.addEventListener('scanError', (e) => {
    const err: ScanError = e.detail;
});
document.body.addEventListener('scan', (e) => {
    const code: string = e.detail.scanCode;
});
document.addEventListener('scanButtonLongPress', (e) => {
    const noDetail: null = e.detail;
});
document.body.addEventListener('scanButtonLongPress', (e) => {
    const noDetail: null = e.detail;
});

// onScanButtonLongPress gets the attached element as `this` and as its argument
onScan.attachTo(document.body, {
    scanButtonKeyCode: 113,
    onScanButtonLongPress(oDomElement) {
        const el: Element = oDomElement;
        const self: Element = this;
    },
});
