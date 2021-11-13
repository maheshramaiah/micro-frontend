let remoteMap = {};
let importMapModule = {};

function getAllImportMaps() {
  return Array.from(
    document.querySelectorAll('script[type=systemjs-importmap]')
  ).reduce((importMaps, element) => {
    if (element?.textContent) {
      const importMap = JSON.parse(element.textContent).imports;

      importMaps = {
        ...importMaps,
        ...importMap,
      };
    }
    return importMaps;
  }, {});
}

function createDynamicImportMap(remotes) {
  return new Promise((resolve) => {
    const existingImportMaps = getAllImportMaps();
    const remoteEntryByName = remotes.reduce((ac, obj) => {
      if (!existingImportMaps[obj.remoteName]) {
        ac[obj.remoteName] = obj.remoteEntry;
      }

      return ac;
    }, {});

    if (Object.keys(remoteEntryByName).length) {
      // const overrideMapElement = document.querySelector(
      //   '[data-is-importmap-override]'
      // );
      const script = document.createElement('script');

      script.type = 'systemjs-importmap';
      script.textContent = JSON.stringify(
        {
          imports: remoteEntryByName,
        },
        null,
        2
      );

      // if (overrideMapElement) {
      //   overrideMapElement.parentNode.insertBefore(script, overrideMapElement);
      // } else {
      //   document.head.appendChild(script);
      // }

      document.head.appendChild(script);
    }

    resolve();
  });
}

function dummyPromise(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Promise complete', name);
      resolve('hai');
    }, 100);
  });
}

async function initRemote(remote) {
  // console.log('Loading', remote.remoteName);
  const container = await System.import(remote.remoteName);
  // console.log('Loaded', remote.remoteName);

  // if (remoteMap[remote.remoteName]) {
  //   return container;
  // }

  // Initialize the container, it may provide shared modules
  // console.log('Init starting', remote.remoteName);
  const val = container.init(__webpack_share_scopes__.default);
  // console.log(val);
  // console.log('Init Finished', remote.remoteName);
  remoteMap[remote.remoteName] = true;

  // console.log('Before promise', remote.remoteName);
  // await dummyPromise(remote.remoteName);
  // console.log('After promise', remote.remoteName);

  return;
}

/**
 * Load remote entries and initiate share scopes
 */
export async function loadRemoteEntries(remotes) {
  try {
    await createDynamicImportMap(remotes);

    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    // console.log('STARTED');

    // Initialize remotes and provide share scopes
    await Promise.all(remotes.map(initRemote));

    // console.log('ENDED');

    return;
  } catch (err) {
    console.error(`Error loading remote entries or initializing - ${err}`);
    throw new Error(err);
  }
}

export async function loadRemoteModule(remoteName, exposedModule) {
  try {
    const container = await System.import(remoteName);
    const factory = await container.get(exposedModule);
    const module = factory();

    return module;
  } catch (err) {
    console.error(
      `Error loading remote module ${remoteName}/${exposedModule} - ${err}`
    );
    throw new Error(err);
  }
}
