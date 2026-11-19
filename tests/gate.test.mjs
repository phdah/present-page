import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

function makeElement() {
  const listeners = {};
  const attributes = new Map();
  const classes = new Set();
  return {
    listeners,
    attributes,
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
    },
    value: '',
    hidden: false,
    disabled: false,
    textContent: '',
    focusCalled: false,
    addEventListener(name, fn) { listeners[name] = fn; },
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
    focus() { this.focusCalled = true; },
    select() {},
    get offsetWidth() { return 100; },
  };
}

function renderApp({ reducedMotion = false } = {}) {
  const keys = ['code-form', 'code-input', 'code-message', 'unlock-button', 'login-screen', 'success-screen'];
  const elements = Object.fromEntries(keys.map((key) => [key, makeElement()]));
  const body = makeElement();
  elements['success-screen'].hidden = true;

  runInNewContext(script, {
    document: {
      body,
      getElementById: (name) => elements[name],
    },
    window: {
      matchMedia: () => ({ matches: reducedMotion }),
      setTimeout: (fn) => { fn(); return 0; },
    },
  });

  function submit(value) {
    elements['code-input'].value = value;
    elements['code-form'].listeners.submit({ preventDefault() {} });
  }

  return { ...elements, body, submit };
}

test('removes non-digits and limits input to six digits', () => {
  const app = renderApp();
  app['code-input'].value = '96-ab11 21 77';
  app['code-input'].listeners.input();
  assert.equal(app['code-input'].value, '961121');
});

test('rejects an incorrect six-digit code', () => {
  const app = renderApp();
  app.submit('123456');
  assert.equal(app['code-input'].attributes.get('aria-invalid'), 'true');
  assert.match(app['code-message'].textContent, /Inte riktigt rätt/);
  assert.equal(app['success-screen'].hidden, true);
  assert.equal(app['unlock-button'].disabled, false);
});

test('rejects a partial code', () => {
  const app = renderApp();
  app.submit('9611');
  assert.match(app['code-message'].textContent, /sex siffror/);
  assert.equal(app['success-screen'].hidden, true);
});

test('accepts birthday code and reveals success screen', () => {
  const app = renderApp();
  app.submit('961121');
  assert.equal(app['login-screen'].hidden, true);
  assert.equal(app['success-screen'].hidden, false);
  assert.equal(app['success-screen'].focusCalled, true);
  assert.equal(app['unlock-button'].disabled, true);
});

test('reduced-motion path also unlocks', () => {
  const app = renderApp({ reducedMotion: true });
  app.submit('961121');
  assert.equal(app['success-screen'].hidden, false);
});

test('unlock activates full-screen journey layout', () => {
  const app = renderApp();
  app.submit('961121');
  assert.equal(app.body.classList.contains('is-unlocked'), true);
});
test('the three photo placements exist in the story', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(html, /class="gate-art"/);
  assert.match(html, /class="riding-memory"/);
  assert.match(css, /--gate-image/);
  assert.match(css, /--explorer-image/);
  assert.match(css, /--riding-image/);
});
