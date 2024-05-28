import { useContext, useEffect, useState } from "react";
import Menu from "../Components/Menu";
import profile from "../img/profile.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DOMPurify from 'dompurify';
import WriteComment from "../Components/WriteComment";
import ShowComments from "../Components/ShowComments";
function Single(){
    const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/posts/id/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);
  const handleDelete = async ()=>{
    try {
      await axios.delete(`http://localhost:8800/api/posts/posts/delete/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }
  const sanitizedContent = DOMPurify.sanitize(post.content);

    return(
        <div className="single">
            <div className="content">
            <img src={post?.img} alt="" />
            <div className="user">
                <img src={profile} alt="" />
                <div className="info">
                    <span>{post.username}</span>
                    <p>Posted on: {post.created_at}</p>
                </div>
                {currentUser !=null && currentUser.username === post.username &&(<div className="edit">
                    <Link className="link" to={`/write?edit=${post.id}`}state={post}>Edit</Link>
                    <Link onClick={handleDelete} className="link">Delete</Link>
                </div>)}
            </div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            {currentUser !=null &&<div className="writeComment">
              <h2>Add a Comment</h2>
              <WriteComment postID={postId}/>
            </div>}
            <div>
              <ShowComments postID={postId}/>
            </div>
            </div>
            
            <div className="menu">
                <Menu/>
            </div>
        </div>
    )};

export default Single;