# 🖖 Greetings DApp on Base Network

A full-stack decentralized application (DApp) featuring a Greeter smart contract deployed on the **Base Sepolia Testnet**. This project demonstrates the complete workflow of building a Web3 application with React, Express, and Solidity.

## 📁 Project Structure

```
Day 1/
├── smart-contracts/    # Hardhat smart contract project
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   ├── test/          # Contract tests
│   └── hardhat.config.js
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── GreeterABI.json
│   │   └── ...
│   └── package.json
└── backend/           # Node.js Express API
    ├── server.js
    └── package.json
```

## 🚀 Features

- **Smart Contract**: Greeter contract on Base Sepolia with:
  - Get current greeting
  - Update greeting (with event emission)
  - Get personalized greeting with name

- **Frontend**: React application with:
  - MetaMask wallet connection
  - Auto-switch to Base Sepolia network
  - Read and update greetings
  - Get personalized greetings
  - Beautiful gradient UI

- **Backend**: Express API with:
  - RESTful endpoints for contract interaction
  - Event history tracking
  - Network information

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask browser extension
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

## 🛠️ Installation

### 1. Smart Contracts Setup

```bash
cd smart-contracts
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add:
# - PRIVATE_KEY (your wallet private key)
# - BASE_SEPOLIA_RPC_URL (default: https://sepolia.base.org)
# - BASESCAN_API_KEY (optional, for verification)
```

### 2. Compile and Deploy Contract

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Base Sepolia
npm run deploy
```

After deployment, save the contract address from the output. You'll need it for the frontend and backend.

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add:
# VITE_CONTRACT_ADDRESS=<your_deployed_contract_address>
```

### 4. Backend Setup

```bash
cd ../backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add:
# CONTRACT_ADDRESS=<your_deployed_contract_address>
# PORT=5000
# BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

## 🎮 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🌐 Using the DApp

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: The app will automatically prompt you to switch to Base Sepolia
3. **View Greeting**: See the current greeting message
4. **Update Greeting**: Enter a new greeting and click "Update Greeting"
5. **Personal Greeting**: Enter your name to get a personalized greeting

## 📡 API Endpoints

### Backend API

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/greeting` - Get current greeting
- `POST /api/greeting/personalized` - Get personalized greeting
  ```json
  { "name": "Alice" }
  ```
- `GET /api/contract-info` - Get contract details
- `GET /api/greeting/history` - Get greeting change history
- `GET /api/network` - Get network information

## 🔧 Smart Contract Functions

### Read Functions
- `greet()` - Returns current greeting
- `greetWithName(string name)` - Returns personalized greeting
- `owner()` - Returns contract owner address

### Write Functions
- `setGreeting(string greeting)` - Updates the greeting

### Events
- `GreetingChanged(string oldGreeting, string newGreeting, address changedBy)`

## 🧪 Testing

### Contract Tests

```bash
cd smart-contracts
npm test
```

### Test Coverage

The test suite includes:
- Deployment verification
- Greeting retrieval
- Greeting updates
- Event emission
- Personalized greetings

## 🔐 Environment Variables

### Smart Contracts (.env)
```
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

### Frontend (.env)
```
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Backend (.env)
```
PORT=5000
CONTRACT_ADDRESS=your_deployed_contract_address
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

## 🌍 Base Sepolia Network Details

- **Chain ID**: 84532 (0x14a34)
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## 📚 Tech Stack

- **Smart Contract**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Frontend**: React 18, Vite, Ethers.js v6
- **Backend**: Node.js, Express, Ethers.js v6
- **Network**: Base Sepolia Testnet

## 🎨 Features Highlights

- Modern gradient UI design
- Responsive layout for mobile and desktop
- Real-time wallet connection status
- Automatic network switching
- Transaction confirmation feedback
- Event history tracking via backend API

## 🐛 Troubleshooting

### MetaMask Issues
- Make sure MetaMask is unlocked
- Verify you're on Base Sepolia network
- Ensure you have enough testnet ETH for gas

### Contract Not Found
- Verify contract address in .env files
- Make sure contract is deployed to Base Sepolia
- Check the contract address on BaseScan

### Transaction Fails
- Check you have enough ETH for gas
- Verify you're connected to Base Sepolia
- Try refreshing the page and reconnecting wallet

## 📝 Contract Verification

To verify your contract on BaseScan:

```bash
cd smart-contracts
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> "Hello from Base Sepolia"
```

## 🚧 Future Enhancements

- Add multiple greeting presets
- Implement greeting history on frontend
- Add user profile with greeting count
- Deploy to Base Mainnet
- Add IPFS integration for decentralized storage
- Implement ENS name resolution

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review Base documentation: https://docs.base.org
- Open an issue in the repository

---

Built with ❤️ on Base Network
