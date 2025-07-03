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

  async getPoolInfo(assetAddress: string): Promise<any> {
    try {
      return await this.queryRealPoolData(assetAddress)
    } catch (error) {
      if (this.isMainnet) {
        console.error('❌ Failed to load real pool data on mainnet:', error)
        throw new Error(`No real pool found for ${this.getAssetName(assetAddress)} on mainnet`)
      } else {
        // On testnet, fall back to demo data if real pool discovery fails
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
    // Generate consistent, rich demo positions for testnet showcase
    const demoPositions: Position[] = []
    
    // Define demo assets with guaranteed amounts for reliable demo experience
    const demoAssets = [
      { address: this.contracts.USDC_TOKEN, minAmount: 5000, maxAmount: 25000, preferLending: true },
      { address: this.contracts.XLM_TOKEN, minAmount: 10000, maxAmount: 50000, preferLending: false },
      { address: this.contracts.BLND_TOKEN, minAmount: 2000, maxAmount: 8000, preferLending: true }
    ]

    // Add testnet-specific assets for richer demo
    if (this.networkPassphrase === STELLAR_NETWORKS.TESTNET) {
      demoAssets.push(
        { address: this.contracts.WETH_TOKEN, minAmount: 3000, maxAmount: 12000, preferLending: false },
        { address: this.contracts.WBTC_TOKEN, minAmount: 1000, maxAmount: 5000, preferLending: true }
      )
    }

    for (let i = 0; i < demoAssets.length; i++) {
      const asset = demoAssets[i]
      const walletSeed = this.hashString(publicKey + asset.address)
      
      // Always generate at least 3-4 positions for a good demo
      const shouldGenerate = i < 3 || (walletSeed % 100) > 30 // First 3 guaranteed, others 70% chance
      
      if (shouldGenerate) {
        const isLending = asset.preferLending ? (walletSeed % 100) > 25 : (walletSeed % 100) > 65
        const amount = asset.minAmount + (walletSeed % (asset.maxAmount - asset.minAmount))
        
        // Get pool info for this asset
        const poolInfo = this.getMockPoolData(asset.address)
        if (poolInfo) {
          // For demo purposes, adjust APY to ensure optimization suggestions
          let adjustedSupplyAPY = poolInfo.supplyAPY
          let adjustedBorrowAPY = poolInfo.borrowAPY
          
          // Make some positions have lower APY to trigger optimization suggestions
          if (i === 1 && isLending) {
            adjustedSupplyAPY = Math.max(3, poolInfo.supplyAPY - 5) // Lower supply APY for optimization
          }
          
          const position: Position = {
            id: `${asset.address}-${isLending ? 'supply' : 'borrow'}`,
            asset: poolInfo.asset,
            address: asset.address,
            type: isLending ? 'lending' : 'borrowing',
            amount: amount,
            apy: isLending ? adjustedSupplyAPY : -adjustedBorrowAPY,
            totalValue: amount,
            healthFactor: isLending ? 2.1 + ((walletSeed % 40) / 100) : 1.3 + ((walletSeed % 60) / 100),
            liquidationThreshold: poolInfo.liquidationThreshold,
            status: this.getDemoPositionStatus(isLending, walletSeed)
          }
          demoPositions.push(position)
        }
      }
    }

    // Ensure we always have at least 2 positions for a good demo
    if (demoPositions.length < 2) {
      console.log('⚠️  Demo had insufficient positions, adding guaranteed ones...')
      
      // Add guaranteed USDC lending position
      const usdcPool = this.getMockPoolData(this.contracts.USDC_TOKEN)
      if (usdcPool) {
        demoPositions.push({
          id: `${this.contracts.USDC_TOKEN}-supply-guaranteed`,
          asset: usdcPool.asset,
          address: this.contracts.USDC_TOKEN,
          type: 'lending',
          amount: 15000,
          apy: usdcPool.supplyAPY,
          totalValue: 15000,
          healthFactor: 2.4,
          liquidationThreshold: usdcPool.liquidationThreshold,
          status: 'healthy' as const
        })
      }

      // Add guaranteed XLM borrowing position  
      const xlmPool = this.getMockPoolData(this.contracts.XLM_TOKEN)
      if (xlmPool) {
        demoPositions.push({
          id: `${this.contracts.XLM_TOKEN}-borrow-guaranteed`,
          asset: xlmPool.asset,
          address: this.contracts.XLM_TOKEN,
          type: 'borrowing',
          amount: 8000,
          apy: -xlmPool.borrowAPY,
          totalValue: 8000,
          healthFactor: 1.6,
          liquidationThreshold: xlmPool.liquidationThreshold,
          status: 'healthy' as const
        })
      }
    }

    console.log(`🧪 Generated ${demoPositions.length} reliable demo positions for testnet showcase`)
    console.log(`💰 Total demo portfolio value: $${demoPositions.reduce((sum, p) => sum + p.totalValue, 0).toLocaleString()}`)
    
    return demoPositions
  }

  private getDemoPositionStatus(isLending: boolean, seed: number): 'healthy' | 'at_risk' | 'active' {
    if (isLending) return 'healthy' // Lending positions are always healthy
    
    const risk = seed % 100
    if (risk > 85) return 'at_risk' // 15% chance of at-risk for borrowing
    return 'healthy'
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
      console.log(`🔍 Discovering pools on ${this.isMainnet ? 'mainnet' : 'testnet'}...`)
      
      if (this.isMainnet) {
        // On mainnet, try to discover real deployed pools
        console.log('🏭 Checking for deployed Blend pools on mainnet...')
        console.log('📋 Pool Factory: CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU')
        
        try {
          // Method 1: Try to discover pools via Pool Factory events
          const discoveredPools = await this.discoverPoolsFromEvents()
          
          if (discoveredPools.length > 0) {
            console.log(`🎉 Discovered ${discoveredPools.length} real mainnet pools via events!`)
            return discoveredPools
          }
          
          // Method 2: Try known pool addresses (community-sourced)
          const knownPools = await this.tryKnownPools()
          
          if (knownPools.length > 0) {
            console.log(`🎉 Found ${knownPools.length} known mainnet pools!`)
            return knownPools
          }
          
          console.log('📭 No mainnet pools found')
          console.log('💡 This is normal - pools are deployed by individual users/organizations')
          console.log('⚠️  Note: https://mainnet.blend.capital is currently geo-blocked')
          console.log('🚀 Deploy your own pool using blend-utils: https://github.com/blend-capital/blend-utils')
          return []
          
        } catch (error) {
          console.error('❌ Failed to discover mainnet pools:', error)
          console.log('📝 Pool discovery requires individual pool addresses to be known')
          console.log('🏭 Pool Factory does not provide enumeration API')
          return []
        }
      } else {
        // On testnet, try to discover real testnet pools first, then fall back to demo
        console.log('🧪 Testnet: Trying to discover real testnet pools first...')
        
        try {
          const realTestnetPools = await this.discoverRealTestnetPools()
          
          if (realTestnetPools.length > 0) {
            console.log(`🎉 Found ${realTestnetPools.length} real testnet pools!`)
            return realTestnetPools
          }
          
          console.log('📋 No real testnet pools found, using demo data for functionality showcase')
        } catch (error) {
          console.log('⚠️  Real testnet pool discovery failed, using demo data:', error)
        }
        
        // Fallback to demo pools for functionality showcase
        const poolsInfo = []
        
        const assetTokens = [
          this.contracts.USDC_TOKEN,
          this.contracts.XLM_TOKEN,
          this.contracts.BLND_TOKEN,
          this.contracts.WETH_TOKEN,
          this.contracts.WBTC_TOKEN
        ]

        for (const assetAddress of assetTokens) {
          const info = await this.getPoolInfo(assetAddress)
          if (info) {
            poolsInfo.push({
              name: info.asset,
              address: assetAddress,
              poolAddress: info.poolAddress,
              isDemo: true, // Mark as demo data
              ...info
            })
          }
        }

        console.log(`🧪 Generated ${poolsInfo.length} demo pools for testnet showcase`)
        return poolsInfo
      }
    } catch (error) {
      console.error('Failed to get all pools info:', error)
      return []
    }
  }

  private async discoverPoolsFromEvents(): Promise<any[]> {
    try {
      console.log('🔍 Discovering pools via Pool Factory events...')
      
      // Use Stellar SDK to query Pool Factory events
      const { Horizon } = await import('@stellar/stellar-sdk')
      
      const server = new Horizon.Server('https://horizon.stellar.org')
      const POOL_FACTORY_ADDRESS = 'CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU'
      
      // Query contract events for pool deployments
      console.log('📡 Querying Pool Factory deployment events...')
      
      const eventCall = server.operations()
        .forAccount(POOL_FACTORY_ADDRESS)
        .order('desc')
        .limit(100)
      
      const events = await eventCall.call()
      console.log(`📋 Found ${events.records.length} Pool Factory operations`)
      
      // Filter for pool deployment operations and extract pool addresses
      const poolAddresses: string[] = []
      
      for (const operation of events.records) {
        // Look for invoke_contract operations that might be pool deployments
        if (operation.type === 'invoke_host_function') {
          console.log('🔍 Found potential pool deployment operation:', operation.id)
          // TODO: Parse operation details to extract deployed pool address
          // This would require analyzing the operation's effects and return values
        }
      }
      
      if (poolAddresses.length === 0) {
        console.log('⚠️  No pool addresses found in Pool Factory events')
        console.log('💡 This might mean no pools have been deployed yet, or event parsing needs refinement')
        return []
      }
      
      // Load discovered pools
      const discoveredPools = []
      for (const poolAddress of poolAddresses) {
        try {
          const pools = await this.loadPoolData(poolAddress)
          discoveredPools.push(...pools)
        } catch (error) {
          console.log(`❌ Failed to load pool ${poolAddress}:`, error)
        }
      }
      
      return discoveredPools
      
    } catch (error) {
      console.error('❌ Event-based pool discovery failed:', error)
      return []
    }
  }

  private async tryKnownPools(): Promise<any[]> {
    try {
      console.log('🔍 Trying known community pool addresses...')
      
      // Known mainnet pool addresses from community sources
      // These would be updated as pools are discovered and shared
      const knownMainnetPools: string[] = [
        // Add known deployed pool addresses here when they become available
        // Example: 'CBQHNAXSI55GX2GN6D67GK7BHVPSLJUGZQEU7WJ5LKR5PNUCGLIMAO4K'
      ]
      
      if (knownMainnetPools.length === 0) {
        console.log('📭 No known pool addresses configured')
        console.log('💡 Pool addresses would be added here as they are discovered by the community')
        return []
      }
      
      const discoveredPools = []
      
      for (const poolAddress of knownMainnetPools) {
        try {
          const pools = await this.loadPoolData(poolAddress)
          discoveredPools.push(...pools)
        } catch (error) {
          console.log(`❌ Failed to load known pool ${poolAddress}:`, error)
        }
      }
      
      return discoveredPools
      
    } catch (error) {
      console.error('❌ Known pool discovery failed:', error)
      return []
    }
  }

  private async loadPoolData(poolAddress: string): Promise<any[]> {
    try {
      const { Pool } = await import('@blend-capital/blend-sdk')
      
      const network = {
        rpc: 'https://soroban-rpc.mainnet.stellar.gateway.fm',
        passphrase: this.networkPassphrase
      }
      
      console.log(`🔄 Loading pool data for ${poolAddress}...`)
      const pool = await Pool.load(network, poolAddress)
      
      console.log(`✅ Pool ${poolAddress} loaded successfully!`)
      console.log(`📊 Pool has ${Array.from(pool.reserves.keys()).length} reserves`)
      
      // Convert pool reserves to our format
      const poolData = []
      for (const [assetAddress, reserve] of pool.reserves.entries()) {
        if (reserve) {
          poolData.push({
            name: this.getAssetName(assetAddress),
            address: assetAddress,
            poolAddress: poolAddress,
            totalSupply: reserve.totalSupplyFloat(),
            totalBorrow: reserve.totalLiabilitiesFloat(),
            supplyAPY: reserve.supplyApr * 100,
            borrowAPY: reserve.borrowApr * 100,
            utilizationRate: reserve.getUtilizationFloat(),
            liquidationThreshold: reserve.getCollateralFactor(),
            isRealData: true
          })
        }
      }
      
      return poolData
      
    } catch (error) {
      console.error(`❌ Failed to load pool ${poolAddress}:`, error)
      throw error
    }
  }

  async getOptimizationSuggestions(positions: Position[]) {
    try {
      // Don't show optimization suggestions on mainnet if no positions
      if (this.isMainnet && positions.length === 0) {
        console.log('🌐 Mainnet: No optimization suggestions without real positions')
        return []
      }
      
      // Don't show optimization suggestions if no positions at all
      if (positions.length === 0) {
        console.log('📋 No positions available for optimization')
        return []
      }

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

      console.log(`💡 Generated ${suggestions.length} optimization suggestions for ${this.isMainnet ? 'mainnet' : 'testnet'}`)
      return suggestions.slice(0, 3) // Return top 3 suggestions
    } catch (error) {
      console.error('Failed to get optimization suggestions:', error)
      return []
    }
  }

  private async discoverRealTestnetPools(): Promise<any[]> {
    if (this.isMainnet) {
      return [] // This method is only for testnet
    }

    console.log('🔍 Attempting to discover real Blend pools on testnet...')
    
    try {
      const { Pool } = await import('@blend-capital/blend-sdk')
      
      const network = {
        rpc: 'https://soroban-testnet.stellar.org',
        passphrase: this.networkPassphrase
      }

      // Known testnet pool addresses (these could be discovered from Pool Factory)
      // For now, we'll try some expected testnet pool patterns
      const testnetPoolCandidates: string[] = [
        // Add known testnet pool addresses here
        // These would ideally be discovered from Pool Factory events on testnet
      ]

      // Try to discover pools from Pool Factory events on testnet
      const discoveredPools = await this.discoverPoolsFromEvents()
      testnetPoolCandidates.push(...discoveredPools.map(p => p.address))

      console.log(`🔎 Checking ${testnetPoolCandidates.length} potential testnet pools...`)

      const realPools: any[] = []

      for (const poolAddress of testnetPoolCandidates) {
        try {
          console.log(`🔄 Loading testnet pool ${poolAddress}...`)
          const pool = await Pool.load(network, poolAddress)
          
          console.log(`✅ Pool loaded! Available reserves:`, Array.from(pool.reserves.keys()))
          
          // Convert pool reserves to our format
          for (const [assetAddress, reserve] of pool.reserves) {
            if (!reserve) continue
            
            const poolInfo = {
              asset: this.getAssetName(assetAddress),
              address: assetAddress,
              poolAddress: poolAddress,
              totalSupply: reserve.totalSupplyFloat(),
              totalBorrow: reserve.totalLiabilitiesFloat(),
              supplyAPY: reserve.supplyApr * 100,
              borrowAPY: reserve.borrowApr * 100,
              utilizationRate: reserve.getUtilizationFloat(),
              liquidationThreshold: reserve.getCollateralFactor(),
              isRealData: true // This is real testnet data
            }
            
            realPools.push(poolInfo)
            console.log(`🎉 Added real testnet pool for ${poolInfo.asset}`)
          }
          
        } catch (poolError) {
          console.log(`❌ Failed to load testnet pool ${poolAddress}:`, (poolError as Error).message)
          continue
        }
      }

      if (realPools.length > 0) {
        console.log(`🎉 Successfully discovered ${realPools.length} real testnet pools!`)
        return realPools
      } else {
        console.log('📋 No real testnet pools discovered')
        return []
      }
      
    } catch (error) {
      console.error('❌ Testnet pool discovery failed:', error)
      return []
    }
  }
}

export const blendService = new BlendService()