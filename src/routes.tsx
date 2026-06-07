import * as React from 'react';
import { Route, Routes } from 'react-router';
const Base = React.lazy(() => import('./components/base/Base'));
const SimpleCounter = React.lazy(() => import('./components/content/SimpleCounter/simpleCounter'));
const HandCounter = React.lazy(() => import('./components/content/HandCounter/handCounter'));
const BestJokerPage = React.lazy(() => import('./components/content/BestJoker/bestJoker'));
const NotFound = React.lazy(() => import('./components/content/NotFound/NotFound'));

export const routeUrls = {
  home: "/",
  hand: "/hand",
  bestJoker: "/best-joker",
}

export default () => {
  return (
    <Routes>
      <Route element={<Base />}>
        <Route index Component={SimpleCounter} />
        <Route path={routeUrls.hand} Component={HandCounter} />
        <Route path={routeUrls.bestJoker} Component={BestJokerPage} />
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};