// Create web server
// Run this file with the command: node comments.js
// Open web browser and go to: http://localhost:3000
// Press Ctrl+C to stop the web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var messages = [];

var server = http.createServer(function(req, res) {
  var path = url.parse(req.url).pathname;
  switch (path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, 'utf8');
        res.end();
      });
      break;
    case '/comments':
      if (req.method === 'POST') {
        var body = '';
        req.on('data', function(data) {
          body += data;
          if (body.length > 1e6) {
            req.connection.destroy();
          }
        });
        req.on('end', function() {
          var post = qs.parse(body);
          messages.push(post.message);
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Message received: ' + post.message);
        });
      } else {
        res.end(JSON.stringify(messages));
      }
      break;
    default:
      send404(res);
  }
});

function send404(res) {
  res.writeHead(404);
  res.write('404');
  res.end();
}

server.listen(3000);
console.log('Server running at http://localhost:3000/');