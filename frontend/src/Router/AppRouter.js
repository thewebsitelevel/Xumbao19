import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Dashboard from '../Components/Dashboard/Dashboard';
import Questions from '../Components/Questions/Questions.js';
import Leaderboard from '../Components/Leaderboard/Leaderboard.js';
import Rules from '../Components/Rules/Rules';
export const history = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/" component={Dashboard} exact={true} />
          <Route path="/rules" component={Rules} exact={true} />
          <Route path="/question" component={Questions} exact={true} />
          <Route path="/leaderboard" component={Leaderboard} exact={true} />
        </Switch>
      </div>
    </Router>
  )
}

export default AppRouter;