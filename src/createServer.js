/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    console.log(req.url);

    if (req.url.includes('..')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Do not try to cheat');

      return;
    }

    const normUrl = new URL(req.url, 'http://localhost:5701');

    const urlPath = normUrl.pathname;

    // console.log(req.url);
    // console.log(urlPath);

    // const q = urlPath.replace('/file', '') || 'index.html';

    // console.log(q);

    if (!urlPath.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');

      res.end('Request url should start with /file/');

      return;
    }

    const publicPath = urlPath.split('file').join('public');
    const truePath = path.join(__dirname, '..', publicPath);

    if (!fs.existsSync(truePath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('No such file');

      return;
    }

    if (truePath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Duplicate slashes not allowed');

      return;
    }

    try {
      const file = fs.readFileSync(truePath);

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;

      res.end(file);
    } catch {
      res.end();
    }
  });

  return server;
}

module.exports = {
  createServer,
};
