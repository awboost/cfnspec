import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inspect } from 'util';
import {
  decodeCloudFormationSpec,
  decodePropertyType,
} from '../lib/CloudFormationSpec.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inpath = resolve(
  __dirname,
  '../src/__fixtures__/CloudFormationResourceSpecification.json',
);

const spec = JSON.parse(await readFile(inpath, 'utf8'));

if (process.argv[2] === 'first') {
  const first = Object.values(spec.PropertyTypes)[0];
  const result = decodePropertyType(first);

  if (result.ok) {
    console.log(`validated`);
  } else {
    console.log(`VALIDATION ERROR`);
    console.log(inspect(result.error, false, 10));
    console.log(inspect(first));
    process.exit(1);
  }
} else {
  const result = decodeCloudFormationSpec(spec);

  if (result.ok) {
    console.log(`validated`);
  } else {
    console.log(`VALIDATION ERROR`);
    console.log(inspect(result.error, false, 10));
    process.exit(1);
  }
}
