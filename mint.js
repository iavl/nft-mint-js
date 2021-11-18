const Web3 = require('web3');

const abi = require('./abi.json');
const { privateKey } = require('./env.json');
const { airdropsAddress } = require('./airdrops.json');


// Provider
const providerRPC = {
    development: 'http://localhost:9933',
    polygonMainnet: 'https://polygon-rpc.com/',
};

const web3 = new Web3(providerRPC.polygonMainnet); //Change to correct network

const contractAddress = '0xb488dA8b17123F9506C44C17E6d3E6aE9B511B47';

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
        // gas: await web3.eth.estimateGas(mintTx),
        gas: 2208000,
        gasPrice: '30000000000'
    };

    // console.log("txCall:", txCall);

    var signedTx = await web3.eth.accounts.signTransaction(
        txCall,
        privateKey
    );

    // console.log("signedTx:", signedTx);

    // Send Tx and Wait for Receipt
    // const createReceipt = await web3.eth.sendSignedTransaction(
    //     signedTx.rawTransaction
    // );
    // console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};


const batchMint = async () => {
    var step = 4
    for (var i = 0; i < airdropsAddress.length; i+=step) {
        var addrs = []
        var idx = Math.min(airdropsAddress.length, i+step)
        for (var j = i; j < idx; j++) {
            // console.log(airdropsAddress[j])
            addrs.push(airdropsAddress[j])
        }
        console.log("last address: ", airdropsAddress[idx-1])
        await mint(addrs);
    }
}


batchMint();