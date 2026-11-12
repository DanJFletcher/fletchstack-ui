import { publishStyles } from './component-styles.mjs';
import inventory from './component-inventory.json' with { type: 'json' };

await publishStyles(inventory.families);
