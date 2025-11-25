const express = require('express');
const app = express();
let requests = 0;
app.get('/health', (req, res) =>{
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) =>{
    res.json({ requestCount: requests});
});

app.use((req, res, next)=> {requests++; next(); });

app.listen(3000, () => console.log('Server listening on port 3000'));