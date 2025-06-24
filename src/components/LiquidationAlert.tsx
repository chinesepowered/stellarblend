import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, X, Bell } from 'lucide-react'
import type { Position } from '../types'

interface LiquidationAlertProps {
  positions: Position[]
}

export function LiquidationAlert({ positions }: LiquidationAlertProps) {
  const [alerts, setAlerts] = useState<Position[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const riskyPositions = positions.filter(
      pos => pos.healthFactor < 1.5 && !dismissedAlerts.has(pos.id)
    )
    setAlerts(riskyPositions)
  }, [positions, dismissedAlerts])

  const dismissAlert = (positionId: string) => {
    setDismissedAlerts(prev => new Set([...prev, positionId]))
  }

  const enableNotifications = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 space-y-2"
      >
        {alerts.map((position) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Liquidation Risk Alert
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Your {position.asset} position has a health factor of {position.healthFactor.toFixed(2)}.
                  Consider adding collateral or reducing exposure.
                </p>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Protect Position
                  </button>
                  <button
                    onClick={enableNotifications}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                  >
                    <Bell className="w-3 h-3 inline mr-1" />
                    Enable Alerts
                  </button>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(position.id)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}