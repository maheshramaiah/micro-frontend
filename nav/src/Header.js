import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import styled from 'styled-components';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import * as uselessLib from 'useless-lib';

const StyledHeader = styled.div`
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

const Nav = styled.nav`
  a {
    padding-left: 10px;
    color: #fff;
  }
`;

function Header() {
  return (
    <Router>
      <StyledHeader>
        <p>Header</p>
        <p>Useless lib - {uselessLib.version}</p>
        <Nav>
          <Link to="/home">Home</Link>
          <Link to="/contact">Contact</Link>
        </Nav>
      </StyledHeader>
    </Router>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Header,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return <div>Error in header</div>;
  },
  domElementGetter(props) {
    // console.log(props);
    return document.getElementById('ac-header');
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// ReactDOM.render(<Header />, document.getElementById('app'));
