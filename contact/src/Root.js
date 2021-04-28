import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

function Root() {
  return <section>Contact us component</section>;
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  domElementGetter() {
    return document.getElementById('ac-page-content');
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// ReactDOM.render(<Root />, document.getElementById('app'));
