import { Link } from "react-router-dom";
import logo from "../img/logo.png"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
function Header(){
    const { currentUser, logout } = useContext(AuthContext);
    return(
        <div className="navbar">
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="navigation">
                    <Link className="link" to="/?cat=science"><h5>Science</h5></Link>
                    <Link className="link" to="/?cat=art"><h5>Art</h5></Link>
                    <Link className="link" to="/?cat=food"><h5>Food</h5></Link>
                    <span>{currentUser?.username}</span>
                    {currentUser ? (<span className="write"><Link className="link"  to="/write">Write</Link></span>):""}
                    {currentUser ? (<span onClick={logout}>Logout</span>) : (<Link className="link" to="/login">Login</Link>)}
                </div>
            </div>
        </div>
    )}

export default Header;