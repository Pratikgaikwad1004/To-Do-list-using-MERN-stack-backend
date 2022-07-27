const connect = require('./db');
const express = require('express');
const cors = require('cors')

connect();
const app = express();

const port = 8000;

app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/list', require('./routes/list'));

app.listen(port, () => {
  console.log(`Events app listening on port http://localhost:${port}`)
})
