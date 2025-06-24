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
    if (typeof window !== 'undefined' && 'freighter' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).freighter.isConnected().then((connected: boolean) => {
        if (connected) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).freighter.getPublicKey().then((key: string) => {
            setPublicKey(key)
            setIsConnected(true)
          })
        }
      })
    }
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