/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Spinner from '../components/Spinner';
import moment from "moment";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import userIcon from "../img/user.png";

function Comments({ postId, userId }) {
  // ... existing code for fetching and displaying comments
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch all comments this post
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/comments/${postId}`);
      setComments(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // add comment
  const [content, setContent] = useState('');
  const [spinner, setspinner] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setspinner(true);

    try {
      console.log(content)
      const res = await axios.post(`/comments/`, { content: content, pid: postId });

      if (res.status === 200){
        setContent('');
        fetchComments();
      }
    } catch (err) {
      console.error("Error creating comment:", err);
    } finally {
        setspinner(false);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  /************* */
  // editing comment
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // when click btn edit, display textaere for set content
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async () => {
    console.log(editingComment.id, editedContent)
    try {
        const res = await axios.put(`/comments/${editingComment.id}`, { editedContent });
        if(res.status === 200) {
            setEditingComment(null);
            fetchComments();
        }
      } catch (err) {
        console.error("Error updating comment:", err);
    }
  };

  // when cklick btn cancel
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedContent('');
  };


  // delete comment
  const handleRemove = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    const res = axios.delete(`/comments/${commentId}`);

    if(res.status === 200) {
        await fetchComments();
        window.alert("comment has ben deleted")
    }
  };

  /************* */

  return (
    <div>
        <div className="addComment">
            <form onSubmit={handleSubmit}>
                <label htmlFor="content" className="form-label">Add Comment</label>
                <textarea className="form-control" value={content} name="content" onChange={handleChange} rows="3" minLength={5} maxLength={200} placeholder="Write your comment" required></textarea>
                <button className="rama_btn mt-2" type="submit" disabled={spinner}>Submit Comment {spinner && <Spinner />}</button>
            </form>
        </div>
        <div className='mt-5'>
            
        {isLoading && <p>Loading comments...</p>}
        {error && <p>Error fetching comments: {error.message}</p>}
        {!comments.length && <p className='mt-2'>No comments</p>}
        {comments.length > 0 && (
            <div className="container my-5 py-4">
                <h5>Comments</h5>
                <div className="row flex ">
                    <div className="col-md-11">
                        {comments.map(comment => (
                        <div key={comment.id} className="comment d-flex flex-start mb-4">
                            <div className="card w-100 shadow-sm mb-2 bg-body-tertiary rounded">
                                <div className="card-body p-3">
                                    <div className='userComment pb-2'>
                                        <img className="rounded-circle shadow-1-strong me-3"  src={comment.img ? `../upload/${comment?.img}` : userIcon} alt="avatar" width="50" height="50" />
                                                                              
                                        <div className=''>
                                            <h5>{ comment.username }</h5>
                                            <span className="small">{moment(comment.created_at).fromNow()}</span>
                                        </div>
                                    </div>
                                    {/* Conditionally render comment content or edit form */}
                                    {editingComment && editingComment.id === comment.id ? (
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="form-control"
                                            rows="3" minLength={5} maxLength={200} 
                                            placeholder="Write your comment" required
                                        />
                                        ) : (
                                        <p>{comment.content}</p>
                                    )}
                                    <div className="commentCont">
                                        {/* <p>{comment.content}</p> */}
                                        <div className="">
                                            {/* Edit button conditionally shown for current user */}
                                            {userId === comment.user_id && (
                                                <div className="edit-del">
                                                    {editingComment && editingComment.id === comment.id ? (
                                                        <div className='float-end mt-2'>
                                                            <button className='btn_save' onClick={handleSaveEdit}>Save</button>
                                                            <button className='btn_cancel' onClick={handleCancelEdit}>Cancel</button>
                                                        </div>
                                                        ) : (
                                                        <>
                                                            <span onClick={() => handleEdit(comment)}><img src={Edit} title='Edit' alt='Edit'/></span>
                                                            <span onClick={() => handleRemove(comment.id)}><img src={Delete} title='Remove' alt='Remove'/></span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        </div>
    </div>
  );
}

export default Comments
