'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var Address = function Address() {
  classCallCheck(this, Address);
};

var BlockNumber = function BlockNumber() {
  classCallCheck(this, BlockNumber);
};

var Data = function Data() {
  classCallCheck(this, Data);
};

var Hash = function Hash() {
  classCallCheck(this, Hash);
};

var Integer = function Integer() {
  classCallCheck(this, Integer);
};

var Quantity = function Quantity() {
  classCallCheck(this, Quantity);
};

var db = {
  getHex: {
    desc: 'Returns binary data from the local database.',
    params: [{
      type: String,
      desc: 'Database name'
    }, {
      type: String,
      desc: 'Key name'
    }],
    returns: {
      type: Data,
      desc: 'The previously stored data'
    },
    deprecated: true
  },

  getString: {
    desc: 'Returns string from the local database.',
    params: [{
      type: String,
      desc: 'Database name'
    }, {
      type: String,
      desc: 'Key name'
    }],
    returns: {
      type: String,
      desc: 'The previously stored string'
    },
    deprecated: true
  },

  putHex: {
    desc: 'Stores binary data in the local database.',
    params: [{
      type: String,
      desc: 'Database name'
    }, {
      type: String,
      desc: 'Key name'
    }, {
      type: Data,
      desc: 'The data to store'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the value was stored, otherwise `false`'
    },
    deprecated: true
  },

  putString: {
    desc: 'Stores a string in the local database.',
    params: [{
      type: String,
      desc: 'Database name'
    }, {
      type: String,
      desc: 'Key name'
    }, {
      type: String,
      desc: 'The string to store'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the value was stored, otherwise `false`'
    },
    deprecated: true
  }
};

var vap = {
  accounts: {
    desc: 'Returns a list of addresses owned by client.',
    params: [],
    returns: {
      type: Array,
      desc: '20 Bytes - addresses owned by the client'
    }
  },

  blockNumber: {
    desc: 'Returns the number of most recent block.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'integer of the current block number the client is on'
    }
  },

  call: {
    desc: 'Executes a new message call immediately without creating a transaction on the block chain.',
    params: [{
      type: Object,
      desc: 'The transaction call object',
      format: 'inputCallFormatter',
      details: {
        from: {
          type: Address,
          desc: '20 Bytes - The address the transaction is send from',
          optional: true
        },
        to: {
          type: Address,
          desc: '20 Bytes  - The address the transaction is directed to'
        },
        gas: {
          type: Quantity,
          desc: 'Integer of the gas provided for the transaction execution. vap_call consumes zero gas, but this parameter may be needed by some executions',
          optional: true
        },
        gasPrice: {
          type: Quantity,
          desc: 'Integer of the gasPrice used for each paid gas',
          optional: true
        },
        value: {
          type: Quantity,
          desc: 'Integer of the value send with this transaction',
          optional: true
        },
        data: {
          type: Data,
          desc: 'Hash of the method signature and encoded parameters. For details see [Vapory Contract ABI](https://github.com/vaporyco/wiki/wiki/Vapory-Contract-ABI)',
          optional: true
        }
      }
    }, {
      type: BlockNumber,
      desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`, see the [default block parameter](#the-default-block-parameter)',
      format: 'inputDefaultBlockNumberFormatter'
    }],
    returns: {
      type: Data,
      desc: 'the return value of executed contract'
    }
  },

  coinbase: {
    desc: 'Returns the client coinbase address.',
    params: [],
    returns: {
      type: Address,
      desc: 'The current coinbase address'
    }
  },

  compileSerpent: {
    desc: 'Returns compiled serpent code.',
    params: [{
      type: String,
      desc: 'The source code'
    }],
    returns: {
      type: Data,
      desc: 'The compiled source code'
    }
  },

  compileSolidity: {
    desc: 'Returns compiled solidity code.',
    params: [{
      type: String,
      desc: 'The source code'
    }],
    returns: {
      type: Data,
      desc: 'The compiled source code'
    }
  },

  compileLLL: {
    desc: 'Returns compiled LLL code.',
    params: [{
      type: String,
      desc: 'The source code'
    }],
    returns: {
      type: Data,
      desc: 'The compiled source code'
    }
  },

  estimateGas: {
    desc: 'Makes a call or transaction, which won\'t be added to the blockchain and returns the used gas, which can be used for estimating the used gas.',
    params: [{
      type: Object,
      desc: 'see [vap_sendTransaction](#vap_sendTransaction)',
      format: 'inputCallFormatter'
    }],
    returns: {
      type: Quantity,
      desc: 'The amount of gas used',
      format: 'utils.toDecimal'
    }
  },

  fetchQueuedTransactions: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  flush: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  gasPrice: {
    desc: 'Returns the current price per gas in wei.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'integer of the current gas price in wei'
    }
  },

  getBalance: {
    desc: 'Returns the balance of the account of given address.',
    params: [{
      type: Address,
      desc: '20 Bytes - address to check for balance',
      format: 'inputAddressFormatter'
    }, {
      type: BlockNumber,
      desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`, see the [default block parameter](#the-default-block-parameter)',
      format: 'inputDefaultBlockNumberFormatter'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the current balance in wei',
      format: 'outputBigNumberFormatter'
    }
  },

  getBlockByHash: {
    desc: 'Returns information about a block by hash.',
    params: [{
      type: Hash,
      desc: 'Hash of a block'
    }, {
      type: Boolean,
      desc: 'If `true` it returns the full transaction objects, if `false` only the hashes of the transactions'
    }],
    returns: {
      type: Object,
      desc: 'A block object, or `null` when no block was found',
      details: {
        number: {
          type: Quantity,
          desc: 'The block number. `null` when its pending block'
        },
        hash: {
          type: Hash,
          desc: '32 Bytes - hash of the block. `null` when its pending block'
        },
        parentHash: {
          type: Hash,
          desc: '32 Bytes - hash of the parent block'
        },
        nonce: {
          type: Data,
          desc: '8 Bytes - hash of the generated proof-of-work. `null` when its pending block'
        },
        sha3Uncles: {
          type: Data,
          desc: '32 Bytes - SHA3 of the uncles data in the block'
        },
        logsBloom: {
          type: Data,
          desc: '256 Bytes - the bloom filter for the logs of the block. `null` when its pending block'
        },
        transactionsRoot: {
          type: Data,
          desc: '32 Bytes - the root of the transaction trie of the block'
        },
        stateRoot: {
          type: Data,
          desc: '32 Bytes - the root of the final state trie of the block'
        },
        receiptsRoot: {
          type: Data, desc: '32 Bytes - the root of the receipts trie of the block'
        },
        miner: {
          type: Address,
          desc: '20 Bytes - the address of the beneficiary to whom the mining rewards were given'
        },
        difficulty: {
          type: Quantity,
          desc: 'integer of the difficulty for this block'
        },
        totalDifficulty: {
          type: Quantity,
          desc: 'integer of the total difficulty of the chain until this block'
        },
        extraData: {
          type: Data,
          desc: 'the \'extra data\' field of this block'
        },
        size: {
          type: Quantity,
          desc: 'integer the size of this block in bytes'
        },
        gasLimit: {
          type: Quantity,
          desc: 'the maximum gas allowed in this block'
        },
        gasUsed: {
          type: Quantity,
          desc: 'the total used gas by all transactions in this block'
        },
        timestamp: {
          type: Quantity,
          desc: 'the unix timestamp for when the block was collated'
        },
        transactions: {
          type: Array,
          desc: 'Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter'
        },
        uncles: {
          type: Array,
          desc: 'Array of uncle hashes'
        }
      }
    }
  },

  getBlockByNumber: {
    desc: 'Returns information about a block by block number.',
    params: [{
      type: BlockNumber,
      desc: 'integer of a block number, or the string `\'earliest\'`, `\'latest\'` or `\'pending\'`, as in the [default block parameter](#the-default-block-parameter)'
    }, {
      type: Boolean,
      desc: 'If `true` it returns the full transaction objects, if `false` only the hashes of the transactions'
    }],
    returns: 'See [vap_getBlockByHash](#vap_getblockbyhash)'
  },

  getBlockTransactionCountByHash: {
    desc: 'Returns the number of transactions in a block from a block matching the given block hash.',
    params: [{
      type: Hash,
      desc: '32 Bytes - hash of a block'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the number of transactions in this block'
    }
  },

  getBlockTransactionCountByNumber: {
    desc: 'Returns the number of transactions in a block from a block matching the given block number.',
    params: [{
      type: BlockNumber,
      desc: 'integer of a block number, or the string `\'earliest\'`, `\'latest\'` or `\'pending\'`, as in the [default block parameter](#the-default-block-parameter)'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the number of transactions in this block'
    }
  },

  getCode: {
    desc: 'Returns code at a given address.',
    params: [{
      type: Address,
      desc: '20 Bytes - address',
      format: 'inputAddressFormatter'
    }, {
      type: BlockNumber,
      desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`, see the [default block parameter](#the-default-block-parameter)',
      format: 'inputDefaultBlockNumberFormatter'
    }],
    returns: {
      type: Data,
      desc: 'the code from the given address'
    }
  },

  getCompilers: {
    desc: 'Returns a list of available compilers in the client.',
    params: [],
    returns: {
      type: Array,
      desc: 'Array of available compilers'
    }
  },

  getFilterChanges: {
    desc: 'Polling method for a filter, which returns an array of logs which occurred since last poll.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: {
      type: Array,
      desc: 'Array of log objects, or an empty array if nothing has changed since last poll'
    }
  },

  getFilterChangesEx: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  getFilterLogs: {
    desc: 'Returns an array of all logs matching filter with given id.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: 'See [vap_getFilterChanges](#vap_getfilterchanges)'
  },

  getFilterLogsEx: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  getLogs: {
    desc: 'Returns an array of all logs matching a given filter object.',
    params: [{
      type: Object,
      desc: 'The filter object, see [vap_newFilter parameters](#vap_newfilter)'
    }],
    returns: 'See [vap_getFilterChanges](#vap_getfilterchanges)'
  },

  getLogsEx: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  getStorageAt: {
    desc: 'Returns the value from a storage position at a given address.',
    params: [{
      type: Address,
      desc: '20 Bytes - address of the storage'
    }, {
      type: Quantity,
      desc: 'integer of the position in the storage',
      format: 'utils.toHex'
    }, {
      type: BlockNumber,
      desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`, see the [default block parameter](#the-default-block-parameter)',
      format: 'inputDefaultBlockNumberFormatter'
    }],
    returns: {
      type: Data,
      desc: 'the value at this storage position'
    }
  },

  getTransactionByHash: {
    desc: 'Returns the information about a transaction requested by transaction hash.',
    params: [{
      type: Hash,
      desc: '32 Bytes - hash of a transaction'
    }],
    returns: {
      type: Object,
      desc: 'A transaction object, or `null` when no transaction was found:',
      format: 'outputTransactionFormatter',
      details: {
        hash: {
          type: Hash,
          desc: '32 Bytes - hash of the transaction.'
        },
        nonce: {
          type: Quantity,
          desc: 'the number of transactions made by the sender prior to this one.'
        },
        blockHash: {
          type: Hash,
          desc: '32 Bytes - hash of the block where this transaction was in. `null` when its pending.'
        },
        blockNumber: {
          type: BlockNumber,
          desc: 'block number where this transaction was in. `null` when its pending.'
        },
        transactionIndex: {
          type: Quantity,
          desc: 'integer of the transactions index position in the block. `null` when its pending.'
        },
        from: {
          type: Address,
          desc: '20 Bytes - address of the sender.'
        },
        to: {
          type: Address,
          desc: '20 Bytes - address of the receiver. `null` when its a contract creation transaction.'
        },
        value: {
          type: Quantity,
          desc: 'value transferred in Wei.'
        },
        gasPrice: {
          type: Quantity,
          desc: 'gas price provided by the sender in Wei.'
        },
        gas: {
          type: Quantity,
          desc: 'gas provided by the sender.'
        },
        input: {
          type: Data,
          desc: 'the data send along with the transaction.'
        }
      }
    }
  },

  getTransactionByBlockHashAndIndex: {
    desc: 'Returns information about a transaction by block hash and transaction index position.',
    params: [{
      type: Hash,
      desc: 'hash of a block'
    }, {
      type: Quantity,
      desc: 'integer of the transaction index position'
    }],
    returns: 'See [vap_getBlockByHash](#vap_gettransactionbyhash)'
  },

  getTransactionByBlockNumberAndIndex: {
    desc: 'Returns information about a transaction by block number and transaction index position.',
    params: [{
      type: BlockNumber,
      desc: 'a block number, or the string `\'earliest\'`, `\'latest\'` or `\'pending\'`, as in the [default block parameter](#the-default-block-parameter)'
    }, {
      type: Quantity,
      desc: 'The transaction index position'
    }],
    returns: 'See [vap_getBlockByHash](#vap_gettransactionbyhash)'
  },

  getTransactionCount: {
    desc: 'Returns the number of transactions *sent* from an address.',
    params: [{
      type: Address,
      desc: '20 Bytes - address'
    }, {
      type: BlockNumber,
      desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`, see the [default block parameter](#the-default-block-parameter)',
      format: 'inputDefaultBlockNumberFormatter'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the number of transactions send from this address',
      format: 'utils.toDecimal'
    }
  },

  getTransactionReceipt: {
    desc: 'Returns the receipt of a transaction by transaction hash.\n**Note** That the receipt is not available for pending transactions.',
    params: [{
      type: Hash,
      desc: 'hash of a transaction'
    }],
    returns: {
      type: Object,
      desc: 'A transaction receipt object, or `null` when no receipt was found:',
      format: 'outputTransactionReceiptFormatter',
      details: {
        transactionHash: {
          type: Hash,
          desc: '32 Bytes - hash of the transaction.'
        },
        transactionIndex: {
          type: Quantity,
          desc: 'integer of the transactions index position in the block.'
        },
        blockHash: {
          type: Hash,
          desc: '32 Bytes - hash of the block where this transaction was in.'
        },
        blockNumber: {
          type: BlockNumber,
          desc: 'block number where this transaction was in.'
        },
        cumulativeGasUsed: {
          type: Quantity,
          desc: 'The total amount of gas used when this transaction was executed in the block.'
        },
        gasUsed: {
          type: Quantity,
          desc: 'The amount of gas used by this specific transaction alone.'
        },
        contractAddress: {
          type: Address,
          desc: '20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.'
        },
        logs: {
          type: Array,
          desc: 'Array of log objects, which this transaction generated.'
        }
      }
    }
  },

  getUncleByBlockHashAndIndex: {
    desc: 'Returns information about a uncle of a block by hash and uncle index position.',
    params: [{
      type: Hash,
      desc: 'Hash a block'
    }, {
      type: Quantity,
      desc: 'The uncle\'s index position'
    }],
    returns: 'See [vap_getBlockByHash](#vap_getblockbyhash)'
  },

  getUncleByBlockNumberAndIndex: {
    desc: 'Returns information about a uncle of a block by number and uncle index position.',
    params: [{
      type: BlockNumber,
      desc: 'a block number, or the string `\'earliest\'`, `\'latest\'` or `\'pending\'`, as in the [default block parameter](#the-default-block-parameter)'
    }, {
      type: Quantity,
      desc: 'The uncle\'s index position'
    }],
    returns: 'See [vap_getBlockByHash](#vap_getblockbyhash)'
  },

  getUncleCountByBlockHash: {
    desc: 'Returns the number of uncles in a block from a block matching the given block hash.',
    params: [{
      type: Hash,
      desc: '32 Bytes - hash of a block'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the number of uncles in this block'
    }
  },

  getUncleCountByBlockNumber: {
    desc: 'Returns the number of uncles in a block from a block matching the given block number.',
    params: [{
      type: BlockNumber,
      desc: 'integer of a block number, or the string \'latest\', \'earliest\' or \'pending\', see the [default block parameter](#the-default-block-parameter)'
    }],
    returns: {
      type: Quantity,
      desc: 'integer of the number of uncles in this block'
    }
  },

  getWork: {
    desc: 'Returns the hash of the current block, the seedHash, and the boundary condition to be met (\'target\').',
    params: [],
    returns: {
      type: Array,
      desc: 'Array with the following properties:'
    }
  },

  hashrate: {
    desc: 'Returns the number of hashes per second that the node is mining with.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'number of hashes per second'
    }
  },

  inspectTransaction: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  mining: {
    desc: 'Returns `true` if client is actively mining new blocks.',
    params: [],
    returns: {
      type: Boolean,
      desc: '`true` of the client is mining, otherwise `false`'
    }
  },

  newBlockFilter: {
    desc: 'Creates a filter in the node, to notify when a new block arrives.\nTo check if the state has changed, call [vap_getFilterChanges](#vap_getfilterchanges).',
    params: [],
    returns: {
      type: Quantity,
      desc: 'A filter id'
    }
  },

  newFilter: {
    desc: 'Creates a filter object, based on filter options, to notify when the state changes (logs).\nTo check if the state has changed, call [vap_getFilterChanges](#vap_getfilterchanges).',
    params: [],
    returns: {
      type: Object,
      desc: 'The filter options:',
      details: {
        fromBlock: {
          type: BlockNumber,
          desc: 'Integer block number, or `\'latest\'` for the last mined block or `\'pending\'`, `\'earliest\'` for not yet mined transactions.',
          optional: true,
          default: 'latest'
        },
        toBlock: {
          type: BlockNumber,
          desc: 'Integer block number, or `\'latest\'` for the last mined block or `\'pending\'`, `\'earliest\'` for not yet mined transactions.',
          optional: true,
          default: 'latest'
        },
        address: {
          type: Address,
          desc: '20 Bytes - Contract address or a list of addresses from which logs should originate.',
          optional: true
        },
        topics: {
          type: Array,
          desc: 'Array of 32 Bytes `DATA` topics. Topics are order-dependent. Each topic can also be an array of DATA with \'or\' options.',
          optional: true
        }
      }
    }
  },

  newFilterEx: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  newPendingTransactionFilter: {
    desc: 'Creates a filter in the node, to notify when new pending transactions arrive.\nTo check if the state has changed, call [vap_getFilterChanges](#vap_getfilterchanges).',
    params: [],
    returns: {
      type: Quantity,
      desc: 'A filter id'
    }
  },

  notePassword: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  pendingTransactions: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  protocolVersion: {
    desc: 'Returns the current vapory protocol version.',
    params: [],
    returns: {
      type: String,
      desc: 'The current vapory protocol version'
    }
  },

  register: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  sendRawTransaction: {
    desc: 'Creates new message call transaction or a contract creation for signed transactions.',
    params: [{
      type: Data,
      desc: 'The signed transaction data'
    }],
    returns: {
      type: Hash,
      desc: '32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available'
    }
  },

  sendTransaction: {
    desc: 'Creates new message call transaction or a contract creation, if the data field contains code.',
    params: [{
      type: Object, desc: 'The transaction object',
      format: 'inputTransactionFormatter',
      details: {
        from: {
          type: Address,
          desc: '20 Bytes - The address the transaction is send from'
        },
        to: {
          type: Address,
          desc: '20 Bytes - (optional when creating new contract) The address the transaction is directed to'
        },
        gas: {
          type: Quantity,
          desc: 'Integer of the gas provided for the transaction execution. It will return unused gas.',
          optional: true,
          default: 90000
        },
        gasPrice: {
          type: Quantity,
          desc: 'Integer of the gasPrice used for each paid gas',
          optional: true,
          default: 'To-Be-Determined'
        },
        value: {
          type: Quantity,
          desc: 'Integer of the value send with this transaction',
          optional: true
        },
        data: {
          type: Data,
          desc: 'The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see [Vapory Contract ABI](https://github.com/vaporyco/wiki/wiki/Vapory-Contract-ABI)'
        },
        nonce: {
          type: Quantity,
          desc: 'Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.',
          optional: true
        }
      }
    }],
    returns: {
      type: Hash,
      desc: '32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available'
    }
  },

  sign: {
    desc: 'Signs data with a given address.\n**Note** the address to sign must be unlocked.',
    params: [{
      type: Address,
      desc: '20 Bytes - address',
      format: 'inputAddressFormatter'
    }, {
      type: Data,
      desc: 'Data to sign'
    }],
    returns: {
      type: Data,
      desc: 'Signed data'
    }
  },

  signTransaction: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  submitWork: {
    desc: 'Used for submitting a proof-of-work solution.',
    params: [{
      type: Data,
      desc: '8 Bytes - The nonce found (64 bits)'
    }, {
      type: Data,
      desc: '32 Bytes - The header\'s pow-hash (256 bits)'
    }, {
      type: Data,
      desc: '32 Bytes - The mix digest (256 bits)'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the provided solution is valid, otherwise `false`'
    }
  },

  submitHashrate: {
    desc: 'Used for submitting mining hashrate.',
    params: [{
      type: Data,
      desc: 'a hexadecimal string representation (32 bytes) of the hash rate'
    }, {
      type: String,
      desc: 'A random hexadecimal(32 bytes) ID identifying the client'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if submitting went through succesfully and `false` otherwise'
    }
  },

  syncing: {
    desc: 'Returns an object with data about the sync status or `false`.',
    params: [],
    returns: {
      type: Object,
      desc: 'An object with sync status data or `FALSE`, when not syncing',
      format: 'outputSyncingFormatter',
      details: {
        startingBlock: {
          type: Quantity,
          desc: 'The block at which the import started (will only be reset, after the sync reached his head)'
        },
        currentBlock: {
          type: Quantity,
          desc: 'The current block, same as vap_blockNumber'
        },
        highestBlock: {
          type: Quantity,
          desc: 'The estimated highest block'
        }
      }
    }
  },

  uninstallFilter: {
    desc: 'Uninstalls a filter with given id. Should always be called when watch is no longer needed.\nAdditonally Filters timeout when they aren\'t requested with [vap_getFilterChanges](#vap_getfilterchanges) for a period of time.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the filter was successfully uninstalled, otherwise `false`'
    }
  },

  unregister: {
    desc: '?',
    params: ['?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  }
};

var vapcore = {
  acceptNonReservedPeers: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  addReservedPeer: {
    desc: '?',
    params: [{
      type: String,
      desc: 'Enode'
    }],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  defaultExtraData: {
    desc: 'Returns the default extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  devLogs: {
    desc: 'Returns latest logs of your node',
    params: [],
    returns: {
      type: Array,
      desc: 'Development logs'
    }
  },

  devLogsLevels: {
    desc: 'Returns current log level settings',
    params: [],
    returns: {
      type: String,
      decs: 'Current log level'
    }
  },

  dropNonReservedPeers: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  extraData: {
    desc: 'Returns currently set extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  gasFloorTarget: {
    desc: 'Returns current target for gas floor',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas Floor Target',
      format: 'outputBigNumberFormatter'
    }
  },

  minGasPrice: {
    desc: 'Returns currently set minimal gas price',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Minimal Gas Price',
      format: 'outputBigNumberFormatter'
    }
  },

  netChain: {
    desc: 'Returns the name of the connected chain.',
    params: [],
    returns: {
      type: String,
      desc: 'chain name'
    }
  },

  netMaxPeers: {
    desc: 'Returns maximal number of peers.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Maximal number of peers'
    }
  },

  netPort: {
    desc: 'Returns network port the node is listening on.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Port Number'
    }
  },

  nodeName: {
    desc: 'Returns node name (identity)',
    params: [],
    returns: {
      type: String,
      desc: 'Node name'
    }
  },

  removeReservedPeer: {
    desc: '?',
    params: [{
      type: String,
      desc: 'Encode'
    }],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  rpcSettings: {
    desc: 'Returns basic settings of rpc (enabled, port, interface).',
    params: [],
    returns: {
      type: Object,
      desc: 'JSON object containing rpc settings'
    }
  },

  setAuthor: {
    desc: 'Changes author (coinbase) for mined blocks.',
    params: [{
      type: Address,
      desc: '20 Bytes - Address',
      format: 'inputAddressFormatter'
    }],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setExtraData: {
    desc: 'Changes extra data for newly mined blocks',
    params: [{
      type: Data,
      desc: 'Extra Data',
      format: 'utils.toHex'
    }],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setGasFloorTarget: {
    desc: 'Changes current gas floor target.',
    params: [{
      type: Quantity,
      desc: 'Gas Floor Target',
      format: 'utils.toHex'
    }],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setMinGasPrice: {
    desc: 'Changes minimal gas price for transaction to be accepted to the queue.',
    params: [{
      type: Quantity,
      desc: 'Minimal gas price',
      format: 'utils.toHex'
    }],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setTransactionsLimit: {
    desc: 'Changes limit for transactions in queue.',
    params: [{
      type: Quantity,
      desc: 'New Limit',
      format: 'utils.toHex'
    }],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  transactionsLimit: {
    desc: 'Changes limit for transactions in queue.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Current max number of transactions in queue',
      format: 'outputBigNumberFormatter'
    }
  },

  unsignedTransactionsCount: {
    desc: 'Returns number of unsigned transactions when running with Trusted Signer. Error otherwise',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Number of unsigned transactions'
    }
  }
};

var net = {
  listening: {
    desc: 'Returns `true` if client is actively listening for network connections.',
    params: [],
    returns: {
      type: Boolean,
      desc: '`true` when listening, otherwise `false`.'
    }
  },

  peerCount: {
    desc: 'Returns number of peers currenly connected to the client.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Integer of the number of connected peers',
      format: 'utils.toDecimal'
    }
  },
  version: {
    desc: 'Returns the current network protocol version.',
    params: [],
    returns: {
      type: String,
      desc: 'The current network protocol version'
    }
  }
};

var personal = {
  listAccounts: {
    desc: 'Returns a list of addresses owned by client.',
    params: [],
    returns: {
      type: Array,
      desc: '20 Bytes addresses owned by the client.'
    }
  },

  newAccount: {
    desc: 'Creates new account',
    params: [{
      type: String,
      desc: 'Password'
    }],
    returns: {
      type: Address,
      desc: 'The created address'
    }
  },

  signAndSendTransaction: {
    desc: 'Sends and signs a transaction given account passphrase. Does not require the account to be unlocked nor unlocks the account for future transactions. ',
    params: [{
      type: Object,
      desc: 'The transaction object',
      details: {
        from: {
          type: Address,
          desc: '20 Bytes - The address the transaction is send from'
        },
        to: {
          type: Address,
          desc: '20 Bytes - (optional when creating new contract) The address the transaction is directed to'
        },
        gas: {
          type: Quantity,
          desc: 'Integer of the gas provided for the transaction execution. It will return unused gas',
          optional: true,
          default: 90000
        },
        gasPrice: {
          type: Quantity,
          desc: 'Integer of the gasPrice used for each paid gas',
          optional: true,
          default: 'To-Be-Determined'
        },
        value: {
          type: Quantity,
          desc: 'Integer of the value send with this transaction',
          optional: true
        },
        data: {
          type: Data,
          desc: 'The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see [Vapory Contract ABI](https://github.com/vaporyco/wiki/wiki/Vapory-Contract-ABI)'
        },
        nonce: {
          type: Quantity,
          desc: 'Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.',
          optional: true
        }
      }
    }, {
      type: String,
      desc: 'Passphrase to unlock `from` account.'
    }],
    returns: {
      type: Data,
      desc: '32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available'
    }
  },

  signerEnabled: {
    desc: 'Returns whether signer is enabled/disabled.',
    params: [],
    returns: {
      type: Boolean,
      desc: 'true when enabled, false when disabled'
    }
  },

  unlockAccount: {
    desc: '?',
    params: ['?', '?', '?'],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  }
};

var shh = {
  version: {
    desc: 'Returns the current whisper protocol version.',
    params: [],
    returns: {
      type: String,
      desc: 'The current whisper protocol version'
    }
  },

  post: {
    desc: 'Sends a whisper message.',
    params: [{
      type: Object, desc: 'The whisper post object:', format: 'inputPostFormatter',
      details: {
        from: {
          type: Data, desc: '60 Bytes - The identity of the sender',
          optional: true
        },
        to: {
          type: Data, desc: '60 Bytes - The identity of the receiver. When present whisper will encrypt the message so that only the receiver can decrypt it',
          optional: true
        },
        topics: {
          type: Array, desc: 'Array of `DATA` topics, for the receiver to identify messages'
        },
        payload: {
          type: Data, desc: 'The payload of the message'
        },
        priority: {
          type: Quantity, desc: 'The integer of the priority in a rang from ... (?)'
        },
        ttl: {
          type: Quantity, desc: 'Integer of the time to live in seconds.'
        }
      }
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the message was send, otherwise `false`'
    }
  },

  newIdentity: {
    desc: 'Creates new whisper identity in the client.',
    params: [],
    returns: {
      type: Data,
      desc: '60 Bytes - the address of the new identiy'
    }
  },

  hasIdentity: {
    desc: 'Checks if the client hold the private keys for a given identity.',
    params: [{
      type: Data,
      desc: '60 Bytes - The identity address to check'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the client holds the privatekey for that identity, otherwise `false`'
    }
  },

  newGroup: {
    desc: '(?)',
    params: [],
    returns: {
      type: Data, desc: '60 Bytes - the address of the new group. (?)'
    }
  },

  addToGroup: {
    desc: '(?)',
    params: [{
      type: Data,
      desc: '60 Bytes - The identity address to add to a group (?)'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the identity was successfully added to the group, otherwise `false` (?)'
    }
  },

  newFilter: {
    desc: 'Creates filter to notify, when client receives whisper message matching the filter options.',
    params: [{
      type: Object, desc: 'The filter options:',
      details: {
        to: {
          type: Data, desc: '60 Bytes - Identity of the receiver. *When present it will try to decrypt any incoming message if the client holds the private key to this identity.*',
          optional: true
        },
        topics: {
          type: Array, desc: 'Array of `DATA` topics which the incoming message\'s topics should match.  You can use the following combinations'
        }
      }
    }],
    returns: {
      type: Quantity,
      desc: 'The newly created filter'
    }
  },

  uninstallFilter: {
    desc: 'Uninstalls a filter with given id. Should always be called when watch is no longer needed.\nAdditonally Filters timeout when they aren\'t requested with [shh_getFilterChanges](#shh_getfilterchanges) for a period of time.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: {
      type: Boolean,
      desc: '`true` if the filter was successfully uninstalled, otherwise `false`'
    }
  },

  getFilterChanges: {
    desc: 'Polling method for whisper filters. Returns new messages since the last call of this method.\n**Note** calling the [shh_getMessages](#shh_getmessages) method, will reset the buffer for this method, so that you won\'t receive duplicate messages.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: {
      type: Array,
      desc: 'Array of messages received since last poll'
    }
  },

  getMessages: {
    desc: 'Get all messages matching a filter. Unlike `shh_getFilterChanges` this returns all messages.',
    params: [{
      type: Quantity,
      desc: 'The filter id'
    }],
    returns: 'See [shh_getFilterChanges](#shh_getfilterchanges)'
  }
};

var trace = {
  filter: {
    desc: 'Returns traces matching given filter',
    params: [{
      type: Object,
      desc: 'The filter object'
    }],
    returns: {
      type: Array,
      desc: 'Traces matching given filter'
    }
  },

  get: {
    desc: 'Returns trace at given position.',
    params: [{
      type: Hash,
      desc: 'Transaction hash'
    }, {
      type: Integer,
      desc: 'Trace position witing transaction'
    }],
    returns: {
      type: Object,
      desc: 'Trace object'
    }
  },

  transaction: {
    desc: 'Returns all traces of given transaction',
    params: [{
      type: Hash,
      desc: 'Transaction hash'
    }],
    returns: {
      type: Array,
      desc: 'Traces of given transaction'
    }
  },

  block: {
    desc: 'Returns traces created at given block',
    params: [{
      type: BlockNumber,
      desc: 'Integer block number, or \'latest\' for the last mined block or \'pending\', \'earliest\' for not yet mined transactions'
    }],
    returns: {
      type: Array,
      desc: 'Block traces'
    }
  }
};

var web3 = {
  clientVersion: {
    desc: 'Returns the current client version.',
    params: [],
    returns: {
      type: String,
      desc: 'The current client version'
    }
  },

  sha3: {
    desc: 'Returns Keccak-256 (*not* the standardized SHA3-256) of the given data.',
    params: [{
      type: String,
      desc: 'The data to convert into a SHA3 hash'
    }],
    returns: {
      type: Data,
      desc: 'The SHA3 result of the given string'
    }
  }
};

var index = {
  db: db,
  vap: vap,
  vapcore: vapcore,
  net: net,
  personal: personal,
  shh: shh,
  trace: trace,
  web3: web3
};

module.exports = index;