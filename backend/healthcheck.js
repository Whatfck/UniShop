const http = require('http');

const options = {
  // Force IPv4 loopback to avoid resolving to ::1 (IPv6) which can cause ECONNREFUSED
  host: process.env.HEALTH_HOST || '127.0.0.1',
  port: process.env.PORT || 8080,
  // The API has a global prefix (e.g. /api/v1). Allow overriding via HEALTH_PATH env var.
  path: process.env.HEALTH_PATH || '/api/v1/health',
  method: 'GET',
  timeout: 2000,
};

const req = http.request(options, (res) => {
  console.log('healthcheck: statusCode=', res.statusCode);
  // Drain body for logging (if any)
  let body = '';
  res.on('data', (chunk) => (body += chunk.toString()));
  res.on('end', () => {
    if (body) console.log('healthcheck: body=', body);
    if (res.statusCode === 200) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('healthcheck: request error', err && err.message, err && err.code);
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();