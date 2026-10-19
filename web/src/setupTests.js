import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.fetch) {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Mock window.matchMedia for jsdom — must be a plain function, NOT jest.fn().
// jest.fn() implementations are cleared between tests when clearMocks/resetMocks is active,
// which causes framer-motion and Brand.jsx to receive undefined and crash.
function _matchMediaMock(query) {
  return {
    matches: false,
    media: query || '',
    onchange: null,
    addListener: function () {},    // deprecated but framer-motion 11 still uses this
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () { return false; },
  };
}
global.matchMedia = _matchMediaMock;
try {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: _matchMediaMock,
  });
} catch (e) {
  window.matchMedia = _matchMediaMock;
}


// Mock IntersectionObserver for jsdom (used in Brand.jsx and Identity.jsx)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver for jsdom (used by chart components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
