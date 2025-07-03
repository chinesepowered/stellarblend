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
  private isMainnet: boolean

  constructor(networkPassphrase: string = STELLAR_NETWORKS.TESTNET) {
    this.networkPassphrase = networkPassphrase
    this.contracts = getNetworkContracts(networkPassphrase)
    this.isMainnet = networkPassphrase === STELLAR_NETWORKS.PUBLIC
    console.log('Blend service initialized for network:', this.networkPassphrase)
    console.log('Using contracts:', this.contracts)
    console.log('Mainnet mode:', this.isMainnet)
  }

  updateNetwork(networkPassphrase: string) {
    console.log('🔄 BlendService: Switching network from', this.networkPassphrase, 'to', networkPassphrase)
    this.networkPassphrase = networkPassphrase
    this.contracts = getNetworkContracts(networkPassphrase)
    this.isMainnet = networkPassphrase === STELLAR_NETWORKS.PUBLIC
    console.log('✅ BlendService updated for network:', this.networkPassphrase)
    console.log('📋 Using contracts:', this.contracts)
    console.log('🌐 Mainnet mode:', this.isMainnet)
  }

  async getPoolInfo(assetAddress: string) {
    try {
      // Always try to get real pool data first
      return await this.queryRealPoolData(assetAddress)
    } catch (error) {
      if (this.isMainnet) {
        // On mainnet, never fall back to mock data - throw the error
        console.error('❌ Failed to load real pool data on mainnet:', error)
        throw new Error(`No real pool found for ${this.getAssetName(assetAddress)} on mainnet`)
      } else {
        // On testnet, fall back to demo data
        console.error('Failed to get real pool info, falling back to demo data:', error)
        const mockData = this.getMockPoolData(assetAddress)
        if (mockData) {
          mockData.isRealData = false
          mockData.poolAddress = 'TESTNET_DEMO_MODE'
        }
        return mockData
      }
    }
  }

  private async queryRealPoolData(assetAddress: string) {
    try {
      if (this.isMainnet) {
        // On mainnet, attempt to load real pools
        console.log(`🔍 Loading real Blend pools for ${this.getAssetName(assetAddress)} on mainnet`)
        
        const { Pool } = await import('@blend-capital/blend-sdk')
        
        const network = {
          rpc: this.networkPassphrase === STELLAR_NETWORKS.PUBLIC
            ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
            : 'https://soroban-testnet.stellar.org',
          passphrase: this.networkPassphrase
        }

        // Try to discover pools via Pool Factory
        // Note: This might need to be adapted based on actual Pool Factory API
        console.log('📋 Attempting to discover pools via Pool Factory...')
        
        // For now, we'll try some known mainnet pool addresses
        // These would ideally be discovered from Pool Factory events or a pool registry
        const knownMainnetPools: string[] = [
          // Add known mainnet pool addresses here when available
          // These would be discovered from the Pool Factory in a production app
        ]
        
        if (knownMainnetPools.length === 0) {
          console.log('⚠️  No known mainnet pool addresses configured')
          console.log('   Pool discovery from Pool Factory needs to be implemented')
          throw new Error('Pool discovery not yet implemented for mainnet')
        }
        
        // Try to load each known pool
        for (const poolAddress of knownMainnetPools) {
          try {
            console.log(`🔄 Trying to load mainnet pool ${poolAddress}...`)
            const pool = await Pool.load(network, poolAddress)
            
            console.log(`✅ Pool loaded! Checking if it supports ${assetAddress}...`)
            console.log('📊 Available reserves:', Array.from(pool.reserves.keys()))
            
            if (pool.reserves.has(assetAddress)) {
              const reserve = pool.reserves.get(assetAddress)
              if (!reserve) {
                console.log(`❌ Reserve found but is null for ${assetAddress}`)
                continue
              }
              
              console.log(`🎉 Found real mainnet pool data for ${this.getAssetName(assetAddress)}!`)
              
              // Get real reserve data
              const totalSupply = reserve.totalSupplyFloat()
              const totalBorrow = reserve.totalLiabilitiesFloat()
              const utilizationRate = reserve.getUtilizationFloat()
              const borrowAPY = reserve.borrowApr * 100
              const supplyAPY = reserve.supplyApr * 100
              
              console.log('📈 Real mainnet pool metrics:', {
                totalSupply: totalSupply.toFixed(2),
                totalBorrow: totalBorrow.toFixed(2),
                utilizationRate: (utilizationRate * 100).toFixed(1) + '%',
                supplyAPY: supplyAPY.toFixed(2) + '%',
                borrowAPY: borrowAPY.toFixed(2) + '%'
              })
              
              return {
                asset: this.getAssetName(assetAddress),
                address: assetAddress,
                poolAddress: poolAddress,
                totalSupply: totalSupply,
                totalBorrow: totalBorrow,
                supplyAPY: supplyAPY,
                borrowAPY: borrowAPY,
                utilizationRate: utilizationRate,
                liquidationThreshold: reserve.getCollateralFactor(),
                isRealData: true
              }
            } else {
              console.log(`❌ Pool ${poolAddress} does not support asset ${assetAddress}`)
            }
          } catch (poolError) {
            console.log(`❌ Failed to load pool ${poolAddress}:`, (poolError as Error).message)
            continue
          }
        }
        
        throw new Error(`No mainnet pools found supporting ${this.getAssetName(assetAddress)}`)
        
      } else {
        // On testnet, use demo data
        console.log(`🔍 Testnet mode - generating demo data for ${this.getAssetName(assetAddress)}`)
        console.log('ℹ️  Note: Blend core contracts are deployed, but individual pools must be created separately')
        console.log('💡 To deploy real pools, use: https://github.com/blend-capital/blend-utils')
        console.log('📝 For demo purposes, using realistic mock data that shows the full UI')
        
        // Generate realistic demo data for testnet
        const assetName = this.getAssetName(assetAddress)
        const mockData = {
          asset: assetName,
          address: assetAddress,
          poolAddress: 'TESTNET_DEMO_MODE',
          totalSupply: Math.random() * 10000000 + 1000000,
          totalBorrow: Math.random() * 5000000 + 500000,
          supplyAPY: Math.random() * 10 + 3, // 3-13% APY
          borrowAPY: Math.random() * 15 + 5, // 5-20% APY
          utilizationRate: 0, // Will be calculated below
          liquidationThreshold: 0.75 + Math.random() * 0.15, // 75-90%
          isRealData: false
        }
        
        mockData.utilizationRate = mockData.totalBorrow / mockData.totalSupply
        
        console.log(`📊 Generated testnet demo data for ${assetName}:`, {
          totalSupply: mockData.totalSupply.toFixed(2),
          totalBorrow: mockData.totalBorrow.toFixed(2),
          utilizationRate: (mockData.utilizationRate * 100).toFixed(1) + '%',
          supplyAPY: mockData.supplyAPY.toFixed(2) + '%',
          borrowAPY: mockData.borrowAPY.toFixed(2) + '%'
        })
        
        return mockData
      }
      
    } catch (error) {
      console.error('❌ Pool query failed:', error)
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
      // Only return positions if publicKey is provided and valid
      if (!publicKey || publicKey.trim() === '') {
        console.log('No public key provided, returning empty positions')
        return []
      }
      
      if (this.isMainnet) {
        // On mainnet, never return mock data - only real positions
        console.log(`🌐 Mainnet: Attempting to load real positions for ${publicKey}`)
        
        try {
          // TODO: Implement real position loading from Blend pools
          // For now, return empty array until real pools are deployed
          console.log('⚠️  Real position loading not yet implemented for mainnet')
          console.log('📋 No mainnet Blend pools deployed yet - returning empty positions')
          return []
        } catch (error) {
          console.error('❌ Failed to load real positions on mainnet:', error)
          return []
        }
      } else {
        // On testnet, use demo data for functionality showcase
        console.log(`🧪 Testnet: Generating demo positions for ${publicKey}`)
        return this.getGeneratedPositions(publicKey)
      }
    } catch (error) {
      console.error('Failed to get user positions:', error)
      return []
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