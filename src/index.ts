import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';

const getCommit = (): string => {
  try {
    return encodeURIComponent(
      execSync('git describe --long --always --dirty --abbrev=10000')
        .toString()
        .trim(),
    );
  } catch (error) {
    if (!existsSync('.git')) {
      return '.git-not-found';
    } else {
      console.warn('nonfatal<git>: Git errored', error);
      return 'unknown-commit';
    }
  }
};

let commit = getCommit();
let commitExpires = Date.now() + 10000;
const virtualModuleId = 'virtual:commit-hash';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

const cachedCommitId = (): string => {
  if (Date.now() > commitExpires) {
    // Ensure if you commit, it updates
    commit = getCommit();
    commitExpires = Date.now() + 10000;
  }
  return commit;
};

export const CommitHashPlugin = (
  config = { noPrefix: false, noVirtual: false },
) => {
  const filter = createFilter(['**/*.js', '**/*.css'], null, {
    resolve: false,
  });

  return {
    name: 'ExponentialWorkload: Git Commit Hash',
    transform(code: string, id: string) {
      if (!filter(id)) return null;

      const commit = cachedCommitId();
      const s = new MagicString(code);

      if (id.endsWith('.css')) {
        s.prepend(`/** Commit ${commit} **/\n`);
      } else if (id.endsWith('.js')) {
        s.prepend(`// Commit ${commit}\n`);
      }

      const map = s.generateMap({
        source: id,
        hires: true,
      });

      return { code: s.toString(), map };
    },
    resolveId(id: string) {
      if (!config.noVirtual && id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (!config.noVirtual && id === resolvedVirtualModuleId) {
        return `export const id = '${cachedCommitId()}';
export default id;
`;
      }
    },
  };
};

export default CommitHashPlugin;
