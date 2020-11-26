let net = require('net');
let parser = require('http-string-parser');
let fs = require("fs");
let server = net.createServer((socket) => {
  //console.log(socket);
  socket.on('data', (chunk) => {
      // console.log(`Data received from client: ${chunk.toString()}.`);
      request = parser.parseRequest(chunk.toString());
      console.log(request);
      console.log(request.uri);
      if(request.uri == "/video1"){
          socket.write(
            `HTTP/1.1 200 OK\r\n`+
            `Accept-Ranges: bytes\r\n`+
          `Content-Type: text/html; charset=UTF-8\r\n`+
          `Content-Length: 95\r\n`+
          `\r\n`+
          `<video width="640" height="480" controls>
            <source src="1.mp4" type="video/mp4">
          </video>`
          );
      }
      if(request.uri == "/1.mp4"){
        let stat = fs.statSync("./video/1.mp4");
        let fileSize = stat.size;
        if (request.headers.Range) {
          let parts = request.headers.Range.replace("bytes=", "").split("-");
          console.log(request.headers.Range);
          let start = parseInt(parts[0]);
          let end = parts[1]? parseInt(parts[1]): fileSize-1;
          let chunksize = (end-start)+1;
          console.log(start, " and ", end);
          let file = fs.createReadStream("./video/1.mp4", {start, end});
          let head = `HTTP/1.1 206 Partial Content\r\n`+
            `Content-Length: ${chunksize}\r\n`+
            `Content-Type: video/mp4\r\n`+
            `Content-Range: bytes ${start}-${end}/${fileSize}\r\n`+
            `Accept-Ranges': 'bytes\r\n`+"\r\n";
          socket.write(head);
          file.on("data", (data) => {
            console.log(data.toString());
            // socket.write(data.toString());
          })
          // file.pipe(socket);
        }
        else {
          let head = `HTTP/1.1 200 OK\r\n`+
            `Content-Length: fileSize\r\n`+
            `Content-Type': 'video/mp4\r\n`
          socket.write(head);
          let file = fs.createReadStream(path);
          file.on("data", (data) => {
            console.log(data.toString());
            // socket.write(data.toString());
          })
        }
      }
  });
});    
// server.on('connection', (socket) => {
//   //console.log(socket);
//   socket.on('data', (chunk) => {
//       // console.log(`Data received from client: ${chunk.toString()}.`);
//       request = parser.parseRequest(chunk.toString());
//       console.log(request);
//       console.log(request.uri);
//       if(request.uri == "/video1"){
//           socket.write(
//             `HTTP/1.1 200 OK\r\n`+
//             `Accept-Ranges: bytes\r\n`+
//           `Content-Type: text/html; charset=UTF-8\r\n`+
//           `Content-Length: 95\r\n`+
//           `\r\n`+
//           `<video width="640" height="480" controls>
//             <source src="1.mp4" type="video/mp4">
//           </video>`
//           );
//       }
//       if(request.uri == "/1.mp4"){
//         let stat = fs.statSync("./video/1.mp4");
//         let fileSize = stat.size;
//         if (request.headers.Range) {
//           let parts = request.headers.Range.replace("bytes=", "").split("-");
//           console.log(request.headers.Range);
//           let start = parseInt(parts[0]);
//           let end = parts[1]? parseInt(parts[1]): fileSize-1;
//           let chunksize = (end-start)+1;
//           console.log(start, " and ", end);
//           let file = fs.createReadStream("./video/1.mp4", {start, end});
//           let head = `HTTP/1.1 206 Partial Content\r\n`+
//             `Content-Length: ${chunksize}\r\n`+
//             `Content-Type: video/mp4\r\n`+
//             `Content-Range: bytes ${start}-${end}/${fileSize}\r\n`+
//             `Accept-Ranges': 'bytes\r\n`+"\r\n";
          
//           socket.write(head);
//           file.pipe(socket);
//         }
//         else {
//           let head = `HTTP/1.1 200 OK\r\n`+
//             `Content-Length: fileSize\r\n`+
//             `Content-Type': 'video/mp4\r\n`
//           socket.write(head);
//           fs.createReadStream(path).pipe(socket);
//         }
//       }
//   });
// });

server.listen(8888, () => {    
  console.log('listen on 8888 port');  
});



