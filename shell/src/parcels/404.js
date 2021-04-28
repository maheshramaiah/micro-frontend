import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

function NotFound() {
  return (
    <Container>
      This page is not available. Kindly check the page url.
    </Container>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: NotFound,
  errorBoundary(err, info, props) {
    return null;
  },
});

export default lifecycles;
