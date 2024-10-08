const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'src/main/resources/static')));

// Proxy API requests to Spring Boot application
app.use('/api', createProxyMiddleware({ 
  target: 'http://localhost:8080',
  changeOrigin: true,
}));

app.use('/oauth2', createProxyMiddleware({ 
  target: 'http://localhost:8080',
  changeOrigin: true,
}));

// Handle any remaining requests by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/main/resources/static/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});