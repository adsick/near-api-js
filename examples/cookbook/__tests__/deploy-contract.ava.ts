import { captureError } from 'near-workspaces';
import { workspace } from './utils'


workspace.test('deploy contract', async (test, { root, alice, status_message }) => {
    const config = alice["manager"]["config"];

    const module = require('../utils/deploy-contract')
    const keyStores = module.keyStores;
    let ks = new keyStores.InMemoryKeyStore();
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());

    module.config.keyStore = ks
    module.config.networkId = 'sandbox'
    module.config.nodeUrl = config.rpcAddr;
    const { deployContract } = module
    let result = await deployContract(alice.accountId, "__tests__/res/status_message.wasm");
    test.truthy(result)

    // now with wrong account id

    let result2 = await captureError(() => deployContract(alice.accountId + 'a', "__tests__/res/status_message.wasm"));
    test.true(result2.includes("Can not sign transactions for account"))
})
