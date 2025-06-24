import type { Position, OptimizationSuggestion, Achievement } from '../types'

export const mockPositions: Position[] = [
  {
    id: '1',
    asset: 'USDC',
    type: 'lending',
    amount: 10000,
    apy: 8.5,
    totalValue: 10850,
    healthFactor: 2.1,
    liquidationThreshold: 0.85,
    status: 'healthy'
  },
  {
    id: '2',
    asset: 'XLM',
    type: 'lending',
    amount: 50000,
    apy: 12.3,
    totalValue: 56150,
    healthFactor: 1.8,
    liquidationThreshold: 0.75,
    status: 'healthy'
  },
  {
    id: '3',
    asset: 'BTC',
    type: 'borrowing',
    amount: 0.5,
    apy: -6.2,
    totalValue: 48000,
    healthFactor: 1.3,
    liquidationThreshold: 0.8,
    status: 'at_risk'
  }
]

export const mockSuggestions: OptimizationSuggestion[] = [
  {
    id: '1',
    type: 'yield',
    title: 'Optimize USDC Yield',
    description: 'Move to higher-yield lending pool for +2.1% APY',
    estimatedGain: 228,
    riskLevel: 'low'
  },
  {
    id: '2',
    type: 'safety',
    title: 'Improve BTC Position Safety',
    description: 'Add collateral to increase health factor above 1.5',
    estimatedGain: 0,
    riskLevel: 'low'
  },
  {
    id: '3',
    type: 'leverage',
    title: 'Strategic Leverage Opportunity',
    description: 'Use XLM as collateral for additional lending position',
    estimatedGain: 1250,
    riskLevel: 'medium'
  }
]

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Create your first lending position',
    icon: '🎯',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: '2',
    title: 'Diversified',
    description: 'Hold 5 different assets',
    icon: '🌟',
    unlocked: false,
    progress: 3,
    maxProgress: 5
  },
  {
    id: '3',
    title: 'High Roller',
    description: 'Reach $100K total portfolio value',
    icon: '💎',
    unlocked: false,
    progress: 115000,
    maxProgress: 100000
  },
  {
    id: '4',
    title: 'Yield Master',
    description: 'Maintain >10% average APY for 30 days',
    icon: '🚀',
    unlocked: false,
    progress: 15,
    maxProgress: 30
  }
]