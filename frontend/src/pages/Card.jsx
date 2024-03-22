import React from "react";
import "../assets/css/card.css";

const Card = ({ item }) => {
  return (
    <div className="card item-card">
      <img
        className="image"
        src="https://images.unsplash.com/photo-1700295278848-d4a5d11b2133?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Card image cap"
      />
      <div className="card-body">
        <div className="tag-container">
          <p className="category tag">{item.Category.name}</p>
          {item.Tags.map((tag) => (
            <p key={tag.id} className="tag">
              {tag.name}
            </p>
          ))}
        </div>
        <h5 className="card-title">{item.name}</h5>
        {/* <p className="card-text text-truncate">{item.description}</p> */}
        <p className="card-text">
          {item.description.length > 150
            ? item.description.substring(0, 150).split(" ").slice(0, -1).join(" ") + "..."
            : item.description}
        </p>
      </div>
    </div>
  );
};

export default Card;
