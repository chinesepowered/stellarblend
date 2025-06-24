import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart3, Loader2 } from 'lucide-react'
import { blendService } from '../services/blendService'

interface PoolData {
  name: string
  address: string
  asset: string
  totalSupply: number
  totalBorrow: number
  supplyAPY: number
  borrowAPY: number
  utilizationRate: number
  liquidationThreshold: number
}

export function PoolInfo() {
  const [pools, setPools] = useState<PoolData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPoolsInfo = async () => {
      setIsLoading(true)
      try {
        const poolsData = await blendService.getAllPoolsInfo()
        setPools(poolsData)
      } catch (error) {
        console.error('Failed to load pools info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPoolsInfo()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
            <span className="text-gray-600">Loading pool information...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blend Pools</h2>
          <p className="text-gray-600">Real-time pool statistics</p>
        </div>
        <BarChart3 className="w-6 h-6 text-primary-600" />
      </div>

      <div className="space-y-4">
        {pools.map((pool) => (
          <div key={pool.address} className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{pool.asset}</h3>
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