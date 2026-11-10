import { affectedMain } from './affected-run.mjs';

process.exitCode = await affectedMain(process.argv.slice(2));
