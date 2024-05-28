import axios from "axios";
import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Write(){
    const state = useLocation().state
    const navigate = useNavigate();
    const [value, setValue] = useState(state?.content||"");
    const [title, setTitle] = useState(state?.title||"");
    const [upload, setUpload] = useState(state?.img||"");
    const { currentUser } = useContext(AuthContext);
    const handleUpdate = async()=>{
      await axios.put(`http://localhost:8800/api/posts/posts/updateTitle/${state.id}`, {
        title
      })
      await axios.put(`http://localhost:8800/api/posts/posts/updateContent/${state.id}`, {
        content: value
      })
      await axios.put(`http://localhost:8800/api/posts/posts/updateImg/${state.id}`, {
        img: upload
      })
    }

    const handleCreate = async()=>{
      await axios.post(`http://localhost:8800/api/posts/posts/create`, {
        title,
        content: value,
        img: upload,
        user_id: currentUser.id
    })}
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          state
            ? handleUpdate()
            : handleCreate() 
            navigate("/")
              
        } catch (err) {
          console.log(err);
        }
      };
    return(
        <div className="add">
            <div className="content">
                <input type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
                <div className="editorContainer">
                <ReactQuill className="editor" theme="snow" value={value} onChange={setValue}/>
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <input type="text"value={upload} placeholder="Image URL" id="upload" onChange={(e) => setUpload(e.target.value)} />
                    <div className="buttons">
                        <button onClick={handleSubmit}>Publish</button>
                    </div>
                </div>
                <div className="item">
                <h1>Category</h1>
                <input type="radio" name="cat" value="Science" id="science"/>
                <label htmlFor="science">Science</label>
                <input type="radio" name="cat" value="Food" id="food"/>
                <label htmlFor="food">Food</label>
                <input type="radio" name="cat" value="Art" id="art"/>
                <label htmlFor="art">Art</label>
                </div>
            </div>
        </div>
    )
}

export default Write