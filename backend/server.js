// server.js
const express = require('express');
const db = require('./db.js');
const userRoute = require('./routes/users.js');
const authRotes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoute = require('./routes/comments.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

// that is used to get request like format json 
app.use(express.json());

// cookieParser is a middleware, that is used to parse and convert 
// cookies sent from the browser into a digestible JavaScript object.
app.use(cookieParser());

// upload image in server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/upload')
  },
  filename: function (req, file, cb) {
    // Specify the filename for uploaded files
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })
// send name file
app.post('/api/upload', upload.single('file'), function (req, res, next) {
  const file = req.file;
  console.log("file has ben save : "+file.filename);
  res.status(200).json(file.filename);
});


// image user
app.post('/api/user/imageUser', upload.single('image'), function (req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  const file = req.file;
  console.log("file has ben save : "+file.filename);
  res.status(200).json(file.filename);
});



// localhost:8800/...
// routes user
app.use("/api/user/", userRoute);

// routes auth
app.use("/api/auth/", authRotes);

// routes post
app.use("/api/posts/", postRoutes);

// routes comments
app.use("/api/comments/", commentRoute);



// first route
app.get('/api', (req, res) => {
  res.json('Welcome To Rama Blog!');
});

// run server
app.listen(8800, () => {
  console.log(`app listening at http://localhost:8800/`);
});
