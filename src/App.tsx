import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { NetworkProvider } from './contexts/NetworkContext'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import NetworkAwareApp from './components/NetworkAwareApp'

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - show network switcher */}
        <Route path="/" element={<NetworkSwitcher />} />
        
        {/* Mainnet route */}
        <Route 
          path="/mainnet" 
          element={
            <NetworkProvider network="mainnet">
              <NetworkAwareApp />
            </NetworkProvider>
          } 
        />
        
        {/* Testnet route */}
        <Route 
          path="/testnet" 
          element={
            <NetworkProvider network="testnet">
              <NetworkAwareApp />
            </NetworkProvider>
          } 
        />
        
        {/* Catch all route - redirect to network switcher */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App