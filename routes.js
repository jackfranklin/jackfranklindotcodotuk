import React from 'react';
import { Route } from 'react-router';
import { fromJS } from 'immutable';

import App from './pages/app';
import IndexPage from './pages/index';

export const routes = {
  path: '',
  component: App,
  childRoutes: [
    {
      path: '/',
      component: IndexPage,
    }
  ],
};
