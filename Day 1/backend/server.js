import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

// Load contract ABI
let CONTRACT_ABI;
try {
  const abiPath = '../smart-contracts/artifacts/contracts/Greeter.sol/Greeter.json';
  const contractJson = JSON.parse(readFileSync(abiPath, 'utf8'));
  CONTRACT_ABI = contractJson.abi;
} catch (error) {
  console.warn('Contract ABI not found. Please compile contracts first.');
  CONTRACT_ABI = [];
}

// Initialize provider
const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);

// Get contract instance
function getContract() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Greetings DApp API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      greeting: '/api/greeting',
      contractInfo: '/api/contract-info'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get current greeting
app.get('/api/greeting', async (req, res) => {
  try {
    const contract = getContract();
    const greeting = await contract.greet();
    res.json({
      success: true,
      greeting: greeting,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching greeting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get personalized greeting
app.post('/api/greeting/personalized', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const contract = getContract();
    const personalGreeting = await contract.greetWithName(name);

    res.json({
      success: true,
      greeting: personalGreeting,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting personalized greeting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get contract info
app.get('/api/contract-info', async (req, res) => {
  try {
    const contract = getContract();
    const owner = await contract.owner();
    const greeting = await contract.greet();

    res.json({
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      owner: owner,
      currentGreeting: greeting,
      network: 'Base Sepolia',
      chainId: 84532
    });
  } catch (error) {
    console.error('Error fetching contract info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recent greeting changes (from events)
app.get('/api/greeting/history', async (req, res) => {
  try {
    const contract = getContract();
    const filter = contract.filters.GreetingChanged();
    const events = await contract.queryFilter(filter, -1000); // Last 1000 blocks

    const history = events.map(event => ({
      oldGreeting: event.args.oldGreeting,
      newGreeting: event.args.newGreeting,
      changedBy: event.args.changedBy,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));

    res.json({
      success: true,
      history: history.reverse(), // Most recent first
      count: history.length
    });
  } catch (error) {
    console.error('Error fetching greeting history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Network info
app.get('/api/network', async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    res.json({
      success: true,
      network: {
        name: network.name,
        chainId: Number(network.chainId),
        blockNumber: blockNumber
      }
    });
  } catch (error) {
    console.error('Error fetching network info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Contract Address: ${CONTRACT_ADDRESS || 'Not configured'}`);
  console.log(`RPC URL: ${BASE_SEPOLIA_RPC}`);
});
