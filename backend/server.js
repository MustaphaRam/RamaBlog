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

/* // check connection
db.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database as id ' + db.threadId);
  
  // Close the connection after checking
  db.end(function(err) {
    if (err) {
      console.error('Error closing MySQL connection: ' + err.stack);
      return;
    }
    console.log('MySQL connection closed.');
  });
}); */


// routes post
// localhost:8800/api/posts/route
app.use("/api/posts/", postRoutes);

// routes auth
app.use("/api/auth/", authRotes);

// routes user
app.use("/api/user/", userRoute);

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
