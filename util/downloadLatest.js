import { getLatestSpec } from '../lib/getLatestSpec.js';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, relative, resolve } from 'path';
import {
  decodeCloudFormationSpec,
  decodePropertyType,
} from '../lib/CloudFormationSpec.js';
import { inspect } from 'util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outpath = resolve(
  __dirname,
  '../src/__fixtures__/CloudFormationResourceSpecification.json',
);
const relpath = relative(resolve('.'), outpath);

console.log(`fetching latest spec...`);

const spec = await getLatestSpec(undefined, false);
await writeFile(outpath, JSON.stringify(spec));

console.log(`saved v${spec.ResourceSpecificationVersion} to ${relpath}`);
