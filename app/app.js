const express = require('express');
const app = express();
const PORT = 3000;

const metrics = {totalRequests: 0, startTime: new Date()};

app.use((req, res, next)=>{
    metrics.totalRequests++;
    next();
});

app.get('/health', (req, res) =>{
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) =>{
    const uptime = Math.floor((new Date()- metrics.startTime) / 1000);
    res.json({
        total_requests: metrics.totalRequests,
        uptime_seconds: uptime
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port ${PORT}');
})