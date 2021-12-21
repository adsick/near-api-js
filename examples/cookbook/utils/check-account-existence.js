// Demonstrates checking if an account exists
const { providers } = require("near-api-js");

exports.provider = new providers.JsonRpcProvider(
    "https://archival-rpc.testnet.near.org"
);

async function accountExists(account_id) {
    let rawResult;
    
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
    return succeeded;
}

async function accountsExist() {
    console.log('current connection url: ' + exports.provider.connection.url);

    for (const account_id of ["does-not-exist.mike.testnet", "mike.testnet"]) {
        let succeeded = await accountExists(account_id);
        console.log(succeeded ? `The account ${account_id} exists.` : `There is no account ${account_id}.`)
    }
}

// accountsExist();

exports.accountExists = accountExists;
exports.accountsExist = accountsExist;
