import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Login(){
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
      });
    const navigate = useNavigate();
    const [err, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
      
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await login(inputs)
          navigate("/");
        } catch (err) {
          setError(err.response.data);
        }
      };
    return(
        <div className="auth">
        <h1>Login</h1>
        <form>
            <input required type="text" placeholder="Username" name="username" onChange={handleChange}></input>
            <input required type="password" placeholder="Passoword" name="password" onChange={handleChange}></input>
            <button onClick={handleSubmit}>Login</button>
            {err && <p>{err}</p>}
            <span>No Account? <Link to="/Register">Click Here</Link></span>
        </form>
        </div>
    )
}
export default Login