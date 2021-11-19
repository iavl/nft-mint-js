const Web3 = require('web3');

const abi = require('./abi.json');
const { from, privateKey } = require('./env.json');
const { airdropsAddress } = require('./airdrops.json');


// Provider
const providerRPC = {
    development: 'http://157.245.132.76:8545',
    polygonMainnet: 'https://polygon-rpc.com/',
};

const web3 = new Web3(providerRPC.development); //Change to correct network

const contractAddress = '0x8eC80E34fe34e1de746E2032A7628B15550a7FB9';

/*
   -- Send Function --
*/
// Create Contract Instance
const contractInstance = new web3.eth.Contract(abi, contractAddress);


const mint = async (_value) => {
    // console.log(`Calling the batchMint function at contract address: ${contractAddress}`);

    // Build Increment Tx
    var mintTx = contractInstance.methods.batchMint(_value);

    // Sign Tx with PK
    var txCall = {
        to: contractAddress,
        data: mintTx.encodeABI(),
        gas: await mintTx.estimateGas({from: from}),
        // gas: 2208000,
        gasPrice: '30000000000'
    };

    // console.log("txCall:", txCall);

    var signedTx = await web3.eth.accounts.signTransaction(
        txCall,
        privateKey
    );

    console.log("signedTx:", signedTx);

    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
    );
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};


const batchMint = async () => {
    var step = 50
    for (var i = 0; i < airdropsAddress.length; i+=step) {
        var addrs = []
        var idx = Math.min(airdropsAddress.length, i+step)
        for (var j = i; j < idx; j++) {
            // console.log(airdropsAddress[j])
            addrs.push(airdropsAddress[j])
        }
        console.log("first address: ", airdropsAddress[i])
        console.log("last address: ", airdropsAddress[idx-1])
        await mint(addrs);
    }
}


batchMint();