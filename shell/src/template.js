export function getShellTemplate(remotes) {
  return `
    <single-spa-router>
      <nav>
        <route path="/">
          <application name=""></application>
        </route>
      </nav>
    </single-spa-router>
  `;
}
