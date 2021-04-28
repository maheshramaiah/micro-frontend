import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

function Error() {
  return (
    <div>
      Error loading one or modules in the page. Please try after sometime.
    </div>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Error,
  errorBoundary(err, info, props) {
    return <div>Error</div>;
  },
});

export default lifecycles;
