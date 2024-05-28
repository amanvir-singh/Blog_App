import { Link } from "react-router-dom";
import logo from "../img/logo.png"
function Footer(){
    return(
        <div className="footer">
            <img src={logo} alt="Logo" />
            <Link className="link" to="/">Home</Link>
            <span>This is a Blog App</span>
        </div>
    )};

export default Footer;