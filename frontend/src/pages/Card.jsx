import React from "react";
import "../assets/css/card.css";
import sanitizeHtml from "sanitize-html";
import { useNavigate } from "react-router-dom";

const Card = ({ item }) => {
  const navigate = useNavigate();
  function handleHref(id) {
    window.location.href = `item/${id}`;
  }
  
  return (
    <div className="card item-card" onClick={() => handleHref(item.id)}>
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
            ? sanitizeHtml(
                item.description
                  .replace("><", "> <")
                  .substring(0, 147)
                  .split(" ")
                  .slice(0, -1)
                  .join(" ") + "...",
                {
                  allowedTags: [],
                  allowedAttributes: {},
                  allowedIframeHostnames: [],
                }
              )
            : sanitizeHtml(item.description.replace("><", "> <"), {
                allowedTags: [],
                allowedAttributes: {},
                allowedIframeHostnames: [],
              })}
        </p>
      </div>
    </div>
  );
};

export default Card;
