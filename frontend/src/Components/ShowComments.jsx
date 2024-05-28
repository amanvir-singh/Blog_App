import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DOMPurify from 'dompurify';

function ShowComments({postID}){
    const navigate = useNavigate();
    const [commentID, setCommentID] = useState();
    const { currentUser } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/comments/comments/id/${postID}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    }, [postID]);
    async function handleDelete(id){
        try {
        await axios.delete(`http://localhost:8800/api/comments/comments/delete/${id}`);
        navigate("/")
        } catch (err) {
        console.log(err);
        }
    }
        return(
            <div className="showComments">
            <h2>Comments</h2>
            {comments.map(comment=>{
            const sanitizedContent = DOMPurify.sanitize(comment.content);
            return(
                    <div className="comment" key={comment.id}>
                        <div className="posted">Posted by: {comment.username}</div>
                        <div className="posted">Posted on: {comment.created_at}</div>
                        <div className="allcontent">
                        <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        {currentUser?.username === comment.username &&(<div className="delete">
                            <Link onClick={()=>{handleDelete(comment.id)}} className="link">Delete</Link>
                        </div>)}
                    </div>
                    </div>
                )})}
        </div>
        )
}

export default ShowComments