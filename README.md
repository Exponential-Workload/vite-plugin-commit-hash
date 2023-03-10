# Vite-Plugin-Commit-Hash

Mini-Plugin used to provide commit hash information to the project.<br/>
This should work cross-framework just fine.

## Installation

1. `pnpm i vite-plugin-commit-hash`
2. Load the plugin in your `vite.config.js`: `import {CommitHashPlugin} from 'vite-plugin-commit-hash';` followed by `plugins: [/*your other plugins*/, CommitHashPlugin({noPrefix:false,noVirtual:false})]`

## Usage
Import `virtual:commit-hash` in your codebase;
```js
import CommitHash from 'virtual:commit-hash';
console.log(CommitHash); // -> Current Hash - with '-dirty' at the end if there's uncommitted work.
```

### Example Config

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { CommitHashPlugin } from 'vite-plugin-commit-hash';
import type { UserConfig } from 'vite';

/** @type {import('vite').UserConfig} */
const config: UserConfig = {
	plugins: [sveltekit(), CommitHashPlugin({noPrefix:false,noVirtual:false})]
};

export default config;
```

## Attribution
Developed by [@ExponentialWorkload](https://github.com/Exponential-Workload)<br/>
Licensed under the [MIT License](./LICENSE)<br/>
Slightly inspired by [vite-plugin-git-revision](https://github.com/qduld/vite-plugin-git-revision)
