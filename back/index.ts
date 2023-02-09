import express from 'express';
import fs from 'fs';
import { join } from 'path';
import cors from 'cors';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb' ,extended: true}));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
})

app.get('/api/getArticle', (req, res) => {
  const { id } = req.query
  if (id === '1') {
    fs.readFile(join(__dirname, 'images', 'packet.json'), 'utf-8', (err, file) => {
      res.json({data: JSON.parse(file)})
    })
  }
})

app.post('/save', (req, res) => {
  const { data } = req.body;

  if (!data) {
    res.status(400);
    res.json({});
    return
  }

  fs.writeFile(join(__dirname, 'images', 'packet.json'), JSON.stringify(data), (err) => {
    if (err) {
      console.log(err)
      res.status(400);
    }

    res.json({ok: 'ok'});
  })

})

app.post('/image', (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400);
    res.json({});
    return;
  }    

  const decodedImage = Buffer.from(image, 'base64');

  fs.writeFile(join(__dirname, 'images', Date.now().toString()+'.jpg'), decodedImage, (err) => {
    if (err)
      return console.log(err);

    console.log('Image uploaded');
  });

  res.json({});

});


app.listen(process.env.PORT || 3000, () => {
  console.log('Server connected');
})