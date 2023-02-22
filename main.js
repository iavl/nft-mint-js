const Web3 = require('web3');

const abi = require('./abi.json');
const { from, privateKey, contractAddress } = require('./env.json');
const { uris } = require('./uri.json');

// Provider
const providerRPC = {
    development: 'https://rpc.crossbell.io/',
    polygonMainnet: 'https://polygon-rpc.com/',
};

const web3 = new Web3(providerRPC.development); //Change to correct network

// Create Contract Instance
const contractInstance = new web3.eth.Contract(abi, contractAddress);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const migrate = async (characterIds) => {
    console.log(`Calling the function at contract address: ${characterIds}`);

    // Build Increment Tx
    var tx = contractInstance.methods.migrateOperatorSyncPermissions(characterIds);

    // Sign Tx with PK
    var txCall = {
        to: contractAddress,
        data: tx.encodeABI(),
        gas: await tx.estimateGas({from: from}),
        // gas: 2208000,
        gasPrice: '1000000000'
    };

    console.log("txCall:", txCall);

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


const main = async () => {
    var characters = [49101, 49100, 49076, 49074, 49072, 49064, 49062, 49046, 49043, 49042, 49041, 49037, 49036, 49034, 49033, 49031, 49025, 49022, 49016, 49014, 48977, 48963, 48962, 48954, 48953, 48952, 48951, 48950, 48937, 48933, 48928, 48925, 48921, 48920, 48918, 48910, 48905, 48904, 48869, 47980, 47398, 47397, 47391, 47390, 47389, 47386, 47385, 47384, 47383, 47369, 47368, 47367, 47366, 47364, 47363, 47362, 47361, 47360, 47358, 47356, 47355, 47354, 47353, 47351, 47350, 47349, 47347, 47346, 47345, 47341, 47327, 47314, 47309, 47281, 47117, 47115, 47112, 47110, 47108, 47050, 47049, 47047, 47046, 47045, 47044, 47043, 46951, 46948, 46947, 46946, 46937, 46928, 46927, 46926, 46925, 46912, 46907, 46904, 46896, 46874, 46760, 46759, 46630, 46620, 46618, 46587, 46584, 46529, 46507, 46505, 46504, 46488, 46464, 46380, 46360, 46015, 46013, 46011, 46007, 46003, 45996, 45758, 45749, 45747, 45685, 45683, 45680, 45676, 45664, 45638, 45637, 45627, 45623, 45619, 45596, 45594, 45591, 45568, 45551, 45546, 45519, 45443, 45435, 45405, 45404, 45394, 45384, 45383, 45379, 45375, 45366, 45362, 45357, 45352, 45351, 45346, 45342, 45340, 45325, 45319, 45316, 45315, 45313, 45311, 45310, 45309, 45306, 45292, 45287, 45286, 45282, 45265, 45261, 45256, 45248, 45244, 45243, 45241, 45240, 45239, 45235, 45230, 45229, 45218, 45214, 45201, 45198, 45191, 45185, 45182, 45174, 45172, 45166, 45164, 45155, 45154, 45149, 45144, 45142, 45140, 45134, 45123, 45122, 45121, 45117, 45111, 45108, 45095, 45094, 45093, 45085, 45020, 44943, 44873, 44218, 44177, 43869, 43782, 43747, 43702, 43659, 43626, 43092, 43091, 43088, 43081, 43078, 43075, 43074, 43068, 43065, 43061, 43057, 43056, 43055, 43053, 43039, 43038, 43033, 43031, 43020, 42892, 42874, 42873, 42869, 42868, 42867, 42486, 42464, 40745, 40685, 40683, 40682, 40681, 40680, 40679, 40678, 40676, 40674, 40673, 40672, 39331, 38926, 38588, 38572];
    console.log(characters.length);

    const l = characters.length
    for(let i = 0; i < l; i+=100) {
        const subChars = characters.slice(i, i+100)
        console.log(subChars.toString())
        await migrate(subChars);
    }

}


main();
