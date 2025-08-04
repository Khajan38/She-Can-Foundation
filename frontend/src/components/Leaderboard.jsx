import { InternCard, PersonCard } from './Card';
import { Header, Footer } from './Header_Footer';
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Leaderboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/getLeaderboard`);
        const data = await res.json();
        setUserData(data);
      } catch (error) { setError(error.message); } 
      finally { setLoading(false); }
    }; fetchTopUsers();
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
      <Header section="Leaderboard"/>
      <div id="products" className="dashboard-grid">
        {userData && (<center>
          <h2 className="page-title">LeaderBoards</h2>
          {userData.map((user) => ( <InternCard rank={user.rank} username={user.name} points={user.points} level={user.level} />))}
        </center> )}
        <h2 className="page-title">Our Visionaries</h2>
        <div className="cards-flex">
          <PersonCard name="XYZ" post="Vice President" />
          <PersonCard name="Reeta Mishra" post="Founder and President" />
          <PersonCard name="XYZ" post="Chairperson" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;