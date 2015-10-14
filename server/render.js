import React from 'react';
import { renderToString }  from 'react-dom/server';

import { match, RoutingContext } from 'react-router';

import { routes } from '../routes.js';

export function render(req, res, next) {
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (props) {
      res.status(200).send(renderToString(<RoutingContext {...props} />));
    } else {
      res.sendStatus(404);
    }
  });
};
