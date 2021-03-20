const { request: httpRequest, createServer } = require('http');
const { request: httpsRequest } = require('https');

const { HTTP_PORT = '80' } = process.env;

const server = createServer((req, res) => {
  const querySignIndex = req.url.indexOf('?');
  if (querySignIndex === -1) {
    return res.end();
  }
  const urlPath = new URLSearchParams(req.url.substr(querySignIndex)).get('url');
  const url = new URL(urlPath);
  const request = url.protocol === 'http' ? httpRequest : httpsRequest;
  delete req.headers.host;
  request(urlPath, { method: req.method, headers: req.headers }, (message) => {
    for (const [key, value] of Object.entries(message.headers)) {
      res.setHeader(key, value);
    }
    message.pipe(res);
  }).end();
});

server.listen(HTTP_PORT, () => {
  console.info(`Listening on port %s`, server.address());
});
