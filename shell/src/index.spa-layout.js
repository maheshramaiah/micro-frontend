import {
  registerApplication,
  start,
  addErrorHandler,
  checkActivityFunctions,
  getAppStatus,
  LOAD_ERROR,
  mountRootParcel,
  MOUNTED,
} from 'single-spa';
import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { loadRemoteEntries, loadRemoteModule } from './dynamicFederation';
// import NotFound from './404';
import errorParcelConfig from './parcels/Error';
import './index.css';

const remotes = [
  {
    remoteName: 'nav',
    exposedModules: ['Header'],
    activePath: ['/'],
    remoteEntry: 'http://localhost:8081/remoteEntry.js',
  },
  {
    remoteName: 'home',
    exposedModules: ['Home'],
    activePath: ['/home'],
    remoteEntry: 'http://localhost:8082/remoteEntry.js',
  },
  {
    remoteName: 'contact',
    exposedModules: ['Contact'],
    activePath: ['/contact'],
    remoteEntry: 'http://localhost:8083/remoteEntry.js',
  },
];

loadRemoteEntries(remotes)
  .then(() => {
    const layoutData = {
      loaders: {
        header: 'Loading...',
      },
      errors: {
        header: Error,
        home: Error,
      },
    };

    const routes = constructRoutes(
      document.querySelector('#single-spa-layout'),
      layoutData
    );
    console.log(routes);
    const applications = constructApplications({
      routes,
    });
    const layoutEngine = constructLayoutEngine({ routes, applications });

    applications.forEach((application) => {
      const [remoteName, module] = application.name.split('/');

      registerApplication({
        name: application.name,
        app: loadRemoteModule(remoteName, module),
        activeWhen(location) {
          const remoteConfig = remotes.find(
            (remote) => remote.remoteName === remoteName
          );
          return remoteConfig.activePath.some((path) =>
            location.pathname.startsWith(path)
          );
        },
        customProps: {
          user: 'Mahesh',
        },
      });
    });
  })
  .catch((err) => {
    // console.log(err);
    throw new Error(err);
  });

// registerApplication({
//   name: 'header',
//   app: () => import('nav/Header'),
//   activeWhen: ['/'],
// });

// registerApplication({
//   name: 'home',
//   app: () => import('home/Home'),
//   activeWhen: [
//     '/home',
//     (location) => location.pathname === '/' || location.pathname === '/home',
//   ],
// });

// registerApplication({
//   name: 'contact',
//   app: () => import('contact'),
//   activeWhen: ['/contact'],
// });

let errorParcel;

addErrorHandler((err) => {
  console.error(err.appOrParcelName);
  console.error(err);

  errorParcel = mountRootParcel(errorParcelConfig, {
    domElement: document.getElementById('ac-page-error'),
  });
});

window.addEventListener('single-spa:routing-event', (event) => {
  if (errorParcel && errorParcel.getStatus() === MOUNTED) {
    errorParcel.unmount();
  }
  // const apps = checkActivityFunctions();
  // const filterNav = apps.filter((app) => !app.startsWith('nav/'));
  // console.log(filterNav);
});

start({
  urlRerouteOnly: true,
});
