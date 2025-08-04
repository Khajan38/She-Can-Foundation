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
    { id: 1, points: 0, title: "Joining Badge", img: "https://img.freepik.com/free-vector/international-women-day-badges_23-2148852287.jpg" },
    { id: 2, points: 50, title: "₹500 Lifestyle Gift Card", img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f50ad4162880873.63dc9c415c4fa.jpg" },
    { id: 3, points: 150, title: "Leather Wallet", img: "https://images-na.ssl-images-amazon.com/images/I/81KIJKuV82L._UL1500_.jpg" },
    { id: 4, points: 300, title: "Personalized Coffee Mug", img: "https://i.etsystatic.com/7905522/r/il/a0f441/1855002614/il_1588xN.1855002614_qe4n.jpg" },
    { id: 5, points: 650, title: "Eco-Friendly Tote Bag", img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6130a094622557.5e8373506b486.jpg" },
    { id: 6, points: 800, title: "₹750 Amazon Gift Card", img: "https://worksheets.clipart-library.com/images2/printable-vouchers-amazon/printable-vouchers-amazon-8.jpeg" },
    { id: 7, points: 1000, title: "Premium Wrist Watch", img: "https://i5.walmartimages.com/asr/486b96eb-8899-4cbf-bf98-cd37090ffbd4_1.23e927cefff7f76db9c867b80515715d.jpeg" },
    { id: 8, points: 1150, title: "Bluetooth Earbuds", img: "https://img.freepik.com/premium-photo/elegant-sky-blue-wireless-earbuds-with-modern-aesthetic-design_1313031-2345.jpg" }
  ];

  const milestoneRewards = [
    { id: 2, points: 1300, title: "Portable Bluetooth Speaker", img: "https://m.media-amazon.com/images/I/71ErckLbheL._AC_SX522_.jpg" },
    { id: 6, points: 1500, title: "Website Feature", img: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=296,fit=crop,q=95/Aq2NJ23MzBH2rx2j/she-YlenJon1O7ieeEoa.jpg" },
    { id: 1, points: 1700, title: "₹3,000 Myntra Gift Voucher", img: "https://constant.myntassets.com/giftcard/assets/img/giftCardBanner.jpg" },
    { id: 3, points: 2000, title: "₹5,000 Amazon Gift Card", img: "https://s3-ap-south-1.amazonaws.com/mediain.krazybee.com/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/p/r/products_new_amazon_5k.png" },
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
          <img src={ typeof product.img === 'string' ? product.img : product.img instanceof File ? URL.createObjectURL(product.img[0]) : '/placeholder.jpg' } alt={product.title} style={{ objectFit: 'cover' }} />
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