const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

app
  .use(express.static(path.join(__dirname, '/build')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Proxy api calls
app.get('/api/*', (req, res) => {
  // Add actual implementation for api calls.
  res.status(200).json({message: 'express server output'});
});

// Serve react app.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

