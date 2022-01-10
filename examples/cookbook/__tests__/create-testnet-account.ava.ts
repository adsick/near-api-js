import { workspace } from './utils'

workspace.test('create testnet account', async (test, { root, alice, linkdrop }) => {
    const config = linkdrop["manager"]["config"];

    const module = require('../accounts/create-testnet-account')
    module.config.networkId = "sandbox";
    module.config.nodeUrl = config.rpcAddr;

    let root_account_id = "linkdrop." + root.accountId;

    module.root = root_account_id;
    const { keyStores, createAccount } = module

    let ks = new keyStores.InMemoryKeyStore();
    await ks.setKey('sandbox', alice.accountId, await alice.getKey());

    module.config.keyStore = ks;

    let res = await createAccount(alice.accountId, "brandnew." + root_account_id, "0");
    test.log(res)
    test.truthy(res)
})