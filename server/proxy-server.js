import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Get __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3002;
const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'https://service.sandbox.3dsecure.io';
const USE_LOCAL_PROXY = process.env.USE_LOCAL_PROXY === 'true';
const LOCAL_PROXY_URL = process.env.LOCAL_PROXY_URL || 'http://fbf-cde-card-linking-web-sdk-cde.localhost';

// Validate required environment variables
if (!API_KEY) {
  console.error('ERROR: API_KEY environment variable is required');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (for production)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Also serve public files
app.use(express.static(path.join(__dirname, '..', 'public')));

// In-memory storage for 3DS Method completion status
const methodCompletionStatus = new Map();

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Proxy endpoint for 3DS API calls
app.post('/api/3ds/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  let url;
  
  if (USE_LOCAL_PROXY) {
    // Route through local application stack
    url = `${LOCAL_PROXY_URL}/api/3ds-proxy/${endpoint}`;
    console.log(`Routing through local proxy: ${url}`);
  } else {
    // Direct route to 3dsecure.io
    url = `${API_BASE_URL}/${endpoint}`;
    console.log(`Proxying request to: ${url}`);
  }
  
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log(`Full URL being called: ${url}`);
  
  try {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8'
    };
    
    // Only add API key for direct 3dsecure.io calls
    if (!USE_LOCAL_PROXY) {
      headers['APIKey'] = API_KEY;
    }
    
    const response = await axios.post(url, req.body, { headers });
    
    console.log(`Response from ${endpoint}:`, JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: error.message }
    );
  }
});

// Endpoint to check 3DS Method completion status
app.post('/api/3ds/method-status', (req, res) => {
  const { threeDSServerTransID } = req.body;
  
  if (!threeDSServerTransID) {
    return res.status(400).json({ error: 'threeDSServerTransID is required' });
  }
  
  const completed = methodCompletionStatus.get(threeDSServerTransID) || false;
  console.log(`3DS Method status check for ${threeDSServerTransID}: ${completed}`);
  
  res.json({ completed });
});

// Notification endpoint for 3DS Method completion
app.post('/echo/3ds-method-notification', express.urlencoded({ extended: true }), (req, res) => {
  console.log('3DS Method notification received:', req.body);
  
  // The ACS posts threeDSMethodData as form data
  const { threeDSMethodData } = req.body;
  
  if (threeDSMethodData) {
    try {
      // Decode the base64url data
      const decodedData = JSON.parse(Buffer.from(threeDSMethodData, 'base64url').toString());
      const { threeDSServerTransID } = decodedData;
      
      if (threeDSServerTransID) {
        // Mark this transaction as completed
        methodCompletionStatus.set(threeDSServerTransID, true);
        console.log(`3DS Method completed for transaction: ${threeDSServerTransID}`);
        
        // Clean up after 5 minutes to prevent memory leaks
        setTimeout(() => {
          methodCompletionStatus.delete(threeDSServerTransID);
          console.log(`Cleaned up 3DS Method status for: ${threeDSServerTransID}`);
        }, 300000);
      }
    } catch (error) {
      console.error('Error decoding threeDSMethodData:', error);
    }
  }
  
  // Always respond with 200 OK to acknowledge receipt
  res.status(200).send('OK');
});

// Serve the demo HTML page (for production)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`3DS Demo Proxy Server running at http://localhost:${PORT}`);
  if (USE_LOCAL_PROXY) {
    console.log(`Using local proxy at: ${LOCAL_PROXY_URL}`);
  } else {
    console.log(`Using direct 3DS API at: ${API_BASE_URL}`);
  }
});