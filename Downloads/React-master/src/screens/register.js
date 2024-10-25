import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picture, setPicture] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = () => {
    let valid = true;
    let errors = {};

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validatePassword()) {
      const user = {
        name,
        email,
        password,
        picture,
      };

      try {
        const response = await axios.post('http://localhost:5000/api/users', user, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('User registered:', response.data);
        window.alert('You have registered successfully!');
        navigate('/login'); // Redirect to login page after successful registration
      } catch (error) {
        console.error('Error registering user:', error);
        if (error.response && error.response.data) {
          setErrors({ apiError: error.response.data.message });
        } else {
          setErrors({ apiError: 'An error occurred during registration.' });
        }
      }
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Create your YouTube account</h2>
        <input
          type="text"
          placeholder="Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <div className="error">{errors.confirmPassword}</div>
        )}
        <input
          type="file"
          className="input"
          onChange={handlePictureChange}
        />
        {errors.apiError && (
          <div className="error">{errors.apiError}</div>
        )}
        <button type="submit" className="button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
