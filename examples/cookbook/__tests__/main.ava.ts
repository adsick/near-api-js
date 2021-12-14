import { Workspace, NearAccount, BN, toYocto, MAINNET_RPC_ADDR, TESTNET_RPC_ADDR } from 'near-workspaces-ava';


async function initWorkspace(root: NearAccount) {
    const workspace = Workspace.init();

    const alice = await root.createAccount('alice');
    // console.log('current mainnet rpc address is: ', MAINNET_RPC_ADDR) //note, no these for 'sandbox'
    // console.log('current testnet rpc address is: ', TESTNET_RPC_ADDR)
    
    return { alice};
}

export const STORAGE_PER_BYTE = new BN('10000000000000000000');

export const workspace = Workspace.init(async ({ root }) => {
    return initWorkspace(root)
});
