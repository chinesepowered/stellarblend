import { useState, useEffect } from 'react'
import { PositionCard } from './PositionCard'
import { OptimizeActions } from './OptimizeActions'
import { PortfolioAllocation } from './PortfolioAllocation'
import { AchievementBadges } from './AchievementBadges'
import { LiquidationAlert } from './LiquidationAlert'
import { useWallet } from '../hooks/useWallet'
import { Loader2 } from 'lucide-react'

export function PositionManager() {
  const { positions: walletPositions, isLoadingPositions } = useWallet()
  const [positions, setPositions] = useState(walletPositions)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  useEffect(() => {
    setPositions(walletPositions)
  }, [walletPositions])

  const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0)
  const totalYield = totalValue > 0 ? positions.reduce((sum, pos) => sum + pos.apy * pos.totalValue, 0) / totalValue : 0

  if (isLoadingPositions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading your Blend positions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <LiquidationAlert positions={positions} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average APY</h3>
          <p className="text-3xl font-bold text-green-600">{totalYield.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Positions</h3>
          <p className="text-3xl font-bold text-blue-600">{positions.length}</p>
        </div>
      </div>

      <OptimizeActions positions={positions} onOptimize={setPositions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Positions</h2>
          <div className="space-y-4">
            {positions.length > 0 ? (
              positions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  isSelected={selectedPosition === position.id}
                  onClick={() => setSelectedPosition(
                    selectedPosition === position.id ? null : position.id
                  )}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Positions Found</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any active Blend positions yet.
                </p>
                <p className="text-sm text-gray-500">
                  Connect to Blend pools to start lending or borrowing assets.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <PortfolioAllocation positions={positions} onUpdate={setPositions} />
          <AchievementBadges totalValue={totalValue} positionCount={positions.length} />
        </div>
      </div>
    </div>
  )
}