const http = require('http');

const options = {
  timeout: 2000,
  host: 'localhost',
  port: process.env.PORT,
  path: '/azure/health',
};

const request = http.request(options, (res) => {
  process.exitCode = (res.statusCode === 200) ? 0 : 1;
  process.exit();
});

request.on('error', function(err) {
  console.error('ERROR', err);
  process.exit(1);
});

request.end();
