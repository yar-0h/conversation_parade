import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './routes.js';

export default function Contents() {
  return (
    <Switch>
      {routes.map(attrs => <Route {...attrs} key={attrs.path} />)}
    </Switch>
  );
}
