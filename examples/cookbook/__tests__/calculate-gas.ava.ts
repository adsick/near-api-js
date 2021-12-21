import { workspace } from './main.ava'
import { fork, exec } from 'child_process'
import { providers } from 'near-api-js'
import { KeyStore } from 'near-workspaces-ava';
import { keyStores } from 'near-workspaces/node_modules/near-api-js';
import { InMemoryKeyStore } from 'near-workspaces/node_modules/near-api-js/lib/key_stores';

workspace.test('calculate gas', async (test, { root, alice })=>{
    const status_message = await root.createAndDeploy('status-message', '__tests__/res/status_message.wasm');
    // console.log(status_message)
    const config = workspace["container"]["config"];
    // console.log(config)
    
    const module = require('../utils/calculate-gas.js')
    const { calculateGas } = module

    module.ACCOUNT_ID = alice.accountId;
    const CONTRACT_ID = status_message.accountId;
    const METHOD_NAME = 'set_status';
    const ATTACHED_DEPOSIT = "0";

    const args = {
        message: "Working on tests for near-api-js...",
    };

    let kp = await alice.getKey();

    let ks = new keyStores.InMemoryKeyStore()
    ks.setKey('sandbox', alice.accountId, kp);

    console.log(ks)

    module.config.keyStore = ks
    module.config.networkId = 'sandbox'
    module.config.nodeUrl = config.rpcAddr 

    console.log(await calculateGas(CONTRACT_ID, METHOD_NAME, args, ATTACHED_DEPOSIT))

    // test.false(await accountExists("nonexistentaccount.testnet"))
    // test.log("check if root account exists")
    // test.true(await accountExists(root.accountId))
    // test.log("check if alice account exists")
    // test.true(await accountExists(alice.accountId))
})