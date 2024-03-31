import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const searchCont = useLocation().search
  
  // that funtion Used to synchronize content
  // In this case the posts are fetched
  // when change cat
  useEffect(() => {
    const fetchData = async () => {
      var res =""
      try {
        if (searchCont.split("=")[0]==='?id') { // id = userId
          res = await axios.get(`/posts/myposts/${searchCont.split("=")[1]}`); // for get only posts user
        } else {
          res = await axios.get(`/posts/${searchCont}`); // for get all posts by categorie 
        }
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [searchCont]);


  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html.slice(0, 180), "text/html")
    return doc.body.textContent +'...';
  }


  return (
    <div className="home row">
      <div className="container">
        <div className="posts">
          { !posts && <span>No found Contant</span>}
          {posts.map((post) => (
            <div className="post row" key={post.id}>
              <div className="img col-md-5">
                <img src={`../upload/${post.img}`} alt="" />
              </div>
              <div className="content col-md-7">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1 className="h2">{post.title}</h1>
                </Link>
                <span className="cat">#{post.cat}</span>
                <p>{getText(post.description)}</p>
                <button>
                  <Link className="link" to={`/post/${post.id}`}>
                    Read More
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
