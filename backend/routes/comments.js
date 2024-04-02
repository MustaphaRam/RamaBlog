const express = require("express");

const {
    addComment,
    getCommentsByPost,
    updateComment,
    deleteComment
} = require ("../controllers/comment");

const router = express.Router();

// routes CURS
router.post("/", addComment);
router.get("/:id", getCommentsByPost);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router
