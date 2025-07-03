import { Link } from 'react-router-dom'
import { Globe, TestTube, ArrowRight } from 'lucide-react'

export function NetworkSwitcher() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blend Position Manager</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your network to access Blend lending protocols on Stellar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mainnet Card */}
          <Link 
            to="/mainnet" 
            className="group block p-8 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-green-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mainnet</h3>
                  <p className="text-sm text-green-600 font-medium">Production Ready</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Real Blend Pools</p>
                  <p className="text-sm text-gray-600">Connect to actual deployed pools with real liquidity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Live Transactions</p>
                  <p className="text-sm text-gray-600">Execute real transactions on Stellar mainnet</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Production Data</p>
                  <p className="text-sm text-gray-600">Real APYs, utilization rates, and pool metrics</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm">
                Experience the fully functional app with real data and blockchain interactions on Stellar mainnet.
              </p>
            </div>
          </Link>

          {/* Testnet Card */}
          <Link 
            to="/testnet" 
            className="group block p-8 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Testnet</h3>
                  <p className="text-sm text-blue-600 font-medium">Demo Mode</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Demo Data</p>
                  <p className="text-sm text-gray-600">Realistic mock data showcasing full functionality</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Safe Testing</p>
                  <p className="text-sm text-gray-600">No real funds at risk - perfect for exploration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Full UI Features</p>
                  <p className="text-sm text-gray-600">Experience all animations and interactions</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Great for demos:</strong> Showcase all features without needing real funds
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            You can switch between networks anytime using the URL: 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">/mainnet</span> or 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">/testnet</span>
          </p>
        </div>
      </div>
    </div>
  )
} 