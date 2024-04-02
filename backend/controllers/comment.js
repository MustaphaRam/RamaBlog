const db = require("../db");
const jwt = require("jsonwebtoken");

// add comment
const addComment = async (req, res) => {
  // Check Auth
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments(`content`, `user_id`, `pid`) VALUES (?)";

    const values = [
      req.body.content,
      userInfo.id,
      req.body.pid,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      console.log("add new Comment");
      return res.status(200).json("Comment has been created.");
    });
  });
}

// Function to get comments for a post
async function getCommentsByPost(req, res) {
  try {
    // "SELECT p.id, `username`, `title`, `description`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";
    const q = 'SELECT c.*, u.username, u.img FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.pid = ? ORDER BY c.created_at DESC ';

    db.query(q, req.params.id , (err, data) => {
        if (err) return res.status(500).json(err);
        console.log("get all Comment post");
        return res.status(200).json(data);
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err; // Re-throw for handling in your application
  }
}
  
  // Function to update a comment
async function updateComment(req, res) {
    console.log(req.body)
    try {
      // Check Auth
      const token = req.cookies.access_token;
      if (!token) return res.status(401).json("Not authenticated!");
        
      jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const qfind = 'SELECT * FROM comments WHERE id = ?'

        db.query(qfind, [req.params.id] , (err, data) => {
            if (err) return res.status(500).json(err);
            console.log(data[0]);
            if (data[0]) {
              const q = 'UPDATE comments SET content = ? WHERE id = ?';

              db.query(q, [req.body.editedContent ,req.params.id] , (err, data) => {
                if (err) return res.status(500).json(err);
                  console.log("update comment");
                  return res.status(200).json("comment has ben update");
              });
            } else {
                return res.status(404).json("Not found comment");
            }
            
          });
      });
    } catch (err) {
        console.error("Error updating comment:", err);
        throw err; // Re-throw for handling in your application
    }
  }
  
  // Function to delete a comment
  async function deleteComment(req, res) {
    try {
      // Check Auth
      const token = req.cookies.access_token;
      if (!token) return res.status(401).json("Not authenticated!");
          
      jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
  
        const qfind = 'SELECT * FROM comments WHERE id = ?'
  
        db.query(qfind, [req.params.id] , (err, data) => {
          if (err) return res.status(500).json(err);

          if (data[0]) {
            const q = 'DELETE FROM comments WHERE id = ?';
            db.query(q, [req.params.id] , (err, data) => {
              if (err) return res.status(500).json(err);
              console.log("Delete comment");
              return res.status(200).json("comment has ben Deleted");
            });
          } else {
          return res.status(404).json("Not found comment");
          }
        });
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      throw err; // Re-throw for handling in your application
    }
  }
  
  module.exports = { addComment, getCommentsByPost, updateComment, deleteComment };