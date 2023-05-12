const express = require('express');
const multer = require('multer');
const cors = require('cors');

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the views directory for Express
app.set('views', path.join(__dirname, 'views'));

// Set the view engine as EJS
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.json({ message: 'Error reading directory' });
    }
    res.render('files', { files: files });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});