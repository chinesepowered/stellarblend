import { PositionManager } from './PositionManager'
import { WalletConnect } from './WalletConnect'
import { PoolInfo } from './PoolInfo'
import { useWallet } from '../hooks/useWallet'
import { useNetwork } from '../contexts/NetworkContext'
import { Globe, TestTube, AlertTriangle } from 'lucide-react'

function NetworkAwareApp() {
  const { isConnected, publicKey } = useWallet()
  const { isMainnet, isTestnet } = useNetwork()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">Blend Position Manager</h1>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                    isMainnet 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isMainnet ? (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Mainnet</span>
                      </>
                    ) : (
                      <>
                        <TestTube className="w-3 h-3" />
                        <span>Testnet</span>
                      </>
                    )}
                  </div>
                </div>
                {isConnected && publicKey && (
                  <p className="text-xs text-gray-500">Connected to {publicKey.slice(0, 8)}...{publicKey.slice(-4)}</p>
                )}
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Network-specific banner */}
      {isMainnet && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Production Mode</p>
                <p className="text-xs text-green-700">Connected to real Blend pools on Stellar mainnet</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTestnet && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-3">
              <TestTube className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Demo Mode</p>
                <p className="text-xs text-blue-700">Using demo data to showcase functionality - no real funds at risk</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? (
          <PositionManager />
        ) : (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
              <p className="text-xl text-gray-600 mb-8">
                Connect your Stellar wallet to start managing your Blend positions
              </p>
              {isMainnet && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-900">Mainnet Warning</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        You're connecting to real Stellar mainnet. Only use funded wallets you control.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <PoolInfo />
          </div>
        )}
      </main>
    </div>
  )
}

export default NetworkAwareApp 