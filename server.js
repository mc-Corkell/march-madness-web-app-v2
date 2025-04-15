const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, this is Katie!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

