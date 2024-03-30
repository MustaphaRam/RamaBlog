const db = require("../db");
const jwt = require("jsonwebtoken");

// get all posts or by category
const getPosts = async (req, res) => {
  try {
    const q = req.query.cat
      ? "SELECT * FROM posts WHERE cat=? ORDER BY `date` DESC"
      : "SELECT * FROM posts ORDER BY `date` DESC";

    db.query(q, [req.query.cat], (err, data) => {
      if (err) return res.status(500).json(err);

      // return data
      return res.status(200).json(data);
    });
  } catch (err) {
    console.log(err);
  }
};

// get post by id
const getPost = async (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `description`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

// add post
const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `description`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.description,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

// delete post
const deletePost = async (req, res) => {

  // check token if req have token
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // and check information user from token
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You cannot delete this post!");

      return res.json("Post has been deleted!");
    });
  });
};

//update post
const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    if (req.body.img) {
      var q = "UPDATE posts SET `title`=?,`description`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";
      var values = [req.body.title, req.body.description, req.body.img, req.body.cat];
    } else {
      var q = "UPDATE posts SET `title`=?,`description`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";
      var values = [req.body.title, req.body.description, req.body.cat];
    }

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};

module.exports = {getPosts, getPost, addPost, updatePost, deletePost, };
