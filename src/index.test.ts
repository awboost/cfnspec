import { readFileSync } from 'fs';
import 'jest';
import { resolve } from 'path';
import { decodeCloudFormationSpec } from './CloudFormationSpec.js';

describe('getLatestSpec', () => {
  it('it validates the current spec without failing', async () => {
    const spec = JSON.parse(
      readFileSync(
        resolve(
          __dirname,
          '__fixtures__/CloudFormationResourceSpecification.json',
        ),
        'utf8',
      ),
    );
    const result = decodeCloudFormationSpec(spec);

    if (!result.ok) {
      console.error('errors:', result.error[0]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).error).toBeUndefined();
  });
});
