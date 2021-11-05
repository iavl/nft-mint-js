const Web3 = require('web3');

const abi = require('./abi.json');

const { from, privateKey } = require('./env.json');


// Provider
const providerRPC = {
    development: 'http://localhost:9933',
    polygonMainnet: 'https://polygon-rpc.com/',
};
const web3 = new Web3(providerRPC.polygonMainnet); //Change to correct network

const contractAddress = '0xb488dA8b17123F9506C44C17E6d3E6aE9B511B47';
const _value = ['0x760524E21377a92C8b5CD18293eeCfc56e9e4296','0x760524E21377a92C8b5CD18293eeCfc56e9e4296'];

/*
   -- Send Function --
*/
// Create Contract Instance
const contractInstance = new web3.eth.Contract(abi, contractAddress);

// Build Mint Tx
const mintTx = contractInstance.methods.batchMint(_value);

const mint = async () => {
    console.log(
        `Calling the batchMint function at contract address: ${contractAddress}`
    );

    // Sign Tx with PK
    let txCall = {
        to: contractAddress,
        data: mintTx.encodeABI(),
        gas: await mintTx.estimateGas({from: from}),
        gasPrice: await web3.eth.getGasPrice()
    };

    console.log("txCall:", txCall);

    const signedTx = await web3.eth.accounts.signTransaction(
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

mint();
