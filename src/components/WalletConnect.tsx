import { Wallet, Power } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'

interface WalletConnectProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { isConnected, isConnecting, publicKey, connect, disconnect } = useWallet()

  const handleConnect = async () => {
    await connect()
    onConnect(true)
  }

  const handleDisconnect = () => {
    disconnect()
    onConnect(false)
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">
            {publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'Connected'}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Power className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-4 h-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}</span>
    </button>
  )
}