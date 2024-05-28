import axios from "axios";
import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
function WriteComment({postID}){
    const { currentUser } = useContext(AuthContext);
    const [value, setValue] = useState("");
    const[buttonText, setButtonText] = useState("Add Comment")
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`http://localhost:8800/api/comments/comments/create`, {
        content: value,
        user_id: currentUser.id,
        post_id: postID,
        })
        setButtonText("Comment Added")
      };
    return(
        <div className="content">
                <div className="editorContainer">
                <ReactQuill className="editor" theme="snow" value={value} onChange={setValue}/>
                </div>
                <div className="buttons">
                        <button onClick={handleSubmit}>{buttonText}</button>
                    </div>
            </div>
    )
}

export default WriteComment