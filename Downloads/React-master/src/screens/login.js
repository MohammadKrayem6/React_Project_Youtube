import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';  // Ensure the CSS file is correctly named and imported

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrors({ email: 'Email is required' });
    } else if (!password) {
      setErrors({ password: 'Password is required' });
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password,
        });
        console.log('User logged in:', response.data);

        // Save token to session storage
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('userId', response.data.userId);
        // Print the token
        console.log('JWT Token:', response.data.token);
        console.log('User ID:', response.data.userId);
        setErrors({});
        window.alert('Login successful!');
        navigate('/videolist'); // Redirect to home page after successful login
      } catch (error) {
        console.error('Error logging in:', error);
        if (error.response && error.response.data) {
          setErrors({ login: error.response.data.message });
        } else {
          setErrors({ login: 'An error occurred during login.' });
        }
      }
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login to your YouTube account</h2>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <div className="error">{errors.email}</div>}
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
        {errors.login && <div className="error">{errors.login}</div>}
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
