import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Menu(){
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
        <div className="menu">
            <h1>Suggested Posts</h1>
            {posts.map(post=>(
                    <div className="post" key={post.id}>
                        <img src={post.img} alt="" />
                        <h2>{post.title}</h2>
                        <Link className="link" to={`/post/${post.id}`}>
                            <button>Read More</button>
                            </Link>
                    </div>
                ))}
        </div>
    )};

    export default Menu;