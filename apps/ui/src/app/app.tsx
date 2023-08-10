import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import axios from 'axios';

import { Route, Routes, Link } from 'react-router-dom';
import IApiResponse from '../interface/IApiResponse';

const API_BASE_URL = 'http://localhost:3000';

export function App() {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [createPasswordRequired, setCreatePasswordRequired] = useState(false)
  const [message, setMessage] = useState('');

  const handleEmailValidate = async () => {
    try {
      const response = await axios.get<IApiResponse>(`${API_BASE_URL}/auth?email=${email}`);

      const { challenge, session } = response.data;

      localStorage.setItem("session", session);

      switch (challenge) {
        case 'new-password':
          setPasswordRequired(true);
          break;
        case 'password':
          setPasswordRequired(true);
          break;
        case 'validate-email':
          setOtpRequired(true);
          break;

        default:
          throw new Error('Response not expected.');
          break;
      }
      if (challenge === 'new-password') {
        setPasswordRequired(true);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error during login.');
    }
  };

  const handleOTP = async () => {
    try {
      const session = localStorage.getItem('session');
      const response = await axios.post(`${API_BASE_URL}/auth/otp`, { session, secret: otp });

      if (response.data.challenge === 'new-password') {
        setMessage('Create new password.');
        setCreatePasswordRequired(true);
      } else {
        setMessage('Insert Password.');
        setPasswordRequired(true);
      }
      setOtpRequired(false);
      
    } catch (error) {
      console.error(error);
      setMessage('Error while setting OTP.');
    }
  };

  const handleCreatePassword = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/login/create`, { email, password });
      const { token } = response.data;

      localStorage.setItem("jwt", token || '');

      setMessage('Password set successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error while setting password.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post<IApiResponse>(`${API_BASE_URL}/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem("jwt", token || '');
      setMessage('Login successful.');
    } catch (error) {
      console.error(error);
      setMessage('Invalid credentials.');
    }
  };

  return (
    <div>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className={styles.container}>
              <div className={styles.login}>
                <h2>Authentication Screen</h2>
                <div className={styles.field}>
                  <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {passwordRequired &&

                    <input
                      type="password"
                      placeholder="Enter a new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  }
                  {passwordRequired ?
                   <button onClick={handleLogin}>Login</button>
                  : createPasswordRequired ?
                    <button onClick={handleCreatePassword}>Create Password</button>
                  : <button onClick={handleEmailValidate}>Validate Email</button>
                  }
                </div>
                {otpRequired && <div>
                  <h2>One-Time Password (OTP) required.</h2>
                  <input
                    type="text"
                    placeholder="Enter OTP here"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <button onClick={handleOTP}>Validate OTP</button>
                </div>
                }
                {/* {passwordRequired ? (
                  <span>
                    <input
                      type="password"
                      placeholder="Enter a new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSetPassword}>Set Password</button>
                  </span>
                ) : (
                  <div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLoginWithPassword}>Login with Password</button>
                  </div>
                )} */}
                {message && <div>{message}</div>}
              </div>
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
