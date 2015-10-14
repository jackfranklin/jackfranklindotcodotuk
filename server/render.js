import React from 'react';
import { renderToString, renderToStaticMarkup }  from 'react-dom/server';

import { match, RoutingContext } from 'react-router';

import HtmlDocument from '../components/html-document';

import { routes } from '../routes.js';

export function render(req, res, next) {
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (props) {

      const markup = renderToString(<RoutingContext {...props} />);

      const html = renderToStaticMarkup(
        <HtmlDocument markup={markup} />
      );
      res.status(200).send('<!DOCTYPE html>' + html);
    } else {
      res.sendStatus(404);
    }
  });
};