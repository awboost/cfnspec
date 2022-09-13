import 'jest';
import { decodeCloudFormationSpec } from './CloudFormationSpec.js';
import { DefaultSpecUrl, getLatestSpec } from './getLatestSpec.js';

describe('getLatestSpec', () => {
  it('it validates the current spec without failing', async () => {
    const spec = await getLatestSpec(DefaultSpecUrl, false);
    const result = decodeCloudFormationSpec(spec);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).error).toBeUndefined();
  });
});
