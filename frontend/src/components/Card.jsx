import './../CSS/Cards.css';

export const StatCard = ({ title, value, imageItem }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
      {imageItem && <img src={imageItem} alt={`${title} Icon`} className="stat-icon" />}
    </div>
  );
};