// Setup file for Vitest (jsdom environment). Add global configuration or polyfills here.
// Import jest-dom matchers to get nice assertions like `toBeDisabled` and `toHaveTextContent`.
import "@testing-library/jest-dom";

// Polyfill `localStorage` in case the test environment doesn't provide one.
// This makes tests that set/get items resilient across environments.
// If `localStorage` isn't available or lacks functions, install a minimal
// polyfill that still works with `vi.spyOn(Storage.prototype, ...)`.
if (
  typeof globalThis.localStorage === "undefined" ||
  typeof globalThis.localStorage?.setItem !== "function" ||
  typeof globalThis.localStorage?.getItem !== "function"
) {
  const store = new Map<string, string>();
  // minimal Storage-like object
  const obj = {
    getItem: (key: string) => {
      const value = store.get(key);
      return value === undefined ? null : value;
    },
    setItem: (key: string, value: string) => {
      store.set(String(key), String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;

  try {
    // Ensure prototype matches Storage so `vi.spyOn(Storage.prototype, 'getItem')`
    // can intercept calls in tests. This is a no-op in environments where
    // `Storage` is not defined.
    if (typeof Storage !== "undefined") {
      // Ensure the polyfill inherits Storage prototype so that spies on
      // Storage.prototype (like `vi.spyOn(Storage.prototype, 'getItem')`)
      // work. Cast to `unknown` to avoid `any`.
      Object.setPrototypeOf(obj, Storage.prototype as unknown as object);
    }
  } catch (_e) {
    /* ignore */
  }

  try {
    Object.defineProperty(globalThis, "localStorage", {
      value: obj,
      configurable: true,
      writable: true,
    });
  } catch (_e) {
    // If defining a property fails for some reason (non-writable global),
    // fall back to assignment with a safer cast.
    (globalThis as unknown as { localStorage?: Storage }).localStorage = obj;
  }
}
