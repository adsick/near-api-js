import { workspace } from './utils'
import { providers } from 'near-api-js'
const { path }  = require('path')
import { keyStores } from 'near-workspaces/node_modules/near-api-js';
workspace.test('deploy contract', async (test, { root, alice, status_message }) => {
    const config = alice["manager"]["config"];

    const module = require('../utils/deploy-contract')
    
    let ks = new keyStores.InMemoryKeyStore();
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());
    
    module.config.keyStore = ks
    module.config.networkId = 'sandbox'
    module.config.nodeUrl = config.rpcAddr;
    const { deployContract } = module

    test.truthy(await deployContract(alice.accountId, "__tests__/res/status_message.wasm"))
})