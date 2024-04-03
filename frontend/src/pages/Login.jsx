import React, { useState } from "react";
import { useContext } from "react";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import Spinner from '../components/Spinner';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  var [spinner, setspinner] = useState(false);


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setspinner(true);

    try {
      await login(inputs)
      navigate("/");
    } catch (err) {
      console.log(err);
      if(err.response.status === 400) {
        console.error(err);
        setError(err.response.data || err.response.data.errors[0].msg);
      };
      if (err.response.status === 409 || err.response.status === 404){
        setError(err.response.data);
      }
    } finally {
      setspinner(false);
    }
  };
  return (
    <div className='auth'>
      <div className="logo">
        <img src={logo} alt="" width={150}/>
      </div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className='col-md-6'>
        <input type="username" name='username' className="form-control" onChange={handleChange} placeholder="username" required />
        <input type="password" name='password' className="form-control" onChange={handleChange} placeholder="Password" autoComplete="true" required />
        <button type="submit" disabled={spinner}>Login
          {spinner && <Spinner />}
        </button>
        {err && <p>{err}</p>}
        <span>
          Don't you have an account? <Link to="/register">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
