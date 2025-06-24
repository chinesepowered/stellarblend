import { PieChart } from 'lucide-react'
import type { Position } from '../types'

interface PortfolioAllocationProps {
  positions: Position[]
  onUpdate: (positions: Position[]) => void
}

export function PortfolioAllocation({ positions }: PortfolioAllocationProps) {
  const totalValue = positions.reduce((sum: number, p: Position) => sum + p.totalValue, 0)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Portfolio Allocation</h2>
          <p className="text-gray-600">Your position breakdown</p>
        </div>
        <PieChart className="w-6 h-6 text-primary-600" />
      </div>

      <div className="space-y-3 mb-6">
        {positions.map((position) => {
          const percentage = (position.totalValue / totalValue) * 100
          return (
            <div key={position.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{position.asset}</h4>
                <p className="text-sm text-gray-500">${position.totalValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{percentage.toFixed(1)}%</p>
                <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Portfolio Value</span>
          <span className="text-xl font-bold text-gray-900">${totalValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}