import { Header, Footer } from './Header_Footer';
import { StatCard } from './Card';
import { useEffect, useState } from 'react';
import level1 from '../assets/Levels/level-1.jpeg';
import level2 from '../assets/Levels/level-2.jpeg';
import level3 from '../assets/Levels/level-3.jpeg';
import level4 from '../assets/Levels/level-4.jpeg';
import level5 from '../assets/Levels/level-5.jpeg';
import level6 from '../assets/Levels/level-6.jpeg';
import level0 from '../assets/Levels/level-0.jpeg';
import rewards from '../assets/rewards.jpeg';
import donations from '../assets/donations.jpeg';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const levelImages = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 0: level0 };
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const username = localStorage.getItem("username");
        if (!username) return;
        const response = await fetch(`${BASE_URL}/api/getData?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) { setError(error.message); }
      finally { setLoading(false); }
    }; fetchUserData();
  }, []);

  return (
    <div>
      {loading && ( <>
        <div className="toast-overlay" />
        <div className="toast-message processing">Loading the Data...</div>
      </> )}
      {error && ( <>
        <div className="toast-overlay" onClick={() => setError(null)} />
        <div className="toast-message error" onClick={() => setError(null)}>{error}</div>
      </> )}
      <Header />
      {userData && ( <div className='dashboard-grid'>
        <h2 className="page-title">Performance Dashboard</h2>
        <div className="cards-flex">
          <StatCard title="Level" value={userData.level} imageItem={levelImages[userData.level] || level0} />
          <StatCard title="Name" value={userData.username} />
          <StatCard title="Referral Code" value={userData.referral_code} />
          <StatCard title="Points" value={userData.points} imageItem={rewards} />
          <StatCard title="Donations" value={userData.donations} imageItem={donations} />
        </div>
      </div> )};
      <Footer />
    </div>
  );
};

export default Home;