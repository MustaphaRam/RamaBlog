import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import Logo from "../img/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <div className="navbar-brand logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
            <li className="nav-item">
              <Link className="link" to="/?cat=art">
                ART
              </Link>
            </li>
            <li className="nav-item">
              <Link className="link" to="/?cat=science">
                SCIENCE
              </Link>
            </li>
            <li className="nav-item">
              <Link className="link" to="/?cat=technology">
                TECHNOLOGY
              </Link>
            </li>
            <li className="nav-item">
              <Link className="link" to="/?cat=cinema">
                CINEMA
              </Link>
            </li>
            <li className="nav-item">
              <Link className="link" to="/?cat=design">
                DESIGN
              </Link>
            </li>
            <li className="nav-item">
              <Link className="link" to="/?cat=food">
                FOOD
              </Link>
            </li>
            
            { currentUser ? 
              <>
              <li className="nav-item active">
                <Link className="link" to="/write">
                  Write
                </Link>
              </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {currentUser?.username}
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="link dropdown-item" to='/profile' >Profile</Link></li>
                    <li><Link className="link dropdown-item" to={'/myposts/?id='+currentUser.id} >My Posts</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="link dropdown-item" onClick={logout}>Logout</Link></li>
                  </ul>
                </li>
                  {/* <li className="nav-item"><Link className="link" to={'/profile/'+currentUser.id} >{currentUser?.username}</Link></li>
                  <li className="nav-item"><Link className="link" onClick={logout}>Logout</Link></li> */}
              </> 
              : 
              <>
                  <li className="nav-item"><Link className="link" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="link" to="/register">Register</Link></li>
              </>
            }
            
          </ul>          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
