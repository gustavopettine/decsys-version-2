import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

import '@nomiclabs/hardhat-ethers'
import '@nomicfoundation/hardhat-verify'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    apothem: {
      url: process.env.XDC_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
}

export default config
