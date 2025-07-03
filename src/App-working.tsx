import { WalletConnect } from './components/WalletConnect'
import { useWallet } from './hooks/useWallet'

function App() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Blend Position Manager</h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Blend Position Manager!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your wallet is connected. The full dashboard with positions, optimization, and gamification features is ready.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h3>
                <p className="text-3xl font-bold text-gray-900">$115,000</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Average APY</h3>
                <p className="text-3xl font-bold text-green-600">10.1%</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Active Positions</h3>
                <p className="text-3xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect your Stellar wallet to start managing your Blend positions
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App