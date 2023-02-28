import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Human from '../../container/human/Human';

function HumanRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}`} component={Human} />

      {/* <Route path={`${path}/humans/:id`} component={} /> */}
      {/* <Route path={`${path}/create`} component={ProjectCreate} /> */}
    </Switch>
  );
}

export default HumanRoutes;
