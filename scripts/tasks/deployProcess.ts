import fs from 'fs'
import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { writeFileSync } from '../../helpers/pathHelper'

task('deploy:contract', 'Deploy contract')
  .addParam('contract')
  .setAction(async ({ contract }, hre) => {
    await hre.run('compile')
    const [signer] = await hre.ethers.getSigners()
    const contractFactory = await hre.ethers.getContractFactory(contract)
    // if you mint in constructor, you need to add value in deploy function
    const deployContract = await contractFactory.connect(signer).deploy()
    console.log(`TestToken.sol deployed to ${deployContract.address}`)

    const address = {
      main: deployContract.address,
    }
    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, 'mainContract.json', addressData)

    await deployContract.deployed()
  },
  )

task('deploy:proxy', 'Deploy Proxy contract')
  .addParam('contract')
  .setAction(async ({ contract }, hre) => {
    await hre.run('compile')
    // Deploying
    const contractFactory = await hre.ethers.getContractFactory(contract)
    console.log('Deploying Proxy...')
    // if you mint in constructor, you need to add value in deploy function
    const proxyContract = await hre.upgrades.deployProxy(contractFactory, { initializer: 'initialize', kind: 'uups' })
    console.log('Waiting for two blocks of confirmation...')
    await proxyContract.deployTransaction.wait(2)

    console.log(`Proxy Contract deployed to ${proxyContract.address}`)
    const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyContract.address)
    console.log(`Implementation Contract deployed to ${implementationAddress}`)

    const address = {
      proxy: proxyContract.address,
      implementation: implementationAddress,
    }

    const addressData = JSON.stringify(address)
    writeFileSync(`scripts/address/${hre.network.name}/`, 'proxyContract.json', addressData)
    await proxyContract.deployed()
  },
  )

task('deploy:create2Factory', 'Deploy Factory contract for create2')
  // eslint-disable-next-line @typescript-eslint/naming-convention
  .setAction(async (_, hre) => {
    await hre.run('compile')

    const create2Factory = await hre.ethers.getContractFactory('Create2Factory')

    console.log('Deploying Factory for create2...')
    const factory = await create2Factory.deploy()

    console.log('Waiting for two blocks of confirmation...')
    await factory.deployTransaction.wait(2)

    const factoryAddress = factory.address
    console.log('Factory has been deployed at ', factoryAddress)
    await factory.deployed()
    const addressObject = {
      main: factoryAddress,
    }
    writeFileSync(`scripts/address/${hre.network.name}/`, 'create2FactoryContract.json', JSON.stringify(addressObject))
  },
  )

task('deploy:contractFromCreate2Factory', 'Deploy contract using create2Factory')
  .addParam('contract')
  .addParam('salt')
  .setAction(async ({ contract, salt }, hre) => {
    await hre.run('compile')
    await deployCreate2(hre, contract, salt)
  },
  )

task('deploy:proxyFromCreate2Factory', 'Deploy proxy contract using create2Factory')
  .addParam('contract')
  .addParam('salt')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .setAction(async ({ contract, salt }, hre) => {
    // TODO:
    // 1. Deploy implementation Contract
    // 2. Deploy ERC1967 Contract (Proxy) using create2Factory
    // 3. Connect implementation to Proxy
    // 4. Save Contract Info
  },
  )

async function deployCreate2 (hre: HardhatRuntimeEnvironment, contract: string, salt: string) {
  const create2Factory = await hre.ethers.getContractFactory('Create2Factory')
  const factoryAddress = (JSON.parse(fs.readFileSync(`scripts/address/${hre.network.name}/create2FactoryContract.json`).toString())).main
  const factory = create2Factory.attach(factoryAddress)

  const create2Contract = await hre.ethers.getContractFactory(contract)
  const byteCode = create2Contract.bytecode

  const computeAddress = await factory.computeAddress(salt, byteCode)
  console.log(`Contract will be deployed at ${computeAddress} from Create2 Compute`)

  const tx = await factory.deploy(0, salt, byteCode)
  console.log('Waiting for transaction of confirmation...')
  const rc = await tx.wait()
  const deployEvent = rc.events.find((e: { event: string }) => e.event === 'DeployByCreate2')
  const addressObject = {
    factory: factoryAddress,
    salt: salt,
    addressFromSalt: deployEvent.args[0],
  }

  console.log(`Contract has been deployed at ${deployEvent.args[0]} from Create2Factory`)
  writeFileSync(`scripts/address/${hre.network.name}/`, 'contractFromFactory.json', JSON.stringify(addressObject))
  return deployEvent.args[0]
}
