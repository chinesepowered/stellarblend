export interface Position {
  id: string
  asset: string
  address: string
  type: 'lending' | 'borrowing'
  amount: number
  apy: number
  totalValue: number
  healthFactor: number
  liquidationThreshold: number
  status: 'active' | 'at_risk' | 'healthy'
}

export interface OptimizationSuggestion {
  id: string
  type: 'yield' | 'safety' | 'leverage'
  title: string
  description: string
  estimatedGain: number
  riskLevel: 'low' | 'medium' | 'high'
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}