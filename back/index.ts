import express from 'express';
import fs from 'fs';
import { join } from 'path';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/api/getArticle', (req, res) => {
  const { id } = req.query
  if (id === '1') {
    fs.readFile(join(__dirname, 'images', 'packet.json'), 'utf-8', (err, file) => {
      res.json({data: file})
    })
  }
})

app.post('/save', (req, res) => {
  const { data } = req.body;

  if (!data) {
    res.sendStatus(400);
    return
  }

  fs.writeFile(join(__dirname, 'images', 'packet.json'), JSON.stringify(data), (err) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }

    res.sendStatus(200);
  })

})

app.post('/image', (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.sendStatus(400);
    return;
  }    

  const decodedImage = Buffer.from(image, 'base64');

  fs.writeFile(join(__dirname, 'images', Date.now().toString()+'.jpg'), decodedImage, (err) => {
    if (err)
      return console.log(err);

    console.log('Image uploaded');
  });

  res.sendStatus(200);

});


app.listen(3000, () => {
  console.log('Server connected on 3000');
})