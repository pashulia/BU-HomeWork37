const Web3 = require('web3')
const fs = require('fs');


// let web3 = new Web3('wss://eth-goerli.g.alchemy.com/v2/XdE1v9zVDSoRe6S5013cteykw1ZDC0u9')
let web3 = new Web3('ws://127.0.0.1:7545')

async function main() {
    console.log("   --- Создание аккаунта ---   \n");

    let key1 = "0x749cd5e364fea9e930b9dd2acf00e7ea918dd584b2b4dc7d3e29cca204d4a545"
    let account1 = web3.eth.accounts.privateKeyToAccount(key1)
    let key2 = "0x42a8206d823db8bc101c5ba4018f93be2d7da3f0d9d28a0d559ab5e0910c25cb"
    let account2 = web3.eth.accounts.privateKeyToAccount(key2)
    console.log(account1);
    console.log(account2);
    
    console.log('\n\n\n --- Подписка на транзакции web3.eth.subscribe(pendingTransactions) --- \n')

    let subscriptionTx = web3.eth.subscribe('pendingTransactions', function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log('callback: ', result);
        }
    })
    .on("connected", function(subscriptionId) {
        console.log('connected: ', subscriptionId);
    })
    .on("data", function(transaction) {
        console.log('data: ', transaction);
    })
    .on("error", function(error) {
        console.log(error);
    })

    console.log('\n\n\n --- Создание транзакции --- \n')

    let sendETH = await web3.eth.accounts.signTransaction({
        from: account1.address,
        to: account2.address,
        value: 1_000_000_000_000,
        gas: 21_000
    }, key1)

    await web3.eth.sendSignedTransaction(sendETH.rawTransaction)
    .on("receipt", receipt => {
        console.log("sendETH: ", receipt);
    })

    sendETH = await web3.eth.accounts.signTransaction({
        from: account2.address,
        to: account1.address,
        value: 1_000_000_000_000_000_000,
        gas: 21_000
    }, key2)

    await web3.eth.sendSignedTransaction(sendETH.rawTransaction)
    .on("receipt", receipt => {
        console.log("reversETH: ", receipt);
    })
    // требуется установить задержку на выпуск новых блоков 5 секунд в настройках Ganache!
}

main()

