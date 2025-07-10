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

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Proxy endpoint for 3DS API calls
app.post('/api/3ds/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint;
  const url = `${API_BASE_URL}/${endpoint}`;
  
  console.log(`Proxying request to: ${url}`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const response = await axios.post(url, req.body, {
      headers: {
        'APIKey': API_KEY,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    
    console.log(`Response from ${endpoint}:`, JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: error.message }
    );
  }
});

// Serve the demo HTML page (for production)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`3DS Demo Proxy Server running at http://localhost:${PORT}`);
});