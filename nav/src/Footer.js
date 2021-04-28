import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #669999;
  padding: 15px 20px;
  color: #fff;

  p {
    margin: 0;
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <p>Footer</p>
    </StyledFooter>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Footer,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  domElementGetter(props) {
    // console.log(props);
    return document.getElementById('ac-footer');
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// ReactDOM.render(<Header />, document.getElementById('app'));
