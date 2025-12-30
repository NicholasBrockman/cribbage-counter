import * as React from 'react';
import { Route, Routes } from 'react-router';
const Base = React.lazy(() => import('./components/base/Base'));
const SimpleCount = React.lazy(() => import('./components/content/HandCounter/handCounter'));
const AdvancedCount = React.lazy(() => import('./components/content/HandCounter/handCounter'));
const BestJokerPage = React.lazy(() => import('./components/content/BestJoker/bestJoker'));
const NotFound = React.lazy(() => import('./components/content/NotFound/NotFound'));

export const routeUrls = {
  simpleCount: "/",
  advCount: "/advCount",
  bestJoker: "/bestJoker",
}

export default () => {
  return (
    <Routes>
      <Route element={<Base />}>
        <Route index Component={SimpleCount} />
        <Route path={routeUrls.advCount} Component={AdvancedCount} />
        <Route path={routeUrls.bestJoker} Component={BestJokerPage} />
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};