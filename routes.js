import React from 'react';
import { Route } from 'react-router';
import { fromJS } from 'immutable';

import App from './pages/app';
import IndexPage from './pages/index';
import AboutPage from './pages/about';

export const routes = {
  path: '',
  component: App,
  childRoutes: [
    {
      path: '/',
      component: IndexPage,
    },
    {
      path: '/about',
      component: AboutPage,
    }
  ],
};
