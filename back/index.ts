import express from 'express';
import fs from 'fs';
import { join } from 'path';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

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