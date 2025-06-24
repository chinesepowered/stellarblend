// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const StellarSdk: any

export class StellarService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server: any
  private networkPassphrase: string

  constructor(networkPassphrase: string = 'Test SDF Network ; September 2015') {
    this.networkPassphrase = networkPassphrase
    
    // Use appropriate Horizon server for the network
    const serverUrl = networkPassphrase === 'Public Global Stellar Network ; September 2015'
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org'
    
    // For now, we'll create a simple mock server to avoid SDK import issues
    this.server = {
      loadAccount: async (publicKey: string) => {
        // Mock account data for demo
        console.log('Loading account data for:', publicKey)
        return {
          balances: [
            {
              asset_type: 'native',
              balance: '1000.0000000',
              limit: null
            },
            {
              asset_type: 'credit_alphanum4',
              asset_code: 'USDC',
              balance: '500.0000000',
              limit: '10000.0000000'
            }
          ]
        }
      }
    }
    
    console.log('Stellar service initialized for network:', this.networkPassphrase)
    console.log('Using Horizon server:', serverUrl)
  }

  async connectWallet(): Promise<string | null> {
    if (typeof window !== 'undefined' && 'freighter' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const freighter = (window as any).freighter
        
        // Check if Freighter is available
        const isAvailable = await freighter.isConnected()
        if (!isAvailable) {
          // Request access if not already connected
          await freighter.requestAccess()
        }
        
        // Get the public key
        const publicKey = await freighter.getPublicKey()
        console.log('Connected to Freighter wallet:', publicKey)
        return publicKey
      } catch (error) {
        console.error('Failed to connect Freighter wallet:', error)
        throw new Error('Failed to connect to Freighter wallet. Please make sure it is installed and unlocked.')
      }
    } else {
      throw new Error('Freighter wallet not found. Please install the Freighter browser extension.')
    }
  }

  async getAccountBalances(publicKey: string) {
    try {
      const account = await this.server.loadAccount(publicKey)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return account.balances.map((balance: any) => ({
        asset: balance.asset_type === 'native' ? 'XLM' : 
               balance.asset_type === 'credit_alphanum4' ? balance.asset_code :
               balance.asset_code || 'Unknown',
        balance: parseFloat(balance.balance),
        limit: balance.limit ? parseFloat(balance.limit) : null
      }))
    } catch (error) {
      console.error('Failed to load account balances:', error)
      return []
    }
  }

  async getBlendPositions(publicKey: string, poolAddress: string) {
    try {
      // TODO: Implement actual Blend SDK integration
      // For now, return mock data
      console.log('Getting positions for:', publicKey, poolAddress)
      return []
    } catch (error) {
      console.error('Failed to load Blend positions:', error)
      return []
    }
  }

  async supplyToPool(
    publicKey: string,
    poolAddress: string,
    asset: string,
    amount: number
  ) {
    try {
      // TODO: Implement actual Blend pool supply transaction
      console.log('Supplying to pool:', { publicKey, poolAddress, asset, amount })
      return false
    } catch (error) {
      console.error('Failed to supply to pool:', error)
      return false
    }
  }

  async borrowFromPool(
    publicKey: string,
    poolAddress: string,
    asset: string,
    amount: number
  ) {
    try {
      // TODO: Implement actual Blend pool borrow transaction
      console.log('Borrowing from pool:', { publicKey, poolAddress, asset, amount })
      return false
    } catch (error) {
      console.error('Failed to borrow from pool:', error)
      return false
    }
  }
}

export const stellarService = new StellarService()