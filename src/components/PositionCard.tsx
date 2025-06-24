import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react'
import type { Position } from '../types'

interface PositionCardProps {
  position: Position
  isSelected: boolean
  onClick: () => void
}

export function PositionCard({ position, isSelected, onClick }: PositionCardProps) {
  const getStatusColor = (status: Position['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200'
      case 'at_risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: Position['status']) => {
    switch (status) {
      case 'healthy': return <Shield className="w-4 h-4" />
      case 'at_risk': return <AlertTriangle className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-primary-50 border-primary-200 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{position.asset}</h3>
          <p className="text-sm text-gray-500 capitalize">{position.type}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(position.status)}`}>
          {getStatusIcon(position.status)}
          <span className="capitalize">{position.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-lg font-semibold text-gray-900">
            {position.amount.toLocaleString()} {position.asset}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ${position.totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          {position.apy > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <div>
            <p className="text-sm text-gray-500">APY</p>
            <p className={`font-semibold ${position.apy > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {position.apy > 0 ? '+' : ''}{position.apy.toFixed(1)}%
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Health Factor</p>
          <p className={`font-semibold ${
            position.healthFactor > 1.5 ? 'text-green-600' :
            position.healthFactor > 1.2 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {position.healthFactor.toFixed(2)}
          </p>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Liquidation Threshold</p>
              <p className="font-medium">{(position.liquidationThreshold * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-gray-500">Risk Level</p>
              <p className={`font-medium ${
                position.healthFactor > 1.5 ? 'text-green-600' : 
                position.healthFactor > 1.2 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {position.healthFactor > 1.5 ? 'Low' : 
                 position.healthFactor > 1.2 ? 'Medium' : 'High'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}