// import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

function loadScript(data, type, callback) {
  const el = document.createElement('script');
  el.class = 'demo-ext-plugin';
  if (type === 'code') {
    el.textContent = data;
  } else if (type === 'url') {
    el.src = data;
    // el.type = 'module';
  }
  document.documentElement.appendChild(el);
  if (callback && typeof callback === 'function') {
    callback();
  } else {
    return Promise.resolve();
  }
}

// Set up message event handler:
window.addEventListener('message', async (event) => {
  const { command } = event.data;

  if (command === 'loadScript') {
    const { code = '' } = event.data;
    if (code) {
      await loadScript(code, 'code');
      event.source.postMessage({ source: 'sandbox', result: 'OK' }, event.origin);
    }
  } else if (command === 'render') {
    const { moduleName = '', props = {} } = event.data;

    if (moduleName && window[moduleName]) {
      const module = window[moduleName];
      const r = ReactDOMServer.renderToString(module(props));

      event.source.postMessage({ source: 'sandbox', [`${moduleName}`]: r, props }, event.origin);
    }
  }
})