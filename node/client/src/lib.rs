extern crate beacon;
extern crate network;
extern crate node_runtime;
extern crate parking_lot;
extern crate primitives;
extern crate storage;
#[macro_use]
extern crate log;

use beacon::chain::{BlockChain, ChainConfig};
use beacon::types::{BeaconBlock, BeaconBlockHeader};
use node_runtime::Runtime;
use parking_lot::RwLock;
use primitives::hash::CryptoHash;
use primitives::traits::{Block, GenericResult};
use primitives::types::{
    BLSSignature, BlockId, MerkleHash, SignedTransaction, ViewCall, ViewCallResult,
};
use std::sync::Arc;
use storage::{StateDb, Storage};

#[allow(dead_code)]
pub struct Client {
    state_db: RwLock<StateDb>,
    runtime: Runtime,
    last_root: RwLock<MerkleHash>,
    beacon_chain: BlockChain<BeaconBlock>,
    // transaction pool (put here temporarily)
    tx_pool: RwLock<Vec<SignedTransaction>>,
    // import queue for receiving blocks
    import_queue: RwLock<Vec<BeaconBlock>>,
}

impl Client {
    pub fn new(storage: Arc<Storage>) -> Self {
        let state_db = StateDb::new(storage.clone());
        let state_view = state_db.get_state_view();
        let chain_config = ChainConfig {
            extra_col: storage::COL_BEACON_EXTRA,
            header_col: storage::COL_BEACON_HEADERS,
            block_col: storage::COL_BEACON_BLOCKS,
            index_col: storage::COL_BEACON_INDEX,
        };
        let genesis = BeaconBlock::new(0, CryptoHash::default(), BLSSignature::default(), vec![]);
        Client {
            runtime: Runtime::default(),
            state_db: RwLock::new(state_db),
            last_root: RwLock::new(state_view),
            beacon_chain: BlockChain::new(chain_config, genesis, storage),
            tx_pool: RwLock::new(vec![]),
            import_queue: RwLock::new(vec![]),
        }
    }

    pub fn receive_transaction(&self, t: SignedTransaction) {
        debug!(target: "client", "receive transaction {:?}", t);
        self.tx_pool.write().push(t);
    }

    pub fn view_call(&self, view_call: &ViewCall) -> ViewCallResult {
        let mut state_db = self.state_db.write();
        self.runtime
            .view(&mut state_db, &self.last_root.read(), view_call)
    }

    pub fn handle_signed_transaction(&self, t: SignedTransaction) -> GenericResult {
        debug!(target: "client", "handle transaction {:?}", t);
        self.tx_pool.write().push(t);
        Ok(())
    }

    #[allow(unused)]
    fn validate_signature(&self, block: &BeaconBlock) -> bool {
        // TODO: validate multisig
        true
    }

    /// import a block. Returns true if it is successfully imported to the chain
    fn import_block(&self, block: BeaconBlock) -> bool {
        let parent_hash = block.header.parent_hash;
        if self.beacon_chain.is_known(&parent_hash) && self.validate_signature(&block) {
            let mut state_db = self.state_db.write();
            let transactions = block.transactions;
            let last_root = self.last_root.read();
            let (_, new_root) = self.runtime.apply(&mut state_db, &last_root, transactions);
            if new_root != block.header.merkle_root_tx {
                // TODO: something bad happened, what should we do
                unimplemented!();
            }
            true
        }
        else {
            self.import_queue.write().push(block);
            false
        }
    }
}

impl network::client::Client<BeaconBlock> for Client {
    fn get_block(&self, id: &BlockId) -> Option<BeaconBlock> {
        self.beacon_chain.get_block(id)
    }
    fn get_header(&self, id: &BlockId) -> Option<BeaconBlockHeader> {
        self.beacon_chain.get_header(id)
    }
    fn best_hash(&self) -> CryptoHash {
        let best_block = self.beacon_chain.best_block();
        best_block.hash()
    }
    fn best_index(&self) -> u64 {
        let best_block = self.beacon_chain.best_block();
        best_block.header().index
    }
    fn genesis_hash(&self) -> CryptoHash {
        self.beacon_chain.genesis_hash
    }
    fn import_blocks(&self, blocks: Vec<BeaconBlock>) {
        for block in blocks {
            // might not be the most efficient way to do this
            // also related to fork choice rule
            if self.import_block(block) {
                let old_queue = std::mem::replace(&mut *self.import_queue.write(), vec![]);
                for b in old_queue {
                    self.import_block(b);
                }
            }
        }
    }
    fn prod_block(&self) -> BeaconBlock {
        // TODO: compute actual merkle root and state, as well as signature, and
        // use some reasonable fork-choice rule
        let transactions = std::mem::replace(&mut *self.tx_pool.write(), vec![]);
        let parent_hash = self.best_hash();
        let index = self.best_index();
        BeaconBlock::new(
            index + 1,
            parent_hash,
            BLSSignature::default(),
            transactions,
        )
    }
}