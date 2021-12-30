import { workspace } from './utils'
import { providers, KeyPair } from 'near-api-js'
const { path }  = require('path')
import { keyStores } from 'near-workspaces/node_modules/near-api-js';

workspace.test('deploy contract', async (test, { root, alice, status_message }) => {
    const config = alice["manager"]["config"];

    const module = require('../utils/deploy-contract')
    
    let ks = new keyStores.InMemoryKeyStore();
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());

    //tvhnzbocwmqi3srun4jLpnJXGw5mHXynK3vpyCRrLpJmLfemRManztyv4VJepWpuC1Y6ftw4sQxWDUjPjQU7Nf1
    //53y2QohkctpiwhQusvU2rEAtYTRxdyBYcBPV7C2AVyH5X9zs71q1g8UZhyWCn5bnjn3YaVTroR8LAVCPePTS6Ty7
    const PRIVATE_KEY = "tvhnzbocwmqi3srun4jLpnJXGw5mHXynK3vpyCRrLpJmLfemRManztyv4VJepWpuC1Y6ftw4sQxWDUjPjQU7Nf1"
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await ks.setKey('testnet', "adsick.testnet", keyPair);

    module.config.keyStore = ks
    module.config.networkId = 'testnet'
    module.config.nodeUrl = config.rpcAddr;
    const { deployContract } = module

    // test.truthy(await deployContract(alice.accountId, "__tests__/res/status_message.wasm"))
    test.truthy(await deployContract("adsick.testnet", "__tests__/res/status_message.wasm"))
})