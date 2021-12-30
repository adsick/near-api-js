const { keyStores, connect, Near, KeyPair } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const { baseEncode } = require("borsh");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
const ACCOUNT_ID = "near-example.testnet"; //your target here
const WASM_PATH = path.join(__dirname, "/wasm-files/status_message.wasm");
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

exports.config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

// usage
// deployContract(ACCOUNT_ID, WASM_PATH);

// deployContract("adsick.testnet", WASM_PATH)

async function deployContract(account_id, wasmPath) {
    //debug, trying to find difference between key objects
    console.log(await keyStore.getKey('testnet', 'adsick.testnet'))
    // console.log(await exports.config.keyStore.getKey('sandbox', account_id))

    // const account_id = "adsick.testnet";

    // a 'normal' key store with which everything works fine
    // const CREDENTIALS_DIR = ".near-credentials";
    // const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
    // const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
    
    // let inMemoryKeyStore = new keyStores.InMemoryKeyStore();
    // const PRIVATE_KEY = "tvhnzbocwmqi3srun4jLpnJXGw5mHXynK3vpyCRrLpJmLfemRManztyv4VJepWpuC1Y6ftw4sQxWDUjPjQU7Nf1"
    // const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // await inMemoryKeyStore.setKey('testnet', account_id, keyPair);

    // exports.config.keyStore = inMemoryKeyStore;

    const near = await connect(exports.config);
    // console.log(near, '\n')
    const account = await near.account(account_id);
    // console.log(account, '\n')

    // example of signing some message (works both times)
    let sign = await account.connection.signer.signMessage(
        "message",
        account_id,
        exports.config.networkId);
    
    // ensure that there is a proper key.
    console.log('public key: ', sign.publicKey);
    console.log('debug: ', account.connection.signer);


    // fails with 'no key found...' error
    const result = await account.deployContract(fs.readFileSync(wasmPath));

    console.log(result);

    return result
}

exports.deployContract = deployContract;

    /*  
    Error (BorshError) {
        fieldPath: [
            'publicKey',
          ],
          originalMessage: 'Class PublicKey is missing in schema',
          message: 'Class PublicKey is missing in schema: publicKey',
        } 
    */