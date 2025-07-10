const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const API_KEY = '935d4c3e-1396-443e-b234-389d55ec1b7f';
const API_BASE_URL = 'https://service.sandbox.3dsecure.io';

// Enable CORS for all origins
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

// Serve the demo HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`3DS Demo Proxy Server running at http://localhost:${PORT}`);
  if (process.env.BROWSERSYNC === 'true') {
    console.log(`Open http://localhost:3000 in your browser for live-reload demo (via BrowserSync)`);
  } else {
    console.log(`Open http://localhost:${PORT} in your browser to see the demo`);
  }
});