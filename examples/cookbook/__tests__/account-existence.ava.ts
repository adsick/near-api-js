import { workspace } from './utils'
import { providers} from 'near-api-js'

workspace.test('check account existence', async (test, { root, alice })=>{
    const config = workspace["container"]["config"];

    const module = require('../utils/check-account-existence')
    module.provider = new providers.JsonRpcProvider(config.rpcAddr);
    const { accountExists } = module

    test.false(await accountExists("nonexistentaccount.testnet"))
    test.log("check if root account exists")
    test.true(await accountExists(root.accountId))
    test.log("check if alice account exists")
    test.true(await accountExists(alice.accountId))
})