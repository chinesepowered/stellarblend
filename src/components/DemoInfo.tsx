import { Info, CheckCircle, AlertCircle } from 'lucide-react'

export function DemoInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-start space-x-3">
        <Info className="w-6 h-6 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Demo Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Real Integration</span>
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Freighter Wallet Connection</li>
                <li>✅ Stellar Network (Testnet/Mainnet)</li>
                <li>✅ Account Balance Fetching</li>
                <li>✅ Real Blend Contract Addresses</li>
                <li>✅ Real Pool Configuration</li>
                <li>✅ Network-Specific Asset Support</li>
                <li>✅ UI Framework & Styling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-orange-800 mb-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Simulated for Demo</span>
              </h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>🔄 User Positions (generated based on wallet)</li>
                <li>🔄 Transaction Execution</li>
                <li>🔄 Achievement Progress</li>
                <li>🔄 Optimization Suggestions</li>
                <li>🔄 Portfolio Rebalancing</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-blue-700 mt-4">
            <strong>Using Real Blend Protocol:</strong> Now connected to actual Blend contract addresses on Stellar Testnet. 
            Position data is generated deterministically based on your wallet address for consistent demo experience.
          </p>
        </div>
      </div>
    </div>
  )
}