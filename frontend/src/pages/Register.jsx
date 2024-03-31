import React from "react";
import { useState } from "react";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from '../components/Spinner';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  var [spinner, setspinner] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setspinner(true);
    
    try {
      const res = await axios.post("/auth/register", inputs);
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      if(err.response.status === 400) {
        console.error(err.response.data);
        setError(err.response.data.errors[0].msg);
      };

      if (err.response.status === 409 ){
        console.error(err.response.data);
        setError(err.response.data);
      }
    }

    setspinner(false);
  };

  return (
    <div className='auth'>
      <div className="logo">
        <img src={logo} alt="" width={150}/>
      </div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className='col-md-6'>
        <input type="username" name='username' className="form-control" onChange={handleChange} placeholder="username" required />
        <input type="email" name='email' className="form-control" onChange={handleChange} placeholder="email" required />
        <input type="password" name='password' className="form-control" onChange={handleChange} placeholder="Password" autoComplete="true" required />
        <button type="submit" disabled={spinner}>Register
          {spinner && <Spinner />}
        </button>
        {err && <p>{err}</p>}
        <span>
          Don't you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
