import './../CSS/Cards.css';

export const InternCard = ({ rank, username, level, points }) => {
  const isCurrentUser = username === localStorage.getItem("username");
  return (
    <div className="intern-card" style={isCurrentUser ? { backgroundColor: "#a8e6cf" } : {}}>
      <div className='circular-cover'><img src={ "https://tse2.mm.bing.net/th/id/OIP.0mUKQMMAank6EO-tI4rhOgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" } alt={username} style={{ objectFit: 'cover' }} /></div>
      <div className='user-info'><span className='title'>Rank </span><span className="value">{rank}</span></div>
      <div className='user-info'><span className='title'>Username </span><span className="value">{username}</span></div>
      <div className='user-info'><span className='title'>Level </span><span className="value">{level}</span></div>
      <div className='user-info'><span className='title'>Points </span><span className="value">{points}</span></div>
    </div>
  )
}

export const PersonCard = ({ image, name, post}) => {
  if (!image) image = "https://tse2.mm.bing.net/th/id/OIP.0mUKQMMAank6EO-tI4rhOgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";
  return (
    <div className="person-card">
      <img src={ image } alt={name} style={{ objectFit: 'cover' }} />
      <h3>{name}</h3>
      <p>{post}</p>
    </div>
  )
}

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