import React from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
// import { ServerStyleSheet } from 'styled-components';

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
  el.onload = () => {
    if (callback && typeof callback === 'function') {
      callback();
    } else {
      return Promise.resolve();
    }
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
      const Element = window[moduleName];

      // const sheet = new ServerStyleSheet();
      // const r = renderToString(sheet.collectStyles(<Element {...props} />));

      const r = renderToString(<Element {...props} />);

      // const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();
      // sheet.seal();

      event.source.postMessage({ source: 'sandbox', [`${moduleName}`]: r, props }, event.origin);
    }
  }
})