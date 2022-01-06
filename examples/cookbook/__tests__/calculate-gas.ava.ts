import { workspace } from './utils'
// import { keyStores } from 'near-workspaces/node_modules/near-api-js';

workspace.test('calculate gas', async (test, { root, alice, status_message })=>{
   
    // console.log(status_message)
    const config = status_message["manager"]["config"];
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

    const keyStores = module.keyStores;

    let ks = new keyStores.InMemoryKeyStore()
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());

    module.config.keyStore = ks
    module.config.networkId = 'sandbox'
    module.config.nodeUrl = config.rpcAddr 

    console.log(module.config)

    let {totalTokensBurned, totalGasBurned} = await calculateGas(CONTRACT_ID, METHOD_NAME, args, ATTACHED_DEPOSIT);
    console.log(totalTokensBurned);
    test.true(totalTokensBurned > 0.0)
    test.true(totalGasBurned > 1)
})
