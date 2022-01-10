const HELP = `Please run this script in the following format:

    node create-testnet-account.js CREATOR_ACCOUNT.testnet NEW_ACCOUNT.testnet AMOUNT
`;

const { connect, KeyPair, keyStores, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

exports.config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

exports.root = "testnet";

async function createAccount(creatorAccountId, newAccountId, amount) {
  const near = await connect(exports.config);
  const creatorAccount = await near.account(creatorAccountId);
  const keyPair = KeyPair.fromRandom("ed25519");
  const publicKey = keyPair.publicKey.toString();
  await keyStore.setKey(exports.config.networkId, newAccountId, keyPair);

  return await creatorAccount.functionCall({
    contractId: exports.root,
    methodName: "create_account",
    args: {
      new_account_id: newAccountId,
      new_public_key: publicKey,
    },
    gas: "300000000000000",
    attachedDeposit: utils.format.parseNearAmount(amount),
  });
}

exports.keyStores = keyStores;
exports.createAccount = createAccount;

if (process.argv.length !== 5) {
  console.info(HELP);

} else {
  createAccount(process.argv[2], process.argv[3], process.argv[4]);
}
