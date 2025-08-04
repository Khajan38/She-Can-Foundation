import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './../CSS/LoginRegister.css';
import { useNavigate } from 'react-router-dom';
import logo from './../assets/logo.avif';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [OTP, setOTP] = useState("");
  const [timer, setTimer] = useState({minutes: 2, seconds: 59});
  const [isEmailVerified, setIsEmailVerified] = useState('No');
  const [isPhoneVerified, setIsPhoneVerified] = useState('No');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({username: '', email: '', password: '', phone: '', referral_code: ''});
  const navigate = useNavigate();

  const handleRegisterClick = () => {setIsActive(true);};
  const handleLoginClick = () => {setIsActive(false);};
  const handleChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value });};

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_email", data.user_email);
        localStorage.setItem("username", data.username);
        navigate('/intern/Home');
      } else {
        alert(`Login failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }setIsLoggingIn(false);
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 409) {
        alert(data.error || 'User already exists.');
      } else if (response.ok) {
        alert('Registration Successful');
          setIsActive(false);
      } else {
        alert(`Registration failed: ${data.error || 'Unknown error'}`);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    } setIsLoggingIn(false);
  };  

  const timerRef = useRef();
  useEffect(() => {
    if (isPhoneVerified === "Verifying" || isEmailVerified === "Verifying") {
      setTimer({ minutes: 2, seconds: 59 });
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          const totalSeconds = prev.minutes * 60 + prev.seconds;
          if (totalSeconds <= 1) {
            clearInterval(timerRef.current);
            if (isPhoneVerified === "Verifying") setIsPhoneVerified("No");
            if (isEmailVerified === "Verifying") setIsEmailVerified("No");
            localStorage.removeItem("tempOTP");
            return { minutes: 0, seconds: 0 };
          }const nextTotalSeconds = totalSeconds - 1;
          return {
            minutes: Math.floor(nextTotalSeconds / 60),
            seconds: nextTotalSeconds % 60,
          };});}, 1000);}return () => clearInterval(timerRef.current);
  }, [isPhoneVerified, isEmailVerified]);  

  const HandlePhoneVerify = async () => {
     try {
       setIsPhoneVerified("Verifying");
       setTimer({miniutes: 2, seconds: 59});
       const res = await axios.post(`${BASE_URL}/api/send-sms-otp`, {
         country_code: '+91',
         phone: formData.phone
       });
       localStorage.setItem("tempOTP", res.data.otp);
       console.log("OTP Sent....");
     } catch (err) {
       console.error("OTP sending failed:", err);
       setIsPhoneVerified("No");
     }
   };

   const HandleEmailVerify = async () => {
     try {
       setIsEmailVerified("Verifying");
       setTimer({miniutes: 2, seconds: 59});
       const res = await axios.post(`${BASE_URL}/api/send-email-otp`, {
         email: formData.email
       });
       localStorage.setItem("tempOTP", res.data.otp);
       console.log("OTP Sent...");
     } catch (err) {
       console.error("OTP sending failed:", err);
       setIsEmailVerified("No");
     }
   };
   
  const handleOtpSubmit = (type) => {
    if (OTP === localStorage.getItem("tempOTP")) {
      if (type) setIsPhoneVerified("Yes");
      else setIsEmailVerified("Yes")
      setOTP("");
      localStorage.removeItem("tempOTP");
    } else {
      alert("Incorrect OTP");
      setOTP("");
    }
  };
  
  return (
    <div className={`container ${isActive ? 'active' : ''}`}>

      {/* Login */}
      <div className="form-box login">
        <center><img className="logo" style={{height:"200px"}}src={logo} alt="App Logo"/></center>
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password"  name="password" value={formData.password} onChange={handleChange} required />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn" disabled={isLoggingIn}>{isLoggingIn ? "Logging In..." : "LogIn"}</button>
        </form>
        <button className="register-btn" onClick={handleRegisterClick}>Don't have an account?</button>
      </div>

      {/* Registration */}
      <div className="form-box register" >
        <form onSubmit={handleRegisterSubmit} style={{marginTop: "-30px"}}>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required />
            <i className='bx bxs-user'></i>
          </div>

          {isEmailVerified === "No" && (<div className="input-box">
            <input type="text" placeholder="Email"  name="email" value={formData.email} onChange={handleChange} required /><button type="button" className="btn" disabled={!formData.email.includes('@') || isPhoneVerified === "Verifying"} onClick={HandleEmailVerify}>Verify</button><i className='bx bxs-envelope'></i>
          </div>)}{isEmailVerified  === 'Verifying' && (<div className="input-box">
            <input type="text" name="otp" placeholder="OTP" value={OTP} onChange={(e) => setOTP(e.target.value)} pattern="[0-9]{6}" required/><span>{timer.minutes}:{timer.seconds}</span><button type="button" className="btn" disabled={OTP.length !== 6} onClick={() => handleOtpSubmit(false)}>Submit</button>
          </div>)}{isEmailVerified === "Yes" && (<div className="input-box">
            <input type="text" placeholder="Email"  name="email" value={formData.email} onChange={handleChange} disabled={true} required /><button type="button" className="btn">Verified</button><i className='bx bxs-envelope'></i>
          </div>)}

          {isPhoneVerified === "No" && (<div className="input-box">
            <span>+91</span><input type="tel" name="phone" placeholder="10 digit Phone-Number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" required/><button type="button" className="btn" disabled={formData.phone.length !== 10 || isEmailVerified === "Verifying"} onClick={HandlePhoneVerify}>Verify</button><i className='bx bxs-phone'></i>
          </div>)}{isPhoneVerified  === 'Verifying' && (<div className="input-box">
            <input type="text" name="otp" placeholder="OTP" value={OTP} onChange={(e) => setOTP(e.target.value)} pattern="[0-9]{6}" required/><span>{timer.minutes}:{timer.seconds}</span><button type="button" className="btn" disabled={OTP.length !== 6} onClick={() => handleOtpSubmit(true)}>Submit</button>
          </div>)}{isPhoneVerified === "Yes" && (<div className="input-box">
            <span>+91</span><input type="tel" name="phone" placeholder="10 digit Phone-Number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" disabled={true} required/><button type="button" className="btn">Verified</button><i className='bx bxs-phone'></i>
          </div>)}

          <div className="input-box">
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <i className='bx bxs-lock-alt'></i>
          </div>
          {confirmPassword.length > 0 && confirmPassword !== formData.password && (<p style={{ color: "red", fontSize: "12px", marginTop: "-0.5rem" }}>Passwords do not match</p>)}

          <div className="input-box">
            <input type="text" placeholder="Referral Code" name="referral_code" value={formData.referral_code} onChange={handleChange} />
            <i className='bx bxs-user'></i>
          </div>

          <button type="submit" className="btn" disabled={isLoggingIn || isPhoneVerified !== "Yes" || isEmailVerified !== "Yes"}>{isLoggingIn ? "Registering..." : "Register"}</button>
        </form>
        <button className="login-btn" onClick={handleLoginClick}>Already have an account? </button>
      </div>

      {/* Toggle */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <span>She Can Foundation</span>
          <span className="small">NGO Registered Under the Indian Society Act, 1860</span>
        </div>
        <div className="toggle-panel toggle-right">
          <span>She Can Foundation</span>
          <span className="small">NGO Registered Under the Indian Society Act, 1860</span>
        </div>
      </div> 
    </div>
  );
};

export default LoginRegister;