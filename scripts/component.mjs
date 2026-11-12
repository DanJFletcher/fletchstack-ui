import { componentMain } from './component-command.mjs';

process.exitCode = componentMain(process.argv.slice(2));
