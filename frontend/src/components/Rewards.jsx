import { useEffect, useState } from 'react';
import axios from 'axios';
import './../CSS/Rewards.css';
import { Header, Footer } from "./Header_Footer";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState(0);

  const microRewards = [
    { id: 1, points: 0, title: "Starter's Badge", img: "badge.png" },
    { id: 2, points: 50, title: "Digital Badge", img: "badge.png" },
    { id: 3, points: 150, title: "Foundation Sticker", img: "sticker.png" },
    { id: 4, points: 300, title: "Motivational Quote Wallpaper", img: "wallpaper.png" },
    { id: 5, points: 650, title: "Eco-Friendly Pen Set", img: "pen.png" },
    { id: 6, points: 1200, title: "Exclusive Webinar Pass", img: "webinar.png" },
    { id: 7, points: 1700, title: "Foundation Cap", img: "cap.png" }
  ];
  const milestoneRewards = [
    {  id: 1, points: 100, title: "Digital Certificate", img: "certificate.png" },
    {  id: 2, points: 250, title: "Online Workshop Access", img: "workshop.png" },
    {  id: 3, points: 500, title: "Website Feature", img: "feature.png" },
    {  id: 4, points: 1000, title: "Special Recognition Certificate", img: "trophy.png" },
    {  id: 5, points: 1500, title: "Premium Skill Training Voucher", img: "voucher.png" },
    {  id: 6, points: 2000, title: "Honour Wall Name + Gift Hamper", img: "gift.png" }
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/getPoints?username=${localStorage.getItem('username')}`);
        setPoints(response.data.points);
      } catch (err) {
        setError(err.message || "Error fetching points");
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  const renderRewardCards = (rewards) => (
    <div className="product-container">
      {rewards.map(product => (
        <div className="product-card" key={product.id}>
          <img
            src={
              typeof product.img === 'string'
                ? product.img
                : product.img instanceof File
                  ? URL.createObjectURL(product.img[0])
                  : '/placeholder.jpg'
            }
            alt={product.title}
            style={{ objectFit: 'cover' }}
          />
          <h3>{product.title}</h3>
          <p>Points: {product.points}</p>
          <button disabled={points < product.points}>Get the Goodie</button>
        </div>
      ))}
    </div>
  );

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
      <Header section="Rewards" />
      <div id="products" className="section">
        <h1>Micro Rewards</h1>
        {renderRewardCards(microRewards)}
        <h1>Milestone Rewards</h1>
        {renderRewardCards(milestoneRewards)}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;