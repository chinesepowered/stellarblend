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
    
    // Add global debugging helper for Freighter API
    if (typeof window !== 'undefined') {
      (window as any).debugFreighter = async () => {
        console.log('=== Freighter Debug Info ===')
        try {
          const { isConnected, getAddress, requestAccess } = await import('@stellar/freighter-api')
          const status = await isConnected()
          console.log('Freighter API isConnected():', status)
          console.log('Extension available:', status.isConnected)
          
          if (status.isConnected) {
            console.log('Testing getAddress() (no prompt):')
            const addressResponse = await getAddress()
            console.log('getAddress() response:', addressResponse)
            
            console.log('Testing requestAccess() (may prompt):')
            const accessResponse = await requestAccess()
            console.log('requestAccess() response:', accessResponse)
          }
        } catch (error) {
          console.log('Freighter API error:', error)
        }
        console.log('===========================')
      }
      console.log('Run debugFreighter() in console to check Freighter status')
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      // Import the official Freighter API
      const { isConnected, requestAccess } = await import('@stellar/freighter-api')
      
      console.log('🔍 Checking if Freighter is connected...')
      
      // Check if Freighter is available and connected
      const connectionStatus = await isConnected()
      console.log('Freighter connection status:', connectionStatus)
      
      if (!connectionStatus.isConnected) {
        throw new Error('Freighter wallet not found. Please install the Freighter browser extension and make sure it is enabled.')
      }
      
      console.log('🚀 Freighter detected! Requesting access and public key...')
      
      // Request access (this will prompt user for permission and return the address)
      const accessResponse = await requestAccess()
      console.log('Access response:', accessResponse)
      
      if (accessResponse.error) {
        throw new Error(`Failed to get access: ${accessResponse.error}`)
      }
      
      const publicKey = accessResponse.address
      console.log('✅ Connected to Freighter wallet:', publicKey)
      
      return publicKey
      
    } catch (error) {
      console.error('Failed to connect Freighter wallet:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('User declined access') || error.message.includes('declined')) {
          throw new Error('Connection cancelled. Please approve the connection request in Freighter.')
        }
        if (error.message.includes('not found') || error.message.includes('not available')) {
          throw new Error('Freighter wallet not found. Please install the Freighter browser extension.')
        }
      }
      
      throw new Error('Failed to connect to Freighter wallet. Please make sure it is installed and unlocked.')
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

  async signAndSubmitTransaction(xdr: string): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      console.log('🔐 Signing transaction with Freighter...')
      
      // Import the Freighter API
      const { signTransaction } = await import('@stellar/freighter-api')
      
      // Sign the transaction XDR
      const signedResponse = await signTransaction(xdr, {
        networkPassphrase: this.networkPassphrase
      })
      
      if (signedResponse.error) {
        throw new Error(`Failed to sign transaction: ${signedResponse.error}`)
      }
      
      const signedXDR = signedResponse.signedTxXdr
      console.log('✅ Transaction signed successfully!')
      console.log('📋 Signed XDR:', signedXDR)
      
      // Submit to Stellar network
      console.log('🚀 Submitting transaction to Stellar network...')
      
      const { Horizon, TransactionBuilder } = await import('@stellar/stellar-sdk')
      
      // Create server instance  
      const server = new Horizon.Server(
        this.networkPassphrase === 'Public Global Stellar Network ; September 2015'
          ? 'https://horizon.stellar.org'
          : 'https://horizon-testnet.stellar.org'
      )
      
      // Build transaction from signed XDR
      const transaction = TransactionBuilder.fromXDR(signedXDR, this.networkPassphrase)
      
      // Submit transaction
      const result = await server.submitTransaction(transaction)
      
      console.log('🎉 Transaction submitted successfully!')
      console.log('📊 Transaction result:', result)
      
      return {
        success: true,
        result: {
          hash: result.hash,
          ledger: result.ledger,
          signedXDR
        }
      }
      
    } catch (error) {
      console.error('❌ Transaction failed:', error)
      
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Handle specific error cases
      if (errorMessage.includes('User declined') || errorMessage.includes('cancelled')) {
        errorMessage = 'Transaction cancelled by user'
      } else if (errorMessage.includes('not found') || errorMessage.includes('not available')) {
        errorMessage = 'Freighter wallet not found or not connected'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export const stellarService = new StellarService()