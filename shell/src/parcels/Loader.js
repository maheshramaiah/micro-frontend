import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

function Loader() {
  return <div>Loading...</div>;
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Loader,
  errorBoundary(err, info, props) {
    return <div>Error</div>;
  },
});

export default lifecycles;
