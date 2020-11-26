const express = require('express');
const app = express();
const fs = require("fs");
const PORT = 3000;
app.get("/video1", (req, res) => {
    let options = {
        dotfile: 'ignore',
        root: __dirname+'/',
    }
    res.sendFile("video1.html", options);
})
app.get("/video2", (req, res) => {
    let options = {
        dotfile: 'ignore',
        root: __dirname+'/',
    }
    res.sendFile("video2.html", options);
})
app.get("/hello", (req, res) => {
  res.send("hello");
})

app.get('/1.mp4', function(req, res) {
    let stat = fs.statSync("./video/1.mp4");
    let fileSize = stat.size;
    if (req.headers.range) {
      let parts = req.headers.range.replace("bytes=", "").split("-");
      console.log(req.headers.range);
      let start = parseInt(parts[0]);
      let end = parts[1]? parseInt(parts[1]): fileSize-1;
      let chunksize = (end-start)+1;
      console.log(start, " and ", end);
      let file = fs.createReadStream("./video/1.mp4", {start, end});
      let head = {
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes'
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      let head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
});

app.get('/2.mp4', function(req, res) {
    let stat = fs.statSync("./video/2.mp4");
    let fileSize = stat.size;
    if (req.headers.range) {
      let parts = req.headers.range.replace(/bytes=/, "").split("-");
      console.log(parts);
      let start = parseInt(parts[0], 10);
      let end = parts[1]? parseInt(parts[1]): fileSize-1;
      let chunksize = (end-start)+1;
      let file = fs.createReadStream("./video/2.mp4", {start, end});
      let head = {
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes'
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      let head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
});

app.listen(PORT, () => {
    console.log('Listening at ' + PORT);
});


`HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Type: text/html; charset=UTF-8
Content-Length: 95`

