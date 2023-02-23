const Web3 = require('web3')

let web3 = new Web3('wss://eth-goerli.g.alchemy.com/v2/XdE1v9zVDSoRe6S5013cteykw1ZDC0u9')
// let web3 = new Web3('ws://127.0.0.1:7545')

async function main() {
    console.log('\n\n\n === Подписка на новые блоки web3.eth.subscribe(newBlockHeaders) === \n')

    async function getBockTx(blockHeader) {
        let block = await web3.eth.getBlock(blockHeader.number, true)
        console.log("block-number: ", block.number);
        console.log("transactions-length: ", block.transactions.length);
        let value = 0;
        for (i in block.transactions) {
            value += Number(block.transactions[i].value)
        }
        console.log("eth: ", value);
    }

    let subscriptionBlock = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
        getBockTx(blockHeader);
    })
}

main()

