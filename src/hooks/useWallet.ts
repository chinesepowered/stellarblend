import { useState, useEffect } from 'react'
import { stellarService } from '../services/stellarService'
import { blendService } from '../services/blendService'
import type { Position } from '../types'

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState<Array<{ asset: string; balance: number; limit: number | null }>>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoadingPositions, setIsLoadingPositions] = useState(false)

  const connect = async () => {
    setIsConnecting(true)
    try {
      const key = await stellarService.connectWallet()
      if (key) {
        setPublicKey(key)
        setIsConnected(true)
        
        // Load account balances
        const accountBalances = await stellarService.getAccountBalances(key)
        setBalances(accountBalances)
        
        // Load Blend positions
        setIsLoadingPositions(true)
        const userPositions = await blendService.getUserPositions(key)
        setPositions(userPositions)
        setIsLoadingPositions(false)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setIsLoadingPositions(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setPublicKey(null)
    setIsConnected(false)
    setBalances([])
    setPositions([])
  }

  useEffect(() => {
    // Check for existing connection when component mounts
    const checkExistingConnection = async () => {
      try {
        // Import the official Freighter API
        const { isConnected, getAddress } = await import('@stellar/freighter-api')
        
        // Check if Freighter is available and already connected
        const connectionStatus = await isConnected()
        
        if (connectionStatus.isConnected) {
          // Try to get the address (won't prompt if already authorized)
          const addressResponse = await getAddress()
          
          if (!addressResponse.error) {
            const key = addressResponse.address
            setPublicKey(key)
            setIsConnected(true)
            
            // Load account data if already connected
            const accountBalances = await stellarService.getAccountBalances(key)
            setBalances(accountBalances)
            
            setIsLoadingPositions(true)
            const userPositions = await blendService.getUserPositions(key)
            setPositions(userPositions)
            setIsLoadingPositions(false)
          }
        }
      } catch (error) {
        console.log('No existing wallet connection found or Freighter not available')
      }
    }
    
    checkExistingConnection()
  }, [])

  return {
    publicKey,
    isConnected,
    isConnecting,
    balances,
    positions,
    isLoadingPositions,
    connect,
    disconnect
  }
}