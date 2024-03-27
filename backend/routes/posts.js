const express = require("express");
const {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} = require ("../controllers/post");

const router = express.Router();

// routes CURS
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

module.exports = router
