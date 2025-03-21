import { strict as assert } from 'assert';
import { withFixtures } from '../helpers';
import { loginWithBalanceValidation } from '../page-objects/flows/login.flow';
import FixtureBuilder from '../fixture-builder';
import { Driver } from '../webdriver/driver';

describe('eth_estimateGas', function () {
  it('executes a estimate gas json rpc call', async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        title: this.test?.fullTitle(),
      },
      async ({ driver }: { driver: Driver }) => {
        await loginWithBalanceValidation(driver);

        // eth_estimateGas
        await driver.openNewPage(`http://127.0.0.1:8080`);

        const estimateGas: string = JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_estimateGas',
          params: [
            {
              to: '0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
              from: '0x5cfe73b6021e818b776b421b1c4db2474086a7e1',
            },
          ],
        });

        const estimateGasRequest: string = (await driver.executeScript(
          `return window.ethereum.request(${estimateGas})`,
        )) as string;

        assert.strictEqual(estimateGasRequest, '0x5208');
      },
    );
  });
});
