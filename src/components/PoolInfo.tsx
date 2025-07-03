import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart3, Loader2, TestTube, AlertTriangle, Globe } from 'lucide-react'
import { blendService } from '../services/blendService'
import { useNetwork } from '../contexts/NetworkContext'

interface PoolData {
  asset: string
  address: string
  poolAddress: string
  totalSupply: number
  totalBorrow: number
  supplyAPY: number
  borrowAPY: number
  utilizationRate: number
  liquidationThreshold: number
  isRealData?: boolean
}

export function PoolInfo() {
  const { isMainnet, isTestnet } = useNetwork()
  const [pools, setPools] = useState<PoolData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPools = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log(`🔄 Loading pool data for ${isMainnet ? 'mainnet' : 'testnet'}...`)
        
        // Use the improved getAllPoolsInfo method that handles network-specific discovery
        const discoveredPools = await blendService.getAllPoolsInfo()
        
        if (discoveredPools.length === 0) {
          if (isMainnet) {
            throw new Error('No mainnet Blend pools deployed yet')
          } else {
            throw new Error('No demo pools available')
          }
        }
        
        setPools(discoveredPools)
        console.log(`✅ Loaded ${discoveredPools.length} ${isMainnet ? 'mainnet' : 'demo'} pools`)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load pool data'
        console.error('❌ Pool loading error:', err)
        setError(errorMessage)
        setPools([])
      } finally {
        setLoading(false)
      }
    }

    loadPools()
  }, [isMainnet, isTestnet])

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">
            Loading {isMainnet ? 'mainnet' : 'testnet'} pool data...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isMainnet ? 'Mainnet Pools Geo-Blocked' : 'Pool Loading Error'}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {isMainnet && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                Mainnet pools are geo-restricted in many regions. 
                Try our <a href="/testnet" className="underline font-medium">demo environment</a> to explore full functionality safely.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show empty state when no pools found
  if (pools.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isMainnet ? 'Available Blend Pools' : 'Blend Pools (Demo)'}
            </h2>
            <p className="text-gray-600">
              {isMainnet 
                ? 'Production pools deployed on Stellar mainnet' 
                : 'Demo environment showcasing Blend functionality'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isMainnet ? (
              <Globe className="w-6 h-6 text-green-600" />
            ) : (
              <TestTube className="w-6 h-6 text-blue-600" />
            )}
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <div className="text-center py-8">
          {isMainnet ? (
            <>
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mainnet Pools Geo-Blocked</h3>
              <p className="text-gray-600 mb-4">
                Unable to access mainnet Blend pools due to geo-restrictions.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto text-left">
                <h4 className="font-semibold text-blue-900 mb-2">Production Environment</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Geo-restrictions:</strong> Official UI has regional access limitations</li>
                  <li>• <strong>Protocol is live:</strong> Core Blend contracts are deployed and functional</li>
                  <li>• <strong>Demo available:</strong> Full functionality accessible in test environment</li>
                  <li>• <strong>Alternative access:</strong> Deploy your own UI using <a href="https://github.com/blend-capital/blend-utils" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">blend-utils</a></li>
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-1">Demo Environment Benefits:</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Access to real Blend functionality without restrictions</li>
                    <li>• Safe testing environment with no real funds at risk</li>
                    <li>• Complete feature exploration and interaction testing</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <a href="/testnet" className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                  <TestTube className="w-4 h-4 mr-2" />
                  Explore Demo Environment
                </a>
              </div>
            </>
          ) : (
            <>
              <TestTube className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Environment Loading</h3>
              <p className="text-gray-600">
                Demo pools are temporarily unavailable. Please try again later.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isMainnet ? 'Available Blend Pools' : 'Blend Pools (Demo)'}
          </h2>
          <p className="text-gray-600">
            {isMainnet 
              ? 'Production pools deployed on Stellar mainnet' 
              : 'Demo environment showcasing Blend functionality'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isMainnet ? (
            <Globe className="w-6 h-6 text-green-600" />
          ) : (
            <TestTube className="w-6 h-6 text-blue-600" />
          )}
          <BarChart3 className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      {/* Network-specific information banner */}
      {isMainnet ? (
        pools.length > 0 && pools.some(pool => pool.isRealData === true) && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-1">Production Environment</h3>
                <p className="text-sm text-green-700">
                  These are live Blend pools with real liquidity on Stellar mainnet. 
                  Interactions involve real funds and blockchain transactions.
                </p>
              </div>
            </div>
          </div>
        )
      ) : (
        pools.some(pool => pool.isRealData === false) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Demo Environment</h3>
                <p className="text-sm text-blue-700 mb-2">
                  You're currently exploring our demo environment with simulated data. 
                  No real funds are at risk.
                </p>
                <p className="text-xs text-blue-600">
                  Deploy real pools using: <a href="https://github.com/blend-capital/blend-utils" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">blend-utils</a>
                </p>
              </div>
            </div>
          </div>
        )
      )}

      <div className="space-y-4">
        {pools.map((pool) => (
          <div key={pool.address} className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{pool.asset}</h3>
                {pool.isRealData === false && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    <TestTube className="w-3 h-3" />
                    <span>Demo Data</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {pool.address.slice(0, 6)}...{pool.address.slice(-6)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Supply APY</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">
                    {pool.supplyAPY.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Borrow APY</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-red-500" />
                  <span className="text-sm font-semibold text-red-600">
                    {pool.borrowAPY.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Total Supply</p>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    ${pool.totalSupply.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Utilization</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pool.utilizationRate * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {(pool.utilizationRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex text-xs text-gray-600 space-x-4">
                  <span>Total Borrowed: ${pool.totalBorrow.toLocaleString()}</span>
                  <span>Liquidation Threshold: {(pool.liquidationThreshold * 100).toFixed(0)}%</span>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  {isMainnet ? (
                    pool.isRealData === true ? (
                      <>
                        <button className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                          Supply
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                          Borrow
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Pool not deployed</span>
                    )
                  ) : (
                    <>
                      <button 
                        disabled 
                        className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                        title="Connect wallet to interact with demo pools"
                      >
                        Supply
                      </button>
                      <button 
                        disabled 
                        className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                        title="Connect wallet to interact with demo pools"
                      >
                        Borrow
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
              </div>
      </div>
    )
}