import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export type NetworkType = 'mainnet' | 'testnet'

interface NetworkContextType {
  network: NetworkType
  isMainnet: boolean
  isTestnet: boolean
  networkPassphrase: string
  rpcUrl: string
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

interface NetworkProviderProps {
  children: ReactNode
  network: NetworkType
}

export function NetworkProvider({ children, network }: NetworkProviderProps) {
  const isMainnet = network === 'mainnet'
  const isTestnet = network === 'testnet'
  
  const networkPassphrase = isMainnet 
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015'
    
  const rpcUrl = isMainnet
    ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
    : 'https://soroban-testnet.stellar.org'

  const value: NetworkContextType = {
    network,
    isMainnet,
    isTestnet,
    networkPassphrase,
    rpcUrl
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
} 