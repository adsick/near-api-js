import { workspace } from './utils'
import { providers } from 'near-api-js'
import { keyStores } from 'near-workspaces/node_modules/near-api-js';

//note: any ideas on negative test here?

workspace.test('verify signature', async (test, { root, alice, status_message }) => {
    const config = alice["manager"]["config"];

    const module = require('../utils/verify-signature')
    
    let ks = new keyStores.InMemoryKeyStore();
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());
    console.log("debug get key: ", ks.getKey('sandbox', alice.accountId))
    module.config.keyStore = ks
    module.config.networkId = 'sandbox'
    module.config.nodeUrl = config.rpcAddr;
    const { verifySignature } = module

    test.true(await verifySignature(alice.accountId))
})