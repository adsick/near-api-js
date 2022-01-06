// demonstrates how to query the state without setting 
// up an account. (View methods only)
const { providers } = require("near-api-js");
//network config (replace testnet with mainnet or betanet)
exports.provider = new providers.JsonRpcProvider(
  "https://rpc.testnet.near.org"
);

async function getState(account_id, method_name, args_base64) {

  console.log('trying to query...')
  console.log(exports.provider)

  const view_query = {
    request_type: "call_function",
    account_id: account_id || "guest-book.testnet",
    method_name: method_name || "getMessages",
    args_base64: args_base64 || "e30=", //"{}"
    finality: "optimistic",
  };

  console.log(view_query)

  let rawResult;

  try {
    rawResult = await exports.provider.query(view_query)
  } catch(e){
    console.log('ERROR: ' + e)
  }

  console.log('finished query')

  // format result
  const result = JSON.parse(Buffer.from(rawResult.result).toString());
  return {result, logs: rawResult.logs};
}

// getState();

exports.getState = getState;