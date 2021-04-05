const { request: httpRequest, createServer } = require('http');
const { request: httpsRequest } = require('https');

const { HTTP_PORT = '80' } = process.env;

const server = createServer((req, res) => {
  const { headers, method, url } = req;
  const querySignIndex = url.indexOf('?');
  if (querySignIndex === -1) {
    return res.end();
  }
  const urlPath = new URLSearchParams(url.substr(querySignIndex)).get('url');
  const request = new URL(urlPath).protocol === 'http' ? httpRequest : httpsRequest;
  delete headers.host;
  const client = request(urlPath, { method, headers }, (message) => {
    for (const [key, value] of Object.entries(message.headers)) {
      res.setHeader(key, value);
    }
    message.pipe(res);
  });
  req.pipe(client);
});

server.listen(HTTP_PORT, () => {
  console.info(`Listening on port %s`, server.address());
});
