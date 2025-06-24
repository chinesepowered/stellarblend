import { useState } from 'react'
import { PositionManager } from './components/PositionManager-simple'
import { WalletConnect } from './components/WalletConnect-simple'
import { PoolInfo } from './components/PoolInfo'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Blend Position Manager</h1>
            </div>
            <WalletConnect isConnected={isConnected} onConnect={setIsConnected} />
          </div>
        </div>
      </header>
      
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
            </div>
            
            <PoolInfo />
          </div>
        )}
      </main>
    </div>
  )
}

export default App