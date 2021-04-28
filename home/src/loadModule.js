export default function loadModule(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = window[scope];

    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);

    const factory = await container.get(module);
    const Module = factory();

    return Module;
  };
}
