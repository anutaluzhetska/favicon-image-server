import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
const favicon = readFileSync('./favicon-32x32.png');
const server = createServer(async (req, res) => {
  console.log(req.url)
  if(req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(favicon);
    return;
  }
  const parts = req.url.split('/');
      if (parts[1] === 'image' && parts[2] && parts[3]) {
        const width = parseInt(parts[2]);
    const height = parseInt(parts[3]);
    if (isNaN(width) || isNaN(height)) {
      res.writeHead(400);
      res.end('Error: Dimensions must be numbers. Format: /image/width/height.');
      return;
    }
  
  try {
    const inputImage = readFileSync('./photo.jpg');
    
    const editedImage = await sharp(inputImage)
      .resize(width, height)
      .toBuffer();

    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(editedImage);
  } catch (err) {
    console.error(err);
    res.writeHead(404);
    res.end('Image not found or processing error');
  } 
}else {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Use the format: http://127.0.0.1:3000/image/width/height');
  }
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

