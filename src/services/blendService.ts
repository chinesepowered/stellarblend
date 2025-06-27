import type { Position } from '../types'

// Network constants
const STELLAR_NETWORKS = {
  PUBLIC: 'Public Global Stellar Network ; September 2015',
  TESTNET: 'Test SDF Network ; September 2015'
}

// Real Blend contract addresses - updated with correct testnet addresses
export const BLEND_CONTRACTS = {
  MAINNET: {
    POOL_FACTORY: 'CCZD6ESMOGMPWH2KRO4O7RGTAPGTUPFWFQBELQSS7ZUK63V3TZWETGAG',
    BACKSTOP: 'CAO3AGAMZVRMHITL36EJ2VZQWKYRPWMQAPDQD5YEOF3GIF7T44U4JAL3',
    EMITTER: 'CCOQM6S7ICIUWA225O5PSJWUBEMXGFSSW2PQFO6FP4DQEKMS5DASRGRR',
    BLND_TOKEN: 'CD25MNVTZDL4Y3XBCPCJXGXATV5WUHHOWMYFF4YBEGU5FCPGMYTVG5JY',
    USDC_TOKEN: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    XLM_TOKEN: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
    COMET_FACTORY: 'CA2LVIPU6HJHHPPD6EDDYJTV2QEUBPGOAVJ4VIYNTMFUCRM4LFK3TJKF',
    COMET: 'CAS3FL6TLZKDGGSISDBWGGPXT3NRR4DYTZD7YOD3HMYO6LTJUVGRVEAM'
  },
  TESTNET: {
    // Updated with addresses from blend-utils testnet.contracts.json
    POOL_FACTORY: 'CDIE73IJJKOWXWCPU5GWQ745FUKWCSH3YKZRF5IQW7GE3G7YAZ773MYK', // Pool Factory V2
    BACKSTOP: 'CC4TSDVQKBAYMK4BEDM65CSNB3ISI2A54OOBRO6IPSTFHJY3DEEKHRKV', // Backstop V2
    EMITTER: 'CBKGB24EGKHUS3755GU6IC5YFNDAGCRCGYAONM3HKES2223TIHKQ4QBZ',
    BLND_TOKEN: 'CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF',
    USDC_TOKEN: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU',
    XLM_TOKEN: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    WETH_TOKEN: 'CAZAQB3D7KSLSNOSQKYD2V4JP5V2Y3B4RDJZRLBFCCIXDCTE3WHSY3UE',
    WBTC_TOKEN: 'CAP5AMC2OHNVREO66DFIN6DHJMPOBAJ2KCDDIMFBR7WWJH5RZBFM3UEI',
    COMET_FACTORY: 'CD7E4SS4ZIY2JDEZP3PTWAIBBWMRG2NNFFXKHC7FCW43ZWTSI2KJYG5P',
    COMET: 'CAVWKK4WB7SWLKI7VBPPGP6KNUKLUAWQIHE44V7G7MYOG4K23PW2PXKJ',
    ORACLE_MOCK: 'CBJSXNC2PL5LRMGWBOJVCWZFRNFPQXX4JWCUPSGEVZELZDNSEOM7Q6IQ'
  }
}

// Helper to get contracts for current network
export const getNetworkContracts = (networkPassphrase: string) => {
  return networkPassphrase === STELLAR_NETWORKS.PUBLIC 
    ? BLEND_CONTRACTS.MAINNET 
    : BLEND_CONTRACTS.TESTNET
}

export class BlendService {
  private networkPassphrase: string
  private contracts: any

  constructor(networkPassphrase: string = STELLAR_NETWORKS.TESTNET) {
    this.networkPassphrase = networkPassphrase
    this.contracts = getNetworkContracts(networkPassphrase)
    console.log('Blend service initialized for network:', this.networkPassphrase)
    console.log('Using contracts:', this.contracts)
  }

  async getPoolInfo(assetAddress: string) {
    try {
      // Try to get real pool data using the asset address
      return await this.queryRealPoolData(assetAddress)
    } catch (error) {
      console.error('Failed to get real pool info, falling back to mock:', error)
      // Fallback to mock data if real query fails
      return this.getMockPoolData(assetAddress)
    }
  }

  private async queryRealPoolData(assetAddress: string) {
    try {
      // Import Blend SDK dynamically
      const { Pool } = await import('@blend-capital/blend-sdk')
      
      // Create network configuration with correct Soroban RPC URLs
      const network = {
        rpc: this.networkPassphrase === STELLAR_NETWORKS.PUBLIC
          ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
          : 'https://soroban-testnet.stellar.org',
        passphrase: this.networkPassphrase
      }

      console.log(`Querying real Blend pool data for asset ${assetAddress} on ${this.networkPassphrase}`)
      
      // List of known testnet pool addresses - these would need to be discovered
      // For now, we'll try some potential pool addresses based on the testnet contracts
      const potentialPoolAddresses = [
        // Try using asset addresses as potential pool addresses (likely won't work)
        // In a real implementation, you'd need to discover actual pool addresses
        // through the Pool Factory or from known deployed contracts
      ]
      
      // TODO: Implement real pool discovery when pool addresses are available
      // The proper implementation would be:
      // 1. Get actual deployed pool contract addresses from Pool Factory or known list
      // 2. Use Pool.load(network, poolAddress) for each pool
      // 3. Check pool.reserves to see which assets each pool supports
      // 4. Return real reserve data using reserve.totalSupplyFloat(), etc.
      //
      // Example real implementation:
      // const knownPools = ['CXXXPOOLADDRESS1XXX', 'CXXXPOOLADDRESS2XXX']
      // for (const poolAddress of knownPools) {
      //   const pool = await Pool.load(network, poolAddress)
      //   if (pool.reserves.has(assetAddress)) {
      //     const reserve = pool.reserves.get(assetAddress)
      //     return realPoolData(reserve)
      //   }
      // }
      
      console.log(`Real pool discovery not yet implemented for ${assetAddress}`)
      console.log('Using enhanced mock data until actual pool addresses are available')
      
      // For the hackathon, we can provide enhanced mock data that looks more realistic
      const assetName = this.getAssetName(assetAddress)
      const enhancedMockData = {
        asset: assetName,
        address: assetAddress,
        poolAddress: 'POOL_NOT_FOUND', // Indicates no real pool found
        totalSupply: Math.random() * 10000000 + 1000000, // Random realistic values
        totalBorrow: Math.random() * 5000000 + 500000,
        supplyAPY: Math.random() * 10 + 3, // 3-13% APY
        borrowAPY: Math.random() * 15 + 5, // 5-20% APY
        utilizationRate: Math.random() * 0.8 + 0.1, // 10-90% utilization
        liquidationThreshold: 0.75 + Math.random() * 0.15, // 75-90%
        isRealData: false // Flag to indicate this is enhanced mock data
      }
      
      enhancedMockData.utilizationRate = enhancedMockData.totalBorrow / enhancedMockData.totalSupply
      
      console.log('Generated enhanced mock data for', assetName)
      return enhancedMockData
    } catch (error) {
      console.error('Real pool query failed:', error)
      throw error
    }
  }

  private getMockPoolData(assetAddress: string) {
    // Fallback mock data
    const poolData: Record<string, any> = {
      [this.contracts.USDC_TOKEN]: {
        asset: 'USDC',
        address: this.contracts.USDC_TOKEN,
        totalSupply: 1250000,
        totalBorrow: 980000,
        supplyAPY: 8.5,
        borrowAPY: 12.3,
        utilizationRate: 0.784,
        liquidationThreshold: 0.85
      },
      [this.contracts.XLM_TOKEN]: {
        asset: 'XLM',
        address: this.contracts.XLM_TOKEN,
        totalSupply: 5000000,
        totalBorrow: 3200000,
        supplyAPY: 12.1,
        borrowAPY: 16.8,
        utilizationRate: 0.64,
        liquidationThreshold: 0.75
      },
      [this.contracts.BLND_TOKEN]: {
        asset: 'BLND',
        address: this.contracts.BLND_TOKEN,
        totalSupply: 850000,
        totalBorrow: 420000,
        supplyAPY: 15.2,
        borrowAPY: 19.5,
        utilizationRate: 0.494,
        liquidationThreshold: 0.70
      }
    }

    // Add testnet-specific assets
    if (this.networkPassphrase === STELLAR_NETWORKS.TESTNET) {
      poolData[this.contracts.WETH_TOKEN] = {
        asset: 'wETH',
        address: this.contracts.WETH_TOKEN,
        totalSupply: 320000,
        totalBorrow: 180000,
        supplyAPY: 6.8,
        borrowAPY: 9.4,
        utilizationRate: 0.5625,
        liquidationThreshold: 0.80
      }

      poolData[this.contracts.WBTC_TOKEN] = {
        asset: 'wBTC',
        address: this.contracts.WBTC_TOKEN,
        totalSupply: 45000,
        totalBorrow: 32000,
        supplyAPY: 4.2,
        borrowAPY: 7.1,
        utilizationRate: 0.711,
        liquidationThreshold: 0.75
      }
    }

    return poolData[assetAddress] || null
  }

  private getAssetName(assetAddress: string): string {
    if (assetAddress === this.contracts.USDC_TOKEN) return 'USDC'
    if (assetAddress === this.contracts.XLM_TOKEN) return 'XLM'
    if (assetAddress === this.contracts.BLND_TOKEN) return 'BLND'
    if (assetAddress === this.contracts.WETH_TOKEN) return 'wETH'
    if (assetAddress === this.contracts.WBTC_TOKEN) return 'wBTC'
    return 'Unknown'
  }

  async getUserPositions(publicKey: string): Promise<Position[]> {
    try {
      // For now, use generated positions instead of real queries
      console.log(`Generating mock positions for ${publicKey}`)
      return this.getGeneratedPositions(publicKey)
    } catch (error) {
      console.error('Failed to get user positions:', error)
      return this.getGeneratedPositions(publicKey)
    }
  }

  private async queryRealUserPositions(publicKey: string): Promise<Position[]> {
    try {
      // Import Blend SDK dynamically
      const { Pool } = await import('@blend-capital/blend-sdk')
      
      // Create network configuration
      const network = {
        rpc: this.networkPassphrase === STELLAR_NETWORKS.PUBLIC
          ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
          : 'https://soroban-testnet.stellar.org',
        passphrase: this.networkPassphrase
      }

      console.log(`Querying real user positions for ${publicKey} on ${this.networkPassphrase}`)

      const assetTokens = [
        this.contracts.USDC_TOKEN,
        this.contracts.XLM_TOKEN,
        this.contracts.BLND_TOKEN
      ]

      // Add testnet-specific assets
      if (this.networkPassphrase === STELLAR_NETWORKS.TESTNET) {
        assetTokens.push(
          this.contracts.WETH_TOKEN,
          this.contracts.WBTC_TOKEN
        )
      }

      const positions: Position[] = []

      for (const assetAddress of assetTokens) {
        try {
          // Query pool for user positions
          const pool = await Pool.load(network, assetAddress)
          const poolUser = await pool.loadUser(publicKey)

          // Check each reserve for user positions
          for (const [reserveAddress, reserve] of pool.reserves) {
            const supply = poolUser.getSupplyFloat(reserve)
            const collateral = poolUser.getCollateralFloat(reserve)
            const liabilities = poolUser.getLiabilitiesFloat(reserve)
            
            const poolInfo = await this.getPoolInfo(assetAddress)
            if (!poolInfo) continue

            // Create position for supplied + collateral assets
            if (supply > 0 || collateral > 0) {
              const totalSupplied = supply + collateral
              positions.push({
                id: `${reserveAddress}-supply`,
                asset: poolInfo.asset,
                address: reserveAddress,
                type: 'lending',
                amount: totalSupplied,
                apy: poolInfo.supplyAPY,
                totalValue: totalSupplied * 1, // Would need real price
                healthFactor: 2.5, // Would need to calculate from pool oracle
                liquidationThreshold: poolInfo.liquidationThreshold,
                status: 'healthy'
              })
            }

            // Create position for borrowed assets
            if (liabilities > 0) {
              positions.push({
                id: `${reserveAddress}-borrow`,
                asset: poolInfo.asset,
                address: reserveAddress,
                type: 'borrowing',
                amount: liabilities,
                apy: -poolInfo.borrowAPY,
                totalValue: liabilities * 1,
                healthFactor: 1.5, // Would need to calculate from pool oracle
                liquidationThreshold: poolInfo.liquidationThreshold,
                status: 'healthy' // Would need to calculate based on health factor
              })
            }
          }
        } catch (poolError) {
          console.log(`No positions found for asset ${assetAddress}:`, poolError)
          // Continue to next asset
        }
      }

      console.log(`Found ${positions.length} real positions for ${publicKey}`)
      return positions
    } catch (error) {
      console.error('Real user position query failed:', error)
      throw error
    }
  }

  private getGeneratedPositions(publicKey: string): Position[] {
    // Fallback: generate positions based on wallet address hash for consistency
    const assetTokens = [
      this.contracts.USDC_TOKEN,
      this.contracts.XLM_TOKEN,
      this.contracts.BLND_TOKEN
    ]

    // Add testnet-specific assets
    if (this.networkPassphrase === STELLAR_NETWORKS.TESTNET) {
      assetTokens.push(
        this.contracts.WETH_TOKEN,
        this.contracts.WBTC_TOKEN
      )
    }

    const positions: Position[] = []

    for (const assetAddress of assetTokens) {
      // Generate positions based on wallet address hash for consistency
      const walletSeed = this.hashString(publicKey + assetAddress)
      const hasPosition = walletSeed % 100 > 40 // 60% chance of having a position

      if (hasPosition) {
        const isLending = (walletSeed % 100) > 30 // 70% chance of lending vs borrowing
        const baseAmount = (walletSeed % 50000) + 1000 // Deterministic amount

        // Get pool info for this asset (use sync mock data)
        const poolInfo = this.getMockPoolData(assetAddress)
        if (poolInfo) {
          const position: Position = {
            id: `${assetAddress}-${isLending ? 'supply' : 'borrow'}`,
            asset: poolInfo.asset,
            address: assetAddress,
            type: isLending ? 'lending' : 'borrowing',
            amount: baseAmount,
            apy: isLending ? poolInfo.supplyAPY : -poolInfo.borrowAPY,
            totalValue: baseAmount * (isLending ? 1 : 1),
            healthFactor: isLending ? 2.5 : 1.2 + ((walletSeed % 80) / 100),
            liquidationThreshold: poolInfo.liquidationThreshold,
            status: isLending ? 'healthy' as const : ((walletSeed % 100) > 70 ? 'at_risk' as const : 'healthy' as const)
          }
          positions.push(position)
        }
      }
    }

    console.log(`Generated ${positions.length} fallback positions for ${publicKey}`)
    return positions
  }

  // Simple hash function for deterministic randomness
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  async buildSupplyTransaction(publicKey: string, assetAddress: string, amount: number): Promise<string | null> {
    try {
      console.log(`Building supply transaction: ${amount} of ${assetAddress} for ${publicKey}`)
      
      // Import Blend SDK dynamically
      const { PoolContract, RequestType } = await import('@blend-capital/blend-sdk')
      
      // For demo purposes, use a mock pool address since we don't have real pool contracts deployed
      const mockPoolAddress = 'CBQHNAXSI55GX2GN6D67GK7BHVPSLJUGZQEU7WJ5LKR5PNUCGLIMAO4K'
      
      // Create pool contract instance
      const poolContract = new PoolContract(mockPoolAddress)
      
      // Build supply operation
      const operation = poolContract.submit({
        from: publicKey,
        spender: publicKey,
        to: publicKey,
        requests: [{
          amount: BigInt(Math.floor(amount * 1e7)), // Convert to stroops as bigint
          request_type: RequestType.SupplyCollateral,
          address: assetAddress,
        }],
      })

      console.log('Built supply transaction XDR:', operation)
      return operation // Returns base64 XDR string
      
    } catch (error) {
      console.error('Failed to build supply transaction:', error)
      return null
    }
  }

  async buildBorrowTransaction(publicKey: string, assetAddress: string, amount: number): Promise<string | null> {
    try {
      console.log(`Building borrow transaction: ${amount} of ${assetAddress} for ${publicKey}`)
      
      // Import Blend SDK dynamically
      const { PoolContract, RequestType } = await import('@blend-capital/blend-sdk')
      
      // For demo purposes, use a mock pool address since we don't have real pool contracts deployed
      const mockPoolAddress = 'CBQHNAXSI55GX2GN6D67GK7BHVPSLJUGZQEU7WJ5LKR5PNUCGLIMAO4K'
      
      // Create pool contract instance  
      const poolContract = new PoolContract(mockPoolAddress)
      
      // Build borrow operation
      const operation = poolContract.submit({
        from: publicKey,
        spender: publicKey,
        to: publicKey,
        requests: [{
          amount: BigInt(Math.floor(amount * 1e7)), // Convert to stroops as bigint
          request_type: RequestType.Borrow,
          address: assetAddress,
        }],
      })

      console.log('Built borrow transaction XDR:', operation)
      return operation // Returns base64 XDR string
      
    } catch (error) {
      console.error('Failed to build borrow transaction:', error)
      return null
    }
  }

  async getAllPoolsInfo() {
    try {
      const poolsInfo = []
      
      // Get info for all available assets
      const assetTokens = [
        this.contracts.USDC_TOKEN,
        this.contracts.XLM_TOKEN,
        this.contracts.BLND_TOKEN
      ]

      // Add testnet-specific assets
      if (this.networkPassphrase === STELLAR_NETWORKS.TESTNET) {
        assetTokens.push(
          this.contracts.WETH_TOKEN,
          this.contracts.WBTC_TOKEN
        )
      }

      for (const assetAddress of assetTokens) {
        const info = await this.getPoolInfo(assetAddress)
        if (info) {
          poolsInfo.push({
            name: info.asset,
            address: assetAddress,
            ...info
          })
        }
      }

      console.log(`Loaded ${poolsInfo.length} pools for ${this.networkPassphrase}`)
      return poolsInfo
    } catch (error) {
      console.error('Failed to get all pools info:', error)
      return []
    }
  }

  async getOptimizationSuggestions(positions: Position[]) {
    try {
      const suggestions = []

      // Analyze positions for optimization opportunities
      for (const position of positions) {
        // Yield optimization suggestions
        if (position.type === 'lending' && position.apy < 10) {
          suggestions.push({
            id: `yield-${position.id}`,
            type: 'yield' as const,
            title: `Optimize ${position.asset} Yield`,
            description: `Move to higher-yield pool for +${(Math.random() * 3 + 1).toFixed(1)}% APY`,
            estimatedGain: position.totalValue * 0.03, // 3% estimated gain
            riskLevel: 'low' as const
          })
        }

        // Safety suggestions for risky positions
        if (position.healthFactor < 1.5) {
          suggestions.push({
            id: `safety-${position.id}`,
            type: 'safety' as const,
            title: `Improve ${position.asset} Safety`,
            description: 'Add collateral to increase health factor above 1.5',
            estimatedGain: 0,
            riskLevel: 'low' as const
          })
        }

        // Leverage opportunities
        if (position.type === 'lending' && position.healthFactor > 2.0) {
          suggestions.push({
            id: `leverage-${position.id}`,
            type: 'leverage' as const,
            title: `Strategic Leverage with ${position.asset}`,
            description: 'Use as collateral for additional lending position',
            estimatedGain: position.totalValue * 0.15, // 15% estimated gain
            riskLevel: 'medium' as const
          })
        }
      }

      return suggestions.slice(0, 3) // Return top 3 suggestions
    } catch (error) {
      console.error('Failed to get optimization suggestions:', error)
      return []
    }
  }
}

export const blendService = new BlendService()