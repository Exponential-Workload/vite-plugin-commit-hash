const {execSync} = require('child_process');
const getCommit = ()=>encodeURIComponent(execSync('git describe --long --always --dirty --abbrev=10000').toString().trim())
let commit = getCommit();
let commitExpires = Date.now() + 10000
const virtualModuleId = 'virtual:commit-hash'
const resolvedVirtualModuleId = '\0'+virtualModuleId
const cachedCommitId = ()=>{
	if (Date.now() > commitExpires) {
		// ensure if you commit, it updates
		commit = getCommit();
		commitExpires = Date.now() + 10000
	}
	return commit
}
export const CommitHashPlugin = (config={noPrefix:false,noVirtual:false}) => {
	return {
		name: 'ExponentialWorkload: Git Commit Hash',
		transform: config.noPrefix ? undefined : (str,id) => {
			const commit = cachedCommitId()
			const filename = id.split('?')[0]
			if (filename.endsWith('.css'))
				str=`/** Commit ${commit} **/\n`+str
			else if (filename.endsWith('.js'))
				str=`// Commit ${commit}\n`+str
			return str;
		},
		resolveId(id) {
      if (!config.noVirtual && id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (!config.noVirtual && id === resolvedVirtualModuleId) {
        return `export const id = '${cachedCommitId()}';export default id;`
      }
    },
	}
}
export default CommitHashPlugin