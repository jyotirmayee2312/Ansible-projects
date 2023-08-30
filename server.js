const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy requests to backend
app.get('/get-profile', (req, res) => {
  const backendRequest = https.get('https://backend-server:3000/get-profile', (backendRes) => {
    backendRes.pipe(res);
  });

  backendRequest.on('error', (err) => {
    console.error('Error proxying request to backend:', err);
    res.status(500).send('Error proxying request to backend');
  });
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
