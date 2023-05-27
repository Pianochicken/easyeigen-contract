# Solidity Template
Hardhat-based template for developing Solidity smart contract.

1. [Hardhat](https://github.com/NomicFoundation/hardhat): compile and run smart contract
2. [Typechain](https://github.com/dethcrypto/TypeChain): generate Typescript bindings for smart contract
3. [Ethers](https://github.com/ethers-io/ethers.js/): Ethereum library and wallet

## Getting Started

---

`git clone` or fork this project

### Prepare Enviroment

Before run any command, you need to create a `.env` file and set private key, Report gas function, infura api key and block explorer key. You can copy example in `.env.example` 

```bash
PRIVATE_KEY=ZZZ
REPORT_GAS=true
INFURA_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ETHERSCAN_API_KEY=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

`INFURA_API_KEY` can generate by [https://app.infura.io/](https://app.infura.io/)

Note: The `INFURA_API_KEY` can support all network in support list, but if you want to use polygon-mumbai or other layer 2 network. You will need to add your payment info in [https://app.infura.io/](https://app.infura.io/) 

If you want to verify your contract on etherscan, you need to add the `ETHERSCAN_API_KEY`

`ETHERSCAN_API_KEY` can generate in [https://etherscan.io/](https://etherscan.io/) , you need to click your avatar and click `API Keys` to generate one.

Note: Different network have different block explorer, you need to create different account in different network.

Here is where you can get api_key

`ETHERSCAN_API_KEY`: [https://etherscan.io/myapikey](https://etherscan.io/myapikey)

`POLYGONSCAN_API_KEY`: [https://polygonscan.com/myapikey](https://polygonscan.com/myapikey)

`BSCSCAN_API_KEY`: [https://bscscan.com/myapikey](https://bscscan.com/myapikey)

`SNOWTRACE_API_KEY`: [https://snowtrace.io/myapikey](https://snowtrace.io/myapikey)

`ARBISCAN_API_KEY`: [https://arbiscan.io/myapikey](https://arbiscan.io/myapikey)

`OPTIMISM_API_KEY`: [https://optimistic.etherscan.io/myapikey](https://optimistic.etherscan.io/myapikey)

`REPORT_GAS` is a flag to make your hardhat-gas-report plugin work or not

### Install Dependencies

```bash
npm i
```

## Hardhat

---

You can use mostly all hardhat-toolbox function in this template

### Hardhat Network

Start a network for development

```bash
npm run node
```

### Hardhat Compile

Compile is a function use hardhat to compile solidity file to bytecode, but this action not deploy the contract into network yet

```bash
npm run compile
```

### Hardhat Test

Hardhat can use ethers to check input and return right or not.

```bash
npm run test
```

And in this template we have gas reporter, so you can only check the gas waste with

```bash
npm run test:gas
```

### Hardhat Deploy Local Testnet

Because default network is `hardhat local network` , so this action did not spend your wallet’s ETH

```bash
npm run deploy
```

### Hardhat Deploy to Public Network

And if you want to deploy to different network

```bash
npm run deploy -- --network goerli
```

Now we support these network

```bash
const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  avalanche: 43114,
  bsc: 56,
  'arbitrum-mainnet': 42161,
  'polygon-mainnet': 137,
  'optimism-goerli': 420,
  'optimism-mainnet': 10,
  'polygon-mumbai': 80001,
}
```

You just need to change the last argument with the network you want

Example.

```bash
npm run deploy -- --network polygon-mumbai
```

### Block Explorer Verify

If you want to upload your code into the public network, you can use this function, and you can change the last network argument if you want.

```bash
npm run verify -- --network goerli
```

This verify action need to have API key like `ETHERSCAN_API_KEY` in `.env` file

### Clean and Re-compile

You can clean all compile solidity file with

```bash
npm run clean
npm run compile
```

## Tips

If you use vscode, you can use this [plugin](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)