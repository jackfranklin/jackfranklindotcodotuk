import fs from 'fs';
import 'isomorphic-fetch';
import denodeify from 'denodeify';
import path from 'path';

import { routes } from '../routes';

const writeFile = denodeify(fs.writeFile);

const fetchPromises = routes.childRoutes.map((route) => {
  return route.path;
}).map((path) => {
  return fetch(`http://localhost:3003${path}`).then(response => response.text()).then((text) => {
    console.log('Fetched content for', path);
    return { path, text };
  });
});

Promise.all(fetchPromises).then((pages) => {
  return pages.map((page) => {
    let outLoc;
    if (page.path === '/') {
      outLoc = 'index.html';
    } else {
      outLoc = `${page.path.substring(1)}.html`;
    }
    return writeFile(path.join('out', outLoc), page.text);
  });
}).then(() => {
  console.log('Pages written successfully');
});
