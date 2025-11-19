import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://staging.kurmaspace.com/klhk/app/index.php/api/portal_v1';
  const API_KEY = process.env.VITE_API_KEY || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    // Extract the path from the URL (everything after /api/)
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : (path || '');
    
    // Get query parameters (excluding the path parameter)
    const queryParams = { ...req.query };
    delete queryParams.path;
    
    // Build query string
    const queryString = Object.keys(queryParams).length > 0 
      ? '?' + new URLSearchParams(queryParams as Record<string, string>).toString()
      : '';
    
    // Construct full URL
    const targetUrl = `${API_BASE_URL}/${apiPath}${queryString}`;
    
    console.log(`[Vercel Proxy] ${req.method} ${targetUrl}`);

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add API key
    if (API_KEY) {
      headers['X-API-KEY'] = API_KEY;
    }

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' && req.body 
        ? JSON.stringify(req.body) 
        : undefined,
    });

    console.log(`[Vercel Proxy] Response: ${response.status}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Get response data as text first to avoid encoding issues
    const textData = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      data = textData;
    }

    // Forward the response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Vercel Proxy Error]', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(500).json({ 
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
