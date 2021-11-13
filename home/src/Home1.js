import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as uselessLib from 'useless-lib';
import { Helmet } from 'react-helmet';
import BodyClassName from 'react-body-classname';
import {
  loadRemoteEntries,
  loadRemoteModule,
} from '../../shell/src/dynamicFederation';

const remotes = [
  {
    remoteName: 'fragment',
    exposedModules: ['Button'],
    activePath: '',
    remoteEntry: 'http://localhost:8084/remoteEntry.js',
  },
];

function useLoadRemoteModules(remotes) {
  const [remoteModulesLoaded, setRemoteModulesLoaded] = useState(false);

  useEffect(() => {
    (async function () {
      await loadRemoteEntries(remotes);
      setRemoteModulesLoaded(true);
    })();
  }, []);

  return { remoteModulesLoaded };
}

function LoadModule(props) {
  const Component = React.lazy(() =>
    loadRemoteModule(props.remoteName, props.exposedModules[0])
  );

  return (
    <React.Suspense fallback="Loading Fragment">
      <Component />
    </React.Suspense>
  );
}

const Content = styled.p`
  color: blue;
`;

export default function Home1() {
  const { remoteModulesLoaded } = useLoadRemoteModules(remotes);

  return (
    <React.Suspense fallback={null}>
      <BodyClassName className="home-wrapper">
        <>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <Content>Home1</Content>
          <p>Useless lib - {uselessLib.version}</p>
          <Link to="/home2">Go to Home2</Link>
          {remoteModulesLoaded
            ? remotes.map((remote) => (
                <LoadModule key={remote.remoteName} {...remote} />
              ))
            : null}
        </>
      </BodyClassName>
    </React.Suspense>
  );
}
