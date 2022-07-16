const Web3 = require('web3');

const abi = require('./abi.json');
const { from, privateKey, contractAddress } = require('./env.json');
const { airdropsAddress } = require('./airdrops.json');

// Provider
const providerRPC = {
    development: 'https://csbrpc.kindjeff.com/',
    polygonMainnet: 'https://polygon-rpc.com/',
};



const web3 = new Web3(providerRPC.development); //Change to correct network

// Create Contract Instance
const contractInstance = new web3.eth.Contract(abi, contractAddress);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const mint = async (_value) => {
    // console.log(`Calling the batchMint function at contract address: ${contractAddress}`);

    // Build Increment Tx
    var mintTx = contractInstance.methods.migrate(_value);

    // Sign Tx with PK
    var txCall = {
        to: contractAddress,
        data: mintTx.encodeABI(),
        gas: await mintTx.estimateGas({from: from}),
        // gas: 2208000,
        gasPrice: '1000000000'
    };

    // console.log("txCall:", txCall);
    var startTime = Date.now();
    var signedTx = await web3.eth.accounts.signTransaction(
        txCall,
        privateKey
    );
    var duration = (Date.now() - startTime)/1000;
    console.log(`SignedTx Duration: ${duration}`);

    // console.log("signedTx:", signedTx);

    startTime = Date.now();
    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
    );
    duration = (Date.now() - startTime)/1000;
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
    console.log(`SendTx Duration: ${duration}`);
};


const batchMint = async () => {
    await mint({account:from, handle:"migrate-test1", uri:"ipfs://bafkreie2c6lxtz4junqqmfcw47wgxdglzazp37y75pwcsd4ewnzcne4ilu",toAddresses:["0x55F110395C844963b075674e2956eb414018a7a7","0x0fefeD77Bb715E96f1c35c1a4E0D349563d6f6c0"],linkType:"0x666f6c6c6f770000000000000000000000000000000000000000000000000000"});
}


batchMint();