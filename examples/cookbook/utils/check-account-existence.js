// Demonstrates checking if an account exists
const { providers } = require("near-api-js");

exports.provider = new providers.JsonRpcProvider(
    "https://archival-rpc.testnet.near.org"
);

async function accountExists() {
    let rawResult;
    
    console.log('DEBUG, current rpc_addr: ' + (await exports.provider.status()).rpc_addr);
    console.log('DEBUG, current connection url: ' + exports.provider.connection.url);

    for (const account_id of ["does-not-exist.mike.testnet", "mike.testnet"]) {
        let succeeded = true;
        try {
            rawResult = await exports.provider.query({
                request_type: "view_account",
                account_id: account_id,
                finality: "final",
            });
        } catch (e) {
            if (e.type === 'AccountDoesNotExist') {
                succeeded = false;
            }
        }
        console.log(succeeded ? `The account ${account_id} exists.` : `There is no account ${account_id}.`)
    }
}

exports.accountExists = accountExists;
