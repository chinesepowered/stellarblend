import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Sparkles } from 'lucide-react'
import type { Position } from '../types'
import { mockSuggestions } from '../services/mockData'
import { blendService } from '../services/blendService'
import { useWallet } from '../hooks/useWallet'

interface OptimizeActionsProps {
  positions: Position[]
  onOptimize: (positions: Position[]) => void
}

export function OptimizeActions({ positions, onOptimize }: OptimizeActionsProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationType, setOptimizationType] = useState<string | null>(null)
  const { publicKey } = useWallet()

  const handleOptimize = async (type: 'yield' | 'safety' | 'leverage') => {
    if (!publicKey) {
      console.error('No wallet connected')
      return
    }

    setIsOptimizing(true)
    setOptimizationType(type)

    try {
      // Show real transaction building for yield optimization
      if (type === 'yield' && positions.length > 0) {
        const position = positions[0] // Use first position as example
        console.log(`Building real optimization transaction for ${position.asset}`)
        
        // This builds a real Blend transaction
        const transactionXDR = await blendService.buildSupplyTransaction(
          publicKey,
          position.id.split('-')[0], // Extract asset address from position ID
          100 // Demo amount
        )
        
        if (transactionXDR) {
          console.log('Real Blend transaction built successfully!', transactionXDR)
          alert('Real Blend transaction built! Check console for XDR. In production, this would be sent to Freighter for signing.')
        }
      }

      // Simulate optimization after a delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const optimizedPositions = positions.map(pos => {
        switch (type) {
          case 'yield':
            return { ...pos, apy: pos.apy + Math.random() * 2 }
          case 'safety':
            return { ...pos, healthFactor: Math.max(pos.healthFactor + 0.3, 2.0), status: 'healthy' as const }
          case 'leverage':
            return { ...pos, totalValue: pos.totalValue * 1.1 }
          default:
            return pos
        }
      })

      onOptimize(optimizedPositions)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
      setOptimizationType(null)
    }
  }

  const suggestions = mockSuggestions.slice(0, 3)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Smart Optimization</h2>
          <p className="text-gray-600">One-click actions to improve your positions</p>
        </div>
        <Sparkles className="w-6 h-6 text-primary-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptimize('yield')}
          disabled={isOptimizing}
          className="flex items-center space-x-3 p-4 text-left bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrendingUp className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Optimize Yield</h3>
            <p className="text-sm text-green-700">Maximize returns</p>
            {isOptimizing && optimizationType === 'yield' && (
              <p className="text-xs text-green-600 mt-1">Optimizing...</p>
            )}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptimize('safety')}
          disabled={isOptimizing}
          className="flex items-center space-x-3 p-4 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Safe Leverage Setup</h3>
            <p className="text-sm text-blue-700">Reduce risks</p>
            {isOptimizing && optimizationType === 'safety' && (
              <p className="text-xs text-blue-600 mt-1">Securing...</p>
            )}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptimize('leverage')}
          disabled={isOptimizing}
          className="flex items-center space-x-3 p-4 text-left bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-900">Smart Leverage</h3>
            <p className="text-sm text-purple-700">Amplify gains</p>
            {isOptimizing && optimizationType === 'leverage' && (
              <p className="text-xs text-purple-600 mt-1">Leveraging...</p>
            )}
          </div>
        </motion.button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recommended Actions</h3>
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                +${suggestion.estimatedGain}
              </p>
              <p className="text-xs text-gray-500 capitalize">{suggestion.riskLevel} risk</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}