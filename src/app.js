const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path')

// Set storage engine
const storage = multer.diskStorage({
  destination: './Image',
  filename: function(req, file, callback) {
    callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  } 
})

// upload method
const upload = multer({
  storage: storage,
  limits: {fileSize: 10000000},
  fileFilter: function(req, file, callback){
    checkFileType(file, callback);
  }
}).single('faceImage')

// Check tipe file
function checkFileType(file, callback){
  
  const fileTypes = /jpg|jpeg|png/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if(mimetype && extname){
    return callback(null, true);
  } else {
    callback('Error: Hanya bisa upload gambar!')
  }

}
// Initial app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Folder Public
app.use(express.static('./Image'))

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      })
    } else {
      if (req.file == undefined){
        res.render('index', {
          msg: 'File belum dipilih!'
        });
      } else {
        res.render('index', {
          msg: 'File telah diupload',
          file: `./Image/${req.file.filename}`
        })
      }
    }
  })
})

// init port
const port = 3000;

app.listen(port, () => {
  console.log(`Server berjalan di PORT : ${port}`)
})