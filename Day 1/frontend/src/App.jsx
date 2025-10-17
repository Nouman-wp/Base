import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import GreeterABI from './GreeterABI.json'

const GREETER_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

function App() {
  const [account, setAccount] = useState('')
  const [greeting, setGreeting] = useState('')
  const [newGreeting, setNewGreeting] = useState('')
  const [personName, setPersonName] = useState('')
  const [personalGreeting, setPersonalGreeting] = useState('')
  const [loading, setLoading] = useState(false)
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!')
        return
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setupContract(accounts[0])
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      setAccount(accounts[0])
      await switchToBaseSepolia()
      setupContract(accounts[0])
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const switchToBaseSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }], // 84532 in hex
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x14a34',
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org']
            }]
          })
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError)
        }
      }
    }
  }

  const setupContract = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        GREETER_CONTRACT_ADDRESS,
        GreeterABI,
        signer
      )
      setContract(contract)
      await fetchGreeting(contract)
    } catch (error) {
      console.error('Error setting up contract:', error)
    }
  }

  const fetchGreeting = async (contractInstance = contract) => {
    try {
      setLoading(true)
      const currentGreeting = await contractInstance.greet()
      setGreeting(currentGreeting)
    } catch (error) {
      console.error('Error fetching greeting:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateGreeting = async () => {
    if (!newGreeting.trim()) {
      alert('Please enter a new greeting')
      return
    }

    try {
      setLoading(true)
      const tx = await contract.setGreeting(newGreeting)
      await tx.wait()
      await fetchGreeting()
      setNewGreeting('')
      alert('Greeting updated successfully!')
    } catch (error) {
      console.error('Error updating greeting:', error)
      alert('Error updating greeting. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const getPersonalGreeting = async () => {
    if (!personName.trim()) {
      alert('Please enter your name')
      return
    }

    try {
      setLoading(true)
      const personal = await contract.greetWithName(personName)
      setPersonalGreeting(personal)
    } catch (error) {
      console.error('Error getting personal greeting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>🖖 Greetings DApp</h1>
          <p className="subtitle">on Base Sepolia Testnet</p>
        </header>

        {!account ? (
          <div className="connect-section">
            <button onClick={connectWallet} className="connect-btn">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="connected-section">
            <div className="account-info">
              <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>

            <div className="card">
              <h2>Current Greeting</h2>
              {loading ? (
                <p className="loading">Loading...</p>
              ) : (
                <p className="greeting-text">{greeting || 'No greeting set'}</p>
              )}
              <button onClick={() => fetchGreeting()} disabled={loading}>
                Refresh
              </button>
            </div>

            <div className="card">
              <h2>Update Greeting</h2>
              <input
                type="text"
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.target.value)}
                placeholder="Enter new greeting..."
                disabled={loading}
              />
              <button onClick={updateGreeting} disabled={loading || !newGreeting}>
                {loading ? 'Updating...' : 'Update Greeting'}
              </button>
            </div>

            <div className="card">
              <h2>Personal Greeting</h2>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Enter your name..."
                disabled={loading}
              />
              <button onClick={getPersonalGreeting} disabled={loading || !personName}>
                Get Personal Greeting
              </button>
              {personalGreeting && (
                <p className="greeting-text">{personalGreeting}</p>
              )}
            </div>
          </div>
        )}

        <footer>
          <p>Built with React + Vite + Ethers.js</p>
          {GREETER_CONTRACT_ADDRESS && (
            <p className="contract-address">
              Contract: {GREETER_CONTRACT_ADDRESS.slice(0, 6)}...{GREETER_CONTRACT_ADDRESS.slice(-4)}
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

export default App
