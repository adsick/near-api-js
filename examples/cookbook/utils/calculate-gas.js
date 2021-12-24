const { connect, keyStores, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();
const chalk = require("chalk");

exports.CREDENTIALS_DIR = ".near-credentials";
exports.ACCOUNT_ID = "near-example.testnet";
exports.CONTRACT_ID = "guest-book.testnet";
exports.METHOD_NAME = "addMessage";
exports.MAX_GAS = "300000000000000";
exports.ATTACHED_DEPOSIT = "0";

const args = {
  text: "Howdy!",
};

const credentialsPath = path.join(homedir, exports.CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

exports.config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

//usage
calculateGas(exports.CONTRACT_ID, exports.METHOD_NAME, args, exports.ATTACHED_DEPOSIT);

async function calculateGas(contractId, methodName, args, depositAmount) {
  console.log('trying to connect with nodeUrl: ' + exports.config.nodeUrl)
  const near = await connect(exports.config);
  console.log('connected, getting ' + exports.ACCOUNT_ID + ' account')
  const account = await near.account(exports.ACCOUNT_ID);
  console.log('doing a function call')
  const result = await account.functionCall({
    contractId,
    methodName,
    args,
    gas: exports.MAX_GAS,
    attachedDeposit: utils.format.parseNearAmount(depositAmount),
  });
  console.log('done')
  const { totalGasBurned, totalTokensBurned } = result.receipts_outcome.reduce(
    (acc, receipt) => {
      acc.totalGasBurned += receipt.outcome.gas_burnt;
      acc.totalTokensBurned += utils.format.formatNearAmount(
        receipt.outcome.tokens_burnt
      );
      return acc;
    },
    {
      totalGasBurned: result.transaction_outcome.outcome.gas_burnt,
      totalTokensBurned: utils.format.formatNearAmount(
        result.transaction_outcome.outcome.tokens_burnt
      ),
    }
  );

  console.log(chalk`{white ------------------------------------------------------------------------ }`)
  console.log(chalk`{bold.green RESULTS} {white for: [ {bold.blue ${exports.METHOD_NAME}} ] called on contract: [ {bold.blue ${exports.CONTRACT_ID}} ]}` )
  console.log(chalk`{white ------------------------------------------------------------------------ }`)
  console.log(chalk`{bold.white Gas Burnt}     {white |}  {bold.yellow ${totalGasBurned}}`);
  console.log(chalk`{bold.white Tokens Burnt}  {white |}  {bold.yellow ${totalTokensBurned}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`)

  return {
    totalTokensBurned,
    totalGasBurned,
  };
}

exports.calculateGas = calculateGas;