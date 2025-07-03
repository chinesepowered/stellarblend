import { useState, useEffect } from 'react'
import { stellarService } from '../services/stellarService'
import { blendService } from '../services/blendService'
import { useNetwork } from '../contexts/NetworkContext'
import type { Position } from '../types'

export function useWallet() {
  const { networkPassphrase } = useNetwork()
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState<Array<{ asset: string; balance: number; limit: number | null }>>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoadingPositions, setIsLoadingPositions] = useState(false)
  const [hasManuallyDisconnected, setHasManuallyDisconnected] = useState(false)

  // Initialize BlendService with current network
  useEffect(() => {
    console.log('🔄 Network changed to:', networkPassphrase)
    blendService.updateNetwork(networkPassphrase)
  }, [networkPassphrase])

  const connect = async () => {
    setIsConnecting(true)
    try {
      const key = await stellarService.connectWallet()
      if (key) {
        setPublicKey(key)
        setIsConnected(true)
        setHasManuallyDisconnected(false) // Reset the manual disconnect flag
        
        // Load account balances
        const accountBalances = await stellarService.getAccountBalances(key)
        setBalances(accountBalances)
        
        // Load Blend positions only if we have a valid key
        if (key && key.trim() !== '') {
          setIsLoadingPositions(true)
          try {
            const userPositions = await blendService.getUserPositions(key)
            setPositions(userPositions)
          } catch (error) {
            console.error('Failed to load positions:', error)
            setPositions([])
          } finally {
            setIsLoadingPositions(false)
          }
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setIsLoadingPositions(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    console.log('Disconnecting wallet...')
    setPublicKey(null)
    setIsConnected(false)
    setBalances([])
    setPositions([])
    setIsLoadingPositions(false)
    setHasManuallyDisconnected(true) // Set the manual disconnect flag
  }

  useEffect(() => {
    // Check for existing connection when component mounts, but only if user hasn't manually disconnected
    const checkExistingConnection = async () => {
      // Don't auto-reconnect if user has manually disconnected
      if (hasManuallyDisconnected) {
        console.log('Skipping auto-reconnect due to manual disconnect')
        return
      }

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
            
            if (key && key.trim() !== '') {
              setIsLoadingPositions(true)
              try {
                const userPositions = await blendService.getUserPositions(key)
                setPositions(userPositions)
              } catch (error) {
                console.error('Failed to load positions on reconnect:', error)
                setPositions([])
              } finally {
                setIsLoadingPositions(false)
              }
            }
          }
        }
      } catch (error) {
        console.log('No existing wallet connection found or Freighter not available')
      }
    }
    
    checkExistingConnection()
  }, [hasManuallyDisconnected])

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