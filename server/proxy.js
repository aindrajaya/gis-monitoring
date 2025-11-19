import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const TARGET_API = process.env.VITE_API_BASE_URL || 'https://staging.kurmaspace.com/klhk/app/index.php/api/portal_v1';
const API_KEY = process.env.VITE_API_KEY || '';

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Proxy handler for all /api routes
app.use('/api', async (req, res) => {
  try {
    // Remove /api prefix and construct target URL
    const targetPath = req.url.startsWith('/') ? req.url : `/${req.url}`;
    const targetUrl = `${TARGET_API}${targetPath}`;
    
    console.log(`[PROXY] ${req.method} ${req.path} -> ${targetUrl}`);

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...req.headers,
    };
    
    // Add API key
    if (API_KEY) {
      headers['X-API-KEY'] = API_KEY;
    }

    // Remove host header to avoid conflicts
    delete headers.host;

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    console.log(`[PROXY] Response: ${response.status} for ${req.path}`);

    // Set content type
    res.setHeader('Content-Type', 'application/json');
    
    // Get response as text first to avoid encoding issues
    const textData = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      data = textData;
    }
    
    // Forward the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Proxy server is running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to: ${TARGET_API}`);
  console.log(`🔑 API Key: ${API_KEY ? '✓ Configured' : '✗ Not set'}\n`);
});
