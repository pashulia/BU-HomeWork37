const Web3 = require('web3')
const fs = require('fs');


// let web3 = new Web3('wss://eth-goerli.g.alchemy.com/v2/XdE1v9zVDSoRe6S5013cteykw1ZDC0u9')
let web3 = new Web3('ws://127.0.0.1:7545')

async function main() {
    console.log("\n\n   --- Создание аккаунта ---   \n");

    let key1 = "0x76db50c790b75cc4ddf4077d2c780c7bff7b21645e45d1add809b43e37ce73e2"
    let account1 = web3.eth.accounts.privateKeyToAccount(key1)
    let key2 = "0x2390ceffe8b3230fa8801515ee8b1f3cf913ce9aa3c0ff843931fad505a562ba"
    let account2 = web3.eth.accounts.privateKeyToAccount(key2)
    console.log(account1);
    console.log(account2);

    const ABI = JSON.parse(fs.readFileSync(__dirname + '/' + 'Example.abi', 'utf-8'))
    const bytecode = fs.readFileSync(__dirname + '/' + 'Example.bin', 'utf-8')
    let myContract = new web3.eth.Contract(ABI)

    console.log("\n\n   --- Деплой контракта ---   \n");
    
    await myContract.deploy({
        data: bytecode
    })
    .send({
        from: account1.address,
        gasPrice: 30_000_000,
        gas: 3_000_000 
    }, (error, txhash) => {
        if (error) {
            console.log(error);
        } else {
            console.log(txhash);
        }
    })
    .then((newContractInstance) => {
            myContract = newContractInstance;
            console.log(myContract.options.address);
            console.log(myContract.methods);
        }
    )
    
    console.log("\n\n   --- Создание и подпись event ---   \n");

    const event1 = web3.utils.sha3("Receive(address,uint256)");
    const event2 = web3.utils.sha3("SetData(uint256,string,uin256[])"); 

    myContract.events.Receive({
        filter: {sender: account2.address},
        // topics: [event1]
    })
    .on("data", function(logs){
        console.log("EVENT START");
        console.log(logs);
        console.log("EVENT END");
    })
    
    myContract.events.SetData({
        filter: {number: [100, 500]},
        // topics: [event2]
    })
    .on("data", function(logs){
        console.log("EVENT START");
        console.log(logs);
        console.log("return: ", myContract.events.SetData.returnValues);
        console.log("EVENT END");
    })

    console.log('\n\n --- Создание транзакции --- \n')

    let sendETH = await web3.eth.accounts.signTransaction({
        from: account2.address,
        to: myContract.options.address,
        value: 1_000_000_000,
        gas: 25_000
    }, key2)

    await web3.eth.sendSignedTransaction(sendETH.rawTransaction)
    .on("receipt", receipt => {
        console.log("sendETH: ", receipt);
    })

    console.log('\n\n --- Создание транзакции 2 --- \n')

    let sendETH2 = await web3.eth.accounts.signTransaction({
        from: account1.address,
        to: myContract.options.address,
        value: 2_000_000_000,
        gas: 25_000
    }, key1)

    await web3.eth.sendSignedTransaction(sendETH2.rawTransaction)
    .on("receipt", receipt => {
        console.log("sendETH: ", receipt);
    })
}

main()

