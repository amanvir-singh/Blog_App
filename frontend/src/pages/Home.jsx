import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';
function Home(){
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/posts/all`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  
    return(
        <div className="home">
            <div className="posts">
                {posts.map(post=>{
                const sanitizedContent = DOMPurify.sanitize(post.content);
                return (
                    <div className="post" key={post.id}>
                        <div className="img">
                            <img src={post.img} alt="" />
                        </div>
                        <div className="content">
                            <Link className="link" to={`post/${post.id}`}><h1>{post.title}</h1>
                            <div className="p" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                            <button>Read More</button>
                            </Link>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    )};

export default Home;