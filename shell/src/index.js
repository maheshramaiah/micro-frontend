import {
  registerApplication,
  start,
  addErrorHandler,
  checkActivityFunctions,
  getAppStatus,
  mountRootParcel,
  MOUNTED,
  LOAD_ERROR,
  NOT_LOADED,
} from 'single-spa';
import { loadRemoteEntries, loadRemoteModule } from './dynamicFederation';
import notFoundParcelConfig from './parcels/404';
import errorParcelConfig from './parcels/Error';
import loaderParcelConfig from './parcels/Loader';
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
    remotes.forEach((remote) => {
      remote.exposedModules.forEach((exposedModule) => {
        registerApplication({
          name: `${remote.remoteName}/${exposedModule}`,
          app: () => loadRemoteModule(remote.remoteName, exposedModule),
          activeWhen(location) {
            return remote.activePath.some((path) =>
              location.pathname.startsWith(path)
            );
          },
        });
      });
    });
  })
  .catch((err) => {
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

function initParcel(config, domElement) {
  let parcel;

  return {
    mount() {
      parcel = mountRootParcel(config, {
        domElement: document.getElementById(domElement),
      });
    },
    unmount() {
      if (parcel) {
        parcel.mountPromise.then(() => {
          if (parcel.getStatus() === MOUNTED) {
            parcel.unmount();
            parcel = null;
          }
        });
      }
    },
  };
}

function isInvalidRoute() {
  // console.log(checkActivityFunctions());
  const apps = checkActivityFunctions().filter(
    (app) => !app.startsWith('nav/')
  );

  return !apps.length;
}

function isAppNotLoaded(apps) {
  return apps.some((app) => getAppStatus(app) === NOT_LOADED);
}

function retryLoadingModule(app) {
  System.delete(System.resolve(app));
}

const parcels = {
  loader: initParcel(loaderParcelConfig, 'ac-splash'),
  error: initParcel(errorParcelConfig, 'ac-page-error'),
  notFound: initParcel(notFoundParcelConfig, 'ac-not-found'),
};

addErrorHandler((err) => {
  console.error(err.appOrParcelName);
  console.error(err);

  if (getAppStatus(err.appOrParcelName) === LOAD_ERROR) {
    retryLoadingModule(err.appOrParcelName.split('/')[0]);
  }
  parcels.error.mount();
});

window.addEventListener('single-spa:before-app-change', (event) => {
  // console.log('Before app change');
  // console.log(event.detail);

  if (isAppNotLoaded(event.detail.appsByNewStatus.MOUNTED)) {
    parcels.loader.mount();
  }
  parcels.notFound.unmount();
  parcels.error.unmount();
});

window.addEventListener('single-spa:app-change', (event) => {
  // console.log('After app change');
  // console.log(event.detail);

  if (isInvalidRoute()) {
    parcels.notFound.mount();
  }
  parcels.loader.unmount();
});

start({
  urlRerouteOnly: true,
});
