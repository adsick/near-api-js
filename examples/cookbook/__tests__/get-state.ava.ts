import { workspace } from './utils'
import { providers } from 'near-api-js'

workspace.test('get state', async (test, { root, alice, status_message }) => {
    const config = status_message["manager"]["config"];

    //first we set alice's status to obtain it in the future
    await alice.call(status_message, 'set_status', { message: 'My name is Alice' })

    const module = require('../utils/get-state')
    module.provider = new providers.JsonRpcProvider(config.rpcAddr);
    const { getState } = module

    // now we can make sure that querying status message yields {"account_id": "alice.test.near"}
    test.is((await getState("status_message.test.near",
        'get_status',
        "eyJhY2NvdW50X2lkIjogImFsaWNlLnRlc3QubmVhciJ9Cg==")).result,
        'My name is Alice');
})