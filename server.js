const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const port = 3001;

app.get('/api/data', (req, res) => {
  res.json({message: "Hello, Katie"});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

