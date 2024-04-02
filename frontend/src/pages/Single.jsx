import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import userIcon from "../img/user.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Comment from "../components/Comment";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  // get id post from url
  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);
    
  // delete post by id
  const handleDelete = async ()=>{
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  // function parse to forma html
  /* const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  } */

  return (
    <div className="single row">
      <div className="content col-md-8">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg ? (
            <img src={post.userImg} alt="" />
          ) : (
            <img src={userIcon} alt="" />
          )}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>{/* in here used moment library */}
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.description),
          }}
        ></p>
        {/* <p>{getText(post.description)}</p> */}

        <div className="comments">
          <Comment postId={post.id} userId={currentUser.id} />
        </div>
      </div>
      <Menu className="col-md-4" cat={post.cat}/>
    </div>
  );
};

export default Single;
