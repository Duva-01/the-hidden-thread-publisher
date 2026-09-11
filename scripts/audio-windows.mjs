// Use the shared HyperFrames engine on Windows without changing installed skills.
import cp from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {join,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const spawn = cp.spawn;
cp.spawn = function(command,args,options) {
  if (command === 'npx') return spawn(process.execPath,[join(dirname(process.execPath),'node_modules/npm/bin/npx-cli.js'),...args],options);
  return spawn(command,args,options);
};
syncBuiltinESMExports();
await import(pathToFileURL('C:/Users/Usuario/.codex/skills/hyperframes-media/scripts/audio.mjs'));
