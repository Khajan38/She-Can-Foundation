import './../CSS/Header_Footer.css';
import logo from './../assets/logo.avif';
import user from './../assets/User.jpeg';
import homeBackground from './../assets/home-background.avif';
import footerImage from './../assets/footer-background.avif';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ section }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [curTab, setCurTab] = useState((section != null)? section : "Home");
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setError("Logging Out...");
    try {
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("username");
      setTimeout(() => { setError(null); navigate('/intern'); }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
      setError("Error during Logout");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    }; window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {error && (
        <>
          <div className="toast-overlay" onClick={() => {if (error !== "Logging Out...") setError(null);}}/>
          <div className="toast-message error" onClick={() => {if (error !== "Logging Out...") setError(null);}}>{error}</div>
        </>
      )}
      <div className="hero-section">
        <img className="home-background" src={homeBackground} alt="Home Background"/>
        {/* Navbar */}
        <div className={`header ${isScrolled ? "scrolled" : ""}`}>
          <img className="logo" src={logo} alt="App Logo" />
          <div className="right-section" >
            <nav className="navbar">
              <a className={curTab === "Home" ? "active" : ""} href="/intern/Home" onClick={() => setCurTab("Home")}>Home</a>
              <a className={curTab === "Rewards" ? "active" : ""} href="/intern/Rewards" onClick={() => setCurTab("Rewards")}>Rewards</a>
              <a className={curTab === "Leaderboard" ? "active" : ""} href="/intern/Leaderboard" onClick={() => setCurTab("Leaderboard")}>Leaderboard</a>
            </nav>
            {isHover && ( <div className='email' > {localStorage.getItem("user_email")} </div> )}
            <img src={user} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={() => { setDropdownVisible(!dropdownVisible); setIsHover(false);}}alt="User" className="user-avatar" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={handleLogoutClick}>Logout</button>
              </div>
            )}
          </div>
        </div>
        <p className="Slogan" style={{ fontSize: "90px"}}>Together We Can Change</p><p className="Slogan"  style={{ color: "#ED0707", fontSize: "90px", lineHeight: "1", marginBottom: "15px"}}>THE WORLD</p><p className="Slogan" style={{ fontFamily: "DM Sans", fontSize: "18px", margin: "10px 36px", marginTop: "30px" }}>We don't ask for much, just help us with what </p> <p className="Slogan" style={{fontFamily: "DM Sans", fontSize: "18px", margin: "10px 36px"}}>you can- Be it Money, Skill or Your Time</p>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-up">
        <div className="footer-content">
          <p className="pFirst">Get in touch</p>
          <p className="pSecond">Email: president@shecanfoundation.org</p>
          <p className="pSecond">Contact: +91-8283841830</p>
        </div>
        <img className="footer-background" src={footerImage} alt="Footer Background"/>
      </div>
      <p> &copy; {new Date().getFullYear()}{" "} <strong>| She Can Foundation Website |</strong> All rights reserved. </p>
    </footer>
  );
};

export { Header, Footer };