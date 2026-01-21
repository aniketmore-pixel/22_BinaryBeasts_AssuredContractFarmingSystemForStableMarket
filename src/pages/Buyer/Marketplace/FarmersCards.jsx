// import "./FarmersCard.css";

// const getInitials = (name = "") =>
//   name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

// function FarmersCards({ farmer }) {
//   return (
//     <div className="farmer-card">
//       <div className="farmer-avatar">
//         {getInitials(farmer.name)}
//       </div>

//       <div className="farmer-info">
//         <h3>{farmer.name}</h3>
//         <p className="muted">{farmer.email}</p>

//         <div className="farmer-meta">
//           <span>📍 {farmer.farm_location}</span>
//           <span>🌾 {farmer.primary_crops}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FarmersCards;

import "./FarmersCard.css";

function FarmersCards({ farmer }) {
  // // Use the farmer's name to generate a consistent random avatar
  // const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
  //   farmer.name
  // )}&background=10b981&color=ffffff&size=64`;

  // Alternative: Use randomuser.me for truly random images
  const avatarUrl = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;

  return (
    <div className="farmer-card">
      <div className="farmer-avatar">
        <img src={avatarUrl} alt={farmer.name} />
      </div>

      <div className="farmer-info">
        <h3>{farmer.name}</h3>
        <p className="muted">{farmer.email}</p>

        <div className="farmer-meta">
          <span>📍 {farmer.farm_location}</span>
          <span>🌾 {farmer.primary_crops}</span>
        </div>
      </div>
    </div>
  );
}

export default FarmersCards;

