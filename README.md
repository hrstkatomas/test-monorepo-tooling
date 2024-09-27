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

Also we could use this for CD - define "deploy" tasks in project.json of each project  
```json
  "targets": {
    "deploy": {
      "dependsOn": ["build"],
      "command": "echo 'DONE'"
    }
  }
```
and deploy affected application using ```npx nx affected --target=deploy```


### Rules
Can define what library can use other library like "abstract parts should not use project specific parts".

Add tags to `project.json` files like
Orders: "tags": ["type:feature", "scope:orders"],
UI: "tags": ["type:ui", "scope:shared"],

Next, let's come up with a set of rules based on these tags:
* type:feature should be able to import from type:feature and type:ui
* type:ui should only be able to import from type:ui
* scope:orders should be able to import from scope:orders, scope:shared and scope:products
* scope:products should be able to import from scope:products and scope:shared
  
To enforce the rules, Nx ships with a custom ESLint rule. 
See eslint.config.js in the root of the workspace, See `depConstraints`
