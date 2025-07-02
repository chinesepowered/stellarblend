import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Sparkles, X, Copy, Signature } from 'lucide-react'
import type { Position } from '../types'
import { mockSuggestions } from '../services/mockData'
import { blendService } from '../services/blendService'
import { stellarService } from '../services/stellarService'
import { useWallet } from '../hooks/useWallet'

interface OptimizeActionsProps {
  positions: Position[]
  onOptimize: (positions: Position[]) => void
}

export function OptimizeActions({ positions, onOptimize }: OptimizeActionsProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationType, setOptimizationType] = useState<string | null>(null)
  const [showXDRDialog, setShowXDRDialog] = useState(false)
  const [isSigningTransaction, setIsSigningTransaction] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<{
    type: string
    asset: string
    amount: number
    xdr: string
  } | null>(null)

  const getTransactionSummary = (type: string, asset: string, amount: number) => {
    switch (type.toLowerCase()) {
      case 'yield':
        return {
          title: 'Supply Additional Collateral',
          description: `This transaction will supply ${amount.toFixed(6)} ${asset} to the Blend lending pool to increase your earning potential. The asset will start earning interest immediately and can be used as collateral for borrowing.`,
          effects: [
            `Supplies ${amount.toFixed(6)} ${asset} to the pool`,
            'Increases your earning position and yield',
            'Adds collateral capacity for potential borrowing',
            'Transaction fee: ~0.1 XLM'
          ]
        }
      case 'safety':
        return {
          title: 'Add Safety Collateral',
          description: `This transaction adds ${amount.toFixed(6)} ${asset} as additional collateral to improve your position's health factor and reduce liquidation risk. This makes your overall portfolio safer.`,
          effects: [
            `Adds ${amount.toFixed(6)} ${asset} as collateral`,
            'Improves health factor and reduces liquidation risk',
            'Provides buffer against market volatility',
            'Transaction fee: ~0.1 XLM'
          ]
        }
      case 'leverage':
        return {
          title: 'Borrow for Leverage',
          description: `This transaction borrows ${amount.toFixed(6)} ${asset} against your existing collateral to create a leveraged position. This amplifies both potential gains and risks.`,
          effects: [
            `Borrows ${amount.toFixed(6)} ${asset} from the pool`,
            'Creates leveraged exposure to increase potential returns',
            'Incurs borrowing interest charges',
            'Increases liquidation risk - monitor health factor',
            'Transaction fee: ~0.1 XLM'
          ]
        }
      default:
        return {
          title: 'Blend Protocol Transaction',
          description: `This transaction interacts with the Blend lending protocol to modify your ${asset} position.`,
          effects: [
            `Modifies ${amount.toFixed(6)} ${asset} position`,
            'Updates your lending/borrowing profile',
            'Transaction fee: ~0.1 XLM'
          ]
        }
    }
  }
  const { publicKey } = useWallet()

  const handleOptimize = async (type: 'yield' | 'safety' | 'leverage') => {
    if (!publicKey) {
      console.error('No wallet connected')
      return
    }

    setIsOptimizing(true)
    setOptimizationType(type)

    try {
      // Show real transaction building for optimization
      if (positions.length > 0) {
        const position = positions[0] // Use first position as example
        console.log(`🔨 Building real ${type} optimization transaction for ${position.asset}`)
        
        try {
          let transactionXDR = null
          
          switch (type) {
            case 'yield':
              // Build a supply transaction to increase yield
              transactionXDR = await blendService.buildSupplyTransaction(
                publicKey,
                position.address, // Use the actual asset address
                position.amount * 0.1 // Add 10% more supply
              )
              break
              
            case 'safety':
              // Build a supply transaction to add collateral for safety
              transactionXDR = await blendService.buildSupplyTransaction(
                publicKey,
                position.address,
                position.amount * 0.05 // Add 5% more collateral
              )
              break
              
            case 'leverage':
              // Build a borrow transaction for leverage
              transactionXDR = await blendService.buildBorrowTransaction(
                publicKey,
                position.address,
                position.amount * 0.2 // Borrow 20% for leverage
              )
              break
          }
          
          if (transactionXDR) {
            console.log(`✅ Real Blend ${type} transaction built successfully!`)
            console.log('📋 Transaction XDR:', transactionXDR)
            
            // Show XDR dialog with technical details
            setTransactionDetails({
              type: type.charAt(0).toUpperCase() + type.slice(1),
              asset: position.asset,
              amount: type === 'leverage' ? position.amount * 0.2 : position.amount * 0.1,
              xdr: transactionXDR
            })
            setShowXDRDialog(true)
          } else {
            console.log('⚠️ Transaction building returned null')
          }
        } catch (txError) {
          console.log('⚠️ Transaction failed:', txError)
        }
      }

      // Apply optimization after a delay
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSignTransaction = async () => {
    if (!transactionDetails) {
      console.error('No transaction details available')
      return
    }

    setIsSigningTransaction(true)
    
    try {
      console.log('🚀 Starting transaction signing process...')
      
      const result = await stellarService.signAndSubmitTransaction(transactionDetails.xdr)
      
      if (result.success) {
        console.log('🎉 Transaction successfully signed and submitted!')
        console.log('Transaction hash:', result.result?.hash)
        console.log('Ledger:', result.result?.ledger)
        
        // Show success message
        alert(`🎉 Transaction Successful!\n\nHash: ${result.result?.hash}\nLedger: ${result.result?.ledger}\n\nYour Blend position has been updated!`)
        
        // Close the dialog
        setShowXDRDialog(false)
        setTransactionDetails(null)
        
        // You could trigger a refresh of positions here if needed
        // For now, we'll keep the optimized state from the mock optimization
        
      } else {
        console.error('❌ Transaction failed:', result.error)
        alert(`❌ Transaction Failed\n\n${result.error}\n\nPlease try again or contact support if the issue persists.`)
      }
      
    } catch (error) {
      console.error('❌ Unexpected error during signing:', error)
      alert('❌ Unexpected Error\n\nSomething went wrong while signing the transaction. Please try again.')
    } finally {
      setIsSigningTransaction(false)
    }
  }

  const suggestions = mockSuggestions.slice(0, 3)

  return (
    <>
      {/* XDR Transaction Dialog */}
      {showXDRDialog && transactionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Transaction Ready</h2>
                <p className="text-sm text-gray-600">Review and sign with Freighter, or copy XDR for manual signing</p>
              </div>
              <button
                onClick={() => setShowXDRDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Transaction Summary */}
                {(() => {
                  const summary = getTransactionSummary(transactionDetails.type, transactionDetails.asset, transactionDetails.amount)
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <h3 className="font-bold text-blue-900 text-lg mb-2">{summary.title}</h3>
                      <p className="text-blue-800 mb-4">{summary.description}</p>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">What this transaction does:</h4>
                        <ul className="space-y-1">
                          {summary.effects.map((effect, index) => (
                            <li key={index} className="text-blue-800 text-sm flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-1">Operation Type</h3>
                    <p className="text-blue-800">{transactionDetails.type} Optimization</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-1">Asset</h3>
                    <p className="text-green-800">{transactionDetails.asset}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-1">Amount</h3>
                    <p className="text-purple-800">{transactionDetails.amount.toFixed(6)}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Transaction XDR</h3>
                    <button
                      onClick={() => copyToClipboard(transactionDetails.xdr)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm break-all max-h-60 overflow-y-auto">
                    {transactionDetails.xdr}
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Technical Details</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• This is a real Stellar transaction built with Blend SDK</li>
                    <li>• XDR can be submitted to Stellar testnet</li>
                    <li>• Transaction includes proper sequence numbers and fees</li>
                    <li>• Ready for Freighter wallet signing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t p-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Choose to sign with Freighter for real transactions, or copy XDR for manual signing
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowXDRDialog(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(transactionDetails.xdr)
                    setShowXDRDialog(false)
                  }}
                  className="px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy XDR</span>
                </button>
                <button
                  onClick={handleSignTransaction}
                  disabled={isSigningTransaction}
                  className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Signature className="w-4 h-4" />
                  <span>{isSigningTransaction ? 'Signing...' : 'Sign with Freighter'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  )
}