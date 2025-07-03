import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart3, Loader2, TestTube, AlertTriangle } from 'lucide-react'
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
        
        // Demo assets - these would be discovered from Pool Factory in production
        const demoAssets = [
          'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAOBKC6BIRQ', // USDC
          'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA', // STELLAR
        ]
        
        const poolPromises = demoAssets.map(async (assetAddress) => {
          try {
            return await blendService.getPoolInfo(assetAddress)
          } catch (assetError) {
            console.warn(`Failed to load pool for asset ${assetAddress}:`, assetError)
            if (isMainnet) {
              // On mainnet, surface asset-specific errors
              throw assetError
            }
            return null // On testnet, just skip failed assets
          }
        })
        
        const poolResults = await Promise.all(poolPromises)
        const validPools = poolResults.filter((pool): pool is PoolData => pool !== null)
        
        if (validPools.length === 0 && isMainnet) {
          throw new Error('No mainnet pools found for demo assets')
        }
        
        setPools(validPools)
        console.log(`✅ Loaded ${validPools.length} pools for ${isMainnet ? 'mainnet' : 'testnet'}`)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load pool data'
        console.error('❌ Pool loading error:', err)
        setError(errorMessage)
        setPools([]) // Clear pools on error
      } finally {
        setLoading(false)
      }
    }

    loadPools()
  }, [isMainnet, isTestnet]) // Reload when network changes

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
            {isMainnet ? 'Mainnet Pools Unavailable' : 'Pool Loading Error'}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {isMainnet && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                <strong>For Judges:</strong> Mainnet pools might not be deployed yet. 
                Try the <a href="/testnet" className="underline font-medium">testnet demo</a> to see the full functionality.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blend Pools</h2>
          <p className="text-gray-600">Real-time pool statistics</p>
        </div>
        <BarChart3 className="w-6 h-6 text-primary-600" />
      </div>

      {pools.some(pool => pool.isRealData === false) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-blue-700 mb-2">
                Currently showing demo data. Blend core contracts are deployed on testnet, but no pools exist yet for these assets.
              </p>
              <p className="text-xs text-blue-600">
                To deploy real pools: <a href="https://github.com/blend-capital/blend-utils" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Use blend-utils</a>
              </p>
            </div>
          </div>
        </div>
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
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Borrowed: ${pool.totalBorrow.toLocaleString()}</span>
                <span>Liquidation Threshold: {(pool.liquidationThreshold * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}