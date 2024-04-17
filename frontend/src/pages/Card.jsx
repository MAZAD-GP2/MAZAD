import React, { useState } from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as api from "../api/index";

const Card = ({ item, interest }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isInterest, setIsInterest] = useState(interest);

  function handleCardClick() {
    window.location.href = `/item/${item.id}`;
  }

  const changeInterest = async (event) => {
    event.stopPropagation(); // Prevents the card click handler from being called
    if (isInterest) {
      await api.removeInterest(item.id);
    } else {
      await api.addInterest(item.id);
    }
    setIsInterest(!isInterest);
  }

  return (
    <div className="card item-card" onClick={handleCardClick}>
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
        <div className="d-flex gap-4 ">
          <h5 className="card-title">{item.name}</h5>
          {user && (
            <span className="text-danger" style={{width:"7%", display:"flex", justifyContent:"center", alignContent:"center", flexDirection:"column"}} onClick={changeInterest}>
              <FontAwesomeIcon
                icon={isInterest ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
