const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
app.use(express.json());

app.use('/api/auth', proxy('http://localhost:4001'));
app.use('/api/reports', proxy('http://localhost:4002'));
app.use('/api/actions', proxy('http://localhost:4003'));
app.use('/api/status', proxy('http://localhost:4004'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
