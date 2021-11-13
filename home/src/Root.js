import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import singleSpaReact from 'single-spa-react';
// import { createBrowserHistory } from 'history';

const Home1 = React.lazy(() => import('./Home1'));
const Home2 = React.lazy(() => import('./Home2'));

// const history = createBrowserHistory();

function Root() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename="/home">
        <Switch>
          <Route exact path="/" component={Home1}></Route>
          <Route exact path="/home1" component={Home1}></Route>
          <Route exact path="/home2" component={Home2}></Route>
        </Switch>
      </Router>
    </Suspense>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  domElementGetter(props) {
    return document.getElementById(props.domElementId);
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// ReactDOM.render(<Root />, document.getElementById('app'));
