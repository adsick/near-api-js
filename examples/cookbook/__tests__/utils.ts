import { Workspace, NearAccount, BN} from 'near-workspaces-ava';

// export let WC = null;

async function initWorkspace(root: NearAccount) {
    const workspace = Workspace.init();

    const alice = await root.createAccount('alice');
    const status_message = await root.createAndDeploy('status_message', '__tests__/res/status_message.wasm');
    // console.log('current mainnet rpc address is: ', MAINNET_RPC_ADDR) //note, no these for 'sandbox'
    // console.log('current testnet rpc address is: ', TESTNET_RPC_ADDR)
    
    return { alice, status_message};
}

export const STORAGE_PER_BYTE = new BN('10000000000000000000');

export const workspace = Workspace.init(async ({ root }) => {
    return initWorkspace(root)
});
