import React from "react";
import "../assets/css/card.css";

const Card = ({ item }) => {
  return (
    <div className="card item-card">
      <img className="image" src={item.Images[0].imgURL} alt="Card image cap" />
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
