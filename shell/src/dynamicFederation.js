let remoteMap = {};

function createDynamicImportMap(remotes) {
  return new Promise((resolve) => {
    const remoteEntryByName = remotes.reduce((ac, obj) => {
      if (!System.has(obj.remoteEntry)) {
        ac[obj.remoteName] = obj.remoteEntry;
      }
      return ac;
    }, {});

    if (Object.keys(remoteEntryByName).length) {
      const script = document.createElement('script');

      script.type = 'systemjs-importmap';
      script.textContent = JSON.stringify(
        {
          imports: remoteEntryByName,
        },
        null,
        2
      );

      document.head.append(script);
    }

    resolve();
  });
}

async function initRemote(remote) {
  const container = await System.import(remote.remoteName);

  if (remoteMap[remote.remoteName]) {
    return container;
  }

  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  remoteMap[remote.remoteName] = true;

  return container;
}

/**
 * Load remote entries and initiate share scopes
 */
export async function loadRemoteEntries(remotes) {
  try {
    await createDynamicImportMap(remotes);

    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    // Initialize remotes and provide share scopes
    await Promise.all(remotes.map(initRemote));

    return;
  } catch (err) {
    throw new Error(err);
  }
}

export async function loadRemoteModule(remoteName, exposedModule) {
  const container = await System.import(remoteName);
  const factory = await container.get(exposedModule);
  const module = factory();

  return module;
}
