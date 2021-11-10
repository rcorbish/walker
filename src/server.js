const http = require('http'); 
const url = require('url'); 
const fs = require('fs'); 
const path = require('path'); 

var server = http.createServer(function (request, response) {   
    const baseDirectory = "web" ;
    try {
        var requestUrl = url.parse(request.url)

        // need to use path.normalize so people can't access directories underneath baseDirectory
        const fsPath = baseDirectory+path.normalize(requestUrl.pathname)
        const fileStream = fs.createReadStream(fsPath)

        fileStream.pipe(response)
        fileStream.on('open', function() {
          if( fsPath.endsWith('.json') ) {
               response.setHeader( "Content-Type", "application/json" ) 
          }  
          if( fsPath.endsWith('.html') ) {
               response.setHeader( "Content-Type", "text/html" ) 
          }   
          response.writeHead(200)
        })
        fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
        })
   } catch(e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
        console.log(e.stack)
   }
});

server.listen(8111); 

console.log('Node.js web server at port 8111 is running..')
