import "./FarmersCard.css";

function FarmersCards({ farmer }) {
  const score = farmer.experience * 5 - farmer.disputes * 3;

  return (
    <div className="farmer-card">
      <img src={farmer.image} alt={farmer.name} />

      <h3>{farmer.name}</h3>

      <p className="crops">{farmer.primaryCrop.join(", ")}</p>
      <p className="location">{farmer.location}</p>

      <div className="meta">
        <span>KYC ✔</span>
        <span>{farmer.contracts} contracts</span>
      </div>

      <div className="meta">
        <span>{farmer.experience} yrs</span>
        <span className="phone">{farmer.phone}</span>
      </div>

      <div className="score">
        Score: <strong>{score}</strong>
      </div>

      <button className="profile-btn">Go to Profile</button>
    </div>
  );
}

export default FarmersCards;
