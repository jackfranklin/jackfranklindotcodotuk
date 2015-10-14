import express from 'express';
import path from 'path';
import http from 'http';

import { render } from './render';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(render);

const server = http.createServer(app);

server.listen(3003);

server.on('listening', () => {
  console.log('Listening on 3003');
});
