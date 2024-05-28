import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from "axios";

function Register(){
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        img:""
      });
    const navigate = useNavigate();
    const [err, setError] = useState(null);
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
      
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post("http://localhost:8800/api/auth/register", inputs);
          navigate("/login");
        } catch (err) {
          setError(err.response.data);
        }
      };

    return(
        <div className="auth">
        <h1>Register</h1>
        <form>
            <input required type="text" placeholder="Username" name="username" onChange={handleChange}></input>
            <input required type="text" placeholder="Email" name="email" onChange={handleChange}></input>
            <input required type="password" placeholder="Passoword" name="password" onChange={handleChange}></input>
            <input type="text" placeholder="Image URL(Optional)" name="img" onChange={handleChange}></input>
            <button onClick={handleSubmit}>Register</button>
            {err && <p>{err}</p>}
            <span>Have an account? <Link to="/Login">Click Here</Link></span>
        </form>
        </div>
    )
}
export default Register