import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

function Root() {
  return <section>Contact us component override</section>;
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
