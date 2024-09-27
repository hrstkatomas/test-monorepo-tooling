# Test NX monorepo
## Notes 

### Dependency management 
https://nx.dev/concepts/decisions/dependency-management

Use single package.json in the root to ensure all app use the same version of dependency.
Nx's graph of dependencies to automatically populate the dependencies section of the individual package.json files in the build output

### Affected
```npx nx affected -t {task}``` will run task (like tests or linters) only on the projects affected by the current changes
```npx nx graph --affected``` will show the affected projects
This could be powerfull for the CI - only run the tests on the affected projects/libs
