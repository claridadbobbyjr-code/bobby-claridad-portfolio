import '@testing-library/jest-dom/vitest';

// jsdom lacks these browser APIs that framer-motion / our hooks use.
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver = IO as unknown as typeof ResizeObserver;
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  }) as MediaQueryList;
}
window.scrollTo = (() => {}) as typeof window.scrollTo;
HTMLCanvasElement.prototype.getContext = (() => null) as never;
