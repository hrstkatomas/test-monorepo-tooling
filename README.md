# Test NX monorepo
## Notes 
https://nx.dev/concepts/decisions/dependency-management

Use single package.json in the root to ensure all app use the same version of dependency.
Nx's graph of dependencies to automatically populate the dependencies section of the individual package.json files in the build output
