import * as React from 'react';
import { Route, Routes } from 'react-router';
const Base = React.lazy(() => import('./components/base/Base'));
const StartPage = React.lazy(() => import('./components/content/HandCounter/handCounter'));
const WebpackPage = React.lazy(() => import('./components/content/BestJoker/bestJoker'));
const NotFound = React.lazy(() => import('./components/content/NotFound/NotFound'));

export const routeUrls = {
  home: "/",
  vite: "/vite",
}

export default () => {
  return (
    <Routes>
      <Route element={<Base />}>
        <Route index Component={StartPage} />
        <Route path={routeUrls.vite} Component={WebpackPage} />
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};